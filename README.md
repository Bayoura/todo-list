# To Do List

![Screenshot](/src/images/todo_screenshot.png)

- [Live Demo](https://bayoura.github.io/todo-list/)

## What I learned

- The buttons to add, edit or delete new projects or tasks are not very accessible on their own. For those who depend on screen-readers, I put an aria-label to make sure the purpose of those buttons is clear to everyone. I also added tool-tips, so the user can hover over the button and get clarification on what it does.
- How to make nice tool tips: https://www.youtube.com/watch?v=ujlpzTyJp-M
- fontawesome is very convenient, but it can be tricky to get it to work. It took me a while to figure out how to use it with webpack.
- I used the dayjs library, which facilitated working with dates a lot.
- Note: a child element's z-index is limited to the stacking context of its parent. More: https://www.freecodecamp.org/news/4-reasons-your-z-index-isnt-working-and-how-to-fix-it-coder-coder-6bc05f103e6c/
- You can use submit buttons outside of a form! Put a form attribute in the submit button which refers to the id of the form: https://davidwalsh.name/submit-button-outside-form
- I wanted to truncate long inputs (project and task titles). I achieved this with a very simple JS conditional statement. Afterwards I learned that this is also possible with CSS, but I was already satisfied with my solution.
- If you have multiple radio button selections, take care to give them different names, so when you try to get the value of the checked button, you will actually get the correct one!
- `focus()` is a very nice method!

## Thoughts for improvement

- Make projects draggable, so the user can sort them how they see fit → https://www.youtube.com/watch?v=jfYWwQrtzzY
- Each task has a projectId, which signifies the index of the project they belong to. It works very well in most cases, but the problem is that it isn't a trustworthy identifier. If you delete a project and create a new one in its place, then it will have the same projectId, even though it's a completely different project. In some specific cases this can lead to undesirable results (e.g. if you complete a task, then delete the task's origin project, and then undo the completion, the task will be moved to whatever project has the index of the old project, if there is any.)

 