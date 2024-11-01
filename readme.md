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
- [x] link https://github.com/danielvtan/vimdo/issues/1 should display with underscore and redirect using shift+t shortcut
- [ ] display markdown title as project name
- [ ] display filename as file name
- [ ] if there is no file ask to create file
- [ ] add pomodoro option. ex. tasks with timer
- [ ] add option for multiline tasks  when pressing enter twice
- [ ] add option to create sub task when pressing tab
- [ ] add set default option
- [ ] add progress view
- [ ] support multiple lists
- [ ] move task to other lists (ex. backlog, todo, done)
- [ ] ability to split task to different lists
- [ ] ux: shortcut to get all //TODO: in current folder
- [ ] git: add git:w shortcuts
- [ ] git: use done task as commit message
- [ ] vim: move by start of word (w/b)
- [ ] vim: delete from cursor to end of word (d+w)
- [ ] sync: to a web app
- [ ] sync: to a mobile app
