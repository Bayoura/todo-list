import dayjs from 'dayjs';
import factories from './factories.js';
import addHandlers from './handlers.js';

const dom = (() => {

    function renderProjects() {
        const projectList_ul = document.querySelector('[data-projectList]');
        projectList_ul.textContent = '';

        // i starts at 6 bc the projects with lower ids are the default ones
        for (let i = 6; i < factories.projectList.length; i++) {
            // li
            const listItem = document.createElement('li');
            listItem.tabIndex = 0;
            listItem.setAttribute('data-sidebarTab', '');
            listItem.setAttribute('data-id', i);
            listItem.textContent = factories.projectList[i].title;
            listItem.addEventListener('click', e => {
                addHandlers.chooseProject(e)
            });
            projectList_ul.appendChild(listItem);
            // div and icon spans
            const iconsDiv = document.createElement('div');
            const editIcon = document.createElement('span');
            editIcon.classList.add(
                'fa-solid',
                'fa-pen-to-square',
                'icon'
            );
            editIcon.setAttribute('projectEdit', '');
            editIcon.ariaLabel = 'edit project';
            const deleteIcon = document.createElement('span');
            deleteIcon.classList.add(
                'fa-solid',
                'fa-trash-can',
                'icon'
            );
            deleteIcon.setAttribute('projectDelete', '');
            deleteIcon.ariaLabel = 'delete project';
            iconsDiv.append(editIcon, deleteIcon);
            listItem.appendChild(iconsDiv);
        }
    }
    
    function renderHeader(currentProject, projectId) {
        const taskCount_span = document.querySelector('[data-taskCount]');
        const projectHeading_h2 = document.querySelector('[data-projectHeading]');
        const addTaskButton_div = document.querySelector('[data-btnDiv]');
        
        addTaskButton_div.textContent = '';
        // h2
        projectHeading_h2.textContent = currentProject.title;
        // task count
        taskCount_span.textContent = currentProject.tasks.length;

        if (projectId >= 5) {
            const taskButton = document.createElement('button');
            taskButton.ariaLabel = 'add new task';
            taskButton.type = 'button';
            taskButton.classList.add('add-button');
            taskButton.addEventListener('click', displayModal);
            const toolTip = document.createElement('span');
            toolTip.textContent = 'Add new task';
            toolTip.classList.add('tool-tip');
            addTaskButton_div.append(taskButton,toolTip);
        } else if (projectId === '5') {
            //notes
            // notes count
            // button to add notes, also special modal??
        }
        
    }

    function formatDate(date) {
        // ✅ Format a date to YYYY-MM-DD (or any other format)
        function padTo2Digits(num) {
            return num.toString().padStart(2, '0');   
        }
        return [    
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),   
        ].join('-');    
    }
 
    function determineTasks(currentProject, projectId) {
        const taskList_ul = document.querySelector('[data-taskList]');
        taskList_ul.textContent = '';
        const today = formatDate(new Date());
        const allTasks = addHandlers.getAllTasks();
        currentProject.tasks = [];

        switch (projectId) {
            // all
            case '0':
                currentProject.tasks = addHandlers.getAllTasks();
                renderTasks(currentProject);
                break;
            // today
            case '1':
                let dueToday = [];
                for (let i = 0; i < allTasks.length; i++) {
                    let dueDate = formatDate(allTasks[i].date);
                    if (dueDate == today) {
                        dueToday.push(allTasks[i]);
                    }
                }
                currentProject.tasks = dueToday;
                renderTasks(currentProject);
                break;
            // week
            case '2':
                let weekOfYear = require('dayjs/plugin/weekOfYear');
                dayjs.extend(weekOfYear);
                require('dayjs/locale/de');
                dayjs.locale('de');
                
                let dueWeek = [];
                for (let i = 0; i < allTasks.length; i++) {
                    let dueDate = formatDate(allTasks[i].date);
                    if (dayjs(today).week() == dayjs(dueDate).week()) {
                        dueWeek.push(allTasks[i]);
                    }
                }
                currentProject.tasks = dueWeek;
                renderTasks(currentProject);
                break;
            // important
            case '3':
                let mostImportant = [];
                for (let i = 0; i < allTasks.length; i++) {
                    if (allTasks[i].priority === 'very-high') mostImportant.push(allTasks[i]);
                }
                currentProject.tasks = mostImportant;
                renderTasks(currentProject);
                break;
            // completed
            case '4':
               let completedTasks = [];
               for (let i = 0; i < allTasks.length; i++) {
                   if (allTasks[i].completed === true) completedTasks.push(allTasks[i]);
               } 
               currentProject.tasks = completedTasks;
               renderTasks(currentProject);
               break;
            // notes
            case '5':
                renderNotes();
                break;
            
        }    
    }

    function renderTasks(currentProject) {
        // color the list items according to the priority!
        const taskList_ul = document.querySelector('[data-taskList]');
        taskList_ul.textContent = '';
        for (let i = 0; i < currentProject.tasks.length; i++) {
            // li
            const listItem = document.createElement('li');
            listItem.tabIndex = 0;
            listItem.classList.add('task');
            listItem.setAttribute('data-id', i);
            taskList_ul.appendChild(listItem);
            // icon span
            const uncheckedIcon = document.createElement('span');
            uncheckedIcon.classList.add(
                'fa-regular',
                'fa-circle',
                'icon',
                'not-checked'
            );
            uncheckedIcon.ariaLabel = 'click to complete task';
            uncheckedIcon.setAttribute('data-id', i);
            // div container for task details
            const taskDetails = document.createElement('div');
            taskDetails.classList.add('task-details');
            listItem.append(uncheckedIcon, taskDetails);
            // title div
            const taskTitle = document.createElement('div');
            taskTitle.textContent = currentProject.tasks[i].title;
            // due date div
            const dateDiv = document.createElement('div');
            const openingBracket = document.createElement('span');
            const closingBracket = document.createElement('span');
            const dueDate = document.createElement('span');
            openingBracket.textContent = '[Due: ';
            closingBracket.textContent = ']';
            dueDate.textContent = formatDate(currentProject.tasks[i].date);
            dateDiv.append(openingBracket, dueDate, closingBracket);
            // task options div
            const taskOptionsDiv = document.createElement('div');
            taskOptionsDiv.classList.add('task-options');
            taskDetails.append(taskTitle, dateDiv, taskOptionsDiv);
            // icon spans
            const infoIcon = document.createElement('span');
            infoIcon.classList.add(
                'fa-solid',
                'fa-circle-info',
                'icon'
            );
            infoIcon.setAttribute('taskInfo', '');
            infoIcon.setAttribute('data-id', i);
            infoIcon.addEventListener('click', () => deleteTask());
            infoIcon.ariaLabel = 'task details';
            
            const editIcon = document.createElement('span');
            editIcon.classList.add(
                'fa-solid',
                'fa-pen-to-square',
                'icon'
            );
            editIcon.setAttribute('taskEdit', '');
            editIcon.setAttribute('data-id', i);
            editIcon.addEventListener('click', () => console.log('openEditModal()'));
            editIcon.ariaLabel = 'edit task';

            const deleteIcon = document.createElement('span');
            deleteIcon.classList.add(
                'fa-solid',
                'fa-trash-can',
                'icon'
            );
            deleteIcon.setAttribute('taskDelete', '');
            deleteIcon.setAttribute('data-id', i);
            deleteIcon.addEventListener('click', (e) => deleteTask(e.target));
            deleteIcon.ariaLabel = 'delete task';

            taskOptionsDiv.append(infoIcon, editIcon, deleteIcon);
        }
    }

    function renderNotes() {
        console.log('notes');
    }

    // die tasks arrays von dem currentProject und dem originProject stimmen nicht überein, es wird nur im originProject gelöscht
    function deleteTask(clicked) {
        const currentProject = factories.projectList[addHandlers.determineCurrentProjectId()];
        const clickedTask = currentProject.tasks[clicked.dataset.id];
        const originProject = factories.projectList[clickedTask.projectId];
        console.log(originProject)
        for (let i = 0; i < originProject.tasks.length; i++) {
            if (originProject.tasks[i].title == clickedTask.title) {
                originProject.tasks.splice(i, 1);
                console.log(originProject)
                renderTasks(currentProject)
                renderHeader(currentProject, addHandlers.determineCurrentProjectId())
            }

        }
        console.log();
    }
    
    function displayModal() {
        const modal_div = document.querySelector('[data-modal]');
        const overlay_div = document.querySelector('[data-overlay]');
        modal_div.classList.toggle('closed');
        overlay_div.classList.toggle('closed');
    }

    function displaySortOptions() {
        const sortOptions_div = document.querySelector('[data-sortOptions]');
        const sortOverlay_div = document.querySelector('[data-sortOverlay]');
        sortOptions_div.classList.toggle('show');
        sortOverlay_div.classList.toggle('closed');
    }

    function displayProjectForm() {
        const newProject_form = document.querySelector('[data-newProjectForm]');
        const projectTitle_input = document.querySelector('[data-projectTitleInput]');
        projectTitle_input.value = '';
        newProject_form.classList.toggle('closed');
    }

    function toggleSidebar() {
        const sidebar_nav = document.querySelector('[data-sidebar]');
        const main_element = document.querySelector('[data-main]');
    
        sidebar_nav.classList.toggle('hidden');
        main_element.classList.toggle('full-page');   
    }
    
    return {
        renderTasks,
        renderProjects,
        renderHeader,
        determineTasks,
        displayModal,
        displaySortOptions,
        displayProjectForm,
        toggleSidebar
    };
})();

export default dom;