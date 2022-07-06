'use strict';

var obsidian = require('obsidian');
var state = require('@codemirror/state');
var view = require('@codemirror/view');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

class Settings {
    constructor() {
        // Defaults as in Vimium extension for browsers
        this.letters = 'sadfjklewcmpgh';
        this.jumpToAnywhereRegex = '\\b\\w{3,}\\b';
    }
}

class MarkWidget extends view.WidgetType {
    constructor(mark) {
        super();
        this.mark = mark;
    }
    eq(other) {
        return other.mark === this.mark;
    }
    toDOM() {
        const mark = document.createElement("span");
        mark.innerText = this.mark;
        const wrapper = document.createElement("div");
        wrapper.style.display = "inline-block";
        wrapper.style.position = "absolute";
        wrapper.classList.add('jl');
        wrapper.classList.add('popover');
        wrapper.append(mark);
        return wrapper;
    }
    ignoreEvent() {
        return false;
    }
}

class MarkPlugin {
    constructor(links) {
        this.links = [];
        this.links = links;
    }
    setLinks(links) {
        this.links = links;
    }
    clean() {
        this.links = [];
    }
    get visible() {
        return this.links.length > 0;
    }
    createMarks() {
        const widgets = this.links.map((x) => view.Decoration.widget({
            widget: new MarkWidget(x.letter),
            side: 1,
        }).range(x.index));
        return view.Decoration.set(widgets);
    }
}
function createViewPluginClass(markPlugin) {
    return class {
        constructor(_view) {
            this.decorations = markPlugin.createMarks();
        }
        update(_update) {
            this.decorations = markPlugin.createMarks();
        }
    };
}

/**
 * Get only visible content
 * @param cmEditor
 * @returns Letter offset and visible content as a string
 */
function getVisibleLineText(cmEditor) {
    const scrollInfo = cmEditor.getScrollInfo();
    const { line: from } = cmEditor.coordsChar({ left: 0, top: 0 }, 'page');
    const { line: to } = cmEditor.coordsChar({ left: scrollInfo.left, top: scrollInfo.top + scrollInfo.height });
    const indOffset = cmEditor.indexFromPos({ ch: 0, line: from });
    const strs = cmEditor.getRange({ ch: 0, line: from }, { ch: 0, line: to + 1 });
    return { indOffset, strs };
}
/**
 *
 * @param alphabet - Letters which used to produce hints
 * @param numLinkHints - Count of needed links
 */
function getLinkHintLetters(alphabet, numLinkHints) {
    const alphabetUppercase = alphabet.toUpperCase();
    let prefixCount = Math.ceil((numLinkHints - alphabetUppercase.length) / (alphabetUppercase.length - 1));
    // ensure 0 <= prefixCount <= alphabet.length
    prefixCount = Math.max(prefixCount, 0);
    prefixCount = Math.min(prefixCount, alphabetUppercase.length);
    const prefixes = ['', ...Array.from(alphabetUppercase.slice(0, prefixCount))];
    const linkHintLetters = [];
    for (let i = 0; i < prefixes.length; i++) {
        const prefix = prefixes[i];
        for (let j = 0; j < alphabetUppercase.length; j++) {
            if (linkHintLetters.length < numLinkHints) {
                const letter = alphabetUppercase[j];
                if (prefix === '') {
                    if (!prefixes.contains(letter)) {
                        linkHintLetters.push(letter);
                    }
                }
                else {
                    linkHintLetters.push(prefix + letter);
                }
            }
            else {
                break;
            }
        }
    }
    return linkHintLetters;
}
function getMDHintLinks(content, offset, letters) {
    // expecting either [[Link]] or [[Link|Title]]
    const regExInternal = /\[\[(.+?)(\|.+?)?]]/g;
    // expecting [Title](../example.md)
    const regExMdInternal = /\[.+?]\(((\.\.|\w|\d).+?)\)/g;
    // expecting [Title](file://link) or [Title](https://link)
    const regExExternal = /\[.+?]\(((https?:|file:).+?)\)/g;
    // expecting http://hogehoge or https://hogehoge
    const regExUrl = /( |\n|^)(https?:\/\/[^ \n]+)/g;
    let linksWithIndex = [];
    let regExResult;
    while (regExResult = regExInternal.exec(content)) {
        const linkText = regExResult[1];
        linksWithIndex.push({ index: regExResult.index + offset, type: 'internal', linkText });
    }
    while (regExResult = regExMdInternal.exec(content)) {
        const linkText = regExResult[1];
        linksWithIndex.push({ index: regExResult.index + offset, type: 'internal', linkText });
    }
    while (regExResult = regExExternal.exec(content)) {
        const linkText = regExResult[1];
        linksWithIndex.push({ index: regExResult.index + offset, type: 'external', linkText });
    }
    while (regExResult = regExUrl.exec(content)) {
        const linkText = regExResult[2];
        linksWithIndex.push({ index: regExResult.index + offset + 1, type: 'external', linkText });
    }
    const linkHintLetters = getLinkHintLetters(letters, linksWithIndex.length);
    const linksWithLetter = [];
    linksWithIndex
        .sort((x, y) => x.index - y.index)
        .forEach((linkHint, i) => {
        linksWithLetter.push(Object.assign({ letter: linkHintLetters[i] }, linkHint));
    });
    return linksWithLetter.filter(link => link.letter);
}
function createWidgetElement(content) {
    const linkHintEl = document.createElement('div');
    linkHintEl.classList.add('jl');
    linkHintEl.classList.add('popover');
    linkHintEl.innerHTML = content;
    return linkHintEl;
}
function displaySourcePopovers(cmEditor, linkKeyMap) {
    const drawWidget = (cmEditor, linkHint) => {
        const pos = cmEditor.posFromIndex(linkHint.index);
        // the fourth parameter is undocumented. it specifies where the widget should be place
        return cmEditor.addWidget(pos, createWidgetElement(linkHint.letter), false, 'over');
    };
    linkKeyMap.forEach(x => drawWidget(cmEditor, x));
}

class CM6LinkProcessor {
    constructor(editor, alphabet) {
        this.getSourceLinkHints = () => {
            const { letters } = this;
            const { index, content } = this.getVisibleLines();
            return getMDHintLinks(content, index, letters);
        };
        this.cmEditor = editor;
        this.letters = alphabet;
    }
    init() {
        return this.getSourceLinkHints();
    }
    getVisibleLines() {
        const { cmEditor } = this;
        const { from, to } = cmEditor.viewport;
        const content = cmEditor.state.sliceDoc(from, to);
        return { index: from, content };
    }
}

function extractRegexpBlocks(content, offset, regexp, letters) {
    const regExUrl = new RegExp(regexp, 'g');
    let linksWithIndex = [];
    let regExResult;
    while ((regExResult = regExUrl.exec(content))) {
        const linkText = regExResult[1];
        linksWithIndex.push({
            index: regExResult.index + offset,
            type: "regex",
            linkText,
        });
    }
    const linkHintLetters = getLinkHintLetters(letters, linksWithIndex.length);
    const linksWithLetter = [];
    linksWithIndex
        .sort((x, y) => x.index - y.index)
        .forEach((linkHint, i) => {
        linksWithLetter.push(Object.assign({ letter: linkHintLetters[i] }, linkHint));
    });
    return linksWithLetter.filter(link => link.letter);
}

class CM6RegexProcessor extends CM6LinkProcessor {
    constructor(editor, alphabet, regexp) {
        super(editor, alphabet);
        this.regexp = regexp;
    }
    init() {
        const { letters, regexp } = this;
        const { index, content } = this.getVisibleLines();
        return extractRegexpBlocks(content, index, regexp, letters);
    }
}

class LegacyRegexpProcessor {
    constructor(cmEditor, regexp, alphabet) {
        this.cmEditor = cmEditor;
        this.regexp = regexp;
        this.letters = alphabet;
    }
    init() {
        const [content, offset] = this.getVisibleContent();
        const links = this.getLinks(content, offset);
        this.display(links);
        return links;
    }
    getVisibleContent() {
        const { cmEditor } = this;
        const { indOffset, strs } = getVisibleLineText(cmEditor);
        return [strs, indOffset];
    }
    getLinks(content, offset) {
        const { regexp, letters } = this;
        return extractRegexpBlocks(content, offset, regexp, letters);
    }
    display(links) {
        const { cmEditor } = this;
        displaySourcePopovers(cmEditor, links);
    }
}

class LegacySourceLinkProcessor {
    constructor(editor, alphabet) {
        this.getSourceLinkHints = (cmEditor) => {
            const { letters } = this;
            const { indOffset, strs } = getVisibleLineText(cmEditor);
            return getMDHintLinks(strs, indOffset, letters);
        };
        this.cmEditor = editor;
        this.letters = alphabet;
    }
    init() {
        const { cmEditor } = this;
        const linkHints = this.getSourceLinkHints(cmEditor);
        displaySourcePopovers(cmEditor, linkHints);
        return linkHints;
    }
}

function getPreviewLinkHints(previewViewEl, letters) {
    const anchorEls = previewViewEl.querySelectorAll('a');
    const embedEls = previewViewEl.querySelectorAll('.internal-embed');
    const linkHints = [];
    anchorEls.forEach((anchorEl, _i) => {
        if (checkIsPreviewElOnScreen(previewViewEl, anchorEl)) {
            return;
        }
        const linkType = anchorEl.classList.contains('internal-link')
            ? 'internal'
            : 'external';
        const linkText = linkType === 'internal'
            ? anchorEl.dataset['href']
            : anchorEl.href;
        let offsetParent = anchorEl.offsetParent;
        let top = anchorEl.offsetTop;
        let left = anchorEl.offsetLeft;
        while (offsetParent) {
            if (offsetParent == previewViewEl) {
                offsetParent = undefined;
            }
            else {
                top += offsetParent.offsetTop;
                left += offsetParent.offsetLeft;
                offsetParent = offsetParent.offsetParent;
            }
        }
        linkHints.push({
            letter: '',
            linkText: linkText,
            type: linkType,
            top: top,
            left: left,
        });
    });
    embedEls.forEach((embedEl, _i) => {
        const linkText = embedEl.getAttribute('src');
        const linkEl = embedEl.querySelector('.markdown-embed-link');
        if (linkText && linkEl) {
            if (checkIsPreviewElOnScreen(previewViewEl, linkEl)) {
                return;
            }
            let offsetParent = linkEl.offsetParent;
            let top = linkEl.offsetTop;
            let left = linkEl.offsetLeft;
            while (offsetParent) {
                if (offsetParent == previewViewEl) {
                    offsetParent = undefined;
                }
                else {
                    top += offsetParent.offsetTop;
                    left += offsetParent.offsetLeft;
                    offsetParent = offsetParent.offsetParent;
                }
            }
            linkHints.push({
                letter: '',
                linkText: linkText,
                type: 'internal',
                top: top,
                left: left,
            });
        }
    });
    const sortedLinkHints = linkHints.sort((a, b) => {
        if (a.top > b.top) {
            return 1;
        }
        else if (a.top === b.top) {
            if (a.left > b.left) {
                return 1;
            }
            else if (a.left === b.left) {
                return 0;
            }
            else {
                return -1;
            }
        }
        else {
            return -1;
        }
    });
    const linkHintLetters = getLinkHintLetters(letters, sortedLinkHints.length);
    sortedLinkHints.forEach((linkHint, i) => {
        linkHint.letter = linkHintLetters[i];
    });
    return sortedLinkHints;
}
function checkIsPreviewElOnScreen(parent, el) {
    return el.offsetTop < parent.scrollTop || el.offsetTop > parent.scrollTop + parent.offsetHeight;
}
function displayPreviewPopovers(markdownPreviewViewEl, linkHints) {
    for (let linkHint of linkHints) {
        const linkHintEl = markdownPreviewViewEl.createEl('div');
        linkHintEl.style.top = linkHint.top + 'px';
        linkHintEl.style.left = linkHint.left + 'px';
        linkHintEl.textContent = linkHint.letter;
        linkHintEl.classList.add('jl');
        linkHintEl.classList.add('popover');
    }
}

class PreviewLinkProcessor {
    constructor(view, alphabet) {
        this.view = view;
        this.alphabet = alphabet;
    }
    init() {
        const { view, alphabet } = this;
        const links = getPreviewLinkHints(view, alphabet);
        displayPreviewPopovers(view, links);
        return links;
    }
}

var VIEW_MODE;
(function (VIEW_MODE) {
    VIEW_MODE[VIEW_MODE["LEGACY"] = 0] = "LEGACY";
    VIEW_MODE[VIEW_MODE["PREVIEW"] = 1] = "PREVIEW";
    VIEW_MODE[VIEW_MODE["CM6"] = 2] = "CM6";
})(VIEW_MODE || (VIEW_MODE = {}));
class JumpToLink extends obsidian.Plugin {
    constructor() {
        super(...arguments);
        this.isLinkHintActive = false;
        this.prefixInfo = undefined;
        this.handleJumpToLink = () => {
            const { settings: { letters }, app } = this;
            const currentView = app.workspace.activeLeaf.view;
            const mode = this.getMode(currentView);
            switch (mode) {
                case VIEW_MODE.LEGACY:
                    const cmEditor = currentView.sourceMode.cmEditor;
                    const sourceLinkHints = new LegacySourceLinkProcessor(cmEditor, letters).init();
                    this.handleActions(sourceLinkHints, cmEditor);
                    break;
                case VIEW_MODE.PREVIEW:
                    const previewViewEl = currentView.previewMode.containerEl.querySelector('div.markdown-preview-view');
                    const previewLinkHints = new PreviewLinkProcessor(previewViewEl, letters).init();
                    this.handleActions(previewLinkHints);
                    break;
                case VIEW_MODE.CM6:
                    const cm6Editor = currentView.editor.cm;
                    const livePreviewLinks = new CM6LinkProcessor(cm6Editor, letters).init();
                    this.markPlugin.setLinks(livePreviewLinks);
                    this.app.workspace.updateOptions();
                    this.handleActions(livePreviewLinks);
                    break;
            }
        };
        this.handleJumpToRegex = () => {
            const { app, settings: { letters, jumpToAnywhereRegex } } = this;
            const currentView = app.workspace.activeLeaf.view;
            const mode = this.getMode(currentView);
            switch (mode) {
                case VIEW_MODE.CM6:
                    const cm6Editor = currentView.editor.cm;
                    const livePreviewLinks = new CM6RegexProcessor(cm6Editor, letters, jumpToAnywhereRegex).init();
                    this.markPlugin.setLinks(livePreviewLinks);
                    this.app.workspace.updateOptions();
                    this.handleActions(livePreviewLinks, cm6Editor);
                    break;
                case VIEW_MODE.PREVIEW:
                    break;
                case VIEW_MODE.LEGACY:
                    const cmEditor = currentView.sourceMode.cmEditor;
                    const links = new LegacyRegexpProcessor(cmEditor, jumpToAnywhereRegex, letters).init();
                    this.handleActions(links, cmEditor);
                    break;
            }
        };
        this.handleActions = (linkHints, cmEditor) => {
            if (!linkHints.length) {
                return;
            }
            const linkHintMap = {};
            linkHints.forEach(x => linkHintMap[x.letter] = x);
            const handleHotkey = (newLeaf, link) => {
                if (link.type === 'internal') {
                    // not sure why the second argument in openLinkText is necessary.
                    this.app.workspace.openLinkText(decodeURI(link.linkText), '', newLeaf, { active: true });
                }
                else if (link.type === 'external') {
                    window.open(link.linkText);
                }
                else {
                    const editor = cmEditor;
                    if (editor instanceof view.EditorView) {
                        const index = link.index;
                        editor.dispatch({ selection: state.EditorSelection.cursor(index) });
                    }
                    else {
                        editor.setCursor(editor.posFromIndex(link.index));
                    }
                }
            };
            const removePopovers = () => {
                document.removeEventListener('click', removePopovers);
                document.querySelectorAll('.jl.popover').forEach(e => e.remove());
                document.querySelectorAll('#jl-modal').forEach(e => e.remove());
                this.prefixInfo = undefined;
                this.markPlugin.clean();
                this.app.workspace.updateOptions();
                this.isLinkHintActive = false;
            };
            const handleKeyDown = (event) => {
                var _a;
                if (event.key === 'Shift') {
                    return;
                }
                const eventKey = event.key.toUpperCase();
                const prefixes = new Set(Object.keys(linkHintMap).filter(x => x.length > 1).map(x => x[0]));
                let linkHint;
                if (this.prefixInfo) {
                    linkHint = linkHintMap[this.prefixInfo.prefix + eventKey];
                }
                else {
                    linkHint = linkHintMap[eventKey];
                    if (!linkHint && prefixes && prefixes.has(eventKey)) {
                        this.prefixInfo = { prefix: eventKey, shiftKey: event.shiftKey };
                        event.preventDefault();
                        event.stopPropagation();
                        event.stopImmediatePropagation();
                        return;
                    }
                }
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                const newLeaf = ((_a = this.prefixInfo) === null || _a === void 0 ? void 0 : _a.shiftKey) || event.shiftKey;
                linkHint && handleHotkey(newLeaf, linkHint);
                document.removeEventListener('keydown', handleKeyDown, { capture: true });
                removePopovers();
            };
            document.addEventListener('click', removePopovers);
            document.addEventListener('keydown', handleKeyDown, { capture: true });
            this.isLinkHintActive = true;
        };
    }
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = (yield this.loadData()) || new Settings();
            this.addSettingTab(new SettingTab(this.app, this));
            const markPlugin = this.markPlugin = new MarkPlugin([]);
            const markViewPlugin = this.markViewPlugin = view.ViewPlugin.fromClass(createViewPluginClass(markPlugin), {
                decorations: v => v.decorations
            });
            this.registerEditorExtension([markViewPlugin]);
            this.addCommand({
                id: 'activate-jump-to-link',
                name: 'Jump to Link',
                callback: this.action.bind(this, 'link'),
                hotkeys: [{ modifiers: ['Ctrl'], key: `'` }],
            });
            this.addCommand({
                id: "activate-jump-to-anywhere",
                name: "Jump to Anywhere Regex",
                callback: this.action.bind(this, 'regexp'),
                hotkeys: [{ modifiers: ["Ctrl"], key: ";" }],
            });
        });
    }
    onunload() {
        console.log('unloading jump to links plugin');
    }
    action(type) {
        if (this.isLinkHintActive) {
            return;
        }
        switch (type) {
            case "link":
                this.handleJumpToLink();
                return;
            case "regexp":
                this.handleJumpToRegex();
                return;
        }
    }
    getMode(currentView) {
        // @ts-ignore
        const isLegacy = this.app.vault.getConfig("legacyEditor");
        if (currentView.getState().mode === 'preview') {
            return VIEW_MODE.PREVIEW;
        }
        else if (!isLegacy) {
            return VIEW_MODE.CM6;
        }
        else if (currentView.getState().mode === 'source') {
            return VIEW_MODE.LEGACY;
        }
        return VIEW_MODE.LEGACY;
    }
}
class SettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        let { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Settings for Jump To Link.' });
        /* Modal mode deprecated */
        // new Setting(containerEl)
        //     .setName('Presentation')
        //     .setDesc('How to show links')
        //     .addDropdown(cb => { cb
        //         .addOptions({
        //             "popovers": 'Popovers',
        //             "modal": 'Modal'
        //         })
        //         .setValue(this.plugin.settings.mode)
        //         .onChange((value: LinkHintMode) => {
        //             this.plugin.settings.mode = value;
        //             this.plugin.saveData(this.plugin.settings);
        //         })
        //     });
        new obsidian.Setting(containerEl)
            .setName('Characters used for link hints')
            .setDesc('The characters placed next to each link after enter link-hint mode.')
            .addText(cb => {
            cb.setValue(this.plugin.settings.letters)
                .onChange((value) => {
                this.plugin.settings.letters = value;
                this.plugin.saveData(this.plugin.settings);
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Jump To Anywhere')
            .setDesc("Regex based navigating in editor mode")
            .addText((text) => text
            .setPlaceholder('Custom Regex')
            .setValue(this.plugin.settings.jumpToAnywhereRegex)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.jumpToAnywhereRegex = value;
            yield this.plugin.saveData(this.plugin.settings);
        })));
    }
}

module.exports = JumpToLink;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsInR5cGVzLnRzIiwic3JjL2NtNi13aWRnZXQvTWFya1dpZGdldC50cyIsInNyYy9jbTYtd2lkZ2V0L01hcmtQbHVnaW4udHMiLCJzcmMvdXRpbHMvY29tbW9uLnRzIiwic3JjL3Byb2Nlc3NvcnMvQ002TGlua1Byb2Nlc3Nvci50cyIsInNyYy91dGlscy9yZWdleHAudHMiLCJzcmMvcHJvY2Vzc29ycy9DTTZSZWdleFByb2Nlc3Nvci50cyIsInNyYy9wcm9jZXNzb3JzL0xlZ2FjeVJlZ2V4cFByb2Nlc3Nvci50cyIsInNyYy9wcm9jZXNzb3JzL0xlZ2FjeVNvdXJjZUxpbmtQcm9jZXNzb3IudHMiLCJzcmMvdXRpbHMvcHJldmlldy50cyIsInNyYy9wcm9jZXNzb3JzL1ByZXZpZXdMaW5rUHJvY2Vzc29yLnRzIiwic3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cclxuXHJcblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxyXG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXHJcblxyXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxyXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXHJcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxyXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxyXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXHJcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fY3JlYXRlQmluZGluZyA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XHJcbiAgICBpZiAoIWRlc2MgfHwgKFwiZ2V0XCIgaW4gZGVzYyA/ICFtLl9fZXNNb2R1bGUgOiBkZXNjLndyaXRhYmxlIHx8IGRlc2MuY29uZmlndXJhYmxlKSkge1xyXG4gICAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XHJcbiAgICB9XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIGRlc2MpO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIG8pIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgcCkpIF9fY3JlYXRlQmluZGluZyhvLCBtLCBwKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5cygpIHtcclxuICAgIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxyXG4gICAgICAgICAgICByW2tdID0gYVtqXTtcclxuICAgIHJldHVybiByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheSh0bywgZnJvbSwgcGFjaykge1xyXG4gICAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XHJcbiAgICAgICAgICAgIGlmICghYXIpIGFyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSwgMCwgaSk7XHJcbiAgICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20pKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xyXG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgc3RhdGUsIGtpbmQsIGYpIHtcclxuICAgIGlmIChraW5kID09PSBcImFcIiAmJiAhZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlByaXZhdGUgYWNjZXNzb3Igd2FzIGRlZmluZWQgd2l0aG91dCBhIGdldHRlclwiKTtcclxuICAgIGlmICh0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyICE9PSBzdGF0ZSB8fCAhZiA6ICFzdGF0ZS5oYXMocmVjZWl2ZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHJlYWQgcHJpdmF0ZSBtZW1iZXIgZnJvbSBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xyXG4gICAgcmV0dXJuIGtpbmQgPT09IFwibVwiID8gZiA6IGtpbmQgPT09IFwiYVwiID8gZi5jYWxsKHJlY2VpdmVyKSA6IGYgPyBmLnZhbHVlIDogc3RhdGUuZ2V0KHJlY2VpdmVyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRTZXQocmVjZWl2ZXIsIHN0YXRlLCB2YWx1ZSwga2luZCwgZikge1xyXG4gICAgaWYgKGtpbmQgPT09IFwibVwiKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBtZXRob2QgaXMgbm90IHdyaXRhYmxlXCIpO1xyXG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgc2V0dGVyXCIpO1xyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3Qgd3JpdGUgcHJpdmF0ZSBtZW1iZXIgdG8gYW4gb2JqZWN0IHdob3NlIGNsYXNzIGRpZCBub3QgZGVjbGFyZSBpdFwiKTtcclxuICAgIHJldHVybiAoa2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIsIHZhbHVlKSA6IGYgPyBmLnZhbHVlID0gdmFsdWUgOiBzdGF0ZS5zZXQocmVjZWl2ZXIsIHZhbHVlKSksIHZhbHVlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEluKHN0YXRlLCByZWNlaXZlcikge1xyXG4gICAgaWYgKHJlY2VpdmVyID09PSBudWxsIHx8ICh0eXBlb2YgcmVjZWl2ZXIgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHJlY2VpdmVyICE9PSBcImZ1bmN0aW9uXCIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHVzZSAnaW4nIG9wZXJhdG9yIG9uIG5vbi1vYmplY3RcIik7XHJcbiAgICByZXR1cm4gdHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciA9PT0gc3RhdGUgOiBzdGF0ZS5oYXMocmVjZWl2ZXIpO1xyXG59XHJcbiIsImV4cG9ydCB0eXBlIExpbmtIaW50VHlwZSA9ICdpbnRlcm5hbCcgfCAnZXh0ZXJuYWwnIHwgJ3JlZ2V4JztcblxuZXhwb3J0IGludGVyZmFjZSBMaW5rSGludEJhc2Uge1xuXHRsZXR0ZXI6IHN0cmluZztcblx0dHlwZTogTGlua0hpbnRUeXBlO1xuXHRsaW5rVGV4dDogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFByZXZpZXdMaW5rSGludCBleHRlbmRzIExpbmtIaW50QmFzZSB7XG5cdGxlZnQ6IG51bWJlcjtcblx0dG9wOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU291cmNlTGlua0hpbnQgZXh0ZW5kcyBMaW5rSGludEJhc2Uge1xuXHRpbmRleDogbnVtYmVyXG59XG5cbmV4cG9ydCBjbGFzcyBTZXR0aW5ncyB7XG5cdC8vIERlZmF1bHRzIGFzIGluIFZpbWl1bSBleHRlbnNpb24gZm9yIGJyb3dzZXJzXG5cdGxldHRlcnM6IHN0cmluZyA9ICdzYWRmamtsZXdjbXBnaCc7XG5cdGp1bXBUb0FueXdoZXJlUmVnZXg6IHN0cmluZyA9ICdcXFxcYlxcXFx3ezMsfVxcXFxiJztcbn1cblxuZXhwb3J0IGNsYXNzIFByb2Nlc3NvciB7XG5cdGxldHRlcnM6IHN0cmluZztcblxuXHRwdWJsaWMgaW5pdDogKCkgPT4gTGlua0hpbnRCYXNlW107XG59XG4iLCJpbXBvcnQge1dpZGdldFR5cGV9IGZyb20gXCJAY29kZW1pcnJvci92aWV3XCI7XG5cbmV4cG9ydCBjbGFzcyBNYXJrV2lkZ2V0IGV4dGVuZHMgV2lkZ2V0VHlwZSB7XG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgbWFyazogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgZXEob3RoZXI6IE1hcmtXaWRnZXQpIHtcbiAgICAgICAgcmV0dXJuIG90aGVyLm1hcmsgPT09IHRoaXMubWFyaztcbiAgICB9XG5cbiAgICB0b0RPTSgpIHtcbiAgICAgICAgY29uc3QgbWFyayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICBtYXJrLmlubmVyVGV4dCA9IHRoaXMubWFyaztcblxuICAgICAgICBjb25zdCB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgd3JhcHBlci5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmUtYmxvY2tcIjtcbiAgICAgICAgd3JhcHBlci5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgICAgd3JhcHBlci5jbGFzc0xpc3QuYWRkKCdqbCcpO1xuICAgICAgICB3cmFwcGVyLmNsYXNzTGlzdC5hZGQoJ3BvcG92ZXInKTtcbiAgICAgICAgd3JhcHBlci5hcHBlbmQobWFyayk7XG5cbiAgICAgICAgcmV0dXJuIHdyYXBwZXI7XG4gICAgfVxuXG4gICAgaWdub3JlRXZlbnQoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG4iLCJpbXBvcnQge1xuICAgIERlY29yYXRpb24sXG4gICAgRGVjb3JhdGlvblNldCxcbiAgICBFZGl0b3JWaWV3LFxuICAgIFZpZXdVcGRhdGUsXG59IGZyb20gXCJAY29kZW1pcnJvci92aWV3XCI7XG5pbXBvcnQgeyBNYXJrV2lkZ2V0IH0gZnJvbSBcIi4vTWFya1dpZGdldFwiO1xuaW1wb3J0IHtTb3VyY2VMaW5rSGludH0gZnJvbSBcIi4uLy4uL3R5cGVzXCI7XG5cbmV4cG9ydCBjbGFzcyBNYXJrUGx1Z2luIHtcbiAgICBsaW5rczogU291cmNlTGlua0hpbnRbXSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IobGlua3M6IFNvdXJjZUxpbmtIaW50W10pIHtcbiAgICAgICAgdGhpcy5saW5rcyA9IGxpbmtzO1xuICAgIH1cblxuICAgIHNldExpbmtzKGxpbmtzOiBTb3VyY2VMaW5rSGludFtdKSB7XG4gICAgICAgIHRoaXMubGlua3MgPSBsaW5rcztcbiAgICB9XG5cbiAgICBjbGVhbigpIHtcbiAgICAgICAgdGhpcy5saW5rcyA9IFtdO1xuICAgIH1cblxuICAgIGdldCB2aXNpYmxlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5saW5rcy5sZW5ndGggPiAwO1xuICAgIH1cblxuICAgIGNyZWF0ZU1hcmtzKCk6IERlY29yYXRpb25TZXQge1xuICAgICAgICBjb25zdCB3aWRnZXRzID0gdGhpcy5saW5rcy5tYXAoKHgpID0+XG4gICAgICAgICAgICBEZWNvcmF0aW9uLndpZGdldCh7XG4gICAgICAgICAgICAgICAgd2lkZ2V0OiBuZXcgTWFya1dpZGdldCh4LmxldHRlciksXG4gICAgICAgICAgICAgICAgc2lkZTogMSxcbiAgICAgICAgICAgIH0pLnJhbmdlKHguaW5kZXgpXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIERlY29yYXRpb24uc2V0KHdpZGdldHMpO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVZpZXdQbHVnaW5DbGFzcyhtYXJrUGx1Z2luOiBNYXJrUGx1Z2luKSB7XG4gICAgcmV0dXJuIGNsYXNzIHtcbiAgICAgICAgZGVjb3JhdGlvbnM6IERlY29yYXRpb25TZXQ7XG5cbiAgICAgICAgY29uc3RydWN0b3IoX3ZpZXc6IEVkaXRvclZpZXcpIHtcbiAgICAgICAgICAgIHRoaXMuZGVjb3JhdGlvbnMgPSBtYXJrUGx1Z2luLmNyZWF0ZU1hcmtzKCk7XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGUoX3VwZGF0ZTogVmlld1VwZGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5kZWNvcmF0aW9ucyA9IG1hcmtQbHVnaW4uY3JlYXRlTWFya3MoKTtcbiAgICAgICAgfVxuICAgIH07XG59XG4iLCJpbXBvcnQge0VkaXRvcn0gZnJvbSBcImNvZGVtaXJyb3JcIjtcbmltcG9ydCB7U291cmNlTGlua0hpbnR9IGZyb20gXCIuLi8uLi90eXBlc1wiO1xuXG4vKipcbiAqIEdldCBvbmx5IHZpc2libGUgY29udGVudFxuICogQHBhcmFtIGNtRWRpdG9yXG4gKiBAcmV0dXJucyBMZXR0ZXIgb2Zmc2V0IGFuZCB2aXNpYmxlIGNvbnRlbnQgYXMgYSBzdHJpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFZpc2libGVMaW5lVGV4dChjbUVkaXRvcjogRWRpdG9yKTogeyBpbmRPZmZzZXQ6IG51bWJlciwgc3Ryczogc3RyaW5nIH0ge1xuICAgIGNvbnN0IHNjcm9sbEluZm8gPSBjbUVkaXRvci5nZXRTY3JvbGxJbmZvKCk7XG4gICAgY29uc3QgeyBsaW5lOiBmcm9tIH0gPSBjbUVkaXRvci5jb29yZHNDaGFyKHsgbGVmdDogMCwgdG9wOiAwIH0sICdwYWdlJyk7XG4gICAgY29uc3QgeyBsaW5lOiB0byB9ID0gY21FZGl0b3IuY29vcmRzQ2hhcih7IGxlZnQ6IHNjcm9sbEluZm8ubGVmdCwgdG9wOiBzY3JvbGxJbmZvLnRvcCArIHNjcm9sbEluZm8uaGVpZ2h0fSlcbiAgICBjb25zdCBpbmRPZmZzZXQgPSBjbUVkaXRvci5pbmRleEZyb21Qb3Moe2NoOjAsIGxpbmU6IGZyb219KVxuICAgIGNvbnN0IHN0cnMgPSBjbUVkaXRvci5nZXRSYW5nZSh7Y2g6IDAsIGxpbmU6IGZyb219LCB7Y2g6IDAsIGxpbmU6IHRvICsgMX0pXG5cbiAgICByZXR1cm4geyBpbmRPZmZzZXQsIHN0cnMgfTtcbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIGFscGhhYmV0IC0gTGV0dGVycyB3aGljaCB1c2VkIHRvIHByb2R1Y2UgaGludHNcbiAqIEBwYXJhbSBudW1MaW5rSGludHMgLSBDb3VudCBvZiBuZWVkZWQgbGlua3NcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldExpbmtIaW50TGV0dGVycyhhbHBoYWJldDogc3RyaW5nLCBudW1MaW5rSGludHM6IG51bWJlcik6IHN0cmluZ1tdIHtcbiAgICBjb25zdCBhbHBoYWJldFVwcGVyY2FzZSA9IGFscGhhYmV0LnRvVXBwZXJDYXNlKClcblxuICAgIGxldCBwcmVmaXhDb3VudCA9IE1hdGguY2VpbCgobnVtTGlua0hpbnRzIC0gYWxwaGFiZXRVcHBlcmNhc2UubGVuZ3RoKSAvIChhbHBoYWJldFVwcGVyY2FzZS5sZW5ndGggLSAxKSlcblxuICAgIC8vIGVuc3VyZSAwIDw9IHByZWZpeENvdW50IDw9IGFscGhhYmV0Lmxlbmd0aFxuICAgIHByZWZpeENvdW50ID0gTWF0aC5tYXgocHJlZml4Q291bnQsIDApO1xuICAgIHByZWZpeENvdW50ID0gTWF0aC5taW4ocHJlZml4Q291bnQsIGFscGhhYmV0VXBwZXJjYXNlLmxlbmd0aCk7XG5cbiAgICBjb25zdCBwcmVmaXhlcyA9IFsnJywgLi4uQXJyYXkuZnJvbShhbHBoYWJldFVwcGVyY2FzZS5zbGljZSgwLCBwcmVmaXhDb3VudCkpXTtcblxuICAgIGNvbnN0IGxpbmtIaW50TGV0dGVycyA9IFtdXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcmVmaXhlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBwcmVmaXggPSBwcmVmaXhlc1tpXVxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGFscGhhYmV0VXBwZXJjYXNlLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBpZiAobGlua0hpbnRMZXR0ZXJzLmxlbmd0aCA8IG51bUxpbmtIaW50cykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxldHRlciA9IGFscGhhYmV0VXBwZXJjYXNlW2pdO1xuICAgICAgICAgICAgICAgIGlmIChwcmVmaXggPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcHJlZml4ZXMuY29udGFpbnMobGV0dGVyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGlua0hpbnRMZXR0ZXJzLnB1c2gobGV0dGVyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxpbmtIaW50TGV0dGVycy5wdXNoKHByZWZpeCArIGxldHRlcilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGxpbmtIaW50TGV0dGVycztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE1ESGludExpbmtzKGNvbnRlbnQ6IHN0cmluZywgb2Zmc2V0OiBudW1iZXIsIGxldHRlcnM6IHN0cmluZyk6IFNvdXJjZUxpbmtIaW50W10ge1xuICAgIC8vIGV4cGVjdGluZyBlaXRoZXIgW1tMaW5rXV0gb3IgW1tMaW5rfFRpdGxlXV1cbiAgICBjb25zdCByZWdFeEludGVybmFsID0gL1xcW1xcWyguKz8pKFxcfC4rPyk/XV0vZztcbiAgICAvLyBleHBlY3RpbmcgW1RpdGxlXSguLi9leGFtcGxlLm1kKVxuICAgIGNvbnN0IHJlZ0V4TWRJbnRlcm5hbCA9IC9cXFsuKz9dXFwoKChcXC5cXC58XFx3fFxcZCkuKz8pXFwpL2c7XG4gICAgLy8gZXhwZWN0aW5nIFtUaXRsZV0oZmlsZTovL2xpbmspIG9yIFtUaXRsZV0oaHR0cHM6Ly9saW5rKVxuICAgIGNvbnN0IHJlZ0V4RXh0ZXJuYWwgPSAvXFxbLis/XVxcKCgoaHR0cHM/OnxmaWxlOikuKz8pXFwpL2c7XG4gICAgLy8gZXhwZWN0aW5nIGh0dHA6Ly9ob2dlaG9nZSBvciBodHRwczovL2hvZ2Vob2dlXG4gICAgY29uc3QgcmVnRXhVcmwgPSAvKCB8XFxufF4pKGh0dHBzPzpcXC9cXC9bXiBcXG5dKykvZztcblxuICAgIGxldCBsaW5rc1dpdGhJbmRleDogeyBpbmRleDogbnVtYmVyLCB0eXBlOiAnaW50ZXJuYWwnIHwgJ2V4dGVybmFsJywgbGlua1RleHQ6IHN0cmluZyB9W10gPSBbXTtcbiAgICBsZXQgcmVnRXhSZXN1bHQ7XG5cbiAgICB3aGlsZShyZWdFeFJlc3VsdCA9IHJlZ0V4SW50ZXJuYWwuZXhlYyhjb250ZW50KSkge1xuICAgICAgICBjb25zdCBsaW5rVGV4dCA9IHJlZ0V4UmVzdWx0WzFdO1xuICAgICAgICBsaW5rc1dpdGhJbmRleC5wdXNoKHsgaW5kZXg6IHJlZ0V4UmVzdWx0LmluZGV4ICsgb2Zmc2V0LCB0eXBlOiAnaW50ZXJuYWwnLCBsaW5rVGV4dCB9KTtcbiAgICB9XG5cbiAgICB3aGlsZShyZWdFeFJlc3VsdCA9IHJlZ0V4TWRJbnRlcm5hbC5leGVjKGNvbnRlbnQpKSB7XG4gICAgICAgIGNvbnN0IGxpbmtUZXh0ID0gcmVnRXhSZXN1bHRbMV07XG4gICAgICAgIGxpbmtzV2l0aEluZGV4LnB1c2goeyBpbmRleDogcmVnRXhSZXN1bHQuaW5kZXggKyBvZmZzZXQsIHR5cGU6ICdpbnRlcm5hbCcsIGxpbmtUZXh0IH0pO1xuICAgIH1cblxuICAgIHdoaWxlKHJlZ0V4UmVzdWx0ID0gcmVnRXhFeHRlcm5hbC5leGVjKGNvbnRlbnQpKSB7XG4gICAgICAgIGNvbnN0IGxpbmtUZXh0ID0gcmVnRXhSZXN1bHRbMV07XG4gICAgICAgIGxpbmtzV2l0aEluZGV4LnB1c2goeyBpbmRleDogcmVnRXhSZXN1bHQuaW5kZXggKyBvZmZzZXQsIHR5cGU6ICdleHRlcm5hbCcsIGxpbmtUZXh0IH0pXG4gICAgfVxuXG4gICAgd2hpbGUocmVnRXhSZXN1bHQgPSByZWdFeFVybC5leGVjKGNvbnRlbnQpKSB7XG4gICAgICAgIGNvbnN0IGxpbmtUZXh0ID0gcmVnRXhSZXN1bHRbMl07XG4gICAgICAgIGxpbmtzV2l0aEluZGV4LnB1c2goeyBpbmRleDogcmVnRXhSZXN1bHQuaW5kZXggKyBvZmZzZXQgKyAxLCB0eXBlOiAnZXh0ZXJuYWwnLCBsaW5rVGV4dCB9KVxuICAgIH1cblxuICAgIGNvbnN0IGxpbmtIaW50TGV0dGVycyA9IGdldExpbmtIaW50TGV0dGVycyhsZXR0ZXJzLCBsaW5rc1dpdGhJbmRleC5sZW5ndGgpO1xuXG4gICAgY29uc3QgbGlua3NXaXRoTGV0dGVyOiBTb3VyY2VMaW5rSGludFtdID0gW107XG4gICAgbGlua3NXaXRoSW5kZXhcbiAgICAgICAgLnNvcnQoKHgseSkgPT4geC5pbmRleCAtIHkuaW5kZXgpXG4gICAgICAgIC5mb3JFYWNoKChsaW5rSGludCwgaSkgPT4ge1xuICAgICAgICAgICAgbGlua3NXaXRoTGV0dGVyLnB1c2goeyBsZXR0ZXI6IGxpbmtIaW50TGV0dGVyc1tpXSwgLi4ubGlua0hpbnR9KTtcbiAgICAgICAgfSk7XG5cbiAgICByZXR1cm4gbGlua3NXaXRoTGV0dGVyLmZpbHRlcihsaW5rID0+IGxpbmsubGV0dGVyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVdpZGdldEVsZW1lbnQoY29udGVudDogc3RyaW5nKSB7XG4gICAgY29uc3QgbGlua0hpbnRFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGxpbmtIaW50RWwuY2xhc3NMaXN0LmFkZCgnamwnKTtcbiAgICBsaW5rSGludEVsLmNsYXNzTGlzdC5hZGQoJ3BvcG92ZXInKTtcbiAgICBsaW5rSGludEVsLmlubmVySFRNTCA9IGNvbnRlbnQ7XG4gICAgcmV0dXJuIGxpbmtIaW50RWw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkaXNwbGF5U291cmNlUG9wb3ZlcnMoY21FZGl0b3I6IEVkaXRvciwgbGlua0tleU1hcDogU291cmNlTGlua0hpbnRbXSk6IHZvaWQge1xuICAgIGNvbnN0IGRyYXdXaWRnZXQgPSAoY21FZGl0b3I6IEVkaXRvciwgbGlua0hpbnQ6IFNvdXJjZUxpbmtIaW50KSA9PiB7XG4gICAgICAgIGNvbnN0IHBvcyA9IGNtRWRpdG9yLnBvc0Zyb21JbmRleChsaW5rSGludC5pbmRleCk7XG4gICAgICAgIC8vIHRoZSBmb3VydGggcGFyYW1ldGVyIGlzIHVuZG9jdW1lbnRlZC4gaXQgc3BlY2lmaWVzIHdoZXJlIHRoZSB3aWRnZXQgc2hvdWxkIGJlIHBsYWNlXG4gICAgICAgIHJldHVybiAoY21FZGl0b3IgYXMgYW55KS5hZGRXaWRnZXQocG9zLCBjcmVhdGVXaWRnZXRFbGVtZW50KGxpbmtIaW50LmxldHRlciksIGZhbHNlLCAnb3ZlcicpO1xuICAgIH1cblxuICAgIGxpbmtLZXlNYXAuZm9yRWFjaCh4ID0+IGRyYXdXaWRnZXQoY21FZGl0b3IsIHgpKTtcbn1cblxuIiwiaW1wb3J0IHtQcm9jZXNzb3IsIFNvdXJjZUxpbmtIaW50fSBmcm9tIFwiLi4vLi4vdHlwZXNcIjtcbmltcG9ydCB7RWRpdG9yVmlld30gZnJvbSBcIkBjb2RlbWlycm9yL3ZpZXdcIjtcbmltcG9ydCB7Z2V0TURIaW50TGlua3N9IGZyb20gXCIuLi91dGlscy9jb21tb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ002TGlua1Byb2Nlc3NvciBpbXBsZW1lbnRzIFByb2Nlc3NvciB7XG4gICAgY21FZGl0b3I6IEVkaXRvclZpZXc7XG4gICAgbGV0dGVyczogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoZWRpdG9yOiBFZGl0b3JWaWV3LCBhbHBoYWJldDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuY21FZGl0b3IgPSBlZGl0b3I7XG4gICAgICAgIHRoaXMubGV0dGVycyA9IGFscGhhYmV0O1xuICAgIH1cblxuICAgIHB1YmxpYyBpbml0KCk6IFNvdXJjZUxpbmtIaW50W10ge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRTb3VyY2VMaW5rSGludHMoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0VmlzaWJsZUxpbmVzKCkge1xuICAgICAgICBjb25zdCB7IGNtRWRpdG9yIH0gPSB0aGlzO1xuXG4gICAgICAgIGNvbnN0IHsgZnJvbSwgdG8gfSA9IGNtRWRpdG9yLnZpZXdwb3J0O1xuICAgICAgICBjb25zdCBjb250ZW50ID0gY21FZGl0b3Iuc3RhdGUuc2xpY2VEb2MoZnJvbSwgdG8pO1xuXG4gICAgICAgIHJldHVybiB7IGluZGV4OiBmcm9tLCBjb250ZW50IH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRTb3VyY2VMaW5rSGludHMgPSAoKTogU291cmNlTGlua0hpbnRbXSA9PiB7XG4gICAgICAgIGNvbnN0IHsgbGV0dGVycyB9ID0gdGhpcztcbiAgICAgICAgY29uc3QgeyBpbmRleCwgY29udGVudCB9ID0gdGhpcy5nZXRWaXNpYmxlTGluZXMoKTtcblxuICAgICAgICByZXR1cm4gZ2V0TURIaW50TGlua3MoY29udGVudCwgaW5kZXgsIGxldHRlcnMpO1xuICAgIH1cbn0iLCJpbXBvcnQge2dldExpbmtIaW50TGV0dGVyc30gZnJvbSBcIi4vY29tbW9uXCI7XG5pbXBvcnQge1NvdXJjZUxpbmtIaW50fSBmcm9tIFwiLi4vLi4vdHlwZXNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RSZWdleHBCbG9ja3MoY29udGVudDogc3RyaW5nLCBvZmZzZXQ6IG51bWJlciwgcmVnZXhwOiBzdHJpbmcsIGxldHRlcnM6IHN0cmluZykge1xuICAgIGNvbnN0IHJlZ0V4VXJsID0gbmV3IFJlZ0V4cChyZWdleHAsICdnJyk7XG5cbiAgICBsZXQgbGlua3NXaXRoSW5kZXg6IHtcbiAgICAgICAgaW5kZXg6IG51bWJlcjtcbiAgICAgICAgdHlwZTogXCJyZWdleFwiO1xuICAgICAgICBsaW5rVGV4dDogc3RyaW5nO1xuICAgIH1bXSA9IFtdO1xuXG4gICAgbGV0IHJlZ0V4UmVzdWx0O1xuXG4gICAgd2hpbGUgKChyZWdFeFJlc3VsdCA9IHJlZ0V4VXJsLmV4ZWMoY29udGVudCkpKSB7XG4gICAgICAgIGNvbnN0IGxpbmtUZXh0ID0gcmVnRXhSZXN1bHRbMV07XG4gICAgICAgIGxpbmtzV2l0aEluZGV4LnB1c2goe1xuICAgICAgICAgICAgaW5kZXg6IHJlZ0V4UmVzdWx0LmluZGV4ICsgb2Zmc2V0LFxuICAgICAgICAgICAgdHlwZTogXCJyZWdleFwiLFxuICAgICAgICAgICAgbGlua1RleHQsXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGxpbmtIaW50TGV0dGVycyA9IGdldExpbmtIaW50TGV0dGVycyhsZXR0ZXJzLCBsaW5rc1dpdGhJbmRleC5sZW5ndGgpO1xuXG4gICAgY29uc3QgbGlua3NXaXRoTGV0dGVyOiBTb3VyY2VMaW5rSGludFtdID0gW107XG4gICAgbGlua3NXaXRoSW5kZXhcbiAgICAgICAgLnNvcnQoKHgsIHkpID0+IHguaW5kZXggLSB5LmluZGV4KVxuICAgICAgICAuZm9yRWFjaCgobGlua0hpbnQsIGkpID0+IHtcbiAgICAgICAgICAgIGxpbmtzV2l0aExldHRlci5wdXNoKHtcbiAgICAgICAgICAgICAgICBsZXR0ZXI6IGxpbmtIaW50TGV0dGVyc1tpXSxcbiAgICAgICAgICAgICAgICAuLi5saW5rSGludCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgIHJldHVybiBsaW5rc1dpdGhMZXR0ZXIuZmlsdGVyKGxpbmsgPT4gbGluay5sZXR0ZXIpO1xufVxuIiwiaW1wb3J0IENNNkxpbmtQcm9jZXNzb3IgZnJvbSBcIi4vQ002TGlua1Byb2Nlc3NvclwiO1xuaW1wb3J0IHtQcm9jZXNzb3J9IGZyb20gXCIuLi8uLi90eXBlc1wiO1xuaW1wb3J0IHtFZGl0b3JWaWV3fSBmcm9tIFwiQGNvZGVtaXJyb3Ivdmlld1wiO1xuaW1wb3J0IHtleHRyYWN0UmVnZXhwQmxvY2tzfSBmcm9tIFwiLi4vdXRpbHMvcmVnZXhwXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENNNlJlZ2V4UHJvY2Vzc29yIGV4dGVuZHMgQ002TGlua1Byb2Nlc3NvciBpbXBsZW1lbnRzIFByb2Nlc3NvciB7XG4gICAgcmVnZXhwOiBzdHJpbmc7XG4gICAgY29uc3RydWN0b3IoZWRpdG9yOiBFZGl0b3JWaWV3LCBhbHBoYWJldDogc3RyaW5nLCByZWdleHA6IHN0cmluZykge1xuICAgICAgICBzdXBlcihlZGl0b3IsIGFscGhhYmV0KTtcbiAgICAgICAgdGhpcy5yZWdleHAgPSByZWdleHA7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgY29uc3QgeyBsZXR0ZXJzLCByZWdleHAgfSA9IHRoaXM7XG4gICAgICAgIGNvbnN0IHsgaW5kZXgsIGNvbnRlbnQgfSA9IHRoaXMuZ2V0VmlzaWJsZUxpbmVzKCk7XG4gICAgICAgIHJldHVybiBleHRyYWN0UmVnZXhwQmxvY2tzKGNvbnRlbnQsIGluZGV4LCByZWdleHAsIGxldHRlcnMpO1xuICAgIH1cbn0iLCJpbXBvcnQge0VkaXRvcn0gZnJvbSBcImNvZGVtaXJyb3JcIjtcbmltcG9ydCB7UHJvY2Vzc29yLCBTb3VyY2VMaW5rSGludH0gZnJvbSBcIi4uLy4uL3R5cGVzXCI7XG5pbXBvcnQge2Rpc3BsYXlTb3VyY2VQb3BvdmVycywgZ2V0VmlzaWJsZUxpbmVUZXh0fSBmcm9tIFwiLi4vdXRpbHMvY29tbW9uXCI7XG5pbXBvcnQge2V4dHJhY3RSZWdleHBCbG9ja3N9IGZyb20gXCIuLi91dGlscy9yZWdleHBcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGVnYWN5UmVnZXhwUHJvY2Vzc29yIGltcGxlbWVudHMgUHJvY2Vzc29yIHtcbiAgICBjbUVkaXRvcjogRWRpdG9yO1xuICAgIHJlZ2V4cDogc3RyaW5nO1xuICAgIGxldHRlcnM6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKGNtRWRpdG9yOiBFZGl0b3IsIHJlZ2V4cDogc3RyaW5nLCBhbHBoYWJldDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuY21FZGl0b3IgPSBjbUVkaXRvcjtcbiAgICAgICAgdGhpcy5yZWdleHAgPSByZWdleHA7XG4gICAgICAgIHRoaXMubGV0dGVycyA9IGFscGhhYmV0O1xuICAgIH1cblxuICAgIHB1YmxpYyBpbml0KCk6IFNvdXJjZUxpbmtIaW50W10ge1xuICAgICAgICBjb25zdCBbY29udGVudCwgb2Zmc2V0XSA9IHRoaXMuZ2V0VmlzaWJsZUNvbnRlbnQoKTtcbiAgICAgICAgY29uc3QgbGlua3MgPSB0aGlzLmdldExpbmtzKGNvbnRlbnQsIG9mZnNldCk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5KGxpbmtzKTtcbiAgICAgICAgcmV0dXJuIGxpbmtzO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0VmlzaWJsZUNvbnRlbnQoKTogW3N0cmluZywgbnVtYmVyXSB7XG4gICAgICAgIGNvbnN0IHsgY21FZGl0b3IgfSA9IHRoaXM7XG4gICAgICAgIGNvbnN0IHsgaW5kT2Zmc2V0LCBzdHJzIH0gPSBnZXRWaXNpYmxlTGluZVRleHQoY21FZGl0b3IpO1xuXG4gICAgICAgIHJldHVybiBbc3RycywgaW5kT2Zmc2V0XTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldExpbmtzKGNvbnRlbnQ6IHN0cmluZywgb2Zmc2V0OiBudW1iZXIpOiBTb3VyY2VMaW5rSGludFtdIHtcbiAgICAgICAgY29uc3QgeyByZWdleHAsIGxldHRlcnMgfSA9IHRoaXNcbiAgICAgICAgcmV0dXJuIGV4dHJhY3RSZWdleHBCbG9ja3MoY29udGVudCwgb2Zmc2V0LCByZWdleHAsIGxldHRlcnMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZGlzcGxheShsaW5rczogU291cmNlTGlua0hpbnRbXSk6IHZvaWQge1xuICAgICAgICBjb25zdCB7IGNtRWRpdG9yIH0gPSB0aGlzXG4gICAgICAgIGRpc3BsYXlTb3VyY2VQb3BvdmVycyhjbUVkaXRvciwgbGlua3MpO1xuICAgIH1cbn0iLCJpbXBvcnQge1Byb2Nlc3NvciwgU291cmNlTGlua0hpbnR9IGZyb20gXCIuLi8uLi90eXBlc1wiO1xuaW1wb3J0IHtFZGl0b3J9IGZyb20gXCJjb2RlbWlycm9yXCI7XG5pbXBvcnQge2Rpc3BsYXlTb3VyY2VQb3BvdmVycywgZ2V0TURIaW50TGlua3MsIGdldFZpc2libGVMaW5lVGV4dH0gZnJvbSBcIi4uL3V0aWxzL2NvbW1vblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMZWdhY3lTb3VyY2VMaW5rUHJvY2Vzc29yIGltcGxlbWVudHMgUHJvY2Vzc29yIHtcbiAgICBjbUVkaXRvcjogRWRpdG9yO1xuICAgIGxldHRlcnM6IHN0cmluZztcblxuICAgIGNvbnN0cnVjdG9yKGVkaXRvcjogRWRpdG9yLCBhbHBoYWJldDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuY21FZGl0b3IgPSBlZGl0b3I7XG4gICAgICAgIHRoaXMubGV0dGVycyA9IGFscGhhYmV0O1xuICAgIH1cblxuICAgIHB1YmxpYyBpbml0KCkge1xuICAgICAgICBjb25zdCB7IGNtRWRpdG9yIH0gPSB0aGlzO1xuXG4gICAgICAgIGNvbnN0IGxpbmtIaW50cyA9IHRoaXMuZ2V0U291cmNlTGlua0hpbnRzKGNtRWRpdG9yKTtcbiAgICAgICAgZGlzcGxheVNvdXJjZVBvcG92ZXJzKGNtRWRpdG9yLCBsaW5rSGludHMpO1xuXG4gICAgICAgIHJldHVybiBsaW5rSGludHM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRTb3VyY2VMaW5rSGludHMgPSAoY21FZGl0b3I6IEVkaXRvcik6IFNvdXJjZUxpbmtIaW50W10gPT4ge1xuICAgICAgICBjb25zdCB7IGxldHRlcnMgfSA9IHRoaXM7XG4gICAgICAgIGNvbnN0IHsgaW5kT2Zmc2V0LCBzdHJzIH0gPSBnZXRWaXNpYmxlTGluZVRleHQoY21FZGl0b3IpO1xuXG4gICAgICAgIHJldHVybiBnZXRNREhpbnRMaW5rcyhzdHJzLCBpbmRPZmZzZXQsIGxldHRlcnMpO1xuICAgIH1cbn0iLCJpbXBvcnQge0xpbmtIaW50VHlwZSwgUHJldmlld0xpbmtIaW50fSBmcm9tIFwiLi4vLi4vdHlwZXNcIjtcbmltcG9ydCB7Z2V0TGlua0hpbnRMZXR0ZXJzfSBmcm9tIFwiLi9jb21tb25cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFByZXZpZXdMaW5rSGludHMocHJldmlld1ZpZXdFbDogSFRNTEVsZW1lbnQsIGxldHRlcnM6IHN0cmluZyApOiBQcmV2aWV3TGlua0hpbnRbXSB7XG4gICAgY29uc3QgYW5jaG9yRWxzID0gcHJldmlld1ZpZXdFbC5xdWVyeVNlbGVjdG9yQWxsKCdhJyk7XG4gICAgY29uc3QgZW1iZWRFbHMgPSBwcmV2aWV3Vmlld0VsLnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbnRlcm5hbC1lbWJlZCcpO1xuXG4gICAgY29uc3QgbGlua0hpbnRzOiBQcmV2aWV3TGlua0hpbnRbXSA9IFtdO1xuICAgIGFuY2hvckVscy5mb3JFYWNoKChhbmNob3JFbCwgX2kpID0+IHtcbiAgICAgICAgaWYgKGNoZWNrSXNQcmV2aWV3RWxPblNjcmVlbihwcmV2aWV3Vmlld0VsLCBhbmNob3JFbCkpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbGlua1R5cGU6IExpbmtIaW50VHlwZSA9IGFuY2hvckVsLmNsYXNzTGlzdC5jb250YWlucygnaW50ZXJuYWwtbGluaycpXG4gICAgICAgICAgICA/ICdpbnRlcm5hbCdcbiAgICAgICAgICAgIDogJ2V4dGVybmFsJztcblxuICAgICAgICBjb25zdCBsaW5rVGV4dCA9IGxpbmtUeXBlID09PSAnaW50ZXJuYWwnXG4gICAgICAgICAgICA/IGFuY2hvckVsLmRhdGFzZXRbJ2hyZWYnXVxuICAgICAgICAgICAgOiBhbmNob3JFbC5ocmVmO1xuXG4gICAgICAgIGxldCBvZmZzZXRQYXJlbnQgPSBhbmNob3JFbC5vZmZzZXRQYXJlbnQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIGxldCB0b3AgPSBhbmNob3JFbC5vZmZzZXRUb3A7XG4gICAgICAgIGxldCBsZWZ0ID0gYW5jaG9yRWwub2Zmc2V0TGVmdDtcblxuICAgICAgICB3aGlsZSAob2Zmc2V0UGFyZW50KSB7XG4gICAgICAgICAgICBpZiAob2Zmc2V0UGFyZW50ID09IHByZXZpZXdWaWV3RWwpIHtcbiAgICAgICAgICAgICAgICBvZmZzZXRQYXJlbnQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRvcCArPSBvZmZzZXRQYXJlbnQub2Zmc2V0VG9wO1xuICAgICAgICAgICAgICAgIGxlZnQgKz0gb2Zmc2V0UGFyZW50Lm9mZnNldExlZnQ7XG4gICAgICAgICAgICAgICAgb2Zmc2V0UGFyZW50ID0gb2Zmc2V0UGFyZW50Lm9mZnNldFBhcmVudCBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxpbmtIaW50cy5wdXNoKHtcbiAgICAgICAgICAgIGxldHRlcjogJycsXG4gICAgICAgICAgICBsaW5rVGV4dDogbGlua1RleHQsXG4gICAgICAgICAgICB0eXBlOiBsaW5rVHlwZSxcbiAgICAgICAgICAgIHRvcDogdG9wLFxuICAgICAgICAgICAgbGVmdDogbGVmdCxcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBlbWJlZEVscy5mb3JFYWNoKChlbWJlZEVsLCBfaSkgPT4ge1xuICAgICAgICBjb25zdCBsaW5rVGV4dCA9IGVtYmVkRWwuZ2V0QXR0cmlidXRlKCdzcmMnKTtcbiAgICAgICAgY29uc3QgbGlua0VsID0gZW1iZWRFbC5xdWVyeVNlbGVjdG9yKCcubWFya2Rvd24tZW1iZWQtbGluaycpIGFzIEhUTUxFbGVtZW50O1xuXG4gICAgICAgIGlmIChsaW5rVGV4dCAmJiBsaW5rRWwpIHtcbiAgICAgICAgICAgIGlmIChjaGVja0lzUHJldmlld0VsT25TY3JlZW4ocHJldmlld1ZpZXdFbCwgbGlua0VsKSkge1xuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgb2Zmc2V0UGFyZW50ID0gbGlua0VsLm9mZnNldFBhcmVudCBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICAgIGxldCB0b3AgPSBsaW5rRWwub2Zmc2V0VG9wO1xuICAgICAgICAgICAgbGV0IGxlZnQgPSBsaW5rRWwub2Zmc2V0TGVmdDtcblxuICAgICAgICAgICAgd2hpbGUgKG9mZnNldFBhcmVudCkge1xuICAgICAgICAgICAgICAgIGlmIChvZmZzZXRQYXJlbnQgPT0gcHJldmlld1ZpZXdFbCkge1xuICAgICAgICAgICAgICAgICAgICBvZmZzZXRQYXJlbnQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdG9wICs9IG9mZnNldFBhcmVudC5vZmZzZXRUb3A7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQgKz0gb2Zmc2V0UGFyZW50Lm9mZnNldExlZnQ7XG4gICAgICAgICAgICAgICAgICAgIG9mZnNldFBhcmVudCA9IG9mZnNldFBhcmVudC5vZmZzZXRQYXJlbnQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsaW5rSGludHMucHVzaCh7XG4gICAgICAgICAgICAgICAgbGV0dGVyOiAnJyxcbiAgICAgICAgICAgICAgICBsaW5rVGV4dDogbGlua1RleHQsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2ludGVybmFsJyxcbiAgICAgICAgICAgICAgICB0b3A6IHRvcCxcbiAgICAgICAgICAgICAgICBsZWZ0OiBsZWZ0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IHNvcnRlZExpbmtIaW50cyA9IGxpbmtIaW50cy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGlmIChhLnRvcCA+IGIudG9wKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfSBlbHNlIGlmIChhLnRvcCA9PT0gYi50b3ApIHtcbiAgICAgICAgICAgIGlmIChhLmxlZnQgPiBiLmxlZnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYS5sZWZ0ID09PSBiLmxlZnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBsaW5rSGludExldHRlcnMgPSBnZXRMaW5rSGludExldHRlcnMobGV0dGVycywgc29ydGVkTGlua0hpbnRzLmxlbmd0aCk7XG5cbiAgICBzb3J0ZWRMaW5rSGludHMuZm9yRWFjaCgobGlua0hpbnQsIGkpID0+IHtcbiAgICAgICAgbGlua0hpbnQubGV0dGVyID0gbGlua0hpbnRMZXR0ZXJzW2ldO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHNvcnRlZExpbmtIaW50cztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrSXNQcmV2aWV3RWxPblNjcmVlbihwYXJlbnQ6IEhUTUxFbGVtZW50LCBlbDogSFRNTEVsZW1lbnQpIHtcbiAgICByZXR1cm4gZWwub2Zmc2V0VG9wIDwgcGFyZW50LnNjcm9sbFRvcCB8fCBlbC5vZmZzZXRUb3AgPiBwYXJlbnQuc2Nyb2xsVG9wICsgcGFyZW50Lm9mZnNldEhlaWdodFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGlzcGxheVByZXZpZXdQb3BvdmVycyhtYXJrZG93blByZXZpZXdWaWV3RWw6IEhUTUxFbGVtZW50LCBsaW5rSGludHM6IFByZXZpZXdMaW5rSGludFtdKTogdm9pZCB7XG4gICAgZm9yIChsZXQgbGlua0hpbnQgb2YgbGlua0hpbnRzKSB7XG4gICAgICAgIGNvbnN0IGxpbmtIaW50RWwgPSBtYXJrZG93blByZXZpZXdWaWV3RWwuY3JlYXRlRWwoJ2RpdicpO1xuICAgICAgICBsaW5rSGludEVsLnN0eWxlLnRvcCA9IGxpbmtIaW50LnRvcCArICdweCc7XG4gICAgICAgIGxpbmtIaW50RWwuc3R5bGUubGVmdCA9IGxpbmtIaW50LmxlZnQgKyAncHgnO1xuXG4gICAgICAgIGxpbmtIaW50RWwudGV4dENvbnRlbnQgPSBsaW5rSGludC5sZXR0ZXI7XG4gICAgICAgIGxpbmtIaW50RWwuY2xhc3NMaXN0LmFkZCgnamwnKTtcbiAgICAgICAgbGlua0hpbnRFbC5jbGFzc0xpc3QuYWRkKCdwb3BvdmVyJyk7XG4gICAgfVxufVxuXG4iLCJpbXBvcnQge1ByZXZpZXdMaW5rSGludH0gZnJvbSBcIi4uLy4uL3R5cGVzXCI7XG5pbXBvcnQge2Rpc3BsYXlQcmV2aWV3UG9wb3ZlcnMsIGdldFByZXZpZXdMaW5rSGludHN9IGZyb20gXCIuLi91dGlscy9wcmV2aWV3XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByZXZpZXdMaW5rUHJvY2Vzc29yIHtcbiAgICB2aWV3OiBIVE1MRWxlbWVudDtcbiAgICBhbHBoYWJldDogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IodmlldzogSFRNTEVsZW1lbnQsIGFscGhhYmV0OiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy52aWV3ID0gdmlldztcbiAgICAgICAgdGhpcy5hbHBoYWJldCA9IGFscGhhYmV0O1xuICAgIH1cblxuICAgIHB1YmxpYyBpbml0KCk6IFByZXZpZXdMaW5rSGludFtdIHtcbiAgICAgICAgY29uc3QgeyB2aWV3LCBhbHBoYWJldCB9ID0gdGhpc1xuICAgICAgICBjb25zdCBsaW5rcyA9IGdldFByZXZpZXdMaW5rSGludHModmlldywgYWxwaGFiZXQpO1xuICAgICAgICBkaXNwbGF5UHJldmlld1BvcG92ZXJzKHZpZXcsIGxpbmtzKTtcbiAgICAgICAgcmV0dXJuIGxpbmtzO1xuICAgIH1cbn0iLCJpbXBvcnQge0FwcCwgUGx1Z2luLCBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nLCBWaWV3fSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQge0VkaXRvcn0gZnJvbSAnY29kZW1pcnJvcic7XG5pbXBvcnQge0VkaXRvclNlbGVjdGlvbn0gZnJvbSBcIkBjb2RlbWlycm9yL3N0YXRlXCI7XG5pbXBvcnQge0VkaXRvclZpZXcsIFZpZXdQbHVnaW59IGZyb20gXCJAY29kZW1pcnJvci92aWV3XCI7XG5pbXBvcnQge0xpbmtIaW50QmFzZSwgU2V0dGluZ3MsIFNvdXJjZUxpbmtIaW50fSBmcm9tICd0eXBlcyc7XG5pbXBvcnQge2NyZWF0ZVZpZXdQbHVnaW5DbGFzcywgTWFya1BsdWdpbn0gZnJvbSBcIi4vY202LXdpZGdldC9NYXJrUGx1Z2luXCI7XG5cbmltcG9ydCBDTTZMaW5rUHJvY2Vzc29yIGZyb20gXCIuL3Byb2Nlc3NvcnMvQ002TGlua1Byb2Nlc3NvclwiO1xuaW1wb3J0IENNNlJlZ2V4UHJvY2Vzc29yIGZyb20gXCIuL3Byb2Nlc3NvcnMvQ002UmVnZXhQcm9jZXNzb3JcIjtcbmltcG9ydCBMZWdhY3lSZWdleHBQcm9jZXNzb3IgZnJvbSBcIi4vcHJvY2Vzc29ycy9MZWdhY3lSZWdleHBQcm9jZXNzb3JcIjtcbmltcG9ydCBMZWdhY3lTb3VyY2VMaW5rUHJvY2Vzc29yIGZyb20gXCIuL3Byb2Nlc3NvcnMvTGVnYWN5U291cmNlTGlua1Byb2Nlc3NvclwiO1xuaW1wb3J0IFByZXZpZXdMaW5rUHJvY2Vzc29yIGZyb20gXCIuL3Byb2Nlc3NvcnMvUHJldmlld0xpbmtQcm9jZXNzb3JcIjtcblxuZW51bSBWSUVXX01PREUge1xuICAgIExFR0FDWSxcbiAgICBQUkVWSUVXLFxuICAgIENNNlxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBKdW1wVG9MaW5rIGV4dGVuZHMgUGx1Z2luIHtcbiAgICBpc0xpbmtIaW50QWN0aXZlOiBib29sZWFuID0gZmFsc2U7XG4gICAgc2V0dGluZ3M6IFNldHRpbmdzO1xuICAgIHByZWZpeEluZm86IHsgcHJlZml4OiBzdHJpbmcsIHNoaWZ0S2V5OiBib29sZWFuIH0gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgbWFya1BsdWdpbjogTWFya1BsdWdpblxuICAgIG1hcmtWaWV3UGx1Z2luOiBWaWV3UGx1Z2luPGFueT5cblxuICAgIGFzeW5jIG9ubG9hZCgpIHtcbiAgICAgICAgdGhpcy5zZXR0aW5ncyA9IGF3YWl0IHRoaXMubG9hZERhdGEoKSB8fCBuZXcgU2V0dGluZ3MoKTtcblxuICAgICAgICB0aGlzLmFkZFNldHRpbmdUYWIobmV3IFNldHRpbmdUYWIodGhpcy5hcHAsIHRoaXMpKTtcblxuICAgICAgICBjb25zdCBtYXJrUGx1Z2luID0gdGhpcy5tYXJrUGx1Z2luID0gbmV3IE1hcmtQbHVnaW4oW10pO1xuXG4gICAgICAgIGNvbnN0IG1hcmtWaWV3UGx1Z2luID0gdGhpcy5tYXJrVmlld1BsdWdpbiA9IFZpZXdQbHVnaW4uZnJvbUNsYXNzKGNyZWF0ZVZpZXdQbHVnaW5DbGFzcyhtYXJrUGx1Z2luKSwge1xuICAgICAgICAgICAgZGVjb3JhdGlvbnM6IHYgPT4gdi5kZWNvcmF0aW9uc1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yZWdpc3RlckVkaXRvckV4dGVuc2lvbihbbWFya1ZpZXdQbHVnaW5dKVxuXG4gICAgICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICAgICAgICBpZDogJ2FjdGl2YXRlLWp1bXAtdG8tbGluaycsXG4gICAgICAgICAgICBuYW1lOiAnSnVtcCB0byBMaW5rJyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiB0aGlzLmFjdGlvbi5iaW5kKHRoaXMsICdsaW5rJyksXG4gICAgICAgICAgICBob3RrZXlzOiBbe21vZGlmaWVyczogWydDdHJsJ10sIGtleTogYCdgfV0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICAgICAgICBpZDogXCJhY3RpdmF0ZS1qdW1wLXRvLWFueXdoZXJlXCIsXG4gICAgICAgICAgICBuYW1lOiBcIkp1bXAgdG8gQW55d2hlcmUgUmVnZXhcIixcbiAgICAgICAgICAgIGNhbGxiYWNrOiB0aGlzLmFjdGlvbi5iaW5kKHRoaXMsICdyZWdleHAnKSxcbiAgICAgICAgICAgIGhvdGtleXM6IFt7bW9kaWZpZXJzOiBbXCJDdHJsXCJdLCBrZXk6IFwiO1wifV0sXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9udW5sb2FkKCkge1xuICAgICAgICBjb25zb2xlLmxvZygndW5sb2FkaW5nIGp1bXAgdG8gbGlua3MgcGx1Z2luJyk7XG4gICAgfVxuXG4gICAgYWN0aW9uKHR5cGU6ICdsaW5rJyB8ICdyZWdleHAnKSB7XG4gICAgICAgIGlmICh0aGlzLmlzTGlua0hpbnRBY3RpdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgY2FzZSBcImxpbmtcIjpcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUp1bXBUb0xpbmsoKTtcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIGNhc2UgXCJyZWdleHBcIjpcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUp1bXBUb1JlZ2V4KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRNb2RlKGN1cnJlbnRWaWV3OiBWaWV3KTogVklFV19NT0RFIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBjb25zdCBpc0xlZ2FjeSA9IHRoaXMuYXBwLnZhdWx0LmdldENvbmZpZyhcImxlZ2FjeUVkaXRvclwiKVxuXG4gICAgICAgIGlmIChjdXJyZW50Vmlldy5nZXRTdGF0ZSgpLm1vZGUgPT09ICdwcmV2aWV3Jykge1xuICAgICAgICAgICAgcmV0dXJuIFZJRVdfTU9ERS5QUkVWSUVXO1xuICAgICAgICB9IGVsc2UgaWYgKCFpc0xlZ2FjeSkge1xuICAgICAgICAgICAgcmV0dXJuIFZJRVdfTU9ERS5DTTY7XG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudFZpZXcuZ2V0U3RhdGUoKS5tb2RlID09PSAnc291cmNlJykge1xuICAgICAgICAgICAgcmV0dXJuIFZJRVdfTU9ERS5MRUdBQ1k7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gVklFV19NT0RFLkxFR0FDWTtcbiAgICB9XG5cbiAgICBoYW5kbGVKdW1wVG9MaW5rID0gKCkgPT4ge1xuICAgICAgICBjb25zdCB7c2V0dGluZ3M6IHtsZXR0ZXJzfSwgYXBwfSA9IHRoaXNcblxuICAgICAgICBjb25zdCBjdXJyZW50VmlldyA9IGFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZi52aWV3O1xuICAgICAgICBjb25zdCBtb2RlID0gdGhpcy5nZXRNb2RlKGN1cnJlbnRWaWV3KTtcblxuICAgICAgICBzd2l0Y2ggKG1vZGUpIHtcbiAgICAgICAgICAgIGNhc2UgVklFV19NT0RFLkxFR0FDWTpcbiAgICAgICAgICAgICAgICBjb25zdCBjbUVkaXRvcjogRWRpdG9yID0gKGN1cnJlbnRWaWV3IGFzIGFueSkuc291cmNlTW9kZS5jbUVkaXRvcjtcbiAgICAgICAgICAgICAgICBjb25zdCBzb3VyY2VMaW5rSGludHMgPSBuZXcgTGVnYWN5U291cmNlTGlua1Byb2Nlc3NvcihjbUVkaXRvciwgbGV0dGVycykuaW5pdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlQWN0aW9ucyhzb3VyY2VMaW5rSGludHMsIGNtRWRpdG9yKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgVklFV19NT0RFLlBSRVZJRVc6XG4gICAgICAgICAgICAgICAgY29uc3QgcHJldmlld1ZpZXdFbDogSFRNTEVsZW1lbnQgPSAoY3VycmVudFZpZXcgYXMgYW55KS5wcmV2aWV3TW9kZS5jb250YWluZXJFbC5xdWVyeVNlbGVjdG9yKCdkaXYubWFya2Rvd24tcHJldmlldy12aWV3Jyk7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJldmlld0xpbmtIaW50cyA9IG5ldyBQcmV2aWV3TGlua1Byb2Nlc3NvcihwcmV2aWV3Vmlld0VsLCBsZXR0ZXJzKS5pbml0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVBY3Rpb25zKHByZXZpZXdMaW5rSGludHMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBWSUVXX01PREUuQ002OlxuICAgICAgICAgICAgICAgIGNvbnN0IGNtNkVkaXRvcjogRWRpdG9yVmlldyA9ICg8eyBlZGl0b3I/OiB7IGNtOiBFZGl0b3JWaWV3IH0gfT5jdXJyZW50VmlldykuZWRpdG9yLmNtO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxpdmVQcmV2aWV3TGlua3MgPSBuZXcgQ002TGlua1Byb2Nlc3NvcihjbTZFZGl0b3IsIGxldHRlcnMpLmluaXQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1hcmtQbHVnaW4uc2V0TGlua3MobGl2ZVByZXZpZXdMaW5rcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLnVwZGF0ZU9wdGlvbnMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUFjdGlvbnMobGl2ZVByZXZpZXdMaW5rcyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVKdW1wVG9SZWdleCA9ICgpID0+IHtcbiAgICAgICAgY29uc3Qge2FwcCwgc2V0dGluZ3M6IHtsZXR0ZXJzLCBqdW1wVG9Bbnl3aGVyZVJlZ2V4fX0gPSB0aGlzXG4gICAgICAgIGNvbnN0IGN1cnJlbnRWaWV3ID0gYXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmLnZpZXc7XG4gICAgICAgIGNvbnN0IG1vZGUgPSB0aGlzLmdldE1vZGUoY3VycmVudFZpZXcpO1xuXG4gICAgICAgIHN3aXRjaCAobW9kZSkge1xuICAgICAgICAgICAgY2FzZSBWSUVXX01PREUuQ002OlxuICAgICAgICAgICAgICAgIGNvbnN0IGNtNkVkaXRvcjogRWRpdG9yVmlldyA9ICg8eyBlZGl0b3I/OiB7IGNtOiBFZGl0b3JWaWV3IH0gfT5jdXJyZW50VmlldykuZWRpdG9yLmNtO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxpdmVQcmV2aWV3TGlua3MgPSBuZXcgQ002UmVnZXhQcm9jZXNzb3IoY202RWRpdG9yLCBsZXR0ZXJzLCBqdW1wVG9Bbnl3aGVyZVJlZ2V4KS5pbml0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXJrUGx1Z2luLnNldExpbmtzKGxpdmVQcmV2aWV3TGlua3MpO1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS51cGRhdGVPcHRpb25zKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVBY3Rpb25zKGxpdmVQcmV2aWV3TGlua3MsIGNtNkVkaXRvcik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFZJRVdfTU9ERS5QUkVWSUVXOlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBWSUVXX01PREUuTEVHQUNZOlxuICAgICAgICAgICAgICAgIGNvbnN0IGNtRWRpdG9yOiBFZGl0b3IgPSAoY3VycmVudFZpZXcgYXMgYW55KS5zb3VyY2VNb2RlLmNtRWRpdG9yO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxpbmtzID0gbmV3IExlZ2FjeVJlZ2V4cFByb2Nlc3NvcihjbUVkaXRvciwganVtcFRvQW55d2hlcmVSZWdleCwgbGV0dGVycykuaW5pdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlQWN0aW9ucyhsaW5rcywgY21FZGl0b3IpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgaGFuZGxlQWN0aW9ucyA9IChsaW5rSGludHM6IExpbmtIaW50QmFzZVtdLCBjbUVkaXRvcj86IEVkaXRvciB8IEVkaXRvclZpZXcpOiB2b2lkID0+IHtcbiAgICAgICAgaWYgKCFsaW5rSGludHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBsaW5rSGludE1hcDogeyBbbGV0dGVyOiBzdHJpbmddOiBMaW5rSGludEJhc2UgfSA9IHt9O1xuICAgICAgICBsaW5rSGludHMuZm9yRWFjaCh4ID0+IGxpbmtIaW50TWFwW3gubGV0dGVyXSA9IHgpO1xuXG4gICAgICAgIGNvbnN0IGhhbmRsZUhvdGtleSA9IChuZXdMZWFmOiBib29sZWFuLCBsaW5rOiBTb3VyY2VMaW5rSGludCB8IExpbmtIaW50QmFzZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGxpbmsudHlwZSA9PT0gJ2ludGVybmFsJykge1xuICAgICAgICAgICAgICAgIC8vIG5vdCBzdXJlIHdoeSB0aGUgc2Vjb25kIGFyZ3VtZW50IGluIG9wZW5MaW5rVGV4dCBpcyBuZWNlc3NhcnkuXG4gICAgICAgICAgICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9wZW5MaW5rVGV4dChkZWNvZGVVUkkobGluay5saW5rVGV4dCksICcnLCBuZXdMZWFmLCB7YWN0aXZlOiB0cnVlfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGxpbmsudHlwZSA9PT0gJ2V4dGVybmFsJykge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5vcGVuKGxpbmsubGlua1RleHQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlZGl0b3IgPSBjbUVkaXRvcjtcbiAgICAgICAgICAgICAgICBpZiAoZWRpdG9yIGluc3RhbmNlb2YgRWRpdG9yVmlldykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IChsaW5rIGFzIFNvdXJjZUxpbmtIaW50KS5pbmRleDtcbiAgICAgICAgICAgICAgICAgICAgZWRpdG9yLmRpc3BhdGNoKHsgc2VsZWN0aW9uOiBFZGl0b3JTZWxlY3Rpb24uY3Vyc29yKGluZGV4KSB9KVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGVkaXRvci5zZXRDdXJzb3IoZWRpdG9yLnBvc0Zyb21JbmRleCgoPFNvdXJjZUxpbmtIaW50PmxpbmspLmluZGV4KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVtb3ZlUG9wb3ZlcnMgPSAoKSA9PiB7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHJlbW92ZVBvcG92ZXJzKVxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpsLnBvcG92ZXInKS5mb3JFYWNoKGUgPT4gZS5yZW1vdmUoKSk7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjamwtbW9kYWwnKS5mb3JFYWNoKGUgPT4gZS5yZW1vdmUoKSk7XG4gICAgICAgICAgICB0aGlzLnByZWZpeEluZm8gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB0aGlzLm1hcmtQbHVnaW4uY2xlYW4oKTtcbiAgICAgICAgICAgIHRoaXMuYXBwLndvcmtzcGFjZS51cGRhdGVPcHRpb25zKCk7XG4gICAgICAgICAgICB0aGlzLmlzTGlua0hpbnRBY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGhhbmRsZUtleURvd24gPSAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIGlmIChldmVudC5rZXkgPT09ICdTaGlmdCcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGV2ZW50S2V5ID0gZXZlbnQua2V5LnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICBjb25zdCBwcmVmaXhlcyA9IG5ldyBTZXQoT2JqZWN0LmtleXMobGlua0hpbnRNYXApLmZpbHRlcih4ID0+IHgubGVuZ3RoID4gMSkubWFwKHggPT4geFswXSkpO1xuXG4gICAgICAgICAgICBsZXQgbGlua0hpbnQ6IExpbmtIaW50QmFzZTtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZWZpeEluZm8pIHtcbiAgICAgICAgICAgICAgICBsaW5rSGludCA9IGxpbmtIaW50TWFwW3RoaXMucHJlZml4SW5mby5wcmVmaXggKyBldmVudEtleV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxpbmtIaW50ID0gbGlua0hpbnRNYXBbZXZlbnRLZXldO1xuICAgICAgICAgICAgICAgIGlmICghbGlua0hpbnQgJiYgcHJlZml4ZXMgJiYgcHJlZml4ZXMuaGFzKGV2ZW50S2V5KSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByZWZpeEluZm8gPSB7cHJlZml4OiBldmVudEtleSwgc2hpZnRLZXk6IGV2ZW50LnNoaWZ0S2V5fTtcblxuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgICAgIGNvbnN0IG5ld0xlYWYgPSB0aGlzLnByZWZpeEluZm8/LnNoaWZ0S2V5IHx8IGV2ZW50LnNoaWZ0S2V5O1xuXG4gICAgICAgICAgICBsaW5rSGludCAmJiBoYW5kbGVIb3RrZXkobmV3TGVhZiwgbGlua0hpbnQpO1xuXG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93biwgeyBjYXB0dXJlOiB0cnVlIH0pO1xuICAgICAgICAgICAgcmVtb3ZlUG9wb3ZlcnMoKTtcbiAgICAgICAgfTtcblxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHJlbW92ZVBvcG92ZXJzKVxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlS2V5RG93biwgeyBjYXB0dXJlOiB0cnVlIH0pO1xuICAgICAgICB0aGlzLmlzTGlua0hpbnRBY3RpdmUgPSB0cnVlO1xuICAgIH1cbn1cblxuY2xhc3MgU2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICAgIHBsdWdpbjogSnVtcFRvTGlua1xuXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogSnVtcFRvTGluaykge1xuICAgICAgICBzdXBlcihhcHAsIHBsdWdpbilcblxuICAgICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpblxuICAgIH1cblxuICAgIGRpc3BsYXkoKTogdm9pZCB7XG4gICAgICAgIGxldCB7Y29udGFpbmVyRWx9ID0gdGhpcztcblxuICAgICAgICBjb250YWluZXJFbC5lbXB0eSgpO1xuXG4gICAgICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdoMicsIHt0ZXh0OiAnU2V0dGluZ3MgZm9yIEp1bXAgVG8gTGluay4nfSk7XG5cbiAgICAgICAgLyogTW9kYWwgbW9kZSBkZXByZWNhdGVkICovXG4gICAgICAgIC8vIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAvLyAgICAgLnNldE5hbWUoJ1ByZXNlbnRhdGlvbicpXG4gICAgICAgIC8vICAgICAuc2V0RGVzYygnSG93IHRvIHNob3cgbGlua3MnKVxuICAgICAgICAvLyAgICAgLmFkZERyb3Bkb3duKGNiID0+IHsgY2JcbiAgICAgICAgLy8gICAgICAgICAuYWRkT3B0aW9ucyh7XG4gICAgICAgIC8vICAgICAgICAgICAgIFwicG9wb3ZlcnNcIjogJ1BvcG92ZXJzJyxcbiAgICAgICAgLy8gICAgICAgICAgICAgXCJtb2RhbFwiOiAnTW9kYWwnXG4gICAgICAgIC8vICAgICAgICAgfSlcbiAgICAgICAgLy8gICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MubW9kZSlcbiAgICAgICAgLy8gICAgICAgICAub25DaGFuZ2UoKHZhbHVlOiBMaW5rSGludE1vZGUpID0+IHtcbiAgICAgICAgLy8gICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MubW9kZSA9IHZhbHVlO1xuICAgICAgICAvLyAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlRGF0YSh0aGlzLnBsdWdpbi5zZXR0aW5ncyk7XG4gICAgICAgIC8vICAgICAgICAgfSlcbiAgICAgICAgLy8gICAgIH0pO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoJ0NoYXJhY3RlcnMgdXNlZCBmb3IgbGluayBoaW50cycpXG4gICAgICAgICAgICAuc2V0RGVzYygnVGhlIGNoYXJhY3RlcnMgcGxhY2VkIG5leHQgdG8gZWFjaCBsaW5rIGFmdGVyIGVudGVyIGxpbmstaGludCBtb2RlLicpXG4gICAgICAgICAgICAuYWRkVGV4dChjYiA9PiB7XG4gICAgICAgICAgICAgICAgY2Iuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MubGV0dGVycylcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5sZXR0ZXJzID0gdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHRoaXMucGx1Z2luLnNldHRpbmdzKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgICAuc2V0TmFtZSgnSnVtcCBUbyBBbnl3aGVyZScpXG4gICAgICAgICAgICAuc2V0RGVzYyhcIlJlZ2V4IGJhc2VkIG5hdmlnYXRpbmcgaW4gZWRpdG9yIG1vZGVcIilcbiAgICAgICAgICAgIC5hZGRUZXh0KCh0ZXh0KSA9PlxuICAgICAgICAgICAgICAgIHRleHRcbiAgICAgICAgICAgICAgICAgICAgLnNldFBsYWNlaG9sZGVyKCdDdXN0b20gUmVnZXgnKVxuICAgICAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuanVtcFRvQW55d2hlcmVSZWdleClcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuanVtcFRvQW55d2hlcmVSZWdleCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uc2F2ZURhdGEodGhpcy5wbHVnaW4uc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICB9XG59XG4iXSwibmFtZXMiOlsiV2lkZ2V0VHlwZSIsIkRlY29yYXRpb24iLCJQbHVnaW4iLCJFZGl0b3JWaWV3IiwiRWRpdG9yU2VsZWN0aW9uIiwiVmlld1BsdWdpbiIsIlBsdWdp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
