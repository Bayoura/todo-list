import dayjs from 'dayjs';
import factories from './factories.js';
import addHandlers from './handlers.js';
import taskEvents from './task-events.js';
import projectEvents from './project-events.js';

const dom = (() => {

    function renderProjects(currentProjectId) {
        const projectList_ul = document.querySelector('[data-projectList]');
        projectList_ul.textContent = '';

        // i starts at 6 bc the projects with lower ids are the default ones
        for (let i = 6; i < factories.projectList.length; i++) {
            // li
            const listItem = document.createElement('li');
            const projectTitle = document.createElement('h3');
            if (currentProjectId == i) {
                listItem.classList.add('current');
                projectTitle.classList.add('current');
            };
            projectTitle.tabIndex = 0;
            projectTitle.setAttribute('data-sidebarTab', '');
            projectTitle.setAttribute('data-id', i);
            if (factories.projectList[i].title.length > 21) {
                console.log(factories.projectList[i].title.length)
                console.log(factories.projectList[i].title.slice(0, 20))
                projectTitle.textContent = factories.projectList[i].title.slice(0, 20) + '...';
            } else {
                console.log(factories.projectList[i].title.length)
                projectTitle.textContent = factories.projectList[i].title;
            }

            listItem.append(projectTitle);
            projectList_ul.appendChild(listItem);
            
            // div and icon buttons
            const iconsDiv = document.createElement('div');
            iconsDiv.classList.add('icons-div')
            const editIcon = document.createElement('button');
            editIcon.classList.add(
                'fa-solid',
                'fa-pen-to-square',
                'icon'
            );
            editIcon.type = 'button';
            editIcon.setAttribute('data-projectRename', '');
            editIcon.setAttribute('data-id', i);
            editIcon.ariaLabel = 'edit project';

            const deleteIcon = document.createElement('button');
            deleteIcon.classList.add(
                'fa-solid',
                'fa-trash-can',
                'icon'
            ); 
            deleteIcon.type = 'button';
            deleteIcon.setAttribute('data-projectDelete', '');
            deleteIcon.setAttribute('data-id', i);
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
            taskButton.setAttribute('data-addTaskBtn', '');
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
 
    function renderTasks(currentProject) {
        let localizedFormat = require('dayjs/plugin/localizedFormat');
        dayjs.extend(localizedFormat);

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
            const checkIcon = document.createElement('button');
            checkIcon.type = 'button';
            checkIcon.ariaLabel = 'click to check/uncheck task';
            checkIcon.setAttribute('data-taskCheck', '');
            checkIcon.setAttribute('data-id', i);

            if (currentProject.tasks[i].completed === true) {
                checkIcon.classList.add(
                    'fa-solid',
                    'fa-circle-check',
                    'icon',
                    'checked'
                ); 
            } else {
                checkIcon.classList.add(
                    'fa-regular',
                    'fa-circle',
                    'icon'
                );    
            }
            // div container for task details
            const taskDetails = document.createElement('div');
            taskDetails.classList.add('task-details');
            listItem.append(checkIcon, taskDetails);
            // title div
            const taskTitle = document.createElement('div');
            taskTitle.textContent = currentProject.tasks[i].title;
            // date div
            const dateDiv = document.createElement('div');
            const openingBracket = document.createElement('span');
            const closingBracket = document.createElement('span');
            const date = document.createElement('span');
            closingBracket.textContent = ']';
            dateDiv.append(openingBracket, date, closingBracket);
            if (currentProject.title === 'Completed Tasks') {
                openingBracket.textContent = '[Completed: ';
                date.textContent = dayjs(currentProject.tasks[i].completionDate).format('ll');
            } else {
                openingBracket.textContent = '[Due: ';
                date.textContent = dayjs(currentProject.tasks[i].dueDate).format('ll');
            }
            // task options div
            const taskOptionsDiv = document.createElement('div');
            taskOptionsDiv.classList.add('task-options');
            if (currentProject.tasks[i].dueDate !== '') {           
                taskDetails.append(taskTitle, dateDiv, taskOptionsDiv);
            } else {
                taskDetails.append(taskTitle, taskOptionsDiv);
            }
            // icon spans
            const infoIcon = document.createElement('button');
            infoIcon.classList.add(
                'fa-solid',
                'fa-circle-info',
                'icon'
            );
            infoIcon.type = 'button';
            infoIcon.setAttribute('data-taskInfo', '');
            infoIcon.setAttribute('data-id', i);
            infoIcon.ariaLabel = 'task details';
            
            const editIcon = document.createElement('button');
            editIcon.classList.add(
                'fa-solid',
                'fa-pen-to-square',
                'icon'
            );
            editIcon.type = 'button';
            editIcon.setAttribute('data-taskEdit', '');
            editIcon.setAttribute('data-id', i);
            editIcon.ariaLabel = 'edit task';

            const deleteIcon = document.createElement('button');
            deleteIcon.classList.add(
                'fa-solid',
                'fa-trash-can',
                'icon'
            );
            deleteIcon.type = 'button';
            deleteIcon.setAttribute('data-taskDelete', '');
            deleteIcon.setAttribute('data-id', i);
            deleteIcon.ariaLabel = 'delete task';

            taskOptionsDiv.append(infoIcon, editIcon, deleteIcon);
        }
        addHandlers.updateTaskIndex();
    }

    function renderNotes() {
        console.log('notes');
    }

    function renderTaskDetails(clicked) {
        const currentProjectId = addHandlers.determineCurrentProjectId();
        const currentProject = factories.projectList[currentProjectId];
        const clickedTask = currentProject.tasks[clicked.dataset.id];
 
        const titleHeading = document.querySelector('[data-infoTitle]');
        const descriptionPara = document.querySelector('[data-infoDescription]');
        const dueDatePara = document.querySelector('[data-infoDueDate]');
        const completionDatePara = document.querySelector('[data-infoCompletionDate]');
        const priorityPara = document.querySelector('[data-infoPriority]');
        
        titleHeading.textContent = clickedTask.title;
        descriptionPara.textContent = clickedTask.description; 
        dueDatePara.textContent = 'Due: ' + dayjs(clickedTask.dueDate).format('ll');
        priorityPara.textContent = clickedTask.priority;
        if (clickedTask.completionDate !== null) {
            completionDatePara.textContent = 'Completed: ' + dayjs(clickedTask.completionDate).format('ll');
        } else {
            return
        }
    }
    
    function toggleModal() {
        const taskForm_form = document.querySelector('[data-taskModalForm]');
        const modal_div = document.querySelector('[data-modal]');
        const overlay_div = document.querySelector('[data-overlay]');
        taskForm_form.reset();
        modal_div.classList.toggle('closed');
        overlay_div.classList.toggle('closed');
    }

    function toggleInfoModal() {
        const infoModal = document.querySelector('[data-infoModal]');
        const infoOverlay_div = document.querySelector('[data-infoOverlay]');
        infoModal.classList.toggle('closed');
        infoOverlay_div.classList.toggle('closed');
    }

    function displaySortOptions() {
        const sortOptions_div = document.querySelector('[data-sortOptions]');
        const sortOverlay_div = document.querySelector('[data-sortOverlay]');
        sortOptions_div.classList.toggle('show');
        sortOverlay_div.classList.toggle('closed');
    }

    function displayProjectForm() {
        const newProject_form = document.querySelector('[data-newProjectForm]');
        newProject_form.reset();
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
        renderNotes,
        renderTaskDetails,
        toggleModal,
        toggleInfoModal,
        displaySortOptions,
        displayProjectForm,
        toggleSidebar
    };
})();

export default dom;