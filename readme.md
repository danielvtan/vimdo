# TASKY with basic vim
a basic cli tool to help manage project todo lists in markdown format

# Current features
- can read checklist in markdown files
- insert checklist updates in the markdown file
- simulates basic vim commands

# Current limitation 
- will not work properly for markdown files with multiple separate checklists

# How to use
install
`npm install -g tasky`
to run, go to the specific project folder
`tasky`
the tasky without optional argument will try to look for todo.md and readme.md files (respectively).
if both files are not present, tasky will start on draft mode and will creat a todo.md file on save
to select specific .md file, add filename as optional argument
`tasky filename.md`


# TODO features
- [x] get folder
- [x] check if folder has readme.md or todo.md
- [x] add args to add ability to select which md to use
- [ ] display markdown heading as tasks list header
- [ ] able to transform issue links (support for bitbucket and github)
- [ ] if there is no file ask to create file
- [ ] add pomodoro option. ex. tasks with timer
- [ ] add option for multiline tasks  when pressing enter twice
- [ ] add option to create sub task when pressing tab
- [ ] add set default option
- [ ] add progress view
- [ ] add git shortcuts
- [ ] vim: move by start of word (w/b)
- [ ] vim: delete from cursor to end of word (d+w)
- [ ] sync to a web app
- [ ] sync to a mobile app
