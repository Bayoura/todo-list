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
                projectTitle.textContent = factories.projectList[i].title.slice(0, 20) + '...';
            } else {
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
        
        const button = document.createElement('button');
        button.type = 'button';
        button.classList.add('add-button');
        const toolTip = document.createElement('span');
        toolTip.classList.add('tool-tip');

        if (projectId > 5) {
            button.ariaLabel = 'add new task';
            button.setAttribute('data-addTaskBtn', '');
            toolTip.textContent = 'Add new task';
            addTaskButton_div.append(button,toolTip);
        } else if (projectId === '5') {
            button.ariaLabel = 'add new note';
            button.setAttribute('data-addNoteBtn', '');
            toolTip.textContent = 'Add new note';
            addTaskButton_div.append(button,toolTip);
        }    
    }
 
    function renderTasks(currentProject) {
        let localizedFormat = require('dayjs/plugin/localizedFormat');
        dayjs.extend(localizedFormat);
        
        taskEvents.sortTasks();

        // color the list items according to the priority!
        const taskList_ul = document.querySelector('[data-taskList]');
        taskList_ul.classList.remove('note-list');
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
            // icon buttons
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
           
            const moveIcon = document.createElement('button');
            moveIcon.classList.add(
                'fa-solid',
                'fa-circle-right',
                'icon',
                'move-icon'
            );
            moveIcon.type = 'button';
            moveIcon.setAttribute('data-taskMove', '');
            moveIcon.setAttribute('data-id', i);
            moveIcon.ariaLabel = 'move task to another project';
           
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

            taskOptionsDiv.append(infoIcon, editIcon, moveIcon, deleteIcon);
        }
        addHandlers.updateTaskIndex();
    }

    function renderNotes() {
        // taskEvents.sortTasks()
        console.log('HHHHHHH')
        const noteList_ul = document.querySelector('[data-taskList]');
        noteList_ul.textContent = '';
        noteList_ul.classList.add('note-list')
        const currentProject = factories.projectList[5];

        const grid1 = document.createElement('li');
        grid1.classList.add('grid');
        const grid2 = document.createElement('li');
        grid2.classList.add('grid');
        const grid3 = document.createElement('li');
        grid3.classList.add('grid');
   
        noteList_ul.append(grid1, grid2, grid3); 

        for (let i = 0; i < currentProject.tasks.length; i++) {
            const divContainer = document.createElement('div');

            // date paragraph
            const date = document.createElement('p');
            date.textContent = dayjs(currentProject.tasks[i].creationDate).format('ll');

            // icon buttons
            const iconsDiv = document.createElement('div');

            const editIcon = document.createElement('button');
            editIcon.classList.add(
                'fa-solid',
                'fa-pen-to-square',
                'icon'
            );
            editIcon.type = 'button';
            editIcon.setAttribute('data-noteEdit', '');
            editIcon.setAttribute('data-id', i);
            editIcon.ariaLabel = 'edit note';
           
            const deleteIcon = document.createElement('button');
            deleteIcon.classList.add(
                'fa-solid',
                'fa-trash-can',
                'icon'
            );
            deleteIcon.type = 'button';
            deleteIcon.setAttribute('data-taskDelete', '');
            deleteIcon.setAttribute('data-id', i);
            deleteIcon.ariaLabel = 'delete note';

            iconsDiv.append(editIcon, deleteIcon);

            // text paragraph
            const para = document.createElement('p');
            para.textContent = currentProject.tasks[i].description;
            para.setAttribute('spellcheck', 'false');

            divContainer.append(date, iconsDiv, para)
          
            if (i%3 === 0) {
                grid1.appendChild(divContainer);
            } else if (i%3 === 1) {
                grid2.appendChild(divContainer);
            } else if (i%3 === 2) {
                grid3.appendChild(divContainer);
            }
        }
        addHandlers.updateTaskIndex();
    }

    function renderTaskDetails(clicked) {
        const currentProjectId = addHandlers.determineCurrentProjectId();
        const currentProject = factories.projectList[currentProjectId];
        const clickedTask = currentProject.tasks[clicked.dataset.id];

        const infoModalDetails = document.querySelector('[data-infoModalDetails]');
        infoModalDetails.textContent = '';
 
        const titleHeading = document.querySelector('[data-infoTitle]');
        const descriptionPara = document.createElement('p');
        const projectPara = document.createElement('p');
        const creationDatePara = document.createElement('p');
        const dueDatePara = document.createElement('p');
        const completionDatePara = document.createElement('p');
        const priorityPara = document.createElement('p');
        
        titleHeading.textContent = clickedTask.title;
        descriptionPara.textContent = clickedTask.description; 
        projectPara.textContent = factories.projectList[clickedTask.projectId].title;
        creationDatePara.textContent = 'Created: ' + dayjs(clickedTask.creationDate).format('ll');
        dueDatePara.textContent = 'Due: ' + dayjs(clickedTask.dueDate).format('ll');
        priorityPara.textContent = 'Priority: ' + clickedTask.priority;
        if (clickedTask.completed != false) {
            completionDatePara.textContent = 'Completed: ' + dayjs(clickedTask.completionDate).format('ll');
        }
    
        infoModalDetails.append(descriptionPara, projectPara, creationDatePara, dueDatePara, completionDatePara, priorityPara);
    }

    function renderMoveSelection(clicked) {
        document.querySelector('[data-moveOverlay]').classList.remove('closed');
        
        const moveButtons = document.querySelectorAll('[data-taskMove]');
        moveButtons.forEach(button => button.textContent = '');
        
        const taskId = clicked.dataset.id;
        const currentProject = factories.projectList[addHandlers.determineCurrentProjectId()];
        const moveSelect = document.createElement('select');
        moveSelect.name = 'move';
        moveSelect.setAttribute('data-moveSelection', '');
        moveSelect.classList.add('move-selection');
        const firstOption = document.createElement('option');
        firstOption.value = factories.projectList[currentProject.tasks[taskId].projectId].title;
        firstOption.textContent = factories.projectList[currentProject.tasks[taskId].projectId].title;
        moveSelect.append(firstOption);
            
        for (let i = 6; i < factories.projectList.length; i++) {
            if (i != currentProject.tasks[taskId].projectId) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = factories.projectList[i].title;
                moveSelect.append(option);
            }
        }
        clicked.append(moveSelect);
    }
  
    function closeMoveSelection() {
        document.querySelector('[data-moveOverlay]').classList.add('closed');
        document.querySelector('[data-moveSelection]').classList.add('closed');
    }
    
    function toggleModal() {
        const taskForm_form = document.querySelector('[data-taskModalForm]');
        const modal_div = document.querySelector('[data-modal]');
        const overlay_div = document.querySelector('[data-overlay]');
        taskForm_form.reset();
        modal_div.classList.toggle('closed');
        overlay_div.classList.toggle('closed');
    }

    function displayCorrectModal(clicked) {
        if (clicked.hasAttribute('data-addTaskBtn')) {
            document.querySelector('[data-addProjectHeading]').classList.remove('closed');
            document.querySelector('[data-submitTaskBtn]').classList.remove('closed');
            document.querySelector('[data-editProjectHeading]').classList.add('closed');
            document.querySelector('[data-submitEditBtn]').classList.add('closed');
        } else if (clicked.hasAttribute('data-taskEdit')) {
            document.querySelector('[data-editProjectHeading]').classList.remove('closed');
            document.querySelector('[data-submitEditBtn]').classList.remove('closed');
            document.querySelector('[data-addProjectHeading]').classList.add('closed');
            document.querySelector('[data-submitTaskBtn]').classList.add('closed');
        }
    }

    function toggleInfoModal() {
        const infoModal = document.querySelector('[data-infoModal]');
        const infoOverlay_div = document.querySelector('[data-infoOverlay]');
        infoModal.classList.toggle('closed');
        infoOverlay_div.classList.toggle('closed');
    }

    function toggleNotesModal() {
        document.querySelector('[data-notesModal]').classList.toggle('closed');
        document.querySelector('[data-notesOverlay]').classList.toggle('closed');
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
        renderMoveSelection,
        toggleModal,
        displayCorrectModal,
        toggleInfoModal,
        toggleNotesModal,
        displayProjectForm,
        toggleSidebar,
        closeMoveSelection
    };
})();

export default dom;