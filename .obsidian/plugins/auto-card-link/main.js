/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => ObsidianAutoCardLink
});
module.exports = __toCommonJS(main_exports);
var import_obsidian4 = require("obsidian");

// src/settings.ts
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  showInMenuItem: true,
  enhanceDefaultPaste: false
};
var ObsidianAutoCardLinkSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian.Setting(containerEl).setName("Enhance Default Paste").setDesc("Fetch the link metadata when pasting a url in the editor with the default paste command").addToggle((val) => {
      if (!this.plugin.settings)
        return;
      return val.setValue(this.plugin.settings.enhanceDefaultPaste).onChange((value) => __async(this, null, function* () {
        if (!this.plugin.settings)
          return;
        this.plugin.settings.enhanceDefaultPaste = value;
        yield this.plugin.saveSettings();
      }));
    });
    new import_obsidian.Setting(containerEl).setName("Add commands in menu item").setDesc("Whether to add commands in right click menu items").addToggle((val) => {
      if (!this.plugin.settings)
        return;
      return val.setValue(this.plugin.settings.showInMenuItem).onChange((value) => __async(this, null, function* () {
        if (!this.plugin.settings)
          return;
        this.plugin.settings.showInMenuItem = value;
        yield this.plugin.saveSettings();
      }));
    });
  }
};

// src/regex.ts
var urlRegex = /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/i;
var lineRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
var linkRegex = /^\[([^[\]]*)\]\((https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})\)$/i;
var linkLineRegex = /\[([^[\]]*)\]\((https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})\)/gi;
var imageRegex = /\.(gif|jpe?g|tiff?|png|webp|bmp|tga|psd|ai)$/i;

// src/editor_enhancements.ts
var EditorExtensions = class {
  static getSelectedText(editor) {
    if (!editor.somethingSelected()) {
      const wordBoundaries = this.getWordBoundaries(editor);
      editor.setSelection(wordBoundaries.start, wordBoundaries.end);
    }
    return editor.getSelection();
  }
  static isCursorWithinBoundaries(cursor, match) {
    var _a;
    const startIndex = (_a = match.index) != null ? _a : 0;
    const endIndex = startIndex + match[0].length;
    return startIndex <= cursor.ch && cursor.ch <= endIndex;
  }
  static getWordBoundaries(editor) {
    var _a, _b;
    const cursor = editor.getCursor();
    const lineText = editor.getLine(cursor.line);
    const linksInLine = lineText.matchAll(linkLineRegex);
    for (const match of linksInLine) {
      if (this.isCursorWithinBoundaries(cursor, match)) {
        const startCh = (_a = match.index) != null ? _a : 0;
        return {
          start: {
            line: cursor.line,
            ch: startCh
          },
          end: { line: cursor.line, ch: startCh + match[0].length }
        };
      }
    }
    const urlsInLine = lineText.matchAll(lineRegex);
    for (const match of urlsInLine) {
      if (this.isCursorWithinBoundaries(cursor, match)) {
        const startCh = (_b = match.index) != null ? _b : 0;
        return {
          start: { line: cursor.line, ch: startCh },
          end: { line: cursor.line, ch: startCh + match[0].length }
        };
      }
    }
    return {
      start: cursor,
      end: cursor
    };
  }
  static getEditorPositionFromIndex(content, index) {
    const substr = content.substr(0, index);
    let l = 0;
    let offset = -1;
    let r = -1;
    for (; (r = substr.indexOf("\n", r + 1)) !== -1; l++, offset = r)
      ;
    offset += 1;
    const ch = content.substr(offset, index - offset).length;
    return { line: l, ch };
  }
};

// src/checkif.ts
var CheckIf = class {
  static isUrl(text) {
    const regex = new RegExp(urlRegex);
    return regex.test(text);
  }
  static isImage(text) {
    const regex = new RegExp(imageRegex);
    return regex.test(text);
  }
  static isLinkedUrl(text) {
    const regex = new RegExp(linkRegex);
    return regex.test(text);
  }
};

// src/code_block_generator.ts
var import_obsidian2 = require("obsidian");

// src/link_metadata_parser.ts
var LinkMetadataParser = class {
  constructor(url, htmlText) {
    this.url = url;
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(htmlText, "text/html");
    this.htmlDoc = htmlDoc;
  }
  parse() {
    return __async(this, null, function* () {
      var _a, _b;
      const title = (_a = this.getTitle()) == null ? void 0 : _a.replace(/\r\n|\n|\r/g, "").replace(/"/g, '\\"').trim();
      if (!title)
        return;
      const description = (_b = this.getDescription()) == null ? void 0 : _b.replace(/\r\n|\n|\r/g, "").replace(/"/g, '\\"').trim();
      const { hostname } = new URL(this.url);
      const favicon = yield this.getFavicon();
      const image = yield this.getImage();
      return {
        url: this.url,
        title,
        description,
        host: hostname,
        favicon,
        image,
        indent: 0
      };
    });
  }
  getTitle() {
    var _a, _b;
    const ogTitle = (_a = this.htmlDoc.querySelector("meta[property='og:title']")) == null ? void 0 : _a.getAttr("content");
    if (ogTitle)
      return ogTitle;
    const title = (_b = this.htmlDoc.querySelector("title")) == null ? void 0 : _b.textContent;
    if (title)
      return title;
  }
  getDescription() {
    var _a, _b;
    const ogDescription = (_a = this.htmlDoc.querySelector("meta[property='og:description']")) == null ? void 0 : _a.getAttr("content");
    if (ogDescription)
      return ogDescription;
    const metaDescription = (_b = this.htmlDoc.querySelector("meta[name='description']")) == null ? void 0 : _b.getAttr("content");
    if (metaDescription)
      return metaDescription;
  }
  getFavicon() {
    return __async(this, null, function* () {
      var _a;
      const favicon = (_a = this.htmlDoc.querySelector("link[rel='icon']")) == null ? void 0 : _a.getAttr("href");
      if (favicon)
        return yield this.fixImageUrl(favicon);
    });
  }
  getImage() {
    return __async(this, null, function* () {
      var _a;
      const ogImage = (_a = this.htmlDoc.querySelector("meta[property='og:image']")) == null ? void 0 : _a.getAttr("content");
      if (ogImage)
        return yield this.fixImageUrl(ogImage);
    });
  }
  fixImageUrl(url) {
    return __async(this, null, function* () {
      if (url === void 0)
        return "";
      const { hostname } = new URL(this.url);
      let image = url;
      if (url && url.startsWith("//")) {
        const testUrlHttps = `https:${url}`;
        const testUrlHttp = `http:${url}`;
        if (yield checkUrlAccessibility(testUrlHttps)) {
          image = testUrlHttps;
        } else if (yield checkUrlAccessibility(testUrlHttp)) {
          image = testUrlHttp;
        }
      } else if (url && url.startsWith("/") && hostname) {
        const testUrlHttps = `https://${hostname}${url}`;
        const testUrlHttp = `http://${hostname}${url}`;
        const resUrlHttps = yield checkUrlAccessibility(testUrlHttps);
        const resUrlHttp = yield checkUrlAccessibility(testUrlHttp);
        if (resUrlHttps) {
          image = testUrlHttps;
        } else if (resUrlHttp) {
          image = testUrlHttp;
        }
      }
      function checkUrlAccessibility(url2) {
        return __async(this, null, function* () {
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url2;
          });
        });
      }
      return image;
    });
  }
};

// src/code_block_generator.ts
var CodeBlockGenerator = class {
  constructor(editor) {
    this.editor = editor;
  }
  convertUrlToCodeBlock(url) {
    return __async(this, null, function* () {
      const selectedText = this.editor.getSelection();
      const pasteId = this.createBlockHash();
      const fetchingText = `[Fetching Data#${pasteId}](${url})`;
      this.editor.replaceSelection(fetchingText);
      const linkMetadata = yield this.fetchLinkMetadata(url);
      const text = this.editor.getValue();
      const start = text.indexOf(fetchingText);
      if (start < 0) {
        console.log(`Unable to find text "${fetchingText}" in current editor, bailing out; link ${url}`);
        return;
      }
      const end = start + fetchingText.length;
      const startPos = EditorExtensions.getEditorPositionFromIndex(text, start);
      const endPos = EditorExtensions.getEditorPositionFromIndex(text, end);
      if (!linkMetadata) {
        new import_obsidian2.Notice("Couldn't fetch link metadata");
        this.editor.replaceRange(selectedText || url, startPos, endPos);
        return;
      }
      this.editor.replaceRange(this.genCodeBlock(linkMetadata), startPos, endPos);
    });
  }
  genCodeBlock(linkMetadata) {
    const codeBlockTexts = ["\n```cardlink"];
    codeBlockTexts.push(`url: ${linkMetadata.url}`);
    codeBlockTexts.push(`title: "${linkMetadata.title}"`);
    if (linkMetadata.description)
      codeBlockTexts.push(`description: "${linkMetadata.description}"`);
    if (linkMetadata.host)
      codeBlockTexts.push(`host: ${linkMetadata.host}`);
    if (linkMetadata.favicon)
      codeBlockTexts.push(`favicon: ${linkMetadata.favicon}`);
    if (linkMetadata.image)
      codeBlockTexts.push(`image: ${linkMetadata.image}`);
    codeBlockTexts.push("```\n");
    return codeBlockTexts.join("\n");
  }
  fetchLinkMetadata(url) {
    return __async(this, null, function* () {
      const res = yield (() => __async(this, null, function* () {
        try {
          return (0, import_obsidian2.requestUrl)({ url });
        } catch (e) {
          console.log(e);
          return;
        }
      }))();
      if (!res || res.status != 200) {
        console.log(`bad response. response status code was ${res == null ? void 0 : res.status}`);
        return;
      }
      const parser = new LinkMetadataParser(url, res.text);
      return parser.parse();
    });
  }
  createBlockHash() {
    let result = "";
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < 4; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
};

// src/code_block_processor.ts
var import_obsidian3 = require("obsidian");

// src/errors.ts
var YamlParseError = class extends Error {
};
var NoRequiredParamsError = class extends Error {
};

// src/code_block_processor.ts
var CodeBlockProcessor = class {
  constructor(app) {
    this.app = app;
  }
  run(source, el) {
    return __async(this, null, function* () {
      try {
        const data = this.parseLinkMetadataFromYaml(source);
        el.appendChild(this.genLinkEl(data));
      } catch (error) {
        if (error instanceof NoRequiredParamsError) {
          el.appendChild(this.genErrorEl(error.message));
        } else if (error instanceof YamlParseError) {
          el.appendChild(this.genErrorEl(error.message));
        } else {
          console.log("Code Block: cardlink unknown error", error);
        }
      }
    });
  }
  parseLinkMetadataFromYaml(source) {
    let yaml;
    let indent = -1;
    source = source.split(/\r?\n|\r|\n/g).map((line) => line.replace(/^\t+/g, (tabs) => {
      const n = tabs.length;
      if (indent < 0) {
        indent = n;
      }
      return " ".repeat(n);
    })).join("\n");
    try {
      yaml = (0, import_obsidian3.parseYaml)(source);
    } catch (error) {
      console.log(error);
      throw new YamlParseError("failed to parse yaml. Check debug console for more detail.");
    }
    if (!yaml || !yaml.url || !yaml.title) {
      throw new NoRequiredParamsError("required params[url, title] are not found.");
    }
    return {
      url: yaml.url,
      title: yaml.title,
      description: yaml.description,
      host: yaml.host,
      favicon: yaml.favicon,
      image: yaml.image,
      indent
    };
  }
  genErrorEl(errorMsg) {
    const containerEl = document.createElement("div");
    containerEl.addClass("auto-card-link-error-container");
    const spanEl = document.createElement("span");
    spanEl.textContent = `cardlink error: ${errorMsg}`;
    containerEl.appendChild(spanEl);
    return containerEl;
  }
  genLinkEl(data) {
    const containerEl = document.createElement("div");
    containerEl.addClass("auto-card-link-container");
    containerEl.setAttr("data-auto-card-link-depth", data.indent);
    const cardEl = document.createElement("a");
    cardEl.addClass("auto-card-link-card");
    cardEl.setAttr("href", data.url);
    containerEl.appendChild(cardEl);
    const mainEl = document.createElement("div");
    mainEl.addClass("auto-card-link-main");
    cardEl.appendChild(mainEl);
    const titleEl = document.createElement("div");
    titleEl.addClass("auto-card-link-title");
    titleEl.textContent = data.title;
    mainEl.appendChild(titleEl);
    if (data.description) {
      const descriptionEl = document.createElement("div");
      descriptionEl.addClass("auto-card-link-description");
      descriptionEl.textContent = data.description;
      mainEl.appendChild(descriptionEl);
    }
    const hostEl = document.createElement("div");
    hostEl.addClass("auto-card-link-host");
    mainEl.appendChild(hostEl);
    if (data.favicon) {
      const faviconEl = document.createElement("img");
      faviconEl.addClass("auto-card-link-favicon");
      faviconEl.setAttr("src", data.favicon);
      hostEl.appendChild(faviconEl);
    }
    if (data.host) {
      const hostNameEl = document.createElement("span");
      hostNameEl.textContent = data.host;
      hostEl.appendChild(hostNameEl);
    }
    if (data.image) {
      const thumbnailEl = document.createElement("img");
      thumbnailEl.addClass("auto-card-link-thumbnail");
      thumbnailEl.setAttr("src", data.image);
      thumbnailEl.setAttr("draggable", "false");
      cardEl.appendChild(thumbnailEl);
    }
    new import_obsidian3.ButtonComponent(containerEl).setClass("auto-card-link-copy-url").setClass("clickable-icon").setIcon("copy").setTooltip(`Copy URL
${data.url}`).onClick(() => {
      navigator.clipboard.writeText(data.url);
      new import_obsidian3.Notice("URL copied to your clipboard");
    });
    return containerEl;
  }
};

// src/main.ts
var ObsidianAutoCardLink = class extends import_obsidian4.Plugin {
  constructor() {
    super(...arguments);
    this.onPaste = (evt, editor) => __async(this, null, function* () {
      var _a;
      if (!((_a = this.settings) == null ? void 0 : _a.enhanceDefaultPaste))
        return;
      if (!navigator.onLine)
        return;
      if (evt.clipboardData == null)
        return;
      if (evt.clipboardData.files.length > 0)
        return;
      const clipboardText = evt.clipboardData.getData("text/plain");
      if (clipboardText == null || clipboardText == "")
        return;
      if (!CheckIf.isUrl(clipboardText) || CheckIf.isImage(clipboardText)) {
        return;
      }
      evt.stopPropagation();
      evt.preventDefault();
      const codeBlockGenerator = new CodeBlockGenerator(editor);
      yield codeBlockGenerator.convertUrlToCodeBlock(clipboardText);
      return;
    });
    this.onEditorMenu = (menu) => {
      var _a;
      if (!((_a = this.settings) == null ? void 0 : _a.showInMenuItem))
        return;
      menu.addItem((item) => {
        item.setTitle("Paste URL and enhance to card link").setIcon("paste").onClick(() => __async(this, null, function* () {
          const editor = this.getEditor();
          if (!editor)
            return;
          this.manualPasteAndEnhanceURL(editor);
        }));
      });
      if (!navigator.onLine)
        return;
      menu.addItem((item) => {
        item.setTitle("Enhance selected URL to card link").setIcon("link").onClick(() => {
          const editor = this.getEditor();
          if (!editor)
            return;
          this.enhanceSelectedURL(editor);
        });
      });
      return;
    };
  }
  onload() {
    return __async(this, null, function* () {
      yield this.loadSettings();
      this.registerMarkdownCodeBlockProcessor("cardlink", (source, el) => __async(this, null, function* () {
        const processor = new CodeBlockProcessor(this.app);
        yield processor.run(source, el);
      }));
      this.addCommand({
        id: "auto-card-link-paste-and-enhance",
        name: "Paste URL and enhance to card link",
        editorCallback: (editor) => __async(this, null, function* () {
          yield this.manualPasteAndEnhanceURL(editor);
        }),
        hotkeys: []
      });
      this.addCommand({
        id: "auto-card-link-enhance-selected-url",
        name: "Enhance selected URL to card link",
        editorCheckCallback: (checking, editor) => {
          if (!navigator.onLine)
            return false;
          if (checking)
            return true;
          this.enhanceSelectedURL(editor);
        },
        hotkeys: [
          {
            modifiers: ["Mod", "Shift"],
            key: "e"
          }
        ]
      });
      this.registerEvent(this.app.workspace.on("editor-paste", this.onPaste));
      this.registerEvent(this.app.workspace.on("editor-menu", this.onEditorMenu));
      this.addSettingTab(new ObsidianAutoCardLinkSettingTab(this.app, this));
    });
  }
  enhanceSelectedURL(editor) {
    const selectedText = (EditorExtensions.getSelectedText(editor) || "").trim();
    const codeBlockGenerator = new CodeBlockGenerator(editor);
    if (CheckIf.isUrl(selectedText)) {
      codeBlockGenerator.convertUrlToCodeBlock(selectedText);
    } else if (CheckIf.isLinkedUrl(selectedText)) {
      const url = this.getUrlFromLink(selectedText);
      codeBlockGenerator.convertUrlToCodeBlock(url);
    }
  }
  manualPasteAndEnhanceURL(editor) {
    return __async(this, null, function* () {
      const clipboardText = yield navigator.clipboard.readText();
      if (clipboardText == null || clipboardText == "") {
        return;
      }
      if (!navigator.onLine) {
        editor.replaceSelection(clipboardText);
        return;
      }
      console.log(clipboardText);
      console.log(CheckIf.isUrl(clipboardText));
      if (!CheckIf.isUrl(clipboardText) || CheckIf.isImage(clipboardText)) {
        editor.replaceSelection(clipboardText);
        return;
      }
      const codeBlockGenerator = new CodeBlockGenerator(editor);
      yield codeBlockGenerator.convertUrlToCodeBlock(clipboardText);
      return;
    });
  }
  getEditor() {
    const view = this.app.workspace.getActiveViewOfType(import_obsidian4.MarkdownView);
    if (!view)
      return;
    return view.editor;
  }
  getUrlFromLink(link) {
    const urlRegex2 = new RegExp(linkRegex);
    const regExpExecArray = urlRegex2.exec(link);
    if (regExpExecArray === null || regExpExecArray.length < 2) {
      return "";
    }
    return regExpExecArray[2];
  }
  onunload() {
    console.log("unloading auto-card-link");
  }
  loadSettings() {
    return __async(this, null, function* () {
      this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
    });
  }
  saveSettings() {
    return __async(this, null, function* () {
      yield this.saveData(this.settings);
    });
  }
};
