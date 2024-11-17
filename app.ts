import { UTIL, defaultPreLine, gitPreLine } from ".";
import c from 'ansi-colors';
import { Cursor, Line } from "./types";



class App {

  cursor: Cursor = { x: 4, y: 0 };
  lines: Line[] = [];
  gitLines: Line[] = [];
  selectedFile: string;
  preTodo: string = "";
  postTodo: string = "";
  listHeader: string = "";
  isEditMode = false;
  constructor() {
    for (var i = 0; i < process.argv.length; i++) {
      console.log(process.argv[i]);
    }
    this.selectedFile = process.argv[2];
    // app.lines.length - 1
  }
  async read() {
    // let selectedFile = this.selectedFile;
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
    this.selectedFile = this.selectedFile ?? fileOptions[0];

    console.log(this.selectedFile)
    let data: any;
    try {
      data = await fs.readFile(this.selectedFile, { encoding: 'utf8' });
    } catch (e) {
      console.log(e);
      data = "# TODO\n\n- [ ] ";
    }
    const listHeaderIndex = data.split("\n").findIndex(x => x.startsWith("- [ ]") || x.startsWith("- [x]")) - 1;
    const startIndex = data.split("\n").findIndex(x => x.startsWith("- [ ]") || x.startsWith("- [x]"))
    const lastIndex = data.split("\n").findLastIndex(x => x.startsWith("- [ ]") || x.startsWith("- [x]"))
    // Math.max(cursor.x - 2, 0)console.log(startIndex, lastIndex)
    this.listHeader = data.split("\n")[listHeaderIndex];
    this.preTodo = data.split("\n").slice(0, startIndex).join("\n") + "\n";
    this.postTodo = "\n" + data.split("\n").slice(lastIndex + 1, data.split("\n").length - 1).join("\n");
    data = data.split("\n").slice(startIndex, lastIndex + 1).filter(d => d).map(d => {
      return {
        title: d.split("- [ ] ")[1] ?? d.split("- [x] ")[1],
        type: "TASK",
        done: Boolean(d.split("- [x] ")[1])
      }
    })
    this.lines = this.lines.concat(data);
    this.cursor.x = 0
    this.cursor.y = this.lines.length - 1;
  }
  save(onSaveCallback = undefined) {
    this.cursor.state = "saving"

    this.render(this.cursor);
    const fs = require('node:fs');
    const todo = this.lines.map(line => UTIL.format({ line })).join("\n");

    const content = this.preTodo + todo + this.postTodo;
    fs.writeFile(this.selectedFile ?? "todo.md", content, (err: any) => {
      if (err) {
        console.error(err);
      } else {
      }

      onSaveCallback && onSaveCallback();

      setTimeout(() => {
        delete this.cursor.state
        this.render(this.cursor);
      }, 500)
    });
  }
  delete() {
    this.lines.splice(this.cursor.y, 1)
  }
  cancel() {
  }
  async render(cursor: Cursor) {
    console.clear();
    // process.stdout.write('\x1Bc')
    // for (let index = 0; index < lines.length + 1; index++) {
    //   process.stdout.readableDidRead(0, -1);
    //   process.stdout.clearLine();
    // }

    const preLine: Line = cursor.state == "git" ? gitPreLine : defaultPreLine;
    process.stdout.write(
      UTIL.format({ line: preLine }) + "\n" +

      UTIL.format({ line: { render: c.cyan(this.listHeader) } }) + "\n" +
      this.lines.map((line, index) => {
        return UTIL.format({
          line,
          index,
          cursor
        }) + "\n"

      }).join("")
      + "\n" + UTIL.format({ line: UTIL.getPostLine() })
    );
  }
  edit() {
    this.isEditMode = true;
  }
  async create(line = this.lines.length) {
    this.lines.splice(line, 0, {
      title: "",
      type: "TASK",
      done: false
    })
  }
}


export const app = new App();
