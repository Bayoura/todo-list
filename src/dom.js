import dayjs from 'dayjs';
import factories from './factories.js';
import addHandlers from './handlers.js';
import taskEvents from './task-events.js';

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
            taskButton.addEventListener('click', toggleModal);
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
            const checkIcon = document.createElement('span');
            checkIcon.ariaLabel = 'click to check/uncheck task';
            checkIcon.setAttribute('data-id', i);
            checkIcon.addEventListener('click', (e) => taskEvents.changeCompletionStatus(e.target));

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
            infoIcon.addEventListener('click', e => renderTaskDetails(e.target));
            infoIcon.ariaLabel = 'task details';
            
            const editIcon = document.createElement('span');
            editIcon.classList.add(
                'fa-solid',
                'fa-pen-to-square',
                'icon'
            );
            editIcon.setAttribute('taskEdit', '');
            editIcon.setAttribute('data-id', i);
            editIcon.addEventListener('click', e => taskEvents.editTask(e.target));
            editIcon.ariaLabel = 'edit task';

            const deleteIcon = document.createElement('span');
            deleteIcon.classList.add(
                'fa-solid',
                'fa-trash-can',
                'icon'
            );
            deleteIcon.setAttribute('taskDelete', '');
            deleteIcon.setAttribute('data-id', i);
            deleteIcon.addEventListener('click', e => taskEvents.deleteTask(e.target));
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

        // create info modal
        const content_div = document.getElementById('content');
        const infoContainer = document.createElement('div');
        const titleHeading = document.createElement('h2');
        const descriptionPara = document.createElement('p');
        const dueDatePara = document.createElement('p');
        const completionDatePara = document.createElement('p');
        const priorityPara = document.createElement('p');

        titleHeading.textContent = clickedTask.title;
        descriptionPara.textContent = clickedTask.description; 
        dueDatePara.textContent = dayjs(clickedTask.dueDate).format('ll');
        completionDatePara.textContent = dayjs(clickedTask.completionDate).format('ll');
        priorityPara.textContent = clickedTask.priority;

        infoContainer.append(titleHeading, descriptionPara, dueDatePara, priorityPara);
        content_div.append(infoContainer);
        

    }
    
    function toggleModal() {
        const taskForm_form = document.querySelector('[data-taskModalForm]');
        const modal_div = document.querySelector('[data-modal]');
        const overlay_div = document.querySelector('[data-overlay]');
        taskForm_form.reset();
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
        toggleModal,
        displaySortOptions,
        displayProjectForm,
        toggleSidebar
    };
})();

export default dom;