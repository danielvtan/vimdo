#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ansi_colors_1 = __importDefault(require("ansi-colors"));
var keypress_1 = __importDefault(require("keypress"));
(0, keypress_1.default)(process.stdin);
process.stdout.write("\u001B[?25l");
process.stdin.setRawMode(true);
process.stdin.setEncoding('utf8');
// process.stdout._handle.setBlocking(true);
// let deltaTime = 0
// let lastTime = new Date().getTime();
process.stdin.on('keypress', function (ch, key) {
    // const currentTime = new Date().getTime();
    // deltaTime = currentTime - lastTime;
    // if (deltaTime < 100) return;
    //
    // lastTime = currentTime;
    // console.log("ch", ch)
    // console.log("key", key)
    if (ch && !key)
        key = { sequence: ch };
    UTIL.input(cursor, key).then(function (c) {
        cursor = c;
        cursor.y = Math.min(Math.max(cursor.y, 0), lines.length - 1);
        cursor.x = Math.min(Math.max(cursor.x, 0), lines[cursor.y].title.length + 1);
        ACTION.list(cursor);
    });
});
var selectedFile = process.argv[2];
for (var i = 0; i < process.argv.length; i++) {
    console.log(process.argv[i]);
}
var lines = [];
var gitLines = [];
var tipStyle = ansi_colors_1.default.underline.cyan;
var defaultPreLine = {
    title: "DO", description: "Shortcuts",
    render: ansi_colors_1.default.white("".concat(ansi_colors_1.default.cyanBright("TODO"), " with basic VIM navigation\n").concat(tipStyle("ctrl+s or :w<return>"), " to save \t ").concat(tipStyle("g"), " to switch mode   \n").concat(ansi_colors_1.default.gray("".concat(tipStyle("h/j"), " up/down movement \t\t ").concat(tipStyle("a/A/i/I"), " to enter edit mode\n").concat(tipStyle("ctrl+c"), " to exit \t\t\t ").concat(tipStyle("space"), " to set to done \n").concat(tipStyle("c"), " to 'add .' and 'commit -m' using task as msg\n").concat(tipStyle("r"), " to 'git reset HEAD~1 --soft' to revert recent commit and keeps the changes\n").concat(tipStyle("p"), " to 'push origin <current branch>'\n"))))
};
var gitPreLine = {
    title: "DO", description: "Shortcuts",
    render: ansi_colors_1.default.white("".concat(ansi_colors_1.default.cyanBright("GIT"), " with basic VIM navigation\n").concat(tipStyle("ctrl+s or :w<return>"), " to save \t ").concat(tipStyle("g"), " to switch mode   \n").concat(ansi_colors_1.default.gray("".concat(tipStyle("h/j"), " up/down movement \t\t ").concat(tipStyle("a/A/i/I"), " to enter edit mode\n").concat(tipStyle("ctrl+c"), " to exit \t\t\t ").concat(tipStyle("space"), " to checkout branch     \n"))))
};
var postLine = {
    title: ""
};
var inputs = [];
var cursor = { x: 4, y: lines.length - 1 };
var isEditMode = false;
var UTIL = {
    getPostLine: function () {
        var _a, _b;
        var postLineRender = (_b = (_a = cursor.state) !== null && _a !== void 0 ? _a : __spreadArray([], inputs, true).reverse().join("") + " " + cursor.word) !== null && _b !== void 0 ? _b : "";
        postLine = {
            title: ">",
            render: ansi_colors_1.default.white("> " + postLineRender),
        };
        // is link
        var isLink = new RegExp('^(https?:\\/\\/)?((([-a-z0-9]{1,63}\\.)*?[a-z0-9]([-a-z0-9]{0,253}[a-z0-9])?\\.[a-z]{2,63})|((\\d{1,3}\\.){3}\\d{1,3}))(:\\d{1,5})?((\\/|\\?)((%[0-9a-f]{2})|[-\\w\\+\\.\\?\\/@~#&=])*)?$').test(cursor === null || cursor === void 0 ? void 0 : cursor.word);
        if (isLink) {
            cursor.link = cursor === null || cursor === void 0 ? void 0 : cursor.word;
            postLine.render += " shift+t to open link";
        }
        postLine.render += (cursor === null || cursor === void 0 ? void 0 : cursor.debug) ? " " + ansi_colors_1.default.red(cursor.debug) : "";
        return postLine;
    },
    input: function (cursor_1, _a) { return __awaiter(void 0, [cursor_1, _a], void 0, function (cursor, _b) {
        var currentLine, isExit, isSave, isLinkOpen, isDelete, isTryingToSave, titleArray, input, _c, start, line_1, titleArray, start, targetLine, targetLine, start;
        var _d;
        var name = _b.name, ctrl = _b.ctrl, meta = _b.meta, shift = _b.shift, sequence = _b.sequence;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    inputs.unshift(sequence);
                    cursor.debug = "";
                    if (inputs.length > 3)
                        inputs.pop();
                    currentLine = lines[cursor.y];
                    isExit = ctrl && name == 'c';
                    isSave = ctrl && name == 's';
                    isLinkOpen = shift && name == 't';
                    isDelete = inputs.join("").startsWith("dd");
                    isTryingToSave = inputs.join("").startsWith("\rw:");
                    if (isEditMode) {
                        if (isExit || isSave) {
                            // console.log("exit")
                            lines[cursor.y].render = lines[cursor.y].title;
                            // cursor.x = 0
                            isEditMode = false;
                            return [2 /*return*/, cursor];
                        }
                        if (sequence == "\r") {
                            lines[cursor.y].render = lines[cursor.y].title;
                            cursor.y += 1;
                            ACTION.create(cursor.y);
                            cursor.x = lines[cursor.y].title.length + 1;
                            lines[cursor.y].render = lines[cursor.y].title;
                            return [2 /*return*/, cursor];
                        }
                        titleArray = lines[cursor.y].title.split("");
                        if (name == "backspace") {
                            titleArray.splice(Math.max(cursor.x - 1, 0), 1);
                            cursor.x -= 1;
                        }
                        else {
                            titleArray.splice(cursor.x, 0, sequence);
                            if (titleArray.length == 1)
                                cursor.x += 1;
                            cursor.x += 1;
                        }
                        lines[cursor.y].title = titleArray.join("");
                        lines[cursor.y].render = lines[cursor.y].title;
                        return [2 /*return*/, cursor];
                    }
                    input = sequence;
                    if (isExit) {
                        input = "exit";
                    }
                    if (isSave) {
                        input = "save";
                    }
                    if (isDelete) {
                        inputs = [];
                        input = "delete";
                    }
                    if (isLinkOpen) {
                        input = "link_open";
                    }
                    _c = input;
                    switch (_c) {
                        case "r": return [3 /*break*/, 1];
                        case "p": return [3 /*break*/, 2];
                        case "g": return [3 /*break*/, 3];
                        case "c": return [3 /*break*/, 6];
                        case "x": return [3 /*break*/, 7];
                        case "I": return [3 /*break*/, 8];
                        case "i": return [3 /*break*/, 9];
                        case "A": return [3 /*break*/, 10];
                        case "a": return [3 /*break*/, 11];
                        case " ": return [3 /*break*/, 12];
                        case "\r": return [3 /*break*/, 13];
                        case "h": return [3 /*break*/, 14];
                        case "left": return [3 /*break*/, 14];
                        case "l": return [3 /*break*/, 15];
                        case "right": return [3 /*break*/, 15];
                        case "j": return [3 /*break*/, 16];
                        case "down": return [3 /*break*/, 16];
                        case "k": return [3 /*break*/, 17];
                        case "up": return [3 /*break*/, 17];
                        case "J": return [3 /*break*/, 18];
                        case "K": return [3 /*break*/, 19];
                        case "link_open": return [3 /*break*/, 20];
                        case "delete": return [3 /*break*/, 21];
                        case "save": return [3 /*break*/, 22];
                        case "exit": return [3 /*break*/, 23];
                    }
                    return [3 /*break*/, 24];
                case 1:
                    if (cursor.state == "git")
                        return [2 /*return*/, cursor];
                    cursor.debug = "git reset HEAD~1 --soft";
                    ACTION.list(cursor);
                    require('child_process').exec("git reset HEAD~1 --soft", function (err, stdout, stderr) {
                        require('child_process').exec("git restore --staged .", function (err, stdout, stderr) {
                            cursor.debug = "reverted recent commit";
                            if (err || stderr) {
                                cursor.debug = JSON.stringify(err !== null && err !== void 0 ? err : stderr);
                            }
                            ACTION.list(cursor);
                        });
                    });
                    return [2 /*return*/, cursor];
                case 2:
                    if (cursor.state == "git")
                        return [2 /*return*/, cursor];
                    cursor.debug = "git push origin HEAD";
                    ACTION.list(cursor);
                    require('child_process').exec("git push origin HEAD", function (err, stdout, stderr) {
                        cursor.debug = "pushed";
                        if (err || stderr) {
                            cursor.debug = JSON.stringify(err !== null && err !== void 0 ? err : stderr);
                        }
                        ACTION.list(cursor);
                    });
                    return [2 /*return*/, cursor];
                case 3:
                    if (!(cursor.state == "git")) return [3 /*break*/, 5];
                    gitLines = [];
                    lines = [];
                    cursor.state = "";
                    cursor.y = 0;
                    return [4 /*yield*/, ACTION.read()];
                case 4:
                    _e.sent();
                    ACTION.list(cursor);
                    return [2 /*return*/, cursor];
                case 5:
                    start = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open');
                    require('child_process').exec("git branch --sort=-committerdate", function (err, stdout, stderr) {
                        var branches = stdout.split("\n").filter(function (v) { return v.length != 0; });
                        // cursor.debug = JSON.stringify(branches)
                        cursor.state = "git";
                        cursor.y = 0;
                        gitLines = branches.map(function (branch) {
                            return {
                                title: branch.trim(),
                            };
                        });
                        lines = gitLines;
                        ACTION.list(cursor);
                    });
                    return [2 /*return*/, cursor];
                case 6:
                    if (cursor.state == "git")
                        return [2 /*return*/, cursor];
                    if (lines[cursor.y].done) {
                        cursor.debug = "Auto commit only works on tasks not yet done";
                        return [2 /*return*/, cursor];
                    }
                    line_1 = lines[cursor.y];
                    lines[cursor.y].done = !Boolean(lines[cursor.y].done);
                    ACTION.save(function () {
                        require('child_process').exec("git add .", function (err, stdout, stderr) {
                            cursor.debug = "git commit -m '" + line_1.title + "'";
                            ACTION.list(cursor);
                            require('child_process').exec("git commit -m '" + line_1.title + "'", function (err, stdout, stderr) {
                                if (err || stderr) {
                                    cursor.debug = JSON.stringify(err !== null && err !== void 0 ? err : stderr);
                                    return ACTION.list(cursor);
                                }
                                cursor.debug = "committed";
                                ACTION.list(cursor);
                            });
                        });
                    });
                    return [2 /*return*/, cursor];
                case 7:
                    titleArray = lines[cursor.y].title.split("");
                    titleArray.splice(Math.max(cursor.x, 0), 1);
                    // cursor.x -= 1;
                    lines[cursor.y].title = titleArray.join("");
                    lines[cursor.y].render = lines[cursor.y].title;
                    return [2 /*return*/, cursor];
                case 8:
                    cursor.x = 1;
                    _e.label = 9;
                case 9:
                    // cursor.x -= 1;
                    ACTION.edit();
                    return [2 /*return*/, cursor];
                case 10:
                    cursor.x = ((_d = lines[cursor.y]) === null || _d === void 0 ? void 0 : _d.title.length) + 1;
                    _e.label = 11;
                case 11:
                    cursor.x += 1;
                    ACTION.edit();
                    return [2 /*return*/, cursor];
                case 12:
                    if (cursor.state == "git") {
                        start = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open');
                        require('child_process').exec("git checkout " + cursor.word, function (err, stdout, stderr) {
                            var errorMessage;
                            if (stderr.includes("error: Your local changes")) {
                                errorMessage = "Please commit local changes first";
                                cursor.debug = errorMessage;
                                return ACTION.list(cursor);
                            }
                            require('child_process').exec("git branch --sort=-committerdate", function (err, stdout, stderr) {
                                var branches = stdout.split("\n").filter(function (v) { return v.length != 0; });
                                cursor.debug = errorMessage;
                                cursor.state = "git";
                                gitLines = branches.map(function (branch) {
                                    return {
                                        title: branch.trim(),
                                    };
                                });
                                lines = gitLines;
                                ACTION.list(cursor);
                            });
                        });
                        return [2 /*return*/, cursor];
                    }
                    lines[cursor.y].done = !Boolean(lines[cursor.y].done);
                    return [2 /*return*/, cursor];
                case 13:
                    if (isTryingToSave) {
                        inputs = [];
                        ACTION.save();
                        return [2 /*return*/, cursor];
                    }
                    ACTION.create();
                    ACTION.edit();
                    cursor.y = lines.length - 1;
                    return [2 /*return*/, cursor];
                case 14:
                    cursor.x -= 1;
                    return [2 /*return*/, cursor];
                case 15:
                    cursor.x += 1;
                    return [2 /*return*/, cursor];
                case 16:
                    cursor.y += 1;
                    return [2 /*return*/, cursor];
                case 17:
                    cursor.y -= 1;
                    return [2 /*return*/, cursor];
                case 18:
                    targetLine = lines[cursor.y + 1];
                    lines[cursor.y + 1] = currentLine;
                    lines[cursor.y] = targetLine;
                    cursor.y += 1;
                    return [2 /*return*/, cursor];
                case 19:
                    targetLine = lines[cursor.y - 1];
                    lines[cursor.y - 1] = currentLine;
                    lines[cursor.y] = targetLine;
                    cursor.y -= 1;
                    return [2 /*return*/, cursor];
                case 20:
                    start = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open');
                    require('child_process').exec(start + ' ' + (cursor === null || cursor === void 0 ? void 0 : cursor.link));
                    return [2 /*return*/, cursor];
                case 21:
                    ACTION.delete();
                    return [2 /*return*/, cursor];
                case 22:
                    lines[cursor.y].render = lines[cursor.y].title;
                    isEditMode = false;
                    ACTION.save();
                    return [2 /*return*/, cursor];
                case 23:
                    process.stdout.write("\u001B[?25h");
                    process.exit();
                    _e.label = 24;
                case 24: return [2 /*return*/, cursor];
            }
        });
    }); },
    format: function (_a) {
        var _b, _c, _d, _e;
        var line = _a.line, index = _a.index, _f = _a.cursor, cursor = _f === void 0 ? { x: 0, y: 0 } : _f;
        var isSelected = index === (cursor === null || cursor === void 0 ? void 0 : cursor.y);
        var prefixes = {
            TASK: {
                false: "- [ ] ",
                true: "- [x] "
            }
        };
        var editModeBG = {
            true: ansi_colors_1.default.inverse,
            false: ansi_colors_1.default.bgWhite
        };
        var prefix = (_c = (_b = prefixes[line.type]) === null || _b === void 0 ? void 0 : _b[line.done]) !== null && _c !== void 0 ? _c : "";
        var value = (_d = line.render) !== null && _d !== void 0 ? _d : line.title;
        var lineText = value;
        var render = lineText;
        if (isSelected) {
            var lineTextArray = lineText.split("");
            var selectedX = cursor.x;
            lineTextArray[selectedX] = editModeBG[isEditMode.toString()]((_e = lineTextArray[selectedX]) !== null && _e !== void 0 ? _e : " ");
            var textFromStartToCursor = lineText.substring(0, cursor.x);
            var selectedWordIndex = textFromStartToCursor.replace(/[^ ]/g, "").length;
            var selectedWord = lineText.split(" ")[selectedWordIndex];
            cursor.word = selectedWord;
            render = lineTextArray.join("");
        }
        if (line.done) {
            render = ansi_colors_1.default.strikethrough(render);
        }
        if (isSelected) {
            render = ansi_colors_1.default.cyan(render);
            prefix = ansi_colors_1.default.cyan(prefix);
        }
        else {
            render = ansi_colors_1.default.white.dim(render);
        }
        render = prefix + render;
        return index == undefined ? prefix + value : render;
    }
};
var preTodo = "";
var postTodo = "";
var listHeader = "";
var linkList = {};
var ACTION = {
    read: function () { return __awaiter(void 0, void 0, void 0, function () {
        var fs, directory, fileSearch, fileOptions, data, e_1, listHeaderIndex, startIndex, lastIndex;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fs = require('node:fs/promises');
                    return [4 /*yield*/, fs.readdir("./")];
                case 1:
                    directory = _a.sent();
                    console.log(directory);
                    fileSearch = ["todo.md", "readme.md"];
                    fileOptions = [];
                    directory.map(function (f) {
                        if (fileSearch.includes(f.toLowerCase())) {
                            fileOptions.push(f);
                        }
                    });
                    selectedFile = selectedFile !== null && selectedFile !== void 0 ? selectedFile : fileOptions[0];
                    console.log(selectedFile);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, fs.readFile(selectedFile, { encoding: 'utf8' })];
                case 3:
                    data = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    console.log(e_1);
                    data = "# TODO\n\n- [ ] ";
                    return [3 /*break*/, 5];
                case 5:
                    listHeaderIndex = data.split("\n").findIndex(function (x) { return x.startsWith("- [ ]") || x.startsWith("- [x]"); }) - 1;
                    startIndex = data.split("\n").findIndex(function (x) { return x.startsWith("- [ ]") || x.startsWith("- [x]"); });
                    lastIndex = data.split("\n").findLastIndex(function (x) { return x.startsWith("- [ ]") || x.startsWith("- [x]"); });
                    // Math.max(cursor.x - 2, 0)console.log(startIndex, lastIndex)
                    listHeader = data.split("\n")[listHeaderIndex];
                    preTodo = data.split("\n").slice(0, startIndex).join("\n") + "\n";
                    postTodo = "\n" + data.split("\n").slice(lastIndex + 1, data.split("\n").length - 1).join("\n");
                    data = data.split("\n").slice(startIndex, lastIndex + 1).filter(function (d) { return d; }).map(function (d) {
                        var _a;
                        return {
                            title: (_a = d.split("- [ ] ")[1]) !== null && _a !== void 0 ? _a : d.split("- [x] ")[1],
                            type: "TASK",
                            done: Boolean(d.split("- [x] ")[1])
                        };
                    });
                    lines = lines.concat(data);
                    return [2 /*return*/];
            }
        });
    }); },
    save: function (onSaveCallback) {
        if (onSaveCallback === void 0) { onSaveCallback = undefined; }
        cursor.state = "saving";
        ACTION.list(cursor);
        var fs = require('node:fs');
        var todo = lines.map(function (line) { return UTIL.format({ line: line }); }).join("\n");
        var content = preTodo + todo + postTodo;
        fs.writeFile(selectedFile !== null && selectedFile !== void 0 ? selectedFile : "todo.md", content, function (err) {
            if (err) {
                console.error(err);
            }
            else {
            }
            onSaveCallback && onSaveCallback();
            setTimeout(function () {
                delete cursor.state;
                ACTION.list(cursor);
            }, 500);
        });
    },
    delete: function () {
        lines.splice(cursor.y, 1);
    },
    cancel: function () {
    },
    list: function (cursor) { return __awaiter(void 0, void 0, void 0, function () {
        var preLine;
        return __generator(this, function (_a) {
            console.clear();
            preLine = cursor.state == "git" ? gitPreLine : defaultPreLine;
            process.stdout.write(UTIL.format({ line: preLine }) + "\n" +
                UTIL.format({ line: { render: ansi_colors_1.default.cyan(listHeader) } }) + "\n" +
                lines.map(function (line, index) {
                    return UTIL.format({
                        line: line,
                        index: index,
                        cursor: cursor
                    }) + "\n";
                }).join("")
                + "\n" + UTIL.format({ line: UTIL.getPostLine() }));
            return [2 /*return*/];
        });
    }); },
    edit: function () {
        isEditMode = true;
    },
    create: function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (line) {
            if (line === void 0) { line = lines.length; }
            return __generator(this, function (_a) {
                lines.splice(line, 0, {
                    title: "",
                    type: "TASK",
                    done: false
                });
                return [2 /*return*/];
            });
        });
    }
};
function init() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ACTION.read()];
                case 1:
                    _a.sent();
                    cursor = { x: 0, y: lines.length - 1 };
                    ACTION["list"](cursor);
                    return [2 /*return*/];
            }
        });
    });
}
init();
//# sourceMappingURL=index.js.map