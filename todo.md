# VIMDO with basic vim
a basic cli tool to help manage project todo lists in markdown format

![VIMDO screenshot](https://raw.githubusercontent.com/danielvtan/vimdo/main/screenshots/screenshot.png)


# Current features
- can read checklist in markdown files
- insert checklist updates in the markdown file
- simulates basic vim commands

# How to use
install
```
npm install -g vimdo
````
to run, go to the specific project folder
```
vimdo
````
running vimdo without optional file argument will try to look for readme.md and todo.md files (respectively).
if both files are not present, vimdo will start in draft mode and will create a todo.md file on save
to select specific .md file, add the filename as optional argument
```
vimdo filename.md
```

# TODO features
- [x] get folder
- [x] add args to add ability to select which md to use
- [x] check if folder has readme.md or todo.md
- [x] vim: move task up and down (shift+j/k)
- [x] display markdown list heading as tasks list header
- [x] link https://github.com/danielvtan/vimdo/issues/1 should display with underline and redirect using shift+t shortcut
- [x] git: add git shortcuts
- [x] git: add shortcut to checkout
- [x] git: add shortcut to commit using task
- [x] git: use done task as commit message
- [x] git: save file first before add/commit event
- [x] set cursor.y pos to 0 when mode switching
- [x] change help nav to git when in git mode
- [x] git: log successful commit on c shortcut
- [x] git: set p as shortcut to push code in current branch
- [x] git: set r to reset back to previous commit
- [x] git: set r will also restore all staged files
- [x] git: update r shortcut message
- [x] release version 1.1.0
- [x] git: limit branch list to latest 10
- [x] code clean up
- [ ] display markdown title has project name
- [ ] fix bug where you cannnot create a task on first setup
- [ ] display filename as file name
- [ ] if there is no file ask to create file
- [ ] add pomodoro option. ex. tasks with timer
- [ ] add option for multiline tasks  when pressing enter twice
- [ ] add option to create sub task when pressing tab
- [ ] add set default option
- [ ] add ability to run terminal commands
- [ ] add .config file for shortcuts
- [ ] add progress view
- [ ] support multiple lists
- [ ] move task to other lists (ex. backlog, todo, done)
- [ ] ability to split task to different lists
- [ ] ux: shortcut to get all //TODO: in current folder
- [ ] vim: move by start of word (w/b)
- [ ] vim: delete from cursor to end of word (d+w)
- [ ] sync: to a web app
- [ ] sync: to a mobile app
