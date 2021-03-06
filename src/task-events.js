import dayjs from 'dayjs';
import dom from './dom.js';
import factories from './factories.js';
import addHandlers from './handlers.js';

const taskEvents = (() => {
    
    let localizedFormat = require('dayjs/plugin/localizedFormat');
    dayjs.extend(localizedFormat);
    let weekOfYear = require('dayjs/plugin/weekOfYear');
    dayjs.extend(weekOfYear);
    require('dayjs/locale/de');
    dayjs.locale('de');
    
    function determineTasks(currentProject, projectId) {

        const taskList_ul = document.querySelector('[data-taskList]');
        taskList_ul.textContent = '';
        const today = dayjs().format('ll');
        const allTasks = addHandlers.getAllTasks();

        switch (projectId) {
            // all
            case '0':
                currentProject.tasks = allTasks;
                dom.renderTasks(currentProject);
                break;
            // today
            case '1':    
                let dueToday = [];
                for (let i = 0; i < allTasks.length; i++) {
                    let dueDate = dayjs(allTasks[i].dueDate).format('ll');
                    if (dueDate == today) {
                        dueToday.push(allTasks[i]);
                    }
                }
                currentProject.tasks = dueToday;
                dom.renderTasks(currentProject);
                break;
            // week
            case '2':
                let dueWeek = [];
                for (let i = 0; i < allTasks.length; i++) {
                    let dueDate = dayjs(allTasks[i].dueDate).format('ll');
                    // see if dates are in the same calendar week
                    if (dayjs(dueDate).week() == dayjs(today).week()) {
                        dueWeek.push(allTasks[i]);
                    }
                }
                currentProject.tasks = dueWeek;
                dom.renderTasks(currentProject);
                break;
            // important
            case '3':
                let mostImportant = [];
                for (let i = 0; i < allTasks.length; i++) {
                    if (allTasks[i].priority === 'very-high') mostImportant.push(allTasks[i]);
                }
                currentProject.tasks = mostImportant;
                dom.renderTasks(currentProject);
                break;
            // completed
            case '4':
               dom.renderTasks(currentProject);
               break;
            // notes
            case '5':
                dom.renderNotes();
                break;
        }    
    }

    function sortTasks() {
        const selectedSort = document.querySelector('[data-select]').value;
        const currentProject = factories.projectList[addHandlers.determineCurrentProjectId()];
        if (selectedSort === 'old') {
            // at the top are the oldest:
            currentProject.tasks.sort((a,b) => new Date(a.creationDate) - new Date(b.creationDate));
        } else if (selectedSort === 'new') {
            // at the top are the newest:
            currentProject.tasks.sort((a,b) => new Date(b.creationDate) - new Date(a.creationDate));
        } else if (selectedSort === 'date') {
            currentProject.tasks.sort((a,b) =>  new Date(a.dueDate) - new Date(b.dueDate));
        } else if (selectedSort === 'priority') {
            let orderedTasks = [];
            orderedTasks = orderedTasks.concat(
            currentProject.tasks.filter(task => task.priority === 'very-high'), 
            currentProject.tasks.filter(task => task.priority === 'high'),
            currentProject.tasks.filter(task => task.priority === 'medium'), 
            currentProject.tasks.filter(task => task.priority === 'low')
            );
            currentProject.tasks = orderedTasks;
        }
    }

    // add a new task
    function submitTask(e) {
        e.preventDefault(); //stop form from submitting   
        
        const taskForm_form = document.querySelector('[data-taskModalForm]');
        let checkStatus = taskForm_form.checkValidity();
        taskForm_form.reportValidity();
        if (checkStatus) {
            const projectId = addHandlers.determineCurrentProjectId();
            const currentProject = factories.projectList[projectId];
            const title = document.querySelector('[data-taskTitleInput]').value;
            const description = document.querySelector('[data-descriptionInput]').value;
            const creationDate = new Date();
            const dueDate = document.querySelector('[data-dateInput]').value;
            const priority = document.querySelector('input[name=priority]:checked').value;
            const newTask = factories.taskFactory(projectId, title, description, creationDate, dueDate, priority);
            
            currentProject.tasks.push(newTask);
            dom.renderTasks(currentProject);
            dom.renderHeader(currentProject, projectId);
            dom.toggleModal();
            factories.saveLocal();
        }
    }

    function changeCompletionStatus(clicked) {
        const currentProject = factories.projectList[addHandlers.determineCurrentProjectId()];
        const currentProjectId = addHandlers.determineCurrentProjectId();
        const clickedTask = currentProject.tasks[clicked.dataset.id];
        const originProject = factories.projectList[clickedTask.projectId];
        
        if (clickedTask.completed === true) {
            
            if (factories.projectList.length < 7) {
                return;
            } else {
                clickedTask.completed = false;
                clickedTask.completionDate = '';
                // remove old classes:
                clicked.removeAttribute('class');
                clicked.classList.add(
                    'fa-regular',
                    'fa-circle',
                    'icon'
                );
                if (originProject === undefined) {
                    factories.projectList[6].tasks.push(clickedTask);
                    clickedTask.projectId = '6';
                } else {
                    originProject.tasks.push(clickedTask);
                }
                setTimeout(() => {
                    factories.projectList[4].tasks.splice(clicked.dataset.id, 1);
                    dom.renderTasks(currentProject);
                    dom.renderHeader(currentProject, currentProjectId)
                    factories.saveLocal();
                }, 200); 
            }    
        } else {
            clickedTask.completed = true;
            clickedTask.completionDate = new Date();
            factories.projectList[4].tasks.push(clickedTask);
            clicked.removeAttribute('class');
            clicked.classList.add(
                'fa-solid',
                'fa-circle-check',
                'icon',
                'checked'
            ); 
            
            setTimeout(() => {
                originProject.tasks.splice(clickedTask.taskId, 1);
                if (currentProjectId < 6) {
                    determineTasks(currentProject, currentProjectId);
                } else {
                    dom.renderTasks(currentProject);
                }
                dom.renderHeader(currentProject, currentProjectId);
                factories.saveLocal();
            }, 200); 
        }
    }
    
    function editTask(clicked) {
        const currentProject = factories.projectList[addHandlers.determineCurrentProjectId()];
        const clickedTask = currentProject.tasks[clicked.dataset.id];

        document.querySelector('[data-taskTitleInput]').value = clickedTask.title;
        document.querySelector('[data-descriptionInput]').value = clickedTask.description;
        document.querySelector('[data-dateInput]').value = clickedTask.dueDate;  
        document.querySelectorAll('input[name=priority]').forEach(input => {
            if (input.value === clickedTask.priority) input.checked = true;
        })
        document.querySelector('[data-submitEditBtn]').onclick = e => submitTaskEdit(e, clickedTask);
    }

    function submitTaskEdit(e, task) {
        e.preventDefault(); 
        const taskForm_form = document.querySelector('[data-taskModalForm]');
        let checkStatus = taskForm_form.checkValidity();
        taskForm_form.reportValidity();
        if (checkStatus) {
            const projectId = addHandlers.determineCurrentProjectId();
            const currentProject = factories.projectList[projectId];
            task.title = document.querySelector('[data-taskTitleInput]').value;
            task.description = document.querySelector('[data-descriptionInput]').value;
            task.dueDate = document.querySelector('[data-dateInput]').value;
            task.priority = document.querySelector('input[name=priority]:checked').value;
            
            dom.renderTasks(currentProject);
            dom.renderHeader(currentProject, projectId);
            dom.toggleModal();
            factories.saveLocal();
        } 
    }

    // this also  deletes notes
    // note: the data-id attribute shows the index of the task in the current list (the default projects, e.g. 'All'),
    // the taskId shows the index of the task in the original task list of the project the tasks belongs to (the user projects)
    function deleteTask(clicked) {
        const currentProject = factories.projectList[addHandlers.determineCurrentProjectId()];
        const currentProjectId = addHandlers.determineCurrentProjectId();
        const clickedTask = currentProject.tasks[clicked.dataset.id];
        const originProject = factories.projectList[clickedTask.projectId];
  
        // special case for completed tasks
        if (currentProjectId === '4') {
            factories.projectList[4].tasks.splice(clickedTask.taskId, 1);
        } else {
            originProject.tasks.splice(clickedTask.taskId, 1);  
        }

        if (currentProjectId < 6) {
            determineTasks(currentProject, currentProjectId);
        } else {
            dom.renderTasks(currentProject);
        }
        dom.renderHeader(currentProject, currentProjectId)
        factories.saveLocal();
    } 
    
    function moveTask(clicked) {
        const selectedProjectId = clicked.value;
        const taskDataId = document.querySelector('[data-moveSelection]').parentElement.dataset.id;       
        const currentProject = factories.projectList[addHandlers.determineCurrentProjectId()];
        const originProject = factories.projectList[currentProject.tasks[taskDataId].projectId];
        const newProject = factories.projectList[selectedProjectId];
        const taskId = currentProject.tasks[taskDataId].taskId;
        const task = originProject.tasks[taskId]
        
        newProject.tasks.push(task);
        originProject.tasks.splice(taskId, 1);
        task.projectId = selectedProjectId;   
        factories.saveLocal();
    }

    // add a new note
    function submitNote(e) {
        e.preventDefault();

        const noteForm_form = document.querySelector('[data-noteModalForm]');
        let checkStatus = noteForm_form.checkValidity();
        noteForm_form.reportValidity();
        if (checkStatus) {
            const projectId = addHandlers.determineCurrentProjectId();
            const currentProject = factories.projectList[projectId];
            const note = document.querySelector('[data-noteInput]').value;
            const creationDate = new Date(); 
            const priority = document.querySelector('input[name=notePriority]:checked').value;
            const newNote = factories.taskFactory(projectId, null, note, creationDate, null, priority);

            currentProject.tasks.push(newNote);
            dom.renderNotes();
            dom.renderHeader(currentProject, projectId);
            dom.toggleNotesModal();
            factories.saveLocal();
        }
    }

    function editNote(clicked) {
        const currentProject = factories.projectList[addHandlers.determineCurrentProjectId()];
        const clickedNote = currentProject.tasks[clicked.dataset.id];

        document.querySelector('[data-noteInput]').value = clickedNote.description;
        document.querySelectorAll('input[name=notePriority]').forEach(input => {
            if (input.value === clickedNote.priority) input.checked = true;
        })
        document.querySelector('[data-submitNoteEdit]').onclick = e => submitNoteEdit(e, clickedNote);
    }

    function submitNoteEdit(e, note) {
        e.preventDefault();
        const notesForm_form = document.querySelector('[data-noteModalForm]');
        let checkStatus = notesForm_form.checkValidity();
        notesForm_form.reportValidity();
        if (checkStatus) {
            note.description = document.querySelector('[data-noteInput]').value;
            note.priority = document.querySelector('input[name=notePriority]:checked').value;
            
            dom.renderNotes();
            dom.renderHeader(factories.projectList[addHandlers.determineCurrentProjectId()], addHandlers.determineCurrentProjectId());
            dom.toggleNotesModal();
            factories.saveLocal();
        } 
    }
    return {
        determineTasks,
        sortTasks,
        submitTask,
        submitNote,
        submitTaskEdit,
        submitNoteEdit,
        editTask,
        editNote,
        moveTask,
        deleteTask,
        changeCompletionStatus,
    }
})();

export default taskEvents;