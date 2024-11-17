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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var _1 = require(".");
var ansi_colors_1 = __importDefault(require("ansi-colors"));
var App = /** @class */ (function () {
    function App() {
        this.cursor = { x: 4, y: 0 };
        this.lines = [];
        this.gitLines = [];
        this.preTodo = "";
        this.postTodo = "";
        this.listHeader = "";
        this.isEditMode = false;
        for (var i = 0; i < process.argv.length; i++) {
            console.log(process.argv[i]);
        }
        this.selectedFile = process.argv[2];
        // app.lines.length - 1
    }
    App.prototype.read = function () {
        return __awaiter(this, void 0, void 0, function () {
            var fs, directory, fileSearch, fileOptions, data, e_1, dataSplit, listHeaderIndex, startIndex, lastIndex;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        fs = require('node:fs/promises');
                        return [4 /*yield*/, fs.readdir("./")];
                    case 1:
                        directory = _b.sent();
                        console.log(directory);
                        fileSearch = ["todo.md", "readme.md"];
                        fileOptions = [];
                        directory.map(function (f) {
                            if (fileSearch.includes(f.toLowerCase())) {
                                fileOptions.push(f);
                            }
                        });
                        this.selectedFile = (_a = this.selectedFile) !== null && _a !== void 0 ? _a : fileOptions[0];
                        console.log(this.selectedFile);
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fs.readFile(this.selectedFile, { encoding: 'utf8' })];
                    case 3:
                        data = _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _b.sent();
                        console.log(e_1);
                        data = "# TODO\n\n- [ ] ";
                        return [3 /*break*/, 5];
                    case 5:
                        dataSplit = data.split("\n");
                        listHeaderIndex = dataSplit.findIndex(function (x) { return x.startsWith("- [ ]") || x.startsWith("- [x]"); }) - 1;
                        startIndex = dataSplit.findIndex(function (x) { return x.startsWith("- [ ]") || x.startsWith("- [x]"); });
                        lastIndex = dataSplit.findIndex(function (x, index) { return index >= startIndex && !x.startsWith("- [ ]") && !x.startsWith("- [x]"); }) - 1;
                        this.listHeader = dataSplit[listHeaderIndex];
                        this.preTodo = dataSplit.slice(0, startIndex).join("\n") + "\n";
                        this.postTodo = "\n" + dataSplit.slice(lastIndex + 1, dataSplit.length - 1).join("\n");
                        data = dataSplit.slice(startIndex, lastIndex + 1).filter(function (d) { return d; }).map(function (d) {
                            var _a;
                            return {
                                title: (_a = d.split("- [ ] ")[1]) !== null && _a !== void 0 ? _a : d.split("- [x] ")[1],
                                type: "TASK",
                                done: Boolean(d.split("- [x] ")[1])
                            };
                        });
                        this.lines = this.lines.concat(data);
                        this.cursor.x = 0;
                        this.cursor.y = this.lines.length - 1;
                        return [2 /*return*/];
                }
            });
        });
    };
    App.prototype.save = function (onSaveCallback) {
        var _this = this;
        var _a;
        if (onSaveCallback === void 0) { onSaveCallback = undefined; }
        this.cursor.state = "saving";
        this.render(this.cursor);
        var fs = require('node:fs');
        var todo = this.lines.map(function (line) { return _1.UTIL.format({ line: line }); }).join("\n");
        var content = this.preTodo + todo + this.postTodo;
        fs.writeFile((_a = this.selectedFile) !== null && _a !== void 0 ? _a : "todo.md", content, function (err) {
            if (err) {
                console.error(err);
            }
            else {
            }
            onSaveCallback && onSaveCallback();
            setTimeout(function () {
                delete _this.cursor.state;
                _this.render(_this.cursor);
            }, 500);
        });
    };
    App.prototype.delete = function () {
        this.lines.splice(this.cursor.y, 1);
    };
    App.prototype.cancel = function () {
    };
    App.prototype.render = function (cursor) {
        return __awaiter(this, void 0, void 0, function () {
            var preLine;
            return __generator(this, function (_a) {
                console.clear();
                preLine = cursor.state == "git" ? _1.gitPreLine : _1.defaultPreLine;
                process.stdout.write(_1.UTIL.format({ line: preLine }) + "\n" +
                    _1.UTIL.format({ line: { render: ansi_colors_1.default.cyan(this.listHeader) } }) + "\n" +
                    this.lines.map(function (line, index) {
                        return _1.UTIL.format({
                            line: line,
                            index: index,
                            cursor: cursor
                        }) + "\n";
                    }).join("")
                    + "\n" + _1.UTIL.format({ line: _1.UTIL.getPostLine() }));
                return [2 /*return*/];
            });
        });
    };
    App.prototype.edit = function () {
        this.isEditMode = true;
    };
    App.prototype.create = function () {
        return __awaiter(this, arguments, void 0, function (line) {
            if (line === void 0) { line = this.lines.length; }
            return __generator(this, function (_a) {
                this.lines.splice(line, 0, {
                    title: "",
                    type: "TASK",
                    done: false
                });
                return [2 /*return*/];
            });
        });
    };
    return App;
}());
exports.app = new App();
//# sourceMappingURL=app.js.map