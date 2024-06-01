#!/usr/bin/env node
import c from 'ansi-colors';
import keypress from 'keypress';

keypress(process.stdin);
process.stdout.write("\u001B[?25l");
process.stdin.setRawMode(true);
process.stdin.setEncoding('utf8');
// process.stdout._handle.setBlocking(true);
process.stdin.on('keypress', function(ch, key) {
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
}
let inputs = [];
let cursor: Cursor = { x: 4, y: lines.length - 1 };
let isEditMode = false;
var UTIL = {
  input: (cursor, { name, ctrl, meta, shift, sequence }) => {
    inputs.unshift(sequence);

    if (inputs.length > 3) inputs.pop();

    // console.log({ name, ctrl, meta, shift, sequence }, inputs.join(""))
    const isExit = ctrl && name == 'c';
    const isSave = ctrl && name == 's';
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
    postLine = {
      title: ">",
      render: c.white("> " + [...inputs].reverse().join("")),
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

    let render: string;
    if (isSelected) {
      let lineTextArray = lineText.split("");
      // if (!isEditMode) {
      let selectedX = cursor.x;
      // if (cursor?.x == 0) {
      //   selectedX = 3
      // }
      // if (cursor?.x > 0) {
      //   selectedX = cursor.x + 5;
      // }
      lineTextArray[selectedX] = editModeBG[isEditMode.toString()](lineTextArray[selectedX] ?? " ");
      // }
      render = c.cyan(lineTextArray.join(""))
      prefix = c.cyan(prefix)
    } else {
      render = c.white.dim(lineText)
    }
    if (line.done) {
      render = c.strikethrough(render);
    }
    render = prefix + render;

    return index == undefined ? prefix + value : render;
  }
}

let preTodo = "";
let postTodo = "";
var ACTION = {
  read: async () => {
    const fs = require('node:fs/promises');
    let directory = await fs.readdir("./");
    // console.log(directory);


    if (!selectedFile) {
      var fileSearch = ["todo.md", "readme.md"];
      var fileOptions = [];
      directory.map((f: string) => {
        if (fileSearch.includes(f.toLowerCase())) {
          fileOptions.push(f);
        }
      });
      selectedFile = fileOptions[0] ?? selectedFile;
    }
    console.log(selectedFile)
    let data: any;
    try {
      data = await fs.readFile(selectedFile, { encoding: 'utf8' });
    } catch (e) {
      console.log(e);
      data = "# TODO\n\n- [ ] ";
    }
    const startIndex = data.split("\n").findIndex(x => x.startsWith("- [ ]") || x.startsWith("- [x]"))
    const lastIndex = data.split("\n").findLastIndex(x => x.startsWith("- [ ]") || x.startsWith("- [x]"))
    // Math.max(cursor.x - 2, 0)console.log(startIndex, lastIndex)
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
      lines.map((line, index) => {
        return UTIL.format({
          line,
          index,
          cursor
        }) + "\n"

      }).join("")
      + "\n" + UTIL.format({ line: postLine })
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
