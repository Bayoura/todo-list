import dayjs from 'dayjs';
import factories from './factories.js';
import addHandlers from './handlers.js';
import taskEvents from './task-events.js';

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

            const editDiv = document.createElement('div');
            editDiv.setAttribute('data-tooltip', 'Rename');
            editDiv.classList.add('tool-tip');
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
            editDiv.append(editIcon);

            const deleteDiv = document.createElement('div');
            deleteDiv.setAttribute('data-tooltip', 'Delete');
            deleteDiv.classList.add('tool-tip');
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
            deleteDiv.append(deleteIcon);

            iconsDiv.append(editDiv, deleteDiv);
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
        
        // add button
        const toolTipDiv = document.createElement('div');
        toolTipDiv.classList.add('tool-tip');
        const button = document.createElement('button');
        button.type = 'button';
        button.classList.add(
            'fa-solid',
            'fa-circle-plus',
            'icon'
        );
        toolTipDiv.append(button);

        if (projectId > 5) {
            button.ariaLabel = 'add new task';
            button.setAttribute('data-addTaskBtn', '');
            toolTipDiv.setAttribute('data-tooltip', 'Add new task');
            addTaskButton_div.append(toolTipDiv);
        } else if (projectId === '5') {
            button.ariaLabel = 'add new note';
            button.setAttribute('data-addNoteBtn', '');
            toolTipDiv.setAttribute('data-tooltip', 'Add new note');
            addTaskButton_div.append(toolTipDiv);
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
            taskTitle.classList.add('task-title')
            // date span
            const date = document.createElement('span');
            date.classList.add('date-span');
            if (currentProject.title === 'Completed Tasks') {
                date.textContent = 'Completed: ' + dayjs(currentProject.tasks[i].completionDate).format('ll');
            } else {
                date.textContent = dayjs(currentProject.tasks[i].dueDate).format('ll');
            }
            // task buttons div
            const dateStarButtonContainer = document.createElement('div');
            const starButtonContainer = document.createElement('div');
            const taskOptionsDiv = document.createElement('div');
            dateStarButtonContainer.classList.add('date-star-btn-wrap');
            starButtonContainer.classList.add('star-btn-wrap');
            taskOptionsDiv.classList.add('task-buttons');
            
            
            if (currentProject.tasks[i].dueDate !== '') {     
                dateStarButtonContainer.append(date, starButtonContainer);         
            } else {
                dateStarButtonContainer.append(starButtonContainer);
            }
            starButtonContainer.append(addStarIcons(currentProject.tasks[i]), taskOptionsDiv);
            taskDetails.append(taskTitle, dateStarButtonContainer);

            // icon buttons (inside of taskOptionsDiv)
            const infoDiv = document.createElement('div');
            infoDiv.setAttribute('data-tooltip', 'Details');
            infoDiv.classList.add('tool-tip');
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
            infoDiv.append(infoIcon);
            
            const editDiv = document.createElement('div');
            editDiv.setAttribute('data-tooltip', 'Edit');
            editDiv.classList.add('tool-tip');
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
            editDiv.append(editIcon);
           
            const moveDiv = document.createElement('div');
            moveDiv.setAttribute('data-tooltip', 'Move');
            moveDiv.classList.add('tool-tip');
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
            moveDiv.append(moveIcon);
           
            const deleteDiv = document.createElement('div');
            deleteDiv.setAttribute('data-tooltip', 'Delete');
            deleteDiv.classList.add('tool-tip');
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
            deleteDiv.append(deleteIcon);

            if (currentProject.title === 'Completed Tasks') {
                taskOptionsDiv.append(infoDiv, editDiv, deleteDiv);
            } else {
                taskOptionsDiv.append(infoDiv, editDiv, moveDiv, deleteDiv);
            }
        }
        addHandlers.updateTaskIndex();
    }

    function addStarIcons(task) {
        // priority div
        const priorityDiv = document.createElement('div');
        const starSpan1 = document.createElement('span');
        starSpan1.classList.add(
            "fa-solid",
            "fa-star",
            "icon"
        );
        priorityDiv.append(starSpan1);

        // depending on which priority, the note will get more star icons
        if (task.priority === 'medium') {
            const starSpan2 = document.createElement('span');
            starSpan2.classList.add(
                "fa-solid",
                "fa-star",
                "icon"
            );
            priorityDiv.append(starSpan2)
        } else if (task.priority === 'high') {
            const starSpan2 = document.createElement('span');
            starSpan2.classList.add(
                "fa-solid",
                "fa-star", 
                "icon"
            );
            const starSpan3 = document.createElement('span');
            starSpan3.classList.add(
                "fa-solid",
                "fa-star",
                "icon"
            );
            priorityDiv.append(starSpan2, starSpan3);
        } else if (task.priority === 'very-high') {
            const starSpan2 = document.createElement('span');
            starSpan2.classList.add(
                "fa-solid",
                "fa-star",
                "icon"
            );
            const starSpan3 = document.createElement('span');
            starSpan3.classList.add(
                "fa-solid",
                "fa-star",
                "icon"
            );
            const starSpan4 = document.createElement('span');
            starSpan4.classList.add(
                "fa-solid",
                "fa-star",
                "icon"
            );
            priorityDiv.append(starSpan2, starSpan3, starSpan4);
        }

        return priorityDiv;
    }

    function renderNotes() {
        taskEvents.sortTasks();

        const currentProject = factories.projectList[5];
        const noteList_ul = document.querySelector('[data-taskList]');
        noteList_ul.textContent = '';
        noteList_ul.classList.add('note-list')

        const grid1 = document.createElement('li');
        grid1.classList.add('grid');
        const grid2 = document.createElement('li');
        grid2.classList.add('grid');
        const grid3 = document.createElement('li');
        grid3.classList.add('grid');
        noteList_ul.append(grid1, grid2, grid3); 

        for (let i = 0; i < currentProject.tasks.length; i++) {

            // note container
            const noteContainer = document.createElement('div');
            noteContainer.tabIndex = "0";
            noteContainer.classList.add('note');

            // text paragraph
            const para = document.createElement('p');
            para.textContent = currentProject.tasks[i].description;

            // date paragraph
            const date = document.createElement('p');
            date.textContent = 'Created: ' + dayjs(currentProject.tasks[i].creationDate).format('ll');

            // icon buttons
            const iconsDiv = document.createElement('div');
            iconsDiv.classList.add('note-icons-wrap');

            const editDiv = document.createElement('div');
            editDiv.setAttribute('data-tooltip', 'Edit');
            editDiv.classList.add('tool-tip');
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
            editDiv.append(editIcon);
           
            const deleteDiv = document.createElement('div');
            deleteDiv.setAttribute('data-tooltip', 'Delete');
            deleteDiv.classList.add('tool-tip');
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
            deleteDiv.append(deleteIcon);

            iconsDiv.append(editDiv, deleteDiv);

            // details div
            const details = document.createElement('div');
            details.classList.add('note-details');
            details.append(date, iconsDiv);

            noteContainer.append(addStarIcons(currentProject.tasks[i]), para, details);

            if (screen.width > 950) {
                if (i%3 === 0) {
                    grid1.appendChild(noteContainer);
                } else if (i%3 === 1) {
                    grid2.appendChild(noteContainer);
                } else if (i%3 === 2) {
                    grid3.appendChild(noteContainer);
                }
            } else {
                grid1.appendChild(noteContainer);
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
 
        
        const titlePara = document.createElement('p');
        const descriptionPara = document.createElement('p');
        const projectPara = document.createElement('p');
        const creationDatePara = document.createElement('p');
        const dueDatePara = document.createElement('p');
        const completionDatePara = document.createElement('p');
        const priorityPara = document.createElement('p');
        
        const titleSpan = document.createElement('span');
        const descriptionSpan = document.createElement('span');
        const projectSpan = document.createElement('span');
        const creationDateSpan = document.createElement('span');
        const dueDateSpan = document.createElement('span');
        const completionDateSpan = document.createElement('span');
        const prioritySpan = document.createElement('span');
               
        // insert text AFTER the span
        titleSpan.textContent = 'Title: ';
        titlePara.append(titleSpan);
        titleSpan.after(clickedTask.title); 
        infoModalDetails.append(titlePara);

        if (clickedTask.description !== '') {
            descriptionSpan.textContent = 'Description: ';
            descriptionPara.append(descriptionSpan);
            descriptionSpan.after(clickedTask.description);
            infoModalDetails.append(descriptionPara);
        }

        projectSpan.textContent = 'Project: ';
        projectPara.append(projectSpan);
        projectSpan.after(factories.projectList[clickedTask.projectId].title);

        creationDateSpan.textContent = 'Created: ';
        creationDatePara.append(creationDateSpan);
        creationDateSpan.after(dayjs(clickedTask.creationDate).format('ll')); 

        infoModalDetails.append(projectPara, creationDatePara);
       
        if (clickedTask.dueDate !== '') {    
            dueDateSpan.textContent = 'Due: ';       
            dueDatePara.append(dueDateSpan);
            dueDateSpan.after(dayjs(clickedTask.dueDate).format('ll'));
            infoModalDetails.append(dueDatePara);
        } 
        if (clickedTask.completed != false) {
            completionDateSpan.textContent = 'Completed: '; 
            completionDatePara.append(completionDateSpan);
            completionDateSpan.after(dayjs(clickedTask.completionDate).format('ll'));
            infoModalDetails.append(completionDatePara);
        }
        prioritySpan.textContent = 'Priority: ';
        priorityPara.append(prioritySpan);
        let priority = clickedTask.priority;
        if (priority === 'very-high') priority = 'Very high';
        prioritySpan.after(priority[0].toUpperCase() + priority.slice(1).toLowerCase());
        infoModalDetails.append(priorityPara);
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
        document.querySelector('[data-taskTitleInput]').focus();
    }

    function displayCorrectTaskModal(clicked) {
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
        document.querySelector('[data-cancelInfoBtn]').focus();
    }

    function toggleNotesModal() {
        document.querySelector('[data-notesModal]').classList.toggle('closed');
        document.querySelector('[data-notesOverlay]').classList.toggle('closed');
        document.querySelector('[data-noteModalForm]').reset();
        document.querySelector('[data-noteInput]').focus();
    }

    function displayCorrectNoteModal(clicked) {
        if (clicked.hasAttribute('data-addNoteBtn')) {
            document.querySelector('[data-submitNoteBtn]').classList.remove('closed');
            document.querySelector('[data-submitNoteEdit]').classList.add('closed');
        } else if (clicked.hasAttribute('data-noteEdit')) {
            document.querySelector('[data-submitNoteBtn]').classList.add('closed');
            document.querySelector('[data-submitNoteEdit]').classList.remove('closed');
        }
    }

    function displayProjectForm() {
        const newProject_form = document.querySelector('[data-newProjectForm]');
        newProject_form.reset();
        newProject_form.classList.toggle('closed');
        document.querySelector('[data-projectTitleInput]').focus();
    }

    function toggleSidebar() {
        const sidebar_nav = document.querySelector('[data-sidebar]');
        const main_element = document.querySelector('[data-main]');
    
        sidebar_nav.classList.toggle('closed');
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
        displayCorrectTaskModal,
        toggleInfoModal,
        toggleNotesModal,
        displayCorrectNoteModal,
        displayProjectForm,
        toggleSidebar,
        closeMoveSelection
    };
})();

export default dom;