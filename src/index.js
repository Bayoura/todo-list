import styles from "./styles.css";

addNavEvents();

function addNavEvents() {
    const sidebarTabs = document.querySelectorAll('[data-sidebarTab]');
    sidebarTabs.forEach(tab => tab.addEventListener('click', e => {
        if (e.target.classList.contains('current')) {
            return;
        } else {
            setCurrentTab(e.target);
        }
    }));

}

function setCurrentTab(clickedTab) {
    const sidebarTabs = document.querySelectorAll('[data-sidebarTab]');
    sidebarTabs.forEach(tab => {
        if (tab != clickedTab) tab.classList.remove('current');
    });
    clickedTab.classList.add('current');
}

function createProject() {
    console.log('heya')
}

const submitTask_button = document.querySelector('[data-submitTaskBtn]');
const taskForm_form = document.querySelector('[data-taskModalForm]');
const addTask_button = document.querySelector('[data-addTaskBtn]');
const modal_div = document.querySelector('[data-modal]');

addTask_button.addEventListener('click', () => modal_div.classList.remove('closed'));

document.addEventListener('DOMContentLoaded', () => {    
    submitTask_button.addEventListener('click', e => {    
        e.preventDefault(); //stop form from submitting   

        //check if required fields are filled out
        let checkStatus = taskForm_form.checkValidity();
        taskForm_form.reportValidity();
        if (checkStatus) {
            const title = document.querySelector('[data-titleInput]').value;
            const description = document.querySelector('[data-descriptionInput]').value;
            const date = document.querySelector('[data-dateInput]').value;
            const priorityValue = document.querySelector('input[name=priority]:checked').value;
            taskFactory(title, description, date, priorityValue);
        }
    })    
});

function taskFactory(title, description, date, priority) {
    const task = {};
    task.title = title;
    task.description = description;
    task.date = date;
    task.priority = priority;
    console.log(task);
    return task;
}