'use strict';

var obsidian = require('obsidian');
var electron = require('electron');
var path_1 = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path_1__default = /*#__PURE__*/_interopDefaultLegacy(path_1);

/*! *****************************************************************************
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
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

/**
 * File URI to Path function.
 *
 * @param {String} uri
 * @return {String} path
 * @api public
 */
function fileUriToPath(uri) {
    if (typeof uri !== 'string' ||
        uri.length <= 7 ||
        uri.substring(0, 7) !== 'file://') {
        throw new TypeError('must pass in a file:// URI to convert to a file path');
    }
    const rest = decodeURI(uri.substring(7));
    const firstSlash = rest.indexOf('/');
    let host = rest.substring(0, firstSlash);
    let path = rest.substring(firstSlash + 1);
    // 2.  Scheme Definition
    // As a special case, <host> can be the string "localhost" or the empty
    // string; this is interpreted as "the machine from which the URL is
    // being interpreted".
    if (host === 'localhost') {
        host = '';
    }
    if (host) {
        host = path_1__default['default'].sep + path_1__default['default'].sep + host;
    }
    // 3.2  Drives, drive letters, mount points, file system root
    // Drive letters are mapped into the top of a file URI in various ways,
    // depending on the implementation; some applications substitute
    // vertical bar ("|") for the colon after the drive letter, yielding
    // "file:///c|/tmp/test.txt".  In some cases, the colon is left
    // unchanged, as in "file:///c:/tmp/test.txt".  In other cases, the
    // colon is simply omitted, as in "file:///c/tmp/test.txt".
    path = path.replace(/^(.+)\|/, '$1:');
    // for Windows, we need to invert the path separators from what a URI uses
    if (path_1__default['default'].sep === '\\') {
        path = path.replace(/\//g, '\\');
    }
    if (/^.+:/.test(path)) ;
    else {
        // unix path…
        path = path_1__default['default'].sep + path;
    }
    return host + path;
}
var src = fileUriToPath;

var FilePathToUri = /** @class */ (function (_super) {
    __extends(FilePathToUri, _super);
    function FilePathToUri() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FilePathToUri.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                console.log('Loading plugin FilePathToUri...');
                this.addCommand({
                    id: 'toggle-file-path-to-uri',
                    name: 'Toggle selected file path to URI and back',
                    checkCallback: function (checking) {
                        if (_this.getEditor() === null) {
                            return;
                        }
                        if (!checking) {
                            _this.toggleLink();
                        }
                        return true;
                    },
                    hotkeys: [
                        {
                            modifiers: ['Mod', 'Alt'],
                            key: 'L',
                        },
                    ],
                });
                this.addCommand({
                    id: 'paste-file-path-as-file-uri',
                    name: 'Paste file path as file uri',
                    checkCallback: function (checking) {
                        if (_this.getEditor() === null) {
                            return;
                        }
                        if (!checking) {
                            _this.pasteAsUri();
                        }
                        return true;
                    },
                    hotkeys: [
                        {
                            modifiers: ['Mod', 'Alt', 'Shift'],
                            key: 'L',
                        },
                    ],
                });
                this.addCommand({
                    id: 'paste-file-path-as-file-uri-link',
                    name: 'Paste file path as file uri link',
                    checkCallback: function (checking) {
                        if (_this.getEditor() === null) {
                            return;
                        }
                        if (!checking) {
                            _this.pasteAsUriLink();
                        }
                        return true;
                    },
                    hotkeys: [],
                });
                this.addCommand({
                    id: 'paste-file-path-as-file-uri-link-name-only',
                    name: 'Paste file path as file uri link - Name only',
                    checkCallback: function (checking) {
                        if (_this.getEditor() === null) {
                            return;
                        }
                        if (!checking) {
                            _this.pasteAsUriLink('lastSegment');
                        }
                        return true;
                    },
                    hotkeys: [
                    // For testing only
                    // {
                    // 	modifiers: ['Mod', 'Alt', 'Shift'],
                    // 	key: 'J',
                    // },
                    ],
                });
                return [2 /*return*/];
            });
        });
    };
    FilePathToUri.prototype.getEditor = function () {
        var view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
        if (!view || view.getMode() !== 'source') {
            return null;
        }
        return view.sourceMode.cmEditor;
    };
    FilePathToUri.prototype.pasteAsUri = function () {
        var editor = this.getEditor();
        if (editor == null) {
            return;
        }
        var clipboardText = electron.clipboard.readText('clipboard');
        if (!clipboardText) {
            return;
        }
        clipboardText = this.cleanupText(clipboardText);
        // Paste the text as usual if it's not file path
        if (clipboardText.startsWith('file:') || !this.hasSlashes(clipboardText)) {
            editor.replaceSelection(clipboardText, 'around');
        }
        // network path '\\path'
        if (clipboardText.startsWith('\\\\')) {
            var endsWithSlash = clipboardText.endsWith('\\') || clipboardText.endsWith('/');
            // URL throws error on invalid url
            try {
                var url = new URL(clipboardText);
                var link = url.href.replace('file://', 'file:///%5C%5C');
                if (link.endsWith('/') && !endsWithSlash) {
                    link = link.slice(0, -1);
                }
                editor.replaceSelection(link, 'around');
            }
            catch (e) {
                return;
            }
        }
        // path C:\Users\ or \System\etc
        else {
            if (!this.hasSlashes(clipboardText)) {
                return;
            }
            // URL throws error on invalid url
            try {
                var url = new URL('file://' + clipboardText);
                editor.replaceSelection(url.href, 'around');
            }
            catch (e) {
                return;
            }
        }
    };
    FilePathToUri.prototype.makeLink = function (title, link) {
        return "[" + title + "](" + link + ")";
    };
    // TODO: todo
    FilePathToUri.prototype.pasteAsUriLink = function (pasteType) {
        var editor = this.getEditor();
        if (editor == null) {
            return;
        }
        var clipboardText = electron.clipboard.readText('clipboard');
        if (!clipboardText) {
            return;
        }
        clipboardText = this.cleanupText(clipboardText);
        // Paste the text as usual if it's not file path
        if (clipboardText.startsWith('file:') || !this.hasSlashes(clipboardText)) {
            editor.replaceSelection(clipboardText, 'around');
        }
        // network path '\\path'
        if (clipboardText.startsWith('\\\\')) {
            var endsWithSlash = clipboardText.endsWith('\\') || clipboardText.endsWith('/');
            // URL throws error on invalid url
            try {
                var url = new URL(clipboardText);
                var link = url.href.replace('file://', 'file:///%5C%5C');
                if (link.endsWith('/') && !endsWithSlash) {
                    link = link.slice(0, -1);
                }
                // https://stackoverflow.com/questions/8376525/get-value-of-a-string-after-last-slash-in-javascript
                // Need to use url.href cause it normalizes the slash type (\/)
                // Handles trailing slash
                var lastUrlSegment = /[^/]*$/.exec(url.href.endsWith('/') ? url.href.slice(0, -1) : url.href)[0];
                if (pasteType === 'lastSegment') {
                    editor.replaceSelection(this.makeLink(lastUrlSegment, link), 'around');
                }
                else {
                    // Needs to add two '\\' (that is '\\\\' in code because of escaping) in order for the link title
                    // to display two '\\' in preview mode
                    editor.replaceSelection(this.makeLink('\\\\' + clipboardText, link), 'around');
                }
            }
            catch (e) {
                return;
            }
        }
        // path C:\Users\ or \System\etc
        else {
            if (!this.hasSlashes(clipboardText)) {
                return;
            }
            // URL throws error on invalid url
            try {
                var url = new URL('file://' + clipboardText);
                // https://stackoverflow.com/questions/8376525/get-value-of-a-string-after-last-slash-in-javascript
                // Need to use url.href cause it normalizes the slash type (\/)
                // Handles trailing slash
                var lastUrlSegment = /[^/]*$/.exec(url.href.endsWith('/') ? url.href.slice(0, -1) : url.href)[0];
                // Ugly, but quick solution
                if (pasteType === 'lastSegment') {
                    editor.replaceSelection(this.makeLink(lastUrlSegment, url.href), 'around');
                }
                else {
                    editor.replaceSelection(this.makeLink(clipboardText, url.href), 'around');
                }
            }
            catch (e) {
                return;
            }
        }
    };
    /**
     * Does the text have any '\' or '/'?
     */
    FilePathToUri.prototype.hasSlashes = function (text) {
        // Does it have any '\' or '/'?
        var regexHasAnySlash = /.*([\\\/]).*/g;
        if (typeof text !== 'string') {
            return false;
        }
        var matches = text.match(regexHasAnySlash);
        return !!matches;
    };
    /**
     * Trim whitespace and remove surrounding "
     */
    FilePathToUri.prototype.cleanupText = function (text) {
        if (typeof text !== 'string') {
            return '';
        }
        text = text.trim();
        // Remove surrounding "
        if (text.startsWith('"')) {
            text = text.substr(1);
        }
        if (text.endsWith('"')) {
            text = text.substr(0, text.length - 1);
        }
        return text;
    };
    FilePathToUri.prototype.toggleLink = function () {
        var editor = this.getEditor();
        if (editor == null || !editor.somethingSelected()) {
            return;
        }
        var selectedText = editor.getSelection();
        selectedText = this.cleanupText(selectedText);
        // file url for network location file://\\location
        // Works for both 'file:///\\path' and 'file:///%5C%5Cpath'
        // Obsidian uses escape chars in link so `file:///\\location` will try to open `file:///\location instead
        // But the selected text we get contains the full string, thus the test for both 2 and 4 '\' chars
        if (selectedText.startsWith('file:///\\\\') ||
            selectedText.startsWith('file:///\\\\\\\\') ||
            selectedText.startsWith('file:///%5C%5C')) {
            // normalize to 'file:///'
            selectedText = selectedText.replace('file:///\\\\\\\\', 'file:///');
            selectedText = selectedText.replace('file:///\\\\', 'file:///');
            selectedText = selectedText.replace('file:///%5C%5C', 'file:///');
            var url = src(selectedText);
            if (url) {
                // fileUriToPath returns only single leading '\' so we need to add the second one
                editor.replaceSelection('\\' + url, 'around');
            }
        }
        // file link file:///C:/Users
        else if (selectedText.startsWith('file:///')) {
            var url = src(selectedText);
            if (url) {
                editor.replaceSelection(url, 'around');
            }
        }
        // network path '\\path'
        else if (selectedText.startsWith('\\\\')) {
            var endsWithSlash = selectedText.endsWith('\\') || selectedText.endsWith('/');
            // URL throws error on invalid url
            try {
                var url = new URL(selectedText);
                var link = url.href.replace('file://', 'file:///%5C%5C');
                if (link.endsWith('/') && !endsWithSlash) {
                    link = link.slice(0, -1);
                }
                editor.replaceSelection(link, 'around');
            }
            catch (e) {
                return;
            }
        }
        // path C:\Users\ or \System\etc
        else {
            if (!this.hasSlashes(selectedText)) {
                return;
            }
            // URL throws error on invalid url
            try {
                var url = new URL('file://' + selectedText);
                editor.replaceSelection(url.href, 'around');
            }
            catch (e) {
                return;
            }
        }
    };
    FilePathToUri.prototype.onunload = function () {
        console.log('Unloading plugin FilePathToUri...');
    };
    return FilePathToUri;
}(obsidian.Plugin));

module.exports = FilePathToUri;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIi4uL25vZGVfbW9kdWxlcy9maWxlLXVyaS10by1wYXRoL2Rpc3Qvc3JjL2luZGV4LmpzIiwiLi4vbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXHJcblxyXG5QZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnlcclxucHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLlxyXG5cclxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiBBTkQgVEhFIEFVVEhPUiBESVNDTEFJTVMgQUxMIFdBUlJBTlRJRVMgV0lUSFxyXG5SRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFlcclxuQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgRElSRUNULFxyXG5JTkRJUkVDVCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9SIEFOWSBEQU1BR0VTIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST01cclxuTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1JcclxuT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUlxyXG5QRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbihkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxyXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICAgICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2NyZWF0ZUJpbmRpbmcgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIG8pIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgcCkpIF9fY3JlYXRlQmluZGluZyhvLCBtLCBwKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5cygpIHtcclxuICAgIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxyXG4gICAgICAgICAgICByW2tdID0gYVtqXTtcclxuICAgIHJldHVybiByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheSh0bywgZnJvbSkge1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGlsID0gZnJvbS5sZW5ndGgsIGogPSB0by5sZW5ndGg7IGkgPCBpbDsgaSsrLCBqKyspXHJcbiAgICAgICAgdG9bal0gPSBmcm9tW2ldO1xyXG4gICAgcmV0dXJuIHRvO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XHJcbn0pIDogZnVuY3Rpb24obywgdikge1xyXG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XHJcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHJlY2VpdmVyLCBwcml2YXRlTWFwKSB7XHJcbiAgICBpZiAoIXByaXZhdGVNYXAuaGFzKHJlY2VpdmVyKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJhdHRlbXB0ZWQgdG8gZ2V0IHByaXZhdGUgZmllbGQgb24gbm9uLWluc3RhbmNlXCIpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHByaXZhdGVNYXAuZ2V0KHJlY2VpdmVyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fY2xhc3NQcml2YXRlRmllbGRTZXQocmVjZWl2ZXIsIHByaXZhdGVNYXAsIHZhbHVlKSB7XHJcbiAgICBpZiAoIXByaXZhdGVNYXAuaGFzKHJlY2VpdmVyKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJhdHRlbXB0ZWQgdG8gc2V0IHByaXZhdGUgZmllbGQgb24gbm9uLWluc3RhbmNlXCIpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZU1hcC5zZXQocmVjZWl2ZXIsIHZhbHVlKTtcclxuICAgIHJldHVybiB2YWx1ZTtcclxufVxyXG4iLCJcInVzZSBzdHJpY3RcIjtcbmNvbnN0IHBhdGhfMSA9IHJlcXVpcmUoXCJwYXRoXCIpO1xuLyoqXG4gKiBGaWxlIFVSSSB0byBQYXRoIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmlcbiAqIEByZXR1cm4ge1N0cmluZ30gcGF0aFxuICogQGFwaSBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gZmlsZVVyaVRvUGF0aCh1cmkpIHtcbiAgICBpZiAodHlwZW9mIHVyaSAhPT0gJ3N0cmluZycgfHxcbiAgICAgICAgdXJpLmxlbmd0aCA8PSA3IHx8XG4gICAgICAgIHVyaS5zdWJzdHJpbmcoMCwgNykgIT09ICdmaWxlOi8vJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdtdXN0IHBhc3MgaW4gYSBmaWxlOi8vIFVSSSB0byBjb252ZXJ0IHRvIGEgZmlsZSBwYXRoJyk7XG4gICAgfVxuICAgIGNvbnN0IHJlc3QgPSBkZWNvZGVVUkkodXJpLnN1YnN0cmluZyg3KSk7XG4gICAgY29uc3QgZmlyc3RTbGFzaCA9IHJlc3QuaW5kZXhPZignLycpO1xuICAgIGxldCBob3N0ID0gcmVzdC5zdWJzdHJpbmcoMCwgZmlyc3RTbGFzaCk7XG4gICAgbGV0IHBhdGggPSByZXN0LnN1YnN0cmluZyhmaXJzdFNsYXNoICsgMSk7XG4gICAgLy8gMi4gIFNjaGVtZSBEZWZpbml0aW9uXG4gICAgLy8gQXMgYSBzcGVjaWFsIGNhc2UsIDxob3N0PiBjYW4gYmUgdGhlIHN0cmluZyBcImxvY2FsaG9zdFwiIG9yIHRoZSBlbXB0eVxuICAgIC8vIHN0cmluZzsgdGhpcyBpcyBpbnRlcnByZXRlZCBhcyBcInRoZSBtYWNoaW5lIGZyb20gd2hpY2ggdGhlIFVSTCBpc1xuICAgIC8vIGJlaW5nIGludGVycHJldGVkXCIuXG4gICAgaWYgKGhvc3QgPT09ICdsb2NhbGhvc3QnKSB7XG4gICAgICAgIGhvc3QgPSAnJztcbiAgICB9XG4gICAgaWYgKGhvc3QpIHtcbiAgICAgICAgaG9zdCA9IHBhdGhfMS5zZXAgKyBwYXRoXzEuc2VwICsgaG9zdDtcbiAgICB9XG4gICAgLy8gMy4yICBEcml2ZXMsIGRyaXZlIGxldHRlcnMsIG1vdW50IHBvaW50cywgZmlsZSBzeXN0ZW0gcm9vdFxuICAgIC8vIERyaXZlIGxldHRlcnMgYXJlIG1hcHBlZCBpbnRvIHRoZSB0b3Agb2YgYSBmaWxlIFVSSSBpbiB2YXJpb3VzIHdheXMsXG4gICAgLy8gZGVwZW5kaW5nIG9uIHRoZSBpbXBsZW1lbnRhdGlvbjsgc29tZSBhcHBsaWNhdGlvbnMgc3Vic3RpdHV0ZVxuICAgIC8vIHZlcnRpY2FsIGJhciAoXCJ8XCIpIGZvciB0aGUgY29sb24gYWZ0ZXIgdGhlIGRyaXZlIGxldHRlciwgeWllbGRpbmdcbiAgICAvLyBcImZpbGU6Ly8vY3wvdG1wL3Rlc3QudHh0XCIuICBJbiBzb21lIGNhc2VzLCB0aGUgY29sb24gaXMgbGVmdFxuICAgIC8vIHVuY2hhbmdlZCwgYXMgaW4gXCJmaWxlOi8vL2M6L3RtcC90ZXN0LnR4dFwiLiAgSW4gb3RoZXIgY2FzZXMsIHRoZVxuICAgIC8vIGNvbG9uIGlzIHNpbXBseSBvbWl0dGVkLCBhcyBpbiBcImZpbGU6Ly8vYy90bXAvdGVzdC50eHRcIi5cbiAgICBwYXRoID0gcGF0aC5yZXBsYWNlKC9eKC4rKVxcfC8sICckMTonKTtcbiAgICAvLyBmb3IgV2luZG93cywgd2UgbmVlZCB0byBpbnZlcnQgdGhlIHBhdGggc2VwYXJhdG9ycyBmcm9tIHdoYXQgYSBVUkkgdXNlc1xuICAgIGlmIChwYXRoXzEuc2VwID09PSAnXFxcXCcpIHtcbiAgICAgICAgcGF0aCA9IHBhdGgucmVwbGFjZSgvXFwvL2csICdcXFxcJyk7XG4gICAgfVxuICAgIGlmICgvXi4rOi8udGVzdChwYXRoKSkge1xuICAgICAgICAvLyBoYXMgV2luZG93cyBkcml2ZSBhdCBiZWdpbm5pbmcgb2YgcGF0aFxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gdW5peCBwYXRo4oCmXG4gICAgICAgIHBhdGggPSBwYXRoXzEuc2VwICsgcGF0aDtcbiAgICB9XG4gICAgcmV0dXJuIGhvc3QgKyBwYXRoO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmaWxlVXJpVG9QYXRoO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiaW1wb3J0IHsgUGx1Z2luLCBNYXJrZG93blZpZXcgfSBmcm9tICdvYnNpZGlhbic7XHJcbmltcG9ydCB7IGNsaXBib2FyZCB9IGZyb20gJ2VsZWN0cm9uJztcclxuaW1wb3J0IGZpbGVVcmlUb1BhdGggZnJvbSAnZmlsZS11cmktdG8tcGF0aCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaWxlUGF0aFRvVXJpIGV4dGVuZHMgUGx1Z2luIHtcclxuXHRhc3luYyBvbmxvYWQoKSB7XHJcblx0XHRjb25zb2xlLmxvZygnTG9hZGluZyBwbHVnaW4gRmlsZVBhdGhUb1VyaS4uLicpO1xyXG5cclxuXHRcdHRoaXMuYWRkQ29tbWFuZCh7XHJcblx0XHRcdGlkOiAndG9nZ2xlLWZpbGUtcGF0aC10by11cmknLFxyXG5cdFx0XHRuYW1lOiAnVG9nZ2xlIHNlbGVjdGVkIGZpbGUgcGF0aCB0byBVUkkgYW5kIGJhY2snLFxyXG5cdFx0XHRjaGVja0NhbGxiYWNrOiAoY2hlY2tpbmc6IGJvb2xlYW4pID0+IHtcclxuXHRcdFx0XHRpZiAodGhpcy5nZXRFZGl0b3IoKSA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKCFjaGVja2luZykge1xyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVMaW5rKCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fSxcclxuXHRcdFx0aG90a2V5czogW1xyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdG1vZGlmaWVyczogWydNb2QnLCAnQWx0J10sXHJcblx0XHRcdFx0XHRrZXk6ICdMJyxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRdLFxyXG5cdFx0fSk7XHJcblxyXG5cdFx0dGhpcy5hZGRDb21tYW5kKHtcclxuXHRcdFx0aWQ6ICdwYXN0ZS1maWxlLXBhdGgtYXMtZmlsZS11cmknLFxyXG5cdFx0XHRuYW1lOiAnUGFzdGUgZmlsZSBwYXRoIGFzIGZpbGUgdXJpJyxcclxuXHRcdFx0Y2hlY2tDYWxsYmFjazogKGNoZWNraW5nOiBib29sZWFuKSA9PiB7XHJcblx0XHRcdFx0aWYgKHRoaXMuZ2V0RWRpdG9yKCkgPT09IG51bGwpIHtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICghY2hlY2tpbmcpIHtcclxuXHRcdFx0XHRcdHRoaXMucGFzdGVBc1VyaSgpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH0sXHJcblx0XHRcdGhvdGtleXM6IFtcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRtb2RpZmllcnM6IFsnTW9kJywgJ0FsdCcsICdTaGlmdCddLFxyXG5cdFx0XHRcdFx0a2V5OiAnTCcsXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XSxcclxuXHRcdH0pO1xyXG5cclxuXHJcblx0XHR0aGlzLmFkZENvbW1hbmQoe1xyXG5cdFx0XHRpZDogJ3Bhc3RlLWZpbGUtcGF0aC1hcy1maWxlLXVyaS1saW5rJyxcclxuXHRcdFx0bmFtZTogJ1Bhc3RlIGZpbGUgcGF0aCBhcyBmaWxlIHVyaSBsaW5rJyxcclxuXHRcdFx0Y2hlY2tDYWxsYmFjazogKGNoZWNraW5nOiBib29sZWFuKSA9PiB7XHJcblx0XHRcdFx0aWYgKHRoaXMuZ2V0RWRpdG9yKCkgPT09IG51bGwpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKCFjaGVja2luZylcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHR0aGlzLnBhc3RlQXNVcmlMaW5rKCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fSxcclxuXHRcdFx0aG90a2V5czogW10sXHJcblx0XHR9KVxyXG5cclxuXHRcdHRoaXMuYWRkQ29tbWFuZCh7XHJcblx0XHRcdGlkOiAncGFzdGUtZmlsZS1wYXRoLWFzLWZpbGUtdXJpLWxpbmstbmFtZS1vbmx5JyxcclxuXHRcdFx0bmFtZTogJ1Bhc3RlIGZpbGUgcGF0aCBhcyBmaWxlIHVyaSBsaW5rIC0gTmFtZSBvbmx5JyxcclxuXHRcdFx0Y2hlY2tDYWxsYmFjazogKGNoZWNraW5nOiBib29sZWFuKSA9PiB7XHJcblx0XHRcdFx0aWYgKHRoaXMuZ2V0RWRpdG9yKCkgPT09IG51bGwpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKCFjaGVja2luZylcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHR0aGlzLnBhc3RlQXNVcmlMaW5rKCdsYXN0U2VnbWVudCcpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH0sXHJcblx0XHRcdGhvdGtleXM6IFtcclxuXHRcdFx0XHQvLyBGb3IgdGVzdGluZyBvbmx5XHJcblx0XHRcdFx0Ly8ge1xyXG5cdFx0XHRcdC8vIFx0bW9kaWZpZXJzOiBbJ01vZCcsICdBbHQnLCAnU2hpZnQnXSxcclxuXHRcdFx0XHQvLyBcdGtleTogJ0onLFxyXG5cdFx0XHRcdC8vIH0sXHJcblx0XHRcdF0sXHJcblx0XHR9KVxyXG5cclxuXHR9XHJcblxyXG5cdGdldEVkaXRvcigpIHtcclxuXHRcdGNvbnN0IHZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xyXG5cdFx0aWYgKCF2aWV3IHx8IHZpZXcuZ2V0TW9kZSgpICE9PSAnc291cmNlJykge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdmlldy5zb3VyY2VNb2RlLmNtRWRpdG9yO1xyXG5cdH1cclxuXHJcblx0cGFzdGVBc1VyaSgpIHtcclxuXHRcdGxldCBlZGl0b3IgPSB0aGlzLmdldEVkaXRvcigpO1xyXG5cdFx0aWYgKGVkaXRvciA9PSBudWxsKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgY2xpcGJvYXJkVGV4dCA9IGNsaXBib2FyZC5yZWFkVGV4dCgnY2xpcGJvYXJkJyk7XHJcblx0XHRpZiAoIWNsaXBib2FyZFRleHQpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNsaXBib2FyZFRleHQgPSB0aGlzLmNsZWFudXBUZXh0KGNsaXBib2FyZFRleHQpO1xyXG5cclxuXHRcdC8vIFBhc3RlIHRoZSB0ZXh0IGFzIHVzdWFsIGlmIGl0J3Mgbm90IGZpbGUgcGF0aFxyXG5cdFx0aWYgKGNsaXBib2FyZFRleHQuc3RhcnRzV2l0aCgnZmlsZTonKSB8fCAhdGhpcy5oYXNTbGFzaGVzKGNsaXBib2FyZFRleHQpKSB7XHJcblx0XHRcdGVkaXRvci5yZXBsYWNlU2VsZWN0aW9uKGNsaXBib2FyZFRleHQsICdhcm91bmQnKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBuZXR3b3JrIHBhdGggJ1xcXFxwYXRoJ1xyXG5cdFx0aWYgKGNsaXBib2FyZFRleHQuc3RhcnRzV2l0aCgnXFxcXFxcXFwnKSkge1xyXG5cdFx0XHRsZXQgZW5kc1dpdGhTbGFzaCA9XHJcblx0XHRcdFx0Y2xpcGJvYXJkVGV4dC5lbmRzV2l0aCgnXFxcXCcpIHx8IGNsaXBib2FyZFRleHQuZW5kc1dpdGgoJy8nKTtcclxuXHRcdFx0Ly8gVVJMIHRocm93cyBlcnJvciBvbiBpbnZhbGlkIHVybFxyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdGxldCB1cmwgPSBuZXcgVVJMKGNsaXBib2FyZFRleHQpO1xyXG5cclxuXHRcdFx0XHRsZXQgbGluayA9IHVybC5ocmVmLnJlcGxhY2UoJ2ZpbGU6Ly8nLCAnZmlsZTovLy8lNUMlNUMnKTtcclxuXHRcdFx0XHRpZiAobGluay5lbmRzV2l0aCgnLycpICYmICFlbmRzV2l0aFNsYXNoKSB7XHJcblx0XHRcdFx0XHRsaW5rID0gbGluay5zbGljZSgwLCAtMSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRlZGl0b3IucmVwbGFjZVNlbGVjdGlvbihsaW5rLCAnYXJvdW5kJyk7XHJcblx0XHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vIHBhdGggQzpcXFVzZXJzXFwgb3IgXFxTeXN0ZW1cXGV0Y1xyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGlmICghdGhpcy5oYXNTbGFzaGVzKGNsaXBib2FyZFRleHQpKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBVUkwgdGhyb3dzIGVycm9yIG9uIGludmFsaWQgdXJsXHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0bGV0IHVybCA9IG5ldyBVUkwoJ2ZpbGU6Ly8nICsgY2xpcGJvYXJkVGV4dCk7XHJcblx0XHRcdFx0ZWRpdG9yLnJlcGxhY2VTZWxlY3Rpb24odXJsLmhyZWYsICdhcm91bmQnKTtcclxuXHRcdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0bWFrZUxpbmsodGl0bGU6c3RyaW5nLCBsaW5rOnN0cmluZykge1xyXG5cdFx0cmV0dXJuIGBbJHt0aXRsZX1dKCR7bGlua30pYFxyXG5cdH1cclxuXHJcblx0Ly8gVE9ETzogdG9kb1xyXG5cdHBhc3RlQXNVcmlMaW5rKHBhc3RlVHlwZT86c3RyaW5nKVxyXG5cdHtcclxuXHRcdGxldCBlZGl0b3IgPSB0aGlzLmdldEVkaXRvcigpO1xyXG5cdFx0aWYgKGVkaXRvciA9PSBudWxsKVxyXG5cdFx0e1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGNsaXBib2FyZFRleHQgPSBjbGlwYm9hcmQucmVhZFRleHQoJ2NsaXBib2FyZCcpO1xyXG5cdFx0aWYgKCFjbGlwYm9hcmRUZXh0KVxyXG5cdFx0e1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0Y2xpcGJvYXJkVGV4dCA9IHRoaXMuY2xlYW51cFRleHQoY2xpcGJvYXJkVGV4dCk7XHJcblxyXG5cdFx0Ly8gUGFzdGUgdGhlIHRleHQgYXMgdXN1YWwgaWYgaXQncyBub3QgZmlsZSBwYXRoXHJcblx0XHRpZiAoY2xpcGJvYXJkVGV4dC5zdGFydHNXaXRoKCdmaWxlOicpIHx8ICF0aGlzLmhhc1NsYXNoZXMoY2xpcGJvYXJkVGV4dCkpXHJcblx0XHR7XHJcblx0XHRcdGVkaXRvci5yZXBsYWNlU2VsZWN0aW9uKGNsaXBib2FyZFRleHQsICdhcm91bmQnKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBuZXR3b3JrIHBhdGggJ1xcXFxwYXRoJ1xyXG5cdFx0aWYgKGNsaXBib2FyZFRleHQuc3RhcnRzV2l0aCgnXFxcXFxcXFwnKSlcclxuXHRcdHtcclxuXHRcdFx0bGV0IGVuZHNXaXRoU2xhc2ggPVxyXG5cdFx0XHRcdGNsaXBib2FyZFRleHQuZW5kc1dpdGgoJ1xcXFwnKSB8fCBjbGlwYm9hcmRUZXh0LmVuZHNXaXRoKCcvJyk7XHJcblx0XHRcdC8vIFVSTCB0aHJvd3MgZXJyb3Igb24gaW52YWxpZCB1cmxcclxuXHRcdFx0dHJ5XHJcblx0XHRcdHtcclxuXHRcdFx0XHRsZXQgdXJsID0gbmV3IFVSTChjbGlwYm9hcmRUZXh0KTtcclxuXHJcblx0XHRcdFx0bGV0IGxpbmsgPSB1cmwuaHJlZi5yZXBsYWNlKCdmaWxlOi8vJywgJ2ZpbGU6Ly8vJTVDJTVDJyk7XHJcblx0XHRcdFx0aWYgKGxpbmsuZW5kc1dpdGgoJy8nKSAmJiAhZW5kc1dpdGhTbGFzaClcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRsaW5rID0gbGluay5zbGljZSgwLCAtMSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy84Mzc2NTI1L2dldC12YWx1ZS1vZi1hLXN0cmluZy1hZnRlci1sYXN0LXNsYXNoLWluLWphdmFzY3JpcHRcclxuXHRcdFx0XHQvLyBOZWVkIHRvIHVzZSB1cmwuaHJlZiBjYXVzZSBpdCBub3JtYWxpemVzIHRoZSBzbGFzaCB0eXBlIChcXC8pXHJcblx0XHRcdFx0Ly8gSGFuZGxlcyB0cmFpbGluZyBzbGFzaFxyXG5cdFx0XHRcdGxldCBsYXN0VXJsU2VnbWVudCA9IC9bXi9dKiQvLmV4ZWModXJsLmhyZWYuZW5kc1dpdGgoJy8nKSA/IHVybC5ocmVmLnNsaWNlKDAsIC0xKSA6IHVybC5ocmVmKVswXTtcclxuXHRcdFx0XHRcclxuXHJcblx0XHRcdFx0aWYgKHBhc3RlVHlwZSA9PT0gJ2xhc3RTZWdtZW50JylcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRlZGl0b3IucmVwbGFjZVNlbGVjdGlvbih0aGlzLm1ha2VMaW5rKGxhc3RVcmxTZWdtZW50LCBsaW5rKSwgJ2Fyb3VuZCcpO1xyXG5cdFx0XHRcdH0gZWxzZVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdC8vIE5lZWRzIHRvIGFkZCB0d28gJ1xcXFwnICh0aGF0IGlzICdcXFxcXFxcXCcgaW4gY29kZSBiZWNhdXNlIG9mIGVzY2FwaW5nKSBpbiBvcmRlciBmb3IgdGhlIGxpbmsgdGl0bGVcclxuXHRcdFx0XHRcdC8vIHRvIGRpc3BsYXkgdHdvICdcXFxcJyBpbiBwcmV2aWV3IG1vZGVcclxuXHRcdFx0XHRcdGVkaXRvci5yZXBsYWNlU2VsZWN0aW9uKHRoaXMubWFrZUxpbmsoJ1xcXFxcXFxcJyArIGNsaXBib2FyZFRleHQsIGxpbmspLCAnYXJvdW5kJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGNhdGNoIChlKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQvLyBwYXRoIEM6XFxVc2Vyc1xcIG9yIFxcU3lzdGVtXFxldGNcclxuXHRcdGVsc2VcclxuXHRcdHtcclxuXHRcdFx0aWYgKCF0aGlzLmhhc1NsYXNoZXMoY2xpcGJvYXJkVGV4dCkpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIFVSTCB0aHJvd3MgZXJyb3Igb24gaW52YWxpZCB1cmxcclxuXHRcdFx0dHJ5XHJcblx0XHRcdHtcclxuXHRcdFx0XHRsZXQgdXJsID0gbmV3IFVSTCgnZmlsZTovLycgKyBjbGlwYm9hcmRUZXh0KTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHQvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy84Mzc2NTI1L2dldC12YWx1ZS1vZi1hLXN0cmluZy1hZnRlci1sYXN0LXNsYXNoLWluLWphdmFzY3JpcHRcclxuXHRcdFx0XHQvLyBOZWVkIHRvIHVzZSB1cmwuaHJlZiBjYXVzZSBpdCBub3JtYWxpemVzIHRoZSBzbGFzaCB0eXBlIChcXC8pXHJcblx0XHRcdFx0Ly8gSGFuZGxlcyB0cmFpbGluZyBzbGFzaFxyXG5cdFx0XHRcdGxldCBsYXN0VXJsU2VnbWVudCA9IC9bXi9dKiQvLmV4ZWModXJsLmhyZWYuZW5kc1dpdGgoJy8nKSA/IHVybC5ocmVmLnNsaWNlKDAsIC0xKSA6IHVybC5ocmVmKVswXTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHQvLyBVZ2x5LCBidXQgcXVpY2sgc29sdXRpb25cclxuXHRcdFx0XHRpZiAocGFzdGVUeXBlID09PSAnbGFzdFNlZ21lbnQnKSB7XHJcblx0XHRcdFx0XHRlZGl0b3IucmVwbGFjZVNlbGVjdGlvbih0aGlzLm1ha2VMaW5rKGxhc3RVcmxTZWdtZW50LCB1cmwuaHJlZiksICdhcm91bmQnKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0ZWRpdG9yLnJlcGxhY2VTZWxlY3Rpb24odGhpcy5tYWtlTGluayhjbGlwYm9hcmRUZXh0LCB1cmwuaHJlZiksICdhcm91bmQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gY2F0Y2ggKGUpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBEb2VzIHRoZSB0ZXh0IGhhdmUgYW55ICdcXCcgb3IgJy8nP1xyXG5cdCAqL1xyXG5cdGhhc1NsYXNoZXModGV4dDogc3RyaW5nKSB7XHJcblx0XHQvLyBEb2VzIGl0IGhhdmUgYW55ICdcXCcgb3IgJy8nP1xyXG5cdFx0Y29uc3QgcmVnZXhIYXNBbnlTbGFzaCA9IC8uKihbXFxcXFxcL10pLiovZztcclxuXHJcblx0XHRpZiAodHlwZW9mIHRleHQgIT09ICdzdHJpbmcnKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgbWF0Y2hlcyA9IHRleHQubWF0Y2gocmVnZXhIYXNBbnlTbGFzaCk7XHJcblx0XHRyZXR1cm4gISFtYXRjaGVzO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogVHJpbSB3aGl0ZXNwYWNlIGFuZCByZW1vdmUgc3Vycm91bmRpbmcgXCJcclxuXHQgKi9cclxuXHRjbGVhbnVwVGV4dCh0ZXh0OiBzdHJpbmcpIHtcclxuXHRcdGlmICh0eXBlb2YgdGV4dCAhPT0gJ3N0cmluZycpIHtcclxuXHRcdFx0cmV0dXJuICcnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRleHQgPSB0ZXh0LnRyaW0oKTtcclxuXHJcblx0XHQvLyBSZW1vdmUgc3Vycm91bmRpbmcgXCJcclxuXHRcdGlmICh0ZXh0LnN0YXJ0c1dpdGgoJ1wiJykpIHtcclxuXHRcdFx0dGV4dCA9IHRleHQuc3Vic3RyKDEpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRleHQuZW5kc1dpdGgoJ1wiJykpIHtcclxuXHRcdFx0dGV4dCA9IHRleHQuc3Vic3RyKDAsIHRleHQubGVuZ3RoIC0gMSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRleHQ7XHJcblx0fVxyXG5cclxuXHR0b2dnbGVMaW5rKCkge1xyXG5cdFx0bGV0IGVkaXRvciA9IHRoaXMuZ2V0RWRpdG9yKCk7XHJcblx0XHRpZiAoZWRpdG9yID09IG51bGwgfHwgIWVkaXRvci5zb21ldGhpbmdTZWxlY3RlZCgpKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgc2VsZWN0ZWRUZXh0ID0gZWRpdG9yLmdldFNlbGVjdGlvbigpO1xyXG5cdFx0c2VsZWN0ZWRUZXh0ID0gdGhpcy5jbGVhbnVwVGV4dChzZWxlY3RlZFRleHQpO1xyXG5cclxuXHRcdC8vIGZpbGUgdXJsIGZvciBuZXR3b3JrIGxvY2F0aW9uIGZpbGU6Ly9cXFxcbG9jYXRpb25cclxuXHRcdC8vIFdvcmtzIGZvciBib3RoICdmaWxlOi8vL1xcXFxwYXRoJyBhbmQgJ2ZpbGU6Ly8vJTVDJTVDcGF0aCdcclxuXHRcdC8vIE9ic2lkaWFuIHVzZXMgZXNjYXBlIGNoYXJzIGluIGxpbmsgc28gYGZpbGU6Ly8vXFxcXGxvY2F0aW9uYCB3aWxsIHRyeSB0byBvcGVuIGBmaWxlOi8vL1xcbG9jYXRpb24gaW5zdGVhZFxyXG5cdFx0Ly8gQnV0IHRoZSBzZWxlY3RlZCB0ZXh0IHdlIGdldCBjb250YWlucyB0aGUgZnVsbCBzdHJpbmcsIHRodXMgdGhlIHRlc3QgZm9yIGJvdGggMiBhbmQgNCAnXFwnIGNoYXJzXHJcblx0XHRpZiAoXHJcblx0XHRcdHNlbGVjdGVkVGV4dC5zdGFydHNXaXRoKCdmaWxlOi8vL1xcXFxcXFxcJykgfHxcclxuXHRcdFx0c2VsZWN0ZWRUZXh0LnN0YXJ0c1dpdGgoJ2ZpbGU6Ly8vXFxcXFxcXFxcXFxcXFxcXCcpIHx8XHJcblx0XHRcdHNlbGVjdGVkVGV4dC5zdGFydHNXaXRoKCdmaWxlOi8vLyU1QyU1QycpXHJcblx0XHQpIHtcclxuXHRcdFx0Ly8gbm9ybWFsaXplIHRvICdmaWxlOi8vLydcclxuXHRcdFx0c2VsZWN0ZWRUZXh0ID0gc2VsZWN0ZWRUZXh0LnJlcGxhY2UoJ2ZpbGU6Ly8vXFxcXFxcXFxcXFxcXFxcXCcsICdmaWxlOi8vLycpO1xyXG5cdFx0XHRzZWxlY3RlZFRleHQgPSBzZWxlY3RlZFRleHQucmVwbGFjZSgnZmlsZTovLy9cXFxcXFxcXCcsICdmaWxlOi8vLycpO1xyXG5cdFx0XHRzZWxlY3RlZFRleHQgPSBzZWxlY3RlZFRleHQucmVwbGFjZSgnZmlsZTovLy8lNUMlNUMnLCAnZmlsZTovLy8nKTtcclxuXHJcblx0XHRcdGxldCB1cmwgPSBmaWxlVXJpVG9QYXRoKHNlbGVjdGVkVGV4dCk7XHJcblxyXG5cdFx0XHRpZiAodXJsKSB7XHJcblx0XHRcdFx0Ly8gZmlsZVVyaVRvUGF0aCByZXR1cm5zIG9ubHkgc2luZ2xlIGxlYWRpbmcgJ1xcJyBzbyB3ZSBuZWVkIHRvIGFkZCB0aGUgc2Vjb25kIG9uZVxyXG5cdFx0XHRcdGVkaXRvci5yZXBsYWNlU2VsZWN0aW9uKCdcXFxcJyArIHVybCwgJ2Fyb3VuZCcpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQvLyBmaWxlIGxpbmsgZmlsZTovLy9DOi9Vc2Vyc1xyXG5cdFx0ZWxzZSBpZiAoc2VsZWN0ZWRUZXh0LnN0YXJ0c1dpdGgoJ2ZpbGU6Ly8vJykpIHtcclxuXHRcdFx0bGV0IHVybCA9IGZpbGVVcmlUb1BhdGgoc2VsZWN0ZWRUZXh0KTtcclxuXHJcblx0XHRcdGlmICh1cmwpIHtcclxuXHRcdFx0XHRlZGl0b3IucmVwbGFjZVNlbGVjdGlvbih1cmwsICdhcm91bmQnKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly8gbmV0d29yayBwYXRoICdcXFxccGF0aCdcclxuXHRcdGVsc2UgaWYgKHNlbGVjdGVkVGV4dC5zdGFydHNXaXRoKCdcXFxcXFxcXCcpKSB7XHJcblx0XHRcdGxldCBlbmRzV2l0aFNsYXNoID1cclxuXHRcdFx0XHRzZWxlY3RlZFRleHQuZW5kc1dpdGgoJ1xcXFwnKSB8fCBzZWxlY3RlZFRleHQuZW5kc1dpdGgoJy8nKTtcclxuXHRcdFx0Ly8gVVJMIHRocm93cyBlcnJvciBvbiBpbnZhbGlkIHVybFxyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdGxldCB1cmwgPSBuZXcgVVJMKHNlbGVjdGVkVGV4dCk7XHJcblxyXG5cdFx0XHRcdGxldCBsaW5rID0gdXJsLmhyZWYucmVwbGFjZSgnZmlsZTovLycsICdmaWxlOi8vLyU1QyU1QycpO1xyXG5cdFx0XHRcdGlmIChsaW5rLmVuZHNXaXRoKCcvJykgJiYgIWVuZHNXaXRoU2xhc2gpIHtcclxuXHRcdFx0XHRcdGxpbmsgPSBsaW5rLnNsaWNlKDAsIC0xKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGVkaXRvci5yZXBsYWNlU2VsZWN0aW9uKGxpbmssICdhcm91bmQnKTtcclxuXHRcdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly8gcGF0aCBDOlxcVXNlcnNcXCBvciBcXFN5c3RlbVxcZXRjXHJcblx0XHRlbHNlIHtcclxuXHRcdFx0aWYgKCF0aGlzLmhhc1NsYXNoZXMoc2VsZWN0ZWRUZXh0KSkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gVVJMIHRocm93cyBlcnJvciBvbiBpbnZhbGlkIHVybFxyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdGxldCB1cmwgPSBuZXcgVVJMKCdmaWxlOi8vJyArIHNlbGVjdGVkVGV4dCk7XHJcblx0XHRcdFx0ZWRpdG9yLnJlcGxhY2VTZWxlY3Rpb24odXJsLmhyZWYsICdhcm91bmQnKTtcclxuXHRcdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0b251bmxvYWQoKSB7XHJcblx0XHRjb25zb2xlLmxvZygnVW5sb2FkaW5nIHBsdWdpbiBGaWxlUGF0aFRvVXJpLi4uJyk7XHJcblx0fVxyXG59XHJcbiJdLCJuYW1lcyI6WyJwYXRoXzEiLCJNYXJrZG93blZpZXciLCJjbGlwYm9hcmQiLCJmaWxlVXJpVG9QYXRoIiwiUGx1Z2luIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLGFBQWEsR0FBRyxTQUFTLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDbkMsSUFBSSxhQUFhLEdBQUcsTUFBTSxDQUFDLGNBQWM7QUFDekMsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsWUFBWSxLQUFLLElBQUksVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ3BGLFFBQVEsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQzFHLElBQUksT0FBTyxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQy9CLENBQUMsQ0FBQztBQUNGO0FBQ08sU0FBUyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUNoQyxJQUFJLElBQUksT0FBTyxDQUFDLEtBQUssVUFBVSxJQUFJLENBQUMsS0FBSyxJQUFJO0FBQzdDLFFBQVEsTUFBTSxJQUFJLFNBQVMsQ0FBQyxzQkFBc0IsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsK0JBQStCLENBQUMsQ0FBQztBQUNsRyxJQUFJLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDeEIsSUFBSSxTQUFTLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLEVBQUU7QUFDM0MsSUFBSSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsS0FBSyxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3pGLENBQUM7QUF1Q0Q7QUFDTyxTQUFTLFNBQVMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUU7QUFDN0QsSUFBSSxTQUFTLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEtBQUssWUFBWSxDQUFDLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLFVBQVUsT0FBTyxFQUFFLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7QUFDaEgsSUFBSSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDL0QsUUFBUSxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ25HLFFBQVEsU0FBUyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ3RHLFFBQVEsU0FBUyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFO0FBQ3RILFFBQVEsSUFBSSxDQUFDLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLFVBQVUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzlFLEtBQUssQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUNEO0FBQ08sU0FBUyxXQUFXLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRTtBQUMzQyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDckgsSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxNQUFNLEtBQUssVUFBVSxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsV0FBVyxFQUFFLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM3SixJQUFJLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sVUFBVSxDQUFDLEVBQUUsRUFBRSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3RFLElBQUksU0FBUyxJQUFJLENBQUMsRUFBRSxFQUFFO0FBQ3RCLFFBQVEsSUFBSSxDQUFDLEVBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO0FBQ3RFLFFBQVEsT0FBTyxDQUFDLEVBQUUsSUFBSTtBQUN0QixZQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3pLLFlBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNwRCxZQUFZLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6QixnQkFBZ0IsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsTUFBTTtBQUM5QyxnQkFBZ0IsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDO0FBQ3hFLGdCQUFnQixLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO0FBQ2pFLGdCQUFnQixLQUFLLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxTQUFTO0FBQ2pFLGdCQUFnQjtBQUNoQixvQkFBb0IsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRTtBQUNoSSxvQkFBb0IsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRTtBQUMxRyxvQkFBb0IsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxD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
