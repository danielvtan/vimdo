#!/usr/bin/env node
import c from 'ansi-colors';
import keypress from 'keypress';

keypress(process.stdin);
process.stdout.write("\u001B[?25l");
process.stdin.setRawMode(true);
process.stdin.setEncoding('utf8');
// process.stdout._handle.setBlocking(true);

// let deltaTime = 0
// let lastTime = new Date().getTime();
process.stdin.on('keypress', function(ch, key) {
  // const currentTime = new Date().getTime();
  // deltaTime = currentTime - lastTime;
  // if (deltaTime < 100) return;
  //
  // lastTime = currentTime;

  // console.log("ch", ch)
  // console.log("key", key)
  if (ch && !key) key = { sequence: ch }

  UTIL.input(cursor, key).then(c => {
    cursor = c;
    cursor.y = Math.min(Math.max(cursor.y, 0), lines.length - 1);
    cursor.x = Math.min(Math.max(cursor.x, 0), lines[cursor.y].title.length + 1);

    ACTION.list(cursor)
  });
});
let selectedFile = process.argv[2];
for (var i = 0; i < process.argv.length; i++) {
  console.log(process.argv[i]);
}
type Line = {
  title?: string;
  render?: string;
  done?: boolean;
  description?: string;
  type?: string;
}
let lines: Line[] = [];
let gitLines: Line[] = [];
const tipStyle = c.underline.cyan;
const defaultPreLine: Line = {
  title: "DO", description: "Shortcuts",
  render: c.white(`${c.cyanBright("TODO")} with basic VIM navigation
${tipStyle("ctrl+s or :w<return>")} to save \t ${tipStyle("g")} to switch mode   
${c.gray(`${tipStyle("h/j")} up/down movement \t\t ${tipStyle("a/A/i/I")} to enter edit mode
${tipStyle("ctrl+c")} to exit \t\t\t ${tipStyle("space")} to set to done 
${tipStyle("c")} to 'add .' and 'commit -m' using task as msg
${tipStyle("r")} to 'git reset HEAD~1 --soft' to revert recent commit and keeps the changes
${tipStyle("p")} to 'push origin <current branch>'
`)
    }`)
}

const gitPreLine: Line = {
  title: "DO", description: "Shortcuts",
  render: c.white(`${c.cyanBright("GIT")} with basic VIM navigation
${tipStyle("ctrl+s or :w<return>")} to save \t ${tipStyle("g")} to switch mode   
${c.gray(`${tipStyle("h/j")} up/down movement \t\t ${tipStyle("a/A/i/I")} to enter edit mode
${tipStyle("ctrl+c")} to exit \t\t\t ${tipStyle("space")} to checkout branch     
`)
    }`)
}

let postLine: Line = {
  title: ""
}

type Cursor = {
  x?: number;
  y?: number;
  word?: string;
  link?: string;
  state?: string;
  debug?: string;
}
let inputs = [];
let cursor: Cursor = { x: 4, y: lines.length - 1 };
let isEditMode = false;
var UTIL = {
  getPostLine: () => {

    const postLineRender = cursor.state ?? [...inputs].reverse().join("") + " " + cursor.word ?? "";
    postLine = {
      title: ">",
      render: c.white("> " + postLineRender),
    }
    // is link
    const isLink = new RegExp('^(https?:\\/\\/)?((([-a-z0-9]{1,63}\\.)*?[a-z0-9]([-a-z0-9]{0,253}[a-z0-9])?\\.[a-z]{2,63})|((\\d{1,3}\\.){3}\\d{1,3}))(:\\d{1,5})?((\\/|\\?)((%[0-9a-f]{2})|[-\\w\\+\\.\\?\\/@~#&=])*)?$').test(cursor?.word);
    if (isLink) {
      cursor.link = cursor?.word;
      postLine.render += " shift+t to open link"
    }

    postLine.render += cursor?.debug ? " " + c.red(cursor.debug) : "";

    return postLine;
  },
  input: async (cursor, { name, ctrl, meta, shift, sequence }) => {
    inputs.unshift(sequence);

    cursor.debug = "";

    if (inputs.length > 3) inputs.pop();

    const currentLine = lines[cursor.y];
    // console.log({ name, ctrl, meta, shift, sequence }, inputs.join(""))
    const isExit = ctrl && name == 'c';
    const isSave = ctrl && name == 's';
    const isLinkOpen = shift && name == 't';
    const isDelete = inputs.join("").startsWith("dd");
    const isTryingToSave = inputs.join("").startsWith("\rw:");
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
        cursor.y += 1
        ACTION.create(cursor.y)
        cursor.x = lines[cursor.y].title.length + 1
        lines[cursor.y].render = lines[cursor.y].title;
        return cursor;
      }
      const titleArray = lines[cursor.y].title.split("");
      if (name == "backspace") {
        titleArray.splice(Math.max(cursor.x - 1, 0), 1)
        cursor.x -= 1;
      } else {
        titleArray.splice(cursor.x, 0, sequence)
        if (titleArray.length == 1) cursor.x += 1;
        cursor.x += 1;
      }
      lines[cursor.y].title = titleArray.join("");
      lines[cursor.y].render = lines[cursor.y].title;
      return cursor;
    }
    let input = sequence;
    if (isExit) {
      input = "exit"
    }
    if (isSave) {
      input = "save"
    }
    if (isDelete) {
      inputs = [];
      input = "delete"
    }
    if (isLinkOpen) {
      input = "link_open"
    }
    switch (input) {
      //  
      case "r":
        if (cursor.state == "git") return cursor;
        cursor.debug = "git reset HEAD~1 --soft";
        ACTION.list(cursor);
        require('child_process').exec("git reset HEAD~1 --soft", (err, stdout, stderr) => {
          require('child_process').exec("git restore --staged .", (err, stdout, stderr) => {
            cursor.debug = "reverted recent commit";
            if (err || stderr) {
              cursor.debug = JSON.stringify(err ?? stderr);
            }
            ACTION.list(cursor);
          });
        });
        return cursor;
      case "p":
        if (cursor.state == "git") return cursor;
        cursor.debug = "git push origin HEAD";
        ACTION.list(cursor);
        require('child_process').exec("git push origin HEAD", (err, stdout, stderr) => {
          cursor.debug = "pushed";
          if (err || stderr) {
            cursor.debug = JSON.stringify(err ?? stderr);
          }
          ACTION.list(cursor);
        });
        return cursor;
      case "g":
        if (cursor.state == "git") {
          gitLines = [];
          lines = [];
          cursor.state = ""
          cursor.y = 0;
          await ACTION.read();
          ACTION.list(cursor);
          return cursor;
        }
        var start = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open');
        require('child_process').exec("git branch --sort=-committerdate", (err, stdout, stderr) => {
          const branches = stdout.split("\n").filter(v => v.length != 0);
          // cursor.debug = JSON.stringify(branches)

          cursor.state = "git";
          cursor.y = 0;

          gitLines = branches.map(branch => {
            return {
              title: branch.trim(),
            }
          })
          lines = gitLines;
          ACTION.list(cursor);
        });
        return cursor;
      case "c":
        if (cursor.state == "git") return cursor;
        if (lines[cursor.y].done) {
          cursor.debug = "Auto commit only works on tasks not yet done"
          return cursor;
        }
        const line = lines[cursor.y]
        lines[cursor.y].done = !Boolean(lines[cursor.y].done);
        ACTION.save(() => {
          require('child_process').exec("git add .", (err, stdout, stderr) => {
            cursor.debug = "git commit -m '" + line.title + "'";
            ACTION.list(cursor);
            require('child_process').exec("git commit -m '" + line.title + "'", (err, stdout, stderr) => {
              if (err || stderr) {
                cursor.debug = JSON.stringify(err ?? stderr);
                return ACTION.list(cursor);
              }
              cursor.debug = "committed";
              ACTION.list(cursor);
            });
          });
        });
        return cursor;
      case "x":

        const titleArray = lines[cursor.y].title.split("");
        titleArray.splice(Math.max(cursor.x, 0), 1)
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
        cursor.x = lines[cursor.y]?.title.length + 1;
      case "a":
        cursor.x += 1;
        ACTION.edit();
        return cursor;
      case " ":
        if (cursor.state == "git") {
          var start = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open');
          require('child_process').exec("git checkout " + cursor.word, (err, stdout, stderr) => {

            let errorMessage
            if (stderr.includes("error: Your local changes")) {
              errorMessage = "Please commit local changes first";
              cursor.debug = errorMessage
              return ACTION.list(cursor);
            }
            require('child_process').exec("git branch --sort=-committerdate", (err, stdout, stderr) => {
              const branches = stdout.split("\n").filter(v => v.length != 0);
              cursor.debug = errorMessage

              cursor.state = "git";

              gitLines = branches.map(branch => {
                return {
                  title: branch.trim(),
                }
              })
              lines = gitLines;
              ACTION.list(cursor);
            });

          })
          return cursor;
        }
        lines[cursor.y].done = !Boolean(lines[cursor.y].done);
        return cursor;
      case "\r":
        if (isTryingToSave) {
          inputs = [];
          ACTION.save();
          return cursor;
        }
        ACTION.create()
        ACTION.edit();
        cursor.y = lines.length - 1
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
      case "J":
        var targetLine = lines[cursor.y + 1];
        lines[cursor.y + 1] = currentLine;
        lines[cursor.y] = targetLine;
        cursor.y += 1;
        return cursor;
      case "K":
        var targetLine = lines[cursor.y - 1];
        lines[cursor.y - 1] = currentLine;
        lines[cursor.y] = targetLine;
        cursor.y -= 1;
        return cursor;
      case "link_open":
        var start = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open');
        require('child_process').exec(start + ' ' + cursor?.link);
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
  format: ({ line, index, cursor = { x: 0, y: 0 } }: { line?: Line, index?: number, cursor?: Cursor }) => {
    const isSelected = index === cursor?.y;
    let prefixes = {
      TASK: {
        false: "- [ ] ",
        true: "- [x] "
      }
    }
    let editModeBG = {
      true: c.inverse,
      false: c.bgWhite
    }
    let prefix = prefixes[line.type]?.[line.done] ?? "";

    let value = line.render ?? line.title;
    let lineText = value;

    let render: string = lineText;
    if (isSelected) {
      let lineTextArray = lineText.split("");
      let selectedX = cursor.x;
      lineTextArray[selectedX] = editModeBG[isEditMode.toString()](lineTextArray[selectedX] ?? " ");

      const textFromStartToCursor = lineText.substring(0, cursor.x);
      const selectedWordIndex = textFromStartToCursor.replace(/[^ ]/g, "").length
      const selectedWord = lineText.split(" ")[selectedWordIndex];
      cursor.word = selectedWord;

      render = lineTextArray.join("")
    }
    if (line.done) {
      render = c.strikethrough(render);
    }


    if (isSelected) {
      render = c.cyan(render)
      prefix = c.cyan(prefix)
    } else {
      render = c.white.dim(render)
    }
    render = prefix + render;
    return index == undefined ? prefix + value : render;
  }
}

let preTodo = "";
let postTodo = "";
let listHeader = "";
const linkList = {};
var ACTION = {
  read: async () => {
    const fs = require('node:fs/promises');
    let directory = await fs.readdir("./");
    console.log(directory);


    var fileSearch = ["todo.md", "readme.md"];
    var fileOptions = [];
    directory.map((f: string) => {
      if (fileSearch.includes(f.toLowerCase())) {
        fileOptions.push(f);
      }
    });
    selectedFile = selectedFile ?? fileOptions[0];
    console.log(selectedFile)
    let data: any;
    try {
      data = await fs.readFile(selectedFile, { encoding: 'utf8' });
    } catch (e) {
      console.log(e);
      data = "# TODO\n\n- [ ] ";
    }
    const listHeaderIndex = data.split("\n").findIndex(x => x.startsWith("- [ ]") || x.startsWith("- [x]")) - 1;
    const startIndex = data.split("\n").findIndex(x => x.startsWith("- [ ]") || x.startsWith("- [x]"))
    const lastIndex = data.split("\n").findLastIndex(x => x.startsWith("- [ ]") || x.startsWith("- [x]"))
    // Math.max(cursor.x - 2, 0)console.log(startIndex, lastIndex)
    listHeader = data.split("\n")[listHeaderIndex];
    preTodo = data.split("\n").slice(0, startIndex).join("\n") + "\n";
    postTodo = "\n" + data.split("\n").slice(lastIndex + 1, data.split("\n").length - 1).join("\n");
    data = data.split("\n").slice(startIndex, lastIndex + 1).filter(d => d).map(d => {
      return {
        title: d.split("- [ ] ")[1] ?? d.split("- [x] ")[1],
        type: "TASK",
        done: Boolean(d.split("- [x] ")[1])
      }
    })
    lines = lines.concat(data);
  },
  save: (onSaveCallback = undefined) => {
    cursor.state = "saving"

    ACTION.list(cursor);
    const fs = require('node:fs');
    const todo = lines.map(line => UTIL.format({ line })).join("\n");

    const content = preTodo + todo + postTodo;
    fs.writeFile(selectedFile ?? "todo.md", content, (err: any) => {
      if (err) {
        console.error(err);
      } else {
      }

      onSaveCallback && onSaveCallback();

      setTimeout(() => {
        delete cursor.state
        ACTION.list(cursor);
      }, 500)
    });
  },
  delete: () => {
    lines.splice(cursor.y, 1)
  },
  cancel: () => {
  },
  list: async (cursor: Cursor) => {
    console.clear();
    // process.stdout.write('\x1Bc')
    // for (let index = 0; index < lines.length + 1; index++) {
    //   process.stdout.readableDidRead(0, -1);
    //   process.stdout.clearLine();
    // }

    const preLine: Line = cursor.state == "git" ? gitPreLine : defaultPreLine;
    process.stdout.write(
      UTIL.format({ line: preLine }) + "\n" +

      UTIL.format({ line: { render: c.cyan(listHeader) } }) + "\n" +
      lines.map((line, index) => {
        return UTIL.format({
          line,
          index,
          cursor
        }) + "\n"

      }).join("")
      + "\n" + UTIL.format({ line: UTIL.getPostLine() })
    );
  },
  edit: () => {
    isEditMode = true;
  },
  create: async (line = lines.length) => {
    lines.splice(line, 0, {
      title: "",
      type: "TASK",
      done: false
    })
  }
}

async function init() {
  await ACTION.read();
  cursor = { x: 0, y: lines.length - 1 };

  ACTION["list"](cursor)
  // setInterval(() => {
  //
  //   ACTION[action ?? "list"](cursor)
  // }, 1000)
}


init()
