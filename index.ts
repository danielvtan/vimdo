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

  cursor = UTIL.input(cursor, key);
  cursor.y = Math.min(Math.max(cursor.y, 0), lines.length - 1);
  cursor.x = Math.min(Math.max(cursor.x, 0), lines[cursor.y].title.length + 1);

  ACTION.list(cursor)
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
let lines: Line[] = [
];
const preLine: Line = {
  title: "DO", description: "Shortcuts",
  render: c.white(`${c.cyanBright("TODO")} with basic VIM navigation
${c.gray(`${c.underline("h/j")} up/down movement \t\t| ${c.underline.cyan("space")} to complete task
${c.underline("a/A/i/I")} to enter edit mode \t| ${c.underline("ctrl+c")} to exit
${c.underline("ctrl+s or :w<return>")} to save
`)}`)
}
let postLine: Line = {
  title: ""
}

type Cursor = {
  x?: number;
  y?: number;
  word?: string;
  link?: string;
}
let inputs = [];
let cursor: Cursor = { x: 4, y: lines.length - 1 };
let isEditMode = false;
var UTIL = {
  getPostLine: () => {
    postLine = {
      title: ">",
      render: c.white("> " + [...inputs].reverse().join("") + " " + cursor.word ?? ""),
    }
    let selectedLink = "";
    for (const key in linkList) {
      if (cursor?.word == key) {
        selectedLink = linkList[key]
        cursor.link = selectedLink;
      }
    }
    if (selectedLink) {
      postLine.render += " shift+t to open link: " + selectedLink
    }
    return postLine;
  },
  replaceURL: (text: string) => {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
      let urlSplit = url.split("https://")[1].split("/");
      let text = urlSplit[2] + "#" + urlSplit[4];
      linkList[text] = url;
      return text;
    });
  },
  renderURL: (text, linkIndexes) => {
    let textSplit = text.split(" ");
    for (const key in linkIndexes) {
      for (let index = 0; index < linkIndexes[key].length; index++) {
        const pos = linkIndexes[key][index];
        textSplit[pos] = c.blue.underline(textSplit[pos])

      }
    }
    return textSplit.join(" ");
  },
  findURL: (text) => {
    const linkIndexes = {}
    for (const key in linkList) {
      linkIndexes[key] = [];
      text.split(" ").map((word, index) => {
        if (word == key) {
          linkIndexes[key].push(index);
        }
      })
    }
    return linkIndexes;
  },
  input: (cursor, { name, ctrl, meta, shift, sequence }) => {
    inputs.unshift(sequence);

    if (inputs.length > 3) inputs.pop();

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
        var currentLine = lines[cursor.y];
        var targetLine = lines[cursor.y + 1];
        lines[cursor.y + 1] = currentLine;
        lines[cursor.y] = targetLine;
        cursor.y += 1;
        return cursor;
      case "K":
        var currentLine = lines[cursor.y];
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
    let lineText = UTIL.replaceURL(value);
    const linkIndexes = UTIL.findURL(lineText);

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
    render = UTIL.renderURL(render, linkIndexes);


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
  save: () => {
    postLine = {
      title: "Saving...",
      render: c.white("Saving..."),
    }
    ACTION.list(cursor);
    const fs = require('node:fs');
    const todo = lines.map(line => UTIL.format({ line })).join("\n");

    const content = preTodo + todo + postTodo;
    fs.writeFile(selectedFile ?? "todo.md", content, (err: any) => {
      if (err) {
        console.error(err);
      } else {
      }

      setTimeout(() => {
        postLine = {
          title: "",
        }
        ACTION.list(cursor);
      }, 100)
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
