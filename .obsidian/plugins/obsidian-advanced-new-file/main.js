/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
Obsidian Advanced New File
https://github.com/vanadium23/obsidian-advanced-new-file
*/

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
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
__export(exports, {
  default: () => AdvancedNewFilePlugin
});
var import_obsidian4 = __toModule(require("obsidian"));

// src/ChooseFolderModal.ts
var import_obsidian3 = __toModule(require("obsidian"));

// src/CreateNoteModal.ts
var import_obsidian2 = __toModule(require("obsidian"));

// src/utils.ts
var import_obsidian = __toModule(require("obsidian"));
var path = {
  parse(pathString) {
    const regex = /(?<dir>([^/\\]+[/\\])*)(?<name>[^/\\]*$)/;
    const match = String(pathString).match(regex);
    const { dir, name } = match && match.groups;
    return { dir, name: name || "Untitled" };
  },
  join(...strings) {
    const parts = strings.map((s) => String(s).trim()).filter((s) => s != null);
    return (0, import_obsidian.normalizePath)(parts.join("/"));
  }
};

// src/CreateNoteModal.ts
var CreateNoteModal = class extends import_obsidian2.Modal {
  constructor(app) {
    super(app);
    this.inputEl = document.createElement("input");
    this.inputEl.type = "text";
    this.inputEl.placeholder = "Type filename for new note";
    this.inputEl.className = "prompt-input";
    const instructions2 = [
      {
        command: "\u21B5",
        purpose: "to create note (default: Untitled)"
      },
      {
        command: "esc",
        purpose: "to dismiss creation"
      }
    ];
    this.instructionsEl = document.createElement("div");
    this.instructionsEl.addClass("prompt-instructions");
    const children = instructions2.map((x) => {
      const child = document.createElement("div");
      child.addClass("prompt-instruction");
      const command = document.createElement("span");
      command.addClass("prompt-instruction-command");
      command.innerText = x.command;
      child.appendChild(command);
      const purpose = document.createElement("span");
      purpose.innerText = x.purpose;
      child.appendChild(purpose);
      return child;
    });
    for (const child of children) {
      this.instructionsEl.appendChild(child);
    }
    this.modalEl.className = "prompt";
    this.modalEl.innerHTML = "";
    this.modalEl.appendChild(this.inputEl);
    this.modalEl.appendChild(this.instructionsEl);
    this.inputListener = this.listenInput.bind(this);
  }
  setFolder(folder, newDirectoryPath) {
    this.folder = folder;
    this.newDirectoryPath = newDirectoryPath;
  }
  listenInput(evt) {
    if (evt.key === "Enter") {
      this.createNewNote(this.inputEl.value);
      this.close();
    }
  }
  onOpen() {
    this.inputEl.focus();
    this.inputEl.addEventListener("keydown", this.inputListener);
  }
  onClose() {
    this.inputEl.removeEventListener("keydown", this.inputListener);
  }
  createDirectory(dir) {
    return __async(this, null, function* () {
      const { vault } = this.app;
      const { adapter } = vault;
      const root = vault.getRoot().path;
      const directoryPath = path.join(this.folder.path, dir);
      const directoryExists = yield adapter.exists(directoryPath);
      if (!import_obsidian2.Platform.isIosApp) {
        if (!directoryExists) {
          return adapter.mkdir((0, import_obsidian2.normalizePath)(directoryPath));
        }
      }
      const subPaths = (0, import_obsidian2.normalizePath)(directoryPath).split("/").filter((part) => part.trim() !== "").map((_, index, arr) => arr.slice(0, index + 1).join("/"));
      for (const subPath of subPaths) {
        const directoryExists2 = yield adapter.exists(path.join(root, subPath));
        if (!directoryExists2) {
          yield adapter.mkdir(path.join(root, subPath));
        }
      }
    });
  }
  createNewNote(input) {
    return __async(this, null, function* () {
      const { vault } = this.app;
      const { adapter } = vault;
      const prependDirInput = path.join(this.newDirectoryPath, input);
      const { dir, name } = path.parse(prependDirInput);
      const directoryPath = path.join(this.folder.path, dir);
      const filePath = path.join(directoryPath, `${name}.md`);
      try {
        const fileExists = yield adapter.exists(filePath);
        if (fileExists) {
          throw new Error(`${filePath} already exists`);
        }
        if (dir !== "") {
          yield this.createDirectory(dir);
        }
        const File = yield vault.create(filePath, "");
        yield this.app.workspace.activeLeaf.openFile(File);
      } catch (error) {
        new import_obsidian2.Notice(error.toString());
      }
    });
  }
};

// src/ChooseFolderModal.ts
var EMPTY_TEXT = "No folder found. Press esc to dismiss.";
var PLACEHOLDER_TEXT = "Type folder name to fuzzy find.";
var instructions = [
  { command: "\u2191\u2193", purpose: "to navigate" },
  { command: "Tab \u21B9", purpose: "to autocomplete folder" },
  { command: "\u21B5", purpose: "to choose folder" },
  { command: "esc", purpose: "to dismiss" }
];
var ChooseFolderModal = class extends import_obsidian3.FuzzySuggestModal {
  constructor(app) {
    super(app);
    this.init();
  }
  init() {
    const folders = new Set();
    import_obsidian3.Vault.recurseChildren(this.app.vault.getRoot(), (file) => {
      if (file instanceof import_obsidian3.TFolder) {
        folders.add(file);
      }
    });
    this.folders = Array.from(folders);
    this.emptyStateText = EMPTY_TEXT;
    this.setPlaceholder(PLACEHOLDER_TEXT);
    this.setInstructions(instructions);
    this.initChooseFolderItem();
    this.createNoteModal = new CreateNoteModal(this.app);
    this.inputListener = this.listenInput.bind(this);
  }
  getItems() {
    return this.folders;
  }
  getItemText(item) {
    this.noSuggestion = false;
    return item.path;
  }
  onNoSuggestion() {
    this.noSuggestion = true;
    this.newDirectoryPath = this.inputEl.value;
    this.resultContainerEl.childNodes.forEach((c) => c.parentNode.removeChild(c));
    this.chooseFolder.innerText = this.inputEl.value;
    this.itemInstructionMessage(this.chooseFolder, "Press \u21B5 or append / to create folder.");
    this.resultContainerEl.appendChild(this.chooseFolder);
    this.resultContainerEl.appendChild(this.suggestionEmpty);
  }
  shouldCreateFolder(evt) {
    if (this.newDirectoryPath.endsWith("/")) {
      return true;
    }
    if (evt instanceof KeyboardEvent && evt.key == "Enter") {
      return true;
    }
    return false;
  }
  findCurrentSelect() {
    return document.querySelector(".suggestion-item.is-selected");
  }
  listenInput(evt) {
    var _a;
    if (evt.key == "Tab") {
      this.inputEl.value = (_a = this.findCurrentSelect()) == null ? void 0 : _a.innerText;
      evt.preventDefault();
    }
  }
  onOpen() {
    super.onOpen();
    this.inputEl.addEventListener("keydown", this.inputListener);
  }
  onClose() {
    this.inputEl.removeEventListener("keydown", this.inputListener);
    super.onClose();
  }
  onChooseItem(item, evt) {
    if (this.noSuggestion) {
      if (!this.shouldCreateFolder(evt)) {
        return;
      }
      this.createNoteModal.setFolder(this.app.vault.getRoot(), this.newDirectoryPath);
    } else {
      this.createNoteModal.setFolder(item, "");
    }
    this.createNoteModal.open();
  }
  initChooseFolderItem() {
    this.chooseFolder = document.createElement("div");
    this.chooseFolder.addClasses(["suggestion-item", "is-selected"]);
    this.suggestionEmpty = document.createElement("div");
    this.suggestionEmpty.addClass("suggestion-empty");
    this.suggestionEmpty.innerText = EMPTY_TEXT;
  }
  itemInstructionMessage(resultEl, message) {
    const el = document.createElement("kbd");
    el.addClass("suggestion-hotkey");
    el.innerText = message;
    resultEl.appendChild(el);
  }
};

// src/main.ts
var AdvancedNewFilePlugin = class extends import_obsidian4.Plugin {
  onload() {
    return __async(this, null, function* () {
      console.log("loading plugin");
      this.addCommand({
        id: "advanced-new-file",
        name: "Create note",
        callback: () => {
          new ChooseFolderModal(this.app).open();
        }
      });
    });
  }
  onunload() {
    console.log("unloading plugin");
  }
};
