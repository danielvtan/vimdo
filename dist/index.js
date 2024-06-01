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
process.stdin.on('keypress', function (ch, key) {
    // console.log("ch", ch)
    // console.log("key", key)
    if (ch && !key)
        key = { sequence: ch };
    cursor = UTIL.input(cursor, key);
    cursor.y = Math.min(Math.max(cursor.y, 0), lines.length - 1);
    cursor.x = Math.min(Math.max(cursor.x, 0), lines[cursor.y].title.length + 1);
    ACTION.list(cursor);
});
var selectedFile = process.argv[2];
for (var i = 0; i < process.argv.length; i++) {
    console.log(process.argv[i]);
}
var lines = [];
var preLine = {
    title: "DO", description: "Shortcuts",
    render: ansi_colors_1.default.white("".concat(ansi_colors_1.default.cyanBright("TASKY"), " with basic VIM navigation\n").concat(ansi_colors_1.default.gray("".concat(ansi_colors_1.default.underline("h/j"), " up/down movement \t\t| ").concat(ansi_colors_1.default.underline.cyan("space"), " to complete task\n").concat(ansi_colors_1.default.underline("a/A/i/I"), " to enter edit mode \t| ").concat(ansi_colors_1.default.underline("ctrl+c"), " to exit\n").concat(ansi_colors_1.default.underline("ctrl+s or :w<return>"), " to save\n"))))
};
var postLine = {
    title: ""
};
var inputs = [];
var cursor = { x: 4, y: lines.length - 1 };
var isEditMode = false;
var UTIL = {
    input: function (cursor, _a) {
        var _b;
        var name = _a.name, ctrl = _a.ctrl, meta = _a.meta, shift = _a.shift, sequence = _a.sequence;
        inputs.unshift(sequence);
        if (inputs.length > 3)
            inputs.pop();
        // console.log({ name, ctrl, meta, shift, sequence }, inputs.join(""))
        var isExit = ctrl && name == 'c';
        var isSave = ctrl && name == 's';
        var isDelete = inputs.join("").startsWith("dd");
        var isTryingToSave = inputs.join("").startsWith("\rw:");
        if (isEditMode) {
            if (isExit || isSave) {
                // console.log("exit")
                lines[cursor.y].render = lines[cursor.y].title;
                // cursor.x = 0
                isEditMode = false;
                return cursor;
            }
            if (sequence == "\r") {
                lines[cursor.y].render = lines[cursor.y].title;
                cursor.y += 1;
                ACTION.create(cursor.y);
                cursor.x = lines[cursor.y].title.length + 1;
                lines[cursor.y].render = lines[cursor.y].title;
                return cursor;
            }
            var titleArray = lines[cursor.y].title.split("");
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
            return cursor;
        }
        var input = sequence;
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
        postLine = {
            title: ">",
            render: ansi_colors_1.default.white("> " + __spreadArray([], inputs, true).reverse().join("")),
        };
        switch (input) {
            case "x":
                var titleArray = lines[cursor.y].title.split("");
                titleArray.splice(Math.max(cursor.x, 0), 1);
                // cursor.x -= 1;
                lines[cursor.y].title = titleArray.join("");
                lines[cursor.y].render = lines[cursor.y].title;
                return cursor;
            case "I":
                cursor.x = 1;
            case "i":
                // cursor.x -= 1;
                ACTION.edit();
                return cursor;
            case "A":
                cursor.x = ((_b = lines[cursor.y]) === null || _b === void 0 ? void 0 : _b.title.length) + 1;
            case "a":
                cursor.x += 1;
                ACTION.edit();
                return cursor;
            case " ":
                lines[cursor.y].done = !Boolean(lines[cursor.y].done);
                return cursor;
            case "\r":
                if (isTryingToSave) {
                    inputs = [];
                    ACTION.save();
                    return cursor;
                }
                ACTION.create();
                ACTION.edit();
                cursor.y = lines.length - 1;
                return cursor;
            case "h":
            case "left":
                cursor.x -= 1;
                return cursor;
            case "l":
            case "right":
                cursor.x += 1;
                return cursor;
            case "j":
            case "down":
                cursor.y += 1;
                return cursor;
            case "k":
            case "up":
                cursor.y -= 1;
                return cursor;
            case "delete":
                ACTION.delete();
                return cursor;
            case "save":
                lines[cursor.y].render = lines[cursor.y].title;
                isEditMode = false;
                ACTION.save();
                return cursor;
            case "exit":
                process.stdout.write("\u001B[?25h");
                process.exit();
            default:
                return cursor;
        }
    },
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
        var render;
        if (isSelected) {
            var lineTextArray = lineText.split("");
            // if (!isEditMode) {
            var selectedX = cursor.x;
            // if (cursor?.x == 0) {
            //   selectedX = 3
            // }
            // if (cursor?.x > 0) {
            //   selectedX = cursor.x + 5;
            // }
            lineTextArray[selectedX] = editModeBG[isEditMode.toString()]((_e = lineTextArray[selectedX]) !== null && _e !== void 0 ? _e : " ");
            // }
            render = ansi_colors_1.default.cyan(lineTextArray.join(""));
            prefix = ansi_colors_1.default.cyan(prefix);
        }
        else {
            render = ansi_colors_1.default.white.dim(lineText);
        }
        if (line.done) {
            render = ansi_colors_1.default.strikethrough(render);
        }
        render = prefix + render;
        return index == undefined ? prefix + value : render;
    }
};
var preTodo = "";
var postTodo = "";
var ACTION = {
    read: function () { return __awaiter(void 0, void 0, void 0, function () {
        var fs, directory, fileSearch, fileOptions, data, e_1, startIndex, lastIndex;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fs = require('node:fs/promises');
                    return [4 /*yield*/, fs.readdir("./")];
                case 1:
                    directory = _b.sent();
                    // console.log(directory);
                    if (!selectedFile) {
                        fileSearch = ["todo.md", "readme.md"];
                        fileOptions = [];
                        directory.map(function (f) {
                            if (fileSearch.includes(f.toLowerCase())) {
                                fileOptions.push(f);
                            }
                        });
                        selectedFile = (_a = fileOptions[0]) !== null && _a !== void 0 ? _a : selectedFile;
                    }
                    console.log(selectedFile);
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, fs.readFile(selectedFile, { encoding: 'utf8' })];
                case 3:
                    data = _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _b.sent();
                    console.log(e_1);
                    data = "# TODO\n\n- [ ] ";
                    return [3 /*break*/, 5];
                case 5:
                    startIndex = data.split("\n").findIndex(function (x) { return x.startsWith("- [ ]") || x.startsWith("- [x]"); });
                    lastIndex = data.split("\n").findLastIndex(function (x) { return x.startsWith("- [ ]") || x.startsWith("- [x]"); });
                    // Math.max(cursor.x - 2, 0)console.log(startIndex, lastIndex)
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
    save: function () {
        postLine = {
            title: "Saving...",
            render: ansi_colors_1.default.white("Saving..."),
        };
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
            setTimeout(function () {
                postLine = {
                    title: "",
                };
                ACTION.list(cursor);
            }, 100);
        });
    },
    delete: function () {
        lines.splice(cursor.y, 1);
    },
    cancel: function () {
    },
    list: function (cursor) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.clear();
            // process.stdout.write('\x1Bc')
            // for (let index = 0; index < lines.length + 1; index++) {
            //   process.stdout.readableDidRead(0, -1);
            //   process.stdout.clearLine();
            // }
            process.stdout.write(UTIL.format({ line: preLine }) + "\n" +
                lines.map(function (line, index) {
                    return UTIL.format({
                        line: line,
                        index: index,
                        cursor: cursor
                    }) + "\n";
                }).join("")
                + "\n" + UTIL.format({ line: postLine }));
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