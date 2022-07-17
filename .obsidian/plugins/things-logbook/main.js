'use strict';

var obsidian = require('obsidian');
var os = require('os');
var child_process = require('child_process');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var obsidian__default = /*#__PURE__*/_interopDefaultLegacy(obsidian);

const DEFAULT_DAILY_NOTE_FORMAT = "YYYY-MM-DD";
const DEFAULT_WEEKLY_NOTE_FORMAT = "gggg-[W]ww";
const DEFAULT_MONTHLY_NOTE_FORMAT = "YYYY-MM";

function shouldUsePeriodicNotesSettings(periodicity) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const periodicNotes = window.app.plugins.getPlugin("periodic-notes");
    return periodicNotes && periodicNotes.settings?.[periodicity]?.enabled;
}
/**
 * Read the user settings for the `daily-notes` plugin
 * to keep behavior of creating a new note in-sync.
 */
function getDailyNoteSettings() {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { internalPlugins, plugins } = window.app;
        if (shouldUsePeriodicNotesSettings("daily")) {
            const { format, folder, template } = plugins.getPlugin("periodic-notes")?.settings?.daily || {};
            return {
                format: format || DEFAULT_DAILY_NOTE_FORMAT,
                folder: folder?.trim() || "",
                template: template?.trim() || "",
            };
        }
        const { folder, format, template } = internalPlugins.getPluginById("daily-notes")?.instance?.options || {};
        return {
            format: format || DEFAULT_DAILY_NOTE_FORMAT,
            folder: folder?.trim() || "",
            template: template?.trim() || "",
        };
    }
    catch (err) {
        console.info("No custom daily note settings found!", err);
    }
}
/**
 * Read the user settings for the `weekly-notes` plugin
 * to keep behavior of creating a new note in-sync.
 */
function getWeeklyNoteSettings() {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pluginManager = window.app.plugins;
        const calendarSettings = pluginManager.getPlugin("calendar")?.options;
        const periodicNotesSettings = pluginManager.getPlugin("periodic-notes")
            ?.settings?.weekly;
        if (shouldUsePeriodicNotesSettings("weekly")) {
            return {
                format: periodicNotesSettings.format || DEFAULT_WEEKLY_NOTE_FORMAT,
                folder: periodicNotesSettings.folder?.trim() || "",
                template: periodicNotesSettings.template?.trim() || "",
            };
        }
        const settings = calendarSettings || {};
        return {
            format: settings.weeklyNoteFormat || DEFAULT_WEEKLY_NOTE_FORMAT,
            folder: settings.weeklyNoteFolder?.trim() || "",
            template: settings.weeklyNoteTemplate?.trim() || "",
        };
    }
    catch (err) {
        console.info("No custom weekly note settings found!", err);
    }
}
/**
 * Read the user settings for the `periodic-notes` plugin
 * to keep behavior of creating a new note in-sync.
 */
function getMonthlyNoteSettings() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pluginManager = window.app.plugins;
    try {
        const settings = (shouldUsePeriodicNotesSettings("monthly") &&
            pluginManager.getPlugin("periodic-notes")?.settings?.monthly) ||
            {};
        return {
            format: settings.format || DEFAULT_MONTHLY_NOTE_FORMAT,
            folder: settings.folder?.trim() || "",
            template: settings.template?.trim() || "",
        };
    }
    catch (err) {
        console.info("No custom monthly note settings found!", err);
    }
}

// Credit: @creationix/path.js
function join(...partSegments) {
    // Split the inputs into a list of path commands.
    let parts = [];
    for (let i = 0, l = partSegments.length; i < l; i++) {
        parts = parts.concat(partSegments[i].split("/"));
    }
    // Interpret the path commands to get the new resolved path.
    const newParts = [];
    for (let i = 0, l = parts.length; i < l; i++) {
        const part = parts[i];
        // Remove leading and trailing slashes
        // Also remove "." segments
        if (!part || part === ".")
            continue;
        // Push new path segments.
        else
            newParts.push(part);
    }
    // Preserve the initial slash if there was one.
    if (parts[0] === "")
        newParts.unshift("");
    // Turn back into a single string path.
    return newParts.join("/");
}
async function ensureFolderExists(path) {
    const dirs = path.replace(/\\/g, "/").split("/");
    dirs.pop(); // remove basename
    if (dirs.length) {
        const dir = join(...dirs);
        if (!window.app.vault.getAbstractFileByPath(dir)) {
            await window.app.vault.createFolder(dir);
        }
    }
}
async function getNotePath(directory, filename) {
    if (!filename.endsWith(".md")) {
        filename += ".md";
    }
    const path = obsidian__default['default'].normalizePath(join(directory, filename));
    await ensureFolderExists(path);
    return path;
}
async function getTemplateInfo(template) {
    const { metadataCache, vault } = window.app;
    const templatePath = obsidian__default['default'].normalizePath(template);
    if (templatePath === "/") {
        return Promise.resolve(["", null]);
    }
    try {
        const templateFile = metadataCache.getFirstLinkpathDest(templatePath, "");
        const contents = await vault.cachedRead(templateFile);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const IFoldInfo = window.app.foldManager.load(templateFile);
        return [contents, IFoldInfo];
    }
    catch (err) {
        console.error(`Failed to read the daily note template '${templatePath}'`, err);
        new obsidian__default['default'].Notice("Failed to read the daily note template");
        return ["", null];
    }
}

/**
 * dateUID is a way of weekly identifying daily/weekly/monthly notes.
 * They are prefixed with the granularity to avoid ambiguity.
 */
function getDateUID(date, granularity = "day") {
    const ts = date.clone().startOf(granularity).format();
    return `${granularity}-${ts}`;
}
function removeEscapedCharacters(format) {
    return format.replace(/\[[^\]]*\]/g, ""); // remove everything within brackets
}
/**
 * XXX: When parsing dates that contain both week numbers and months,
 * Moment choses to ignore the week numbers. For the week dateUID, we
 * want the opposite behavior. Strip the MMM from the format to patch.
 */
function isFormatAmbiguous(format, granularity) {
    if (granularity === "week") {
        const cleanFormat = removeEscapedCharacters(format);
        return (/w{1,2}/i.test(cleanFormat) &&
            (/M{1,4}/.test(cleanFormat) || /D{1,4}/.test(cleanFormat)));
    }
    return false;
}
function getDateFromFile(file, granularity) {
    return getDateFromFilename(file.basename, granularity);
}
function getDateFromFilename(filename, granularity) {
    const getSettings = {
        day: getDailyNoteSettings,
        week: getWeeklyNoteSettings,
        month: getMonthlyNoteSettings,
    };
    const format = getSettings[granularity]().format.split("/").pop();
    const noteDate = window.moment(filename, format, true);
    if (!noteDate.isValid()) {
        return null;
    }
    if (isFormatAmbiguous(format, granularity)) {
        if (granularity === "week") {
            const cleanFormat = removeEscapedCharacters(format);
            if (/w{1,2}/i.test(cleanFormat)) {
                return window.moment(filename, 
                // If format contains week, remove day & month formatting
                format.replace(/M{1,4}/g, "").replace(/D{1,4}/g, ""), false);
            }
        }
    }
    return noteDate;
}

class DailyNotesFolderMissingError extends Error {
}
/**
 * This function mimics the behavior of the daily-notes plugin
 * so it will replace {{date}}, {{title}}, and {{time}} with the
 * formatted timestamp.
 *
 * Note: it has an added bonus that it's not 'today' specific.
 */
async function createDailyNote(date) {
    const app = window.app;
    const { vault } = app;
    const moment = window.moment;
    const { template, format, folder } = getDailyNoteSettings();
    const [templateContents, IFoldInfo] = await getTemplateInfo(template);
    const filename = date.format(format);
    const normalizedPath = await getNotePath(folder, filename);
    try {
        const createdFile = await vault.create(normalizedPath, templateContents
            .replace(/{{\s*date\s*}}/gi, filename)
            .replace(/{{\s*time\s*}}/gi, moment().format("HH:mm"))
            .replace(/{{\s*title\s*}}/gi, filename)
            .replace(/{{\s*(date|time)\s*(([+-]\d+)([yqmwdhs]))?\s*(:.+?)?}}/gi, (_, _timeOrDate, calc, timeDelta, unit, momentFormat) => {
            const now = moment();
            const currentDate = date.clone().set({
                hour: now.get("hour"),
                minute: now.get("minute"),
                second: now.get("second"),
            });
            if (calc) {
                currentDate.add(parseInt(timeDelta, 10), unit);
            }
            if (momentFormat) {
                return currentDate.format(momentFormat.substring(1).trim());
            }
            return currentDate.format(format);
        })
            .replace(/{{\s*yesterday\s*}}/gi, date.clone().subtract(1, "day").format(format))
            .replace(/{{\s*tomorrow\s*}}/gi, date.clone().add(1, "d").format(format)));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        app.foldManager.save(createdFile, IFoldInfo);
        return createdFile;
    }
    catch (err) {
        console.error(`Failed to create file: '${normalizedPath}'`, err);
        new obsidian__default['default'].Notice("Unable to create new file.");
    }
}
function getDailyNote(date, dailyNotes) {
    return dailyNotes[getDateUID(date, "day")] ?? null;
}
function getAllDailyNotes() {
    /**
     * Find all daily notes in the daily note folder
     */
    const { vault } = window.app;
    const { folder } = getDailyNoteSettings();
    const dailyNotesFolder = vault.getAbstractFileByPath(obsidian__default['default'].normalizePath(folder));
    if (!dailyNotesFolder) {
        throw new DailyNotesFolderMissingError("Failed to find daily notes folder");
    }
    const dailyNotes = {};
    obsidian__default['default'].Vault.recurseChildren(dailyNotesFolder, (note) => {
        if (note instanceof obsidian__default['default'].TFile) {
            const date = getDateFromFile(note, "day");
            if (date) {
                const dateString = getDateUID(date, "day");
                dailyNotes[dateString] = note;
            }
        }
    });
    return dailyNotes;
}
var createDailyNote_1 = createDailyNote;
var getAllDailyNotes_1 = getAllDailyNotes;
var getDailyNote_1 = getDailyNote;

class ConfirmationModal extends obsidian.Modal {
    constructor(app, config) {
        super(app);
        this.config = config;
        const { cta, onAccept, text, title } = config;
        this.contentEl.createEl("h2", { text: title });
        this.contentEl.createEl("p", { text });
        this.contentEl
            .createEl("button", { text: "Never mind" })
            .addEventListener("click", () => {
            this.close();
        });
        this.contentEl
            .createEl("button", {
            cls: "mod-cta",
            text: cta,
        })
            .addEventListener("click", async (e) => {
            this.accepted = true;
            this.close();
            setTimeout(() => onAccept(e), 20);
        });
    }
    onClose() {
        if (!this.accepted) {
            this.config.onCancel?.();
        }
    }
}

function getEditorForFile(app, file) {
    let editor = null;
    app.workspace.iterateAllLeaves((leaf) => {
        if (leaf.view instanceof obsidian.MarkdownView && leaf.view.file === file) {
            editor = leaf.view.sourceMode.cmEditor;
        }
    });
    return editor;
}

function getHeadingLevel(line = "") {
    const heading = line.match(/^(#{1,6})\s+\S/);
    return heading ? heading[1].length : null;
}
function toHeading(title, level) {
    const hash = "".padStart(level, "#");
    return `${hash} ${title}`;
}
function getTab(useTab, tabSize) {
    if (useTab) {
        return "\t";
    }
    return "".padStart(tabSize, " ");
}
function groupBy(arr, predicate) {
    return arr.reduce((acc, elem) => {
        const val = predicate(elem);
        acc[val] = acc[val] || [];
        acc[val].push(elem);
        return acc;
    }, {});
}
function isMacOS() {
    return navigator.appVersion.indexOf("Mac") !== -1;
}
async function updateSection(app, file, heading, sectionContents) {
    const headingLevel = getHeadingLevel(heading);
    const { vault } = app;
    const fileContents = await vault.read(file);
    const fileLines = fileContents.split("\n");
    let logbookSectionLineNum = -1;
    let nextSectionLineNum = -1;
    for (let i = 0; i < fileLines.length; i++) {
        if (fileLines[i].trim() === heading) {
            logbookSectionLineNum = i;
        }
        else if (logbookSectionLineNum !== -1) {
            const currLevel = getHeadingLevel(fileLines[i]);
            if (currLevel && currLevel <= headingLevel) {
                nextSectionLineNum = i;
                break;
            }
        }
    }
    const editor = getEditorForFile(app, file);
    if (editor) {
        // if the "## Logbook" header exists, we just replace the
        // section. If it doesn't, we need to append it to the end
        // if the file and add `\n` for separation.
        if (logbookSectionLineNum !== -1) {
            const from = { line: logbookSectionLineNum, ch: 0 };
            const to = nextSectionLineNum !== -1
                ? { line: nextSectionLineNum - 1, ch: 0 }
                : { line: fileLines.length, ch: 0 };
            editor.replaceRange(`${sectionContents}\n`, from, to);
            return;
        }
        else {
            const pos = { line: fileLines.length, ch: 0 };
            editor.replaceRange(`\n\n${sectionContents}`, pos, pos);
            return;
        }
    }
    // Editor is not open, modify the file on disk...
    if (logbookSectionLineNum !== -1) {
        // Section already exists, just replace
        const prefix = fileLines.slice(0, logbookSectionLineNum);
        const suffix = nextSectionLineNum !== -1 ? fileLines.slice(nextSectionLineNum) : [];
        return vault.modify(file, [...prefix, sectionContents, ...suffix].join("\n"));
    }
    else {
        // Section does not exist, append to end of file.
        return vault.modify(file, [...fileLines, "", sectionContents].join("\n"));
    }
}

class LogbookRenderer {
    constructor(app, settings) {
        this.app = app;
        this.settings = settings;
        this.renderTask = this.renderTask.bind(this);
    }
    renderTask(task) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const vault = this.app.vault;
        const tab = getTab(vault.getConfig("useTab"), vault.getConfig("tabSize"));
        const prefix = this.settings.tagPrefix;
        const tags = task.tags
            .filter((tag) => !!tag)
            .map((tag) => tag.replace(/\s+/g, "-").toLowerCase())
            .map((tag) => `#${prefix}${tag}`)
            .join(" ");
        const taskTitle = `[${task.title}](things:///show?id=${task.uuid}) ${tags}`.trimEnd();
        return [
            `- [x] ${taskTitle}`,
            ...String(task.notes || "")
                .trimEnd()
                .split("\n")
                .filter((line) => !!line)
                .map((noteLine) => `${tab}- ${noteLine}`),
            ...task.subtasks.map((subtask) => `${tab}- [${subtask.completed ? "x" : " "}] ${subtask.title}`),
        ]
            .filter((line) => !!line)
            .join("\n");
    }
    render(tasks) {
        const { sectionHeading } = this.settings;
        const areas = groupBy(tasks, (task) => task.area || "");
        const headingLevel = getHeadingLevel(sectionHeading);
        const output = [sectionHeading];
        Object.entries(areas).map(([area, tasks]) => {
            if (area !== "") {
                output.push(toHeading(area, headingLevel + 1));
            }
            output.push(...tasks.map(this.renderTask));
        });
        return output.join("\n");
    }
}

const DEFAULT_SECTION_HEADING = "## Logbook";
const DEFAULT_SYNC_FREQUENCY_SECONDS = 30 * 60; // Every 30 minutes
const DEFAULT_TAG_PREFIX = "logbook/";
const DEFAULT_SETTINGS = Object.freeze({
    hasAcceptedDisclaimer: false,
    latestSyncTime: 0,
    isSyncEnabled: false,
    syncInterval: DEFAULT_SYNC_FREQUENCY_SECONDS,
    sectionHeading: DEFAULT_SECTION_HEADING,
    tagPrefix: DEFAULT_TAG_PREFIX,
});
class ThingsLogbookSettingsTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        this.containerEl.empty();
        this.containerEl.createEl("h3", {
            text: "Format Settings",
        });
        this.addSectionHeadingSetting();
        this.addTagPrefixSetting();
        this.containerEl.createEl("h3", {
            text: "Sync",
        });
        this.addSyncEnabledSetting();
        this.addSyncIntervalSetting();
    }
    addSectionHeadingSetting() {
        new obsidian.Setting(this.containerEl)
            .setName("Section heading")
            .setDesc("Markdown heading to use when adding the logbook to a daily note")
            .addText((textfield) => {
            textfield.setValue(this.plugin.options.sectionHeading);
            textfield.onChange(async (rawSectionHeading) => {
                const sectionHeading = rawSectionHeading.trim();
                this.plugin.writeOptions({ sectionHeading });
            });
        });
    }
    addSyncEnabledSetting() {
        new obsidian.Setting(this.containerEl)
            .setName("Enable periodic syncing")
            .addToggle((toggle) => {
            toggle.setValue(this.plugin.options.isSyncEnabled);
            toggle.onChange(async (isSyncEnabled) => {
                this.plugin.writeOptions({ isSyncEnabled });
            });
        });
    }
    addSyncIntervalSetting() {
        new obsidian.Setting(this.containerEl)
            .setName("Sync Frequency")
            .setDesc("Number of seconds the plugin will wait before syncing again")
            .addText((textfield) => {
            textfield.setValue(String(this.plugin.options.syncInterval));
            textfield.inputEl.type = "number";
            textfield.inputEl.onblur = (e) => {
                const syncInterval = Number(e.target.value);
                textfield.setValue(String(syncInterval));
                this.plugin.writeOptions({ syncInterval });
            };
        });
    }
    addTagPrefixSetting() {
        new obsidian.Setting(this.containerEl)
            .setName("Tag Prefix")
            .setDesc("Prefix added to Things tags when imported into Obsidian (e.g. #logbook/work)")
            .addText((textfield) => {
            textfield.setValue(this.plugin.options.tagPrefix);
            textfield.onChange(async (tagPrefix) => {
                this.plugin.writeOptions({ tagPrefix });
            });
        });
    }
}

// Documented here: https://culturedcode.com/things/support/articles/2982272/
const THINGS_DB_PATH = "~/Library/Group Containers/JLMPQHK86H.com.culturedcode.ThingsMac/Things Database.thingsdatabase/main.sqlite";

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}

/* @license
Papa Parse
v5.3.0
https://github.com/mholt/PapaParse
License: MIT
*/

var papaparse_min = createCommonjsModule(function (module, exports) {
!function(e,t){module.exports=t();}(commonjsGlobal,function s(){var f="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==f?f:{};var n=!f.document&&!!f.postMessage,o=n&&/blob:/i.test((f.location||{}).protocol),a={},h=0,b={parse:function(e,t){var i=(t=t||{}).dynamicTyping||!1;U(i)&&(t.dynamicTypingFunction=i,i={});if(t.dynamicTyping=i,t.transform=!!U(t.transform)&&t.transform,t.worker&&b.WORKERS_SUPPORTED){var r=function(){if(!b.WORKERS_SUPPORTED)return !1;var e=(i=f.URL||f.webkitURL||null,r=s.toString(),b.BLOB_URL||(b.BLOB_URL=i.createObjectURL(new Blob(["(",r,")();"],{type:"text/javascript"})))),t=new f.Worker(e);var i,r;return t.onmessage=m,t.id=h++,a[t.id]=t}();return r.userStep=t.step,r.userChunk=t.chunk,r.userComplete=t.complete,r.userError=t.error,t.step=U(t.step),t.chunk=U(t.chunk),t.complete=U(t.complete),t.error=U(t.error),delete t.worker,void r.postMessage({input:e,config:t,workerId:r.id})}var n=null;"string"==typeof e?n=t.download?new l(t):new p(t):!0===e.readable&&U(e.read)&&U(e.on)?n=new g(t):(f.File&&e instanceof File||e instanceof Object)&&(n=new c(t));return n.stream(e)},unparse:function(e,t){var n=!1,m=!0,_=",",v="\r\n",s='"',a=s+s,i=!1,r=null,o=!1;!function(){if("object"!=typeof t)return;"string"!=typeof t.delimiter||b.BAD_DELIMITERS.filter(function(e){return -1!==t.delimiter.indexOf(e)}).length||(_=t.delimiter);("boolean"==typeof t.quotes||"function"==typeof t.quotes||Array.isArray(t.quotes))&&(n=t.quotes);"boolean"!=typeof t.skipEmptyLines&&"string"!=typeof t.skipEmptyLines||(i=t.skipEmptyLines);"string"==typeof t.newline&&(v=t.newline);"string"==typeof t.quoteChar&&(s=t.quoteChar);"boolean"==typeof t.header&&(m=t.header);if(Array.isArray(t.columns)){if(0===t.columns.length)throw new Error("Option columns is empty");r=t.columns;}void 0!==t.escapeChar&&(a=t.escapeChar+s);"boolean"==typeof t.escapeFormulae&&(o=t.escapeFormulae);}();var h=new RegExp(q(s),"g");"string"==typeof e&&(e=JSON.parse(e));if(Array.isArray(e)){if(!e.length||Array.isArray(e[0]))return f(null,e,i);if("object"==typeof e[0])return f(r||u(e[0]),e,i)}else if("object"==typeof e)return "string"==typeof e.data&&(e.data=JSON.parse(e.data)),Array.isArray(e.data)&&(e.fields||(e.fields=e.meta&&e.meta.fields),e.fields||(e.fields=Array.isArray(e.data[0])?e.fields:u(e.data[0])),Array.isArray(e.data[0])||"object"==typeof e.data[0]||(e.data=[e.data])),f(e.fields||[],e.data||[],i);throw new Error("Unable to serialize unrecognized input");function u(e){if("object"!=typeof e)return [];var t=[];for(var i in e)t.push(i);return t}function f(e,t,i){var r="";"string"==typeof e&&(e=JSON.parse(e)),"string"==typeof t&&(t=JSON.parse(t));var n=Array.isArray(e)&&0<e.length,s=!Array.isArray(t[0]);if(n&&m){for(var a=0;a<e.length;a++)0<a&&(r+=_),r+=y(e[a],a);0<t.length&&(r+=v);}for(var o=0;o<t.length;o++){var h=n?e.length:t[o].length,u=!1,f=n?0===Object.keys(t[o]).length:0===t[o].length;if(i&&!n&&(u="greedy"===i?""===t[o].join("").trim():1===t[o].length&&0===t[o][0].length),"greedy"===i&&n){for(var d=[],l=0;l<h;l++){var c=s?e[l]:l;d.push(t[o][c]);}u=""===d.join("").trim();}if(!u){for(var p=0;p<h;p++){0<p&&!f&&(r+=_);var g=n&&s?e[p]:p;r+=y(t[o][g],p);}o<t.length-1&&(!i||0<h&&!f)&&(r+=v);}}return r}function y(e,t){if(null==e)return "";if(e.constructor===Date)return JSON.stringify(e).slice(1,25);!0===o&&"string"==typeof e&&null!==e.match(/^[=+\-@].*$/)&&(e="'"+e);var i=e.toString().replace(h,a),r="boolean"==typeof n&&n||"function"==typeof n&&n(e,t)||Array.isArray(n)&&n[t]||function(e,t){for(var i=0;i<t.length;i++)if(-1<e.indexOf(t[i]))return !0;return !1}(i,b.BAD_DELIMITERS)||-1<i.indexOf(_)||" "===i.charAt(0)||" "===i.charAt(i.length-1);return r?s+i+s:i}}};if(b.RECORD_SEP=String.fromCharCode(30),b.UNIT_SEP=String.fromCharCode(31),b.BYTE_ORDER_MARK="\ufeff",b.BAD_DELIMITERS=["\r","\n",'"',b.BYTE_ORDER_MARK],b.WORKERS_SUPPORTED=!n&&!!f.Worker,b.NODE_STREAM_INPUT=1,b.LocalChunkSize=10485760,b.RemoteChunkSize=5242880,b.DefaultDelimiter=",",b.Parser=w,b.ParserHandle=i,b.NetworkStreamer=l,b.FileStreamer=c,b.StringStreamer=p,b.ReadableStreamStreamer=g,f.jQuery){var d=f.jQuery;d.fn.parse=function(o){var i=o.config||{},h=[];return this.each(function(e){if(!("INPUT"===d(this).prop("tagName").toUpperCase()&&"file"===d(this).attr("type").toLowerCase()&&f.FileReader)||!this.files||0===this.files.length)return !0;for(var t=0;t<this.files.length;t++)h.push({file:this.files[t],inputElem:this,instanceConfig:d.extend({},i)});}),e(),this;function e(){if(0!==h.length){var e,t,i,r,n=h[0];if(U(o.before)){var s=o.before(n.file,n.inputElem);if("object"==typeof s){if("abort"===s.action)return e="AbortError",t=n.file,i=n.inputElem,r=s.reason,void(U(o.error)&&o.error({name:e},t,i,r));if("skip"===s.action)return void u();"object"==typeof s.config&&(n.instanceConfig=d.extend(n.instanceConfig,s.config));}else if("skip"===s)return void u()}var a=n.instanceConfig.complete;n.instanceConfig.complete=function(e){U(a)&&a(e,n.file,n.inputElem),u();},b.parse(n.file,n.instanceConfig);}else U(o.complete)&&o.complete();}function u(){h.splice(0,1),e();}};}function u(e){this._handle=null,this._finished=!1,this._completed=!1,this._halted=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},function(e){var t=E(e);t.chunkSize=parseInt(t.chunkSize),e.step||e.chunk||(t.chunkSize=null);this._handle=new i(t),(this._handle.streamer=this)._config=t;}.call(this,e),this.parseChunk=function(e,t){if(this.isFirstChunk&&U(this._config.beforeFirstChunk)){var i=this._config.beforeFirstChunk(e);void 0!==i&&(e=i);}this.isFirstChunk=!1,this._halted=!1;var r=this._partialLine+e;this._partialLine="";var n=this._handle.parse(r,this._baseIndex,!this._finished);if(!this._handle.paused()&&!this._handle.aborted()){var s=n.meta.cursor;this._finished||(this._partialLine=r.substring(s-this._baseIndex),this._baseIndex=s),n&&n.data&&(this._rowCount+=n.data.length);var a=this._finished||this._config.preview&&this._rowCount>=this._config.preview;if(o)f.postMessage({results:n,workerId:b.WORKER_ID,finished:a});else if(U(this._config.chunk)&&!t){if(this._config.chunk(n,this._handle),this._handle.paused()||this._handle.aborted())return void(this._halted=!0);n=void 0,this._completeResults=void 0;}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(n.data),this._completeResults.errors=this._completeResults.errors.concat(n.errors),this._completeResults.meta=n.meta),this._completed||!a||!U(this._config.complete)||n&&n.meta.aborted||(this._config.complete(this._completeResults,this._input),this._completed=!0),a||n&&n.meta.paused||this._nextChunk(),n}this._halted=!0;},this._sendError=function(e){U(this._config.error)?this._config.error(e):o&&this._config.error&&f.postMessage({workerId:b.WORKER_ID,error:e,finished:!1});};}function l(e){var r;(e=e||{}).chunkSize||(e.chunkSize=b.RemoteChunkSize),u.call(this,e),this._nextChunk=n?function(){this._readChunk(),this._chunkLoaded();}:function(){this._readChunk();},this.stream=function(e){this._input=e,this._nextChunk();},this._readChunk=function(){if(this._finished)this._chunkLoaded();else {if(r=new XMLHttpRequest,this._config.withCredentials&&(r.withCredentials=this._config.withCredentials),n||(r.onload=y(this._chunkLoaded,this),r.onerror=y(this._chunkError,this)),r.open(this._config.downloadRequestBody?"POST":"GET",this._input,!n),this._config.downloadRequestHeaders){var e=this._config.downloadRequestHeaders;for(var t in e)r.setRequestHeader(t,e[t]);}if(this._config.chunkSize){var i=this._start+this._config.chunkSize-1;r.setRequestHeader("Range","bytes="+this._start+"-"+i);}try{r.send(this._config.downloadRequestBody);}catch(e){this._chunkError(e.message);}n&&0===r.status&&this._chunkError();}},this._chunkLoaded=function(){4===r.readyState&&(r.status<200||400<=r.status?this._chunkError():(this._start+=this._config.chunkSize?this._config.chunkSize:r.responseText.length,this._finished=!this._config.chunkSize||this._start>=function(e){var t=e.getResponseHeader("Content-Range");if(null===t)return -1;return parseInt(t.substring(t.lastIndexOf("/")+1))}(r),this.parseChunk(r.responseText)));},this._chunkError=function(e){var t=r.statusText||e;this._sendError(new Error(t));};}function c(e){var r,n;(e=e||{}).chunkSize||(e.chunkSize=b.LocalChunkSize),u.call(this,e);var s="undefined"!=typeof FileReader;this.stream=function(e){this._input=e,n=e.slice||e.webkitSlice||e.mozSlice,s?((r=new FileReader).onload=y(this._chunkLoaded,this),r.onerror=y(this._chunkError,this)):r=new FileReaderSync,this._nextChunk();},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk();},this._readChunk=function(){var e=this._input;if(this._config.chunkSize){var t=Math.min(this._start+this._config.chunkSize,this._input.size);e=n.call(e,this._start,t);}var i=r.readAsText(e,this._config.encoding);s||this._chunkLoaded({target:{result:i}});},this._chunkLoaded=function(e){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(e.target.result);},this._chunkError=function(){this._sendError(r.error);};}function p(e){var i;u.call(this,e=e||{}),this.stream=function(e){return i=e,this._nextChunk()},this._nextChunk=function(){if(!this._finished){var e,t=this._config.chunkSize;return t?(e=i.substring(0,t),i=i.substring(t)):(e=i,i=""),this._finished=!i,this.parseChunk(e)}};}function g(e){u.call(this,e=e||{});var t=[],i=!0,r=!1;this.pause=function(){u.prototype.pause.apply(this,arguments),this._input.pause();},this.resume=function(){u.prototype.resume.apply(this,arguments),this._input.resume();},this.stream=function(e){this._input=e,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError);},this._checkIsFinished=function(){r&&1===t.length&&(this._finished=!0);},this._nextChunk=function(){this._checkIsFinished(),t.length?this.parseChunk(t.shift()):i=!0;},this._streamData=y(function(e){try{t.push("string"==typeof e?e:e.toString(this._config.encoding)),i&&(i=!1,this._checkIsFinished(),this.parseChunk(t.shift()));}catch(e){this._streamError(e);}},this),this._streamError=y(function(e){this._streamCleanUp(),this._sendError(e);},this),this._streamEnd=y(function(){this._streamCleanUp(),r=!0,this._streamData("");},this),this._streamCleanUp=y(function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError);},this);}function i(_){var a,o,h,r=Math.pow(2,53),n=-r,s=/^\s*-?(\d+\.?|\.\d+|\d+\.\d+)(e[-+]?\d+)?\s*$/,u=/(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/,t=this,i=0,f=0,d=!1,e=!1,l=[],c={data:[],errors:[],meta:{}};if(U(_.step)){var p=_.step;_.step=function(e){if(c=e,m())g();else {if(g(),0===c.data.length)return;i+=e.data.length,_.preview&&i>_.preview?o.abort():(c.data=c.data[0],p(c,t));}};}function v(e){return "greedy"===_.skipEmptyLines?""===e.join("").trim():1===e.length&&0===e[0].length}function g(){if(c&&h&&(k("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+b.DefaultDelimiter+"'"),h=!1),_.skipEmptyLines)for(var e=0;e<c.data.length;e++)v(c.data[e])&&c.data.splice(e--,1);return m()&&function(){if(!c)return;function e(e,t){U(_.transformHeader)&&(e=_.transformHeader(e,t)),l.push(e);}if(Array.isArray(c.data[0])){for(var t=0;m()&&t<c.data.length;t++)c.data[t].forEach(e);c.data.splice(0,1);}else c.data.forEach(e);}(),function(){if(!c||!_.header&&!_.dynamicTyping&&!_.transform)return c;function e(e,t){var i,r=_.header?{}:[];for(i=0;i<e.length;i++){var n=i,s=e[i];_.header&&(n=i>=l.length?"__parsed_extra":l[i]),_.transform&&(s=_.transform(s,n)),s=y(n,s),"__parsed_extra"===n?(r[n]=r[n]||[],r[n].push(s)):r[n]=s;}return _.header&&(i>l.length?k("FieldMismatch","TooManyFields","Too many fields: expected "+l.length+" fields but parsed "+i,f+t):i<l.length&&k("FieldMismatch","TooFewFields","Too few fields: expected "+l.length+" fields but parsed "+i,f+t)),r}var t=1;!c.data.length||Array.isArray(c.data[0])?(c.data=c.data.map(e),t=c.data.length):c.data=e(c.data,0);_.header&&c.meta&&(c.meta.fields=l);return f+=t,c}()}function m(){return _.header&&0===l.length}function y(e,t){return i=e,_.dynamicTypingFunction&&void 0===_.dynamicTyping[i]&&(_.dynamicTyping[i]=_.dynamicTypingFunction(i)),!0===(_.dynamicTyping[i]||_.dynamicTyping)?"true"===t||"TRUE"===t||"false"!==t&&"FALSE"!==t&&(function(e){if(s.test(e)){var t=parseFloat(e);if(n<t&&t<r)return !0}return !1}(t)?parseFloat(t):u.test(t)?new Date(t):""===t?null:t):t;var i;}function k(e,t,i,r){var n={type:e,code:t,message:i};void 0!==r&&(n.row=r),c.errors.push(n);}this.parse=function(e,t,i){var r=_.quoteChar||'"';if(_.newline||(_.newline=function(e,t){e=e.substring(0,1048576);var i=new RegExp(q(t)+"([^]*?)"+q(t),"gm"),r=(e=e.replace(i,"")).split("\r"),n=e.split("\n"),s=1<n.length&&n[0].length<r[0].length;if(1===r.length||s)return "\n";for(var a=0,o=0;o<r.length;o++)"\n"===r[o][0]&&a++;return a>=r.length/2?"\r\n":"\r"}(e,r)),h=!1,_.delimiter)U(_.delimiter)&&(_.delimiter=_.delimiter(e),c.meta.delimiter=_.delimiter);else {var n=function(e,t,i,r,n){var s,a,o,h;n=n||[",","\t","|",";",b.RECORD_SEP,b.UNIT_SEP];for(var u=0;u<n.length;u++){var f=n[u],d=0,l=0,c=0;o=void 0;for(var p=new w({comments:r,delimiter:f,newline:t,preview:10}).parse(e),g=0;g<p.data.length;g++)if(i&&v(p.data[g]))c++;else {var m=p.data[g].length;l+=m,void 0!==o?0<m&&(d+=Math.abs(m-o),o=m):o=m;}0<p.data.length&&(l/=p.data.length-c),(void 0===a||d<=a)&&(void 0===h||h<l)&&1.99<l&&(a=d,s=f,h=l);}return {successful:!!(_.delimiter=s),bestDelimiter:s}}(e,_.newline,_.skipEmptyLines,_.comments,_.delimitersToGuess);n.successful?_.delimiter=n.bestDelimiter:(h=!0,_.delimiter=b.DefaultDelimiter),c.meta.delimiter=_.delimiter;}var s=E(_);return _.preview&&_.header&&s.preview++,a=e,o=new w(s),c=o.parse(a,t,i),g(),d?{meta:{paused:!0}}:c||{meta:{paused:!1}}},this.paused=function(){return d},this.pause=function(){d=!0,o.abort(),a=U(_.chunk)?"":a.substring(o.getCharIndex());},this.resume=function(){t.streamer._halted?(d=!1,t.streamer.parseChunk(a,!0)):setTimeout(t.resume,3);},this.aborted=function(){return e},this.abort=function(){e=!0,o.abort(),c.meta.aborted=!0,U(_.complete)&&_.complete(c),a="";};}function q(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function w(e){var O,D=(e=e||{}).delimiter,I=e.newline,T=e.comments,A=e.step,L=e.preview,F=e.fastMode,z=O=void 0===e.quoteChar?'"':e.quoteChar;if(void 0!==e.escapeChar&&(z=e.escapeChar),("string"!=typeof D||-1<b.BAD_DELIMITERS.indexOf(D))&&(D=","),T===D)throw new Error("Comment character same as delimiter");!0===T?T="#":("string"!=typeof T||-1<b.BAD_DELIMITERS.indexOf(T))&&(T=!1),"\n"!==I&&"\r"!==I&&"\r\n"!==I&&(I="\n");var M=0,j=!1;this.parse=function(a,t,i){if("string"!=typeof a)throw new Error("Input must be a string");var r=a.length,e=D.length,n=I.length,s=T.length,o=U(A),h=[],u=[],f=[],d=M=0;if(!a)return R();if(F||!1!==F&&-1===a.indexOf(O)){for(var l=a.split(I),c=0;c<l.length;c++){if(f=l[c],M+=f.length,c!==l.length-1)M+=I.length;else if(i)return R();if(!T||f.substring(0,s)!==T){if(o){if(h=[],b(f.split(D)),S(),j)return R()}else b(f.split(D));if(L&&L<=c)return h=h.slice(0,L),R(!0)}}return R()}for(var p=a.indexOf(D,M),g=a.indexOf(I,M),m=new RegExp(q(z)+q(O),"g"),_=a.indexOf(O,M);;)if(a[M]!==O)if(T&&0===f.length&&a.substring(M,M+s)===T){if(-1===g)return R();M=g+n,g=a.indexOf(I,M),p=a.indexOf(D,M);}else {if(-1!==p&&(p<g||-1===g)){if(!(p<_)){f.push(a.substring(M,p)),M=p+e,p=a.indexOf(D,M);continue}var v=x(p,_,g);if(v&&void 0!==v.nextDelim){p=v.nextDelim,_=v.quoteSearch,f.push(a.substring(M,p)),M=p+e,p=a.indexOf(D,M);continue}}if(-1===g)break;if(f.push(a.substring(M,g)),C(g+n),o&&(S(),j))return R();if(L&&h.length>=L)return R(!0)}else for(_=M,M++;;){if(-1===(_=a.indexOf(O,_+1)))return i||u.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:h.length,index:M}),E();if(_===r-1)return E(a.substring(M,_).replace(m,O));if(O!==z||a[_+1]!==z){if(O===z||0===_||a[_-1]!==z){-1!==p&&p<_+1&&(p=a.indexOf(D,_+1)),-1!==g&&g<_+1&&(g=a.indexOf(I,_+1));var y=w(-1===g?p:Math.min(p,g));if(a[_+1+y]===D){f.push(a.substring(M,_).replace(m,O)),a[M=_+1+y+e]!==O&&(_=a.indexOf(O,M)),p=a.indexOf(D,M),g=a.indexOf(I,M);break}var k=w(g);if(a.substring(_+1+k,_+1+k+n)===I){if(f.push(a.substring(M,_).replace(m,O)),C(_+1+k+n),p=a.indexOf(D,M),_=a.indexOf(O,M),o&&(S(),j))return R();if(L&&h.length>=L)return R(!0);break}u.push({type:"Quotes",code:"InvalidQuotes",message:"Trailing quote on quoted field is malformed",row:h.length,index:M}),_++;}}else _++;}return E();function b(e){h.push(e),d=M;}function w(e){var t=0;if(-1!==e){var i=a.substring(_+1,e);i&&""===i.trim()&&(t=i.length);}return t}function E(e){return i||(void 0===e&&(e=a.substring(M)),f.push(e),M=r,b(f),o&&S()),R()}function C(e){M=e,b(f),f=[],g=a.indexOf(I,M);}function R(e){return {data:h,errors:u,meta:{delimiter:D,linebreak:I,aborted:j,truncated:!!e,cursor:d+(t||0)}}}function S(){A(R()),h=[],u=[];}function x(e,t,i){var r={nextDelim:void 0,quoteSearch:void 0},n=a.indexOf(O,t+1);if(t<e&&e<n&&(n<i||-1===i)){var s=a.indexOf(D,n);if(-1===s)return r;n<s&&(n=a.indexOf(O,n+1)),r=x(s,n,i);}else r={nextDelim:e,quoteSearch:t};return r}},this.abort=function(){j=!0;},this.getCharIndex=function(){return M};}function m(e){var t=e.data,i=a[t.workerId],r=!1;if(t.error)i.userError(t.error,t.file);else if(t.results&&t.results.data){var n={abort:function(){r=!0,_(t.workerId,{data:[],errors:[],meta:{aborted:!0}});},pause:v,resume:v};if(U(i.userStep)){for(var s=0;s<t.results.data.length&&(i.userStep({data:t.results.data[s],errors:t.results.errors,meta:t.results.meta},n),!r);s++);delete t.results;}else U(i.userChunk)&&(i.userChunk(t.results,n,t.file),delete t.results);}t.finished&&!r&&_(t.workerId,t.results);}function _(e,t){var i=a[e];U(i.userComplete)&&i.userComplete(t),i.terminate(),delete a[e];}function v(){throw new Error("Not implemented.")}function E(e){if("object"!=typeof e||null===e)return e;var t=Array.isArray(e)?[]:{};for(var i in e)t[i]=E(e[i]);return t}function y(e,t){return function(){e.apply(t,arguments);}}function U(e){return "function"==typeof e}return o&&(f.onmessage=function(e){var t=e.data;void 0===b.WORKER_ID&&t&&(b.WORKER_ID=t.workerId);if("string"==typeof t.input)f.postMessage({workerId:b.WORKER_ID,results:b.parse(t.input,t.config),finished:!0});else if(f.File&&t.input instanceof File||t.input instanceof Object){var i=b.parse(t.input,t.config);i&&f.postMessage({workerId:b.WORKER_ID,results:i,finished:!0});}}),(l.prototype=Object.create(u.prototype)).constructor=l,(c.prototype=Object.create(u.prototype)).constructor=c,(p.prototype=Object.create(p.prototype)).constructor=p,(g.prototype=Object.create(u.prototype)).constructor=g,b});
});

function parseCSV(csv) {
    const lines = Buffer.concat(csv).toString("utf-8");
    return papaparse_min.parse(lines, {
        dynamicTyping: false,
        header: true,
        newline: "\n",
        skipEmptyLines: true,
    }).data;
}
async function handleSqliteQuery(dbPath, query) {
    return new Promise((done) => {
        const stdOut = [];
        const stdErr = [];
        const spawned = child_process.spawn("sqlite3", [dbPath, "-header", "-csv", "-readonly", query], { detached: true });
        spawned.stdout.on("data", (buffer) => {
            stdOut.push(buffer);
        });
        spawned.stderr.on("data", (buffer) => {
            stdErr.push(buffer);
        });
        spawned.on("error", (err) => {
            stdErr.push(Buffer.from(String(err.stack), "ascii"));
        });
        spawned.on("close", (code) => done({ stdErr, stdOut, code }));
        spawned.on("exit", (code) => done({ stdErr, stdOut, code }));
    });
}
async function querySqliteDB(dbPath, query) {
    const { stdOut, stdErr } = await handleSqliteQuery(dbPath, query);
    if (stdErr.length) {
        const error = Buffer.concat(stdErr).toString("utf-8");
        return Promise.reject(error);
    }
    return parseCSV(stdOut);
}

const TASK_FETCH_LIMIT = 1000;
const thingsSqlitePath = THINGS_DB_PATH.replace("~", os.homedir());
class ThingsSQLiteSyncError extends Error {
}
function buildTasksFromSQLRecords(taskRecords, checklistRecords) {
    const tasks = {};
    taskRecords.forEach(({ tag, ...task }) => {
        const id = task.uuid;
        if (tasks[id]) {
            tasks[id].tags.push(tag);
        }
        else {
            tasks[id] = {
                ...task,
                title: (task.title || "").trimEnd(),
                subtasks: [],
                tags: [tag],
            };
        }
    });
    checklistRecords.forEach(({ taskId, title, stopDate }) => {
        const task = tasks[taskId];
        const subtask = {
            completed: !!stopDate,
            title: title.trimEnd(),
        };
        // checklist item might be completed before task
        if (task) {
            if (task.subtasks) {
                task.subtasks.push(subtask);
            }
            else {
                task.subtasks = [subtask];
            }
        }
    });
    return Object.values(tasks);
}
async function getTasksFromThingsDb(latestSyncTime) {
    return querySqliteDB(thingsSqlitePath, `SELECT
        TMTask.uuid as uuid,
        TMTask.title as title,
        TMTask.notes as notes,
        TMTask.startDate as startDate,
        TMTask.stopDate as stopDate,
        TMArea.title as area,
        TMTag.title as tag
    FROM
        TMTask
    LEFT JOIN TMTaskTag
        ON TMTaskTag.tasks = TMTask.uuid
    LEFT JOIN TMTag
        ON TMTag.uuid = TMTaskTag.tags
    LEFT JOIN TMArea
        ON TMTask.area = TMArea.uuid
    WHERE
        TMTask.trashed = 0
        AND TMTask.stopDate IS NOT NULL
        AND TMTask.stopDate > ${latestSyncTime}
    ORDER BY
        TMTask.stopDate
    LIMIT ${TASK_FETCH_LIMIT}
        `);
}
async function getChecklistItemsThingsDb(latestSyncTime) {
    return querySqliteDB(thingsSqlitePath, `SELECT
        task as taskId,
        title as title,
        stopDate as stopDate
    FROM
        TMChecklistItem
    WHERE
        stopDate > ${latestSyncTime}
        AND title IS NOT ""
    ORDER BY
        stopDate
    LIMIT ${TASK_FETCH_LIMIT}
        `);
}
async function getTasksFromThingsLogbook(latestSyncTime) {
    const taskRecords = [];
    let isSyncCompleted = false;
    let stopTime = window.moment.unix(latestSyncTime).startOf("day").unix();
    try {
        while (!isSyncCompleted) {
            console.debug("[Things Logbook] fetching tasks from sqlite db...");
            const batch = await getTasksFromThingsDb(stopTime);
            isSyncCompleted = batch.length < TASK_FETCH_LIMIT;
            stopTime = batch.filter((t) => t.stopDate).last()?.stopDate;
            taskRecords.push(...batch);
            console.debug(`[Things Logbook] fetched ${batch.length} tasks from sqlite db`);
        }
    }
    catch (err) {
        console.error("[Things Logbook] Failed to query the Things SQLite DB", err);
        throw new ThingsSQLiteSyncError("fetch Tasks failed");
    }
    return taskRecords;
}
async function getChecklistItemsFromThingsLogbook(latestSyncTime) {
    const checklistItems = [];
    let isSyncCompleted = false;
    let stopTime = latestSyncTime;
    try {
        while (!isSyncCompleted) {
            console.debug("[Things Logbook] fetching checklist items from sqlite db...");
            const batch = await getChecklistItemsThingsDb(stopTime);
            isSyncCompleted = batch.length < TASK_FETCH_LIMIT;
            stopTime = batch.filter((t) => t.stopDate).last()?.stopDate;
            checklistItems.push(...batch);
            console.debug(`[Things Logbook] fetched ${batch.length} checklist items from sqlite db`);
        }
    }
    catch (err) {
        console.error("[Things Logbook] Failed to query the Things SQLite DB", err);
        throw new ThingsSQLiteSyncError("fetch Subtasks failed");
    }
    return checklistItems;
}

class ThingsLogbookPlugin extends obsidian.Plugin {
    async onload() {
        if (!isMacOS()) {
            console.info("Failed to load Things Logbook plugin. Platform not supported");
            return;
        }
        this.scheduleNextSync = this.scheduleNextSync.bind(this);
        this.syncLogbook = this.syncLogbook.bind(this);
        this.tryToScheduleSync = this.tryToScheduleSync.bind(this);
        this.tryToSyncLogbook = this.tryToSyncLogbook.bind(this);
        this.addCommand({
            id: "sync-things-logbook",
            name: "Sync",
            callback: () => setTimeout(this.tryToSyncLogbook, 20),
        });
        await this.loadOptions();
        this.settingsTab = new ThingsLogbookSettingsTab(this.app, this);
        this.addSettingTab(this.settingsTab);
        if (this.options.hasAcceptedDisclaimer && this.options.isSyncEnabled) {
            if (this.app.workspace.layoutReady) {
                this.scheduleNextSync();
            }
            else {
                this.registerEvent(this.app.workspace.on("layout-ready", this.scheduleNextSync));
            }
        }
    }
    async tryToSyncLogbook() {
        if (this.options.hasAcceptedDisclaimer) {
            this.syncLogbook();
        }
        else {
            new ConfirmationModal(this.app, {
                cta: "Sync",
                onAccept: async () => {
                    await this.writeOptions({ hasAcceptedDisclaimer: true });
                    this.syncLogbook();
                },
                text: "Enabling sync will backfill your entire Things Logbook into Obsidian. This means potentially creating or modifying hundreds of notes. Make sure to test the plugin in a test vault before continuing.",
                title: "Sync Now?",
            }).open();
        }
    }
    async tryToScheduleSync() {
        if (this.options.hasAcceptedDisclaimer) {
            this.scheduleNextSync();
        }
        else {
            new ConfirmationModal(this.app, {
                cta: "Sync",
                onAccept: async () => {
                    await this.writeOptions({ hasAcceptedDisclaimer: true });
                    this.scheduleNextSync();
                },
                onCancel: async () => {
                    await this.writeOptions({ isSyncEnabled: false });
                    // update the settings tab display
                    this.settingsTab.display();
                },
                text: "Enabling sync will backfill your entire Things Logbook into Obsidian. This means potentially creating or modifying hundreds of notes. Make sure to test the plugin in a test vault before continuing.",
                title: "Sync Now?",
            }).open();
        }
    }
    async syncLogbook() {
        const logbookRenderer = new LogbookRenderer(this.app, this.options);
        const dailyNotes = getAllDailyNotes_1();
        const latestSyncTime = this.options.latestSyncTime || 0;
        let taskRecords = [];
        let checklistRecords = [];
        try {
            taskRecords = await getTasksFromThingsLogbook(latestSyncTime);
            checklistRecords = await getChecklistItemsFromThingsLogbook(latestSyncTime);
        }
        catch (err) {
            new obsidian.Notice("Things Logbook sync failed");
            return;
        }
        const tasks = buildTasksFromSQLRecords(taskRecords, checklistRecords);
        const daysToTasks = groupBy(tasks.filter((task) => task.stopDate), (task) => window.moment.unix(task.stopDate).startOf("day").format());
        for (const [dateStr, tasks] of Object.entries(daysToTasks)) {
            const date = window.moment(dateStr);
            let dailyNote = getDailyNote_1(date, dailyNotes);
            if (!dailyNote) {
                dailyNote = await createDailyNote_1(date);
            }
            await updateSection(this.app, dailyNote, this.options.sectionHeading, logbookRenderer.render(tasks));
        }
        new obsidian.Notice("Things Logbook sync complete");
        this.writeOptions({ latestSyncTime: window.moment().unix() });
        this.scheduleNextSync();
    }
    cancelScheduledSync() {
        if (this.syncTimeoutId !== undefined) {
            window.clearTimeout(this.syncTimeoutId);
        }
    }
    scheduleNextSync() {
        const now = window.moment().unix();
        this.cancelScheduledSync();
        if (!this.options.isSyncEnabled || !this.options.syncInterval) {
            console.debug("[Things Logbook] scheduling skipped, no syncInterval set");
            return;
        }
        const { latestSyncTime, syncInterval } = this.options;
        const syncIntervalMs = syncInterval * 1000;
        const nextSync = Math.max(latestSyncTime + syncIntervalMs - now, 20);
        console.debug(`[Things Logbook] next sync scheduled in ${nextSync}ms`);
        this.syncTimeoutId = window.setTimeout(this.syncLogbook, nextSync);
    }
    async loadOptions() {
        this.options = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
        if (!this.options.hasAcceptedDisclaimer) {
            // In case the user quits before accepting sync modal,
            // this keep the settings in sync
            this.options.isSyncEnabled = false;
        }
    }
    async writeOptions(diff) {
        this.options = Object.assign(this.options, diff);
        // Sync toggled on/off
        if (diff.isSyncEnabled !== undefined) {
            if (diff.isSyncEnabled) {
                this.tryToScheduleSync();
            }
            else {
                this.cancelScheduledSync();
            }
        }
        else if (diff.syncInterval !== undefined && this.options.isSyncEnabled) {
            // reschedule if interval changed
            this.tryToScheduleSync();
        }
        await this.saveData(this.options);
    }
}

module.exports = ThingsLogbookPlugin;
