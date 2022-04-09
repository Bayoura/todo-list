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
                currentProject.tasks = addHandlers.getAllTasks();
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

    function changeCompletionStatus(clicked) {
        const currentProject = factories.projectList[addHandlers.determineCurrentProjectId()];
        const currentProjectId = addHandlers.determineCurrentProjectId();
        const clickedTask = currentProject.tasks[clicked.dataset.id];
        const originProject = factories.projectList[clickedTask.projectId];
        
        if (clickedTask.completed === true) {
            clickedTask.completed = false;
            clickedTask.completionDate = '';
            originProject.tasks.push(clickedTask);
            // remove old classes:
            clicked.removeAttribute('class');
            clicked.classList.add(
                'fa-regular',
                'fa-circle',
                'icon'
            );  
            setTimeout(() => {
                factories.projectList[4].tasks.splice(clicked.dataset.id, 1);
                dom.renderTasks(currentProject);
                dom.renderHeader(currentProject, currentProjectId)
            }, 200); 
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
                dom.renderHeader(currentProject, currentProjectId)
            }, 200); 
        }
        console.log(clickedTask);
        console.log(factories.projectList);
    }

    function showTaskDetails() {

    }
    
    function editTask(clicked) {
        dom.displayModal();
        const currentProject = factories.projectList[addHandlers.determineCurrentProjectId()];
        const currentProjectId = addHandlers.determineCurrentProjectId();
        const clickedTask = currentProject.tasks[clicked.dataset.id];
        const originProject = factories.projectList[clickedTask.projectId];
        originProject.tasks.splice(clickedTask.taskId, 1);  

        document.querySelector('[data-taskTitleInput]').value = clickedTask.title;
        document.querySelector('[data-descriptionInput]').value = clickedTask.description;
        document.querySelector('[data-dateInput]').value = dayjs(clickedTask.dueDate).format('YYYY-MM-DD');  
        // document.querySelector('input[name=priority]:checked').value = clickedTask.priority;

        // if (currentProjectId < 6) {
        //     determineTasks(currentProject, currentProjectId);
        // } else {
        //     dom.renderTasks(currentProject);
        // }
        // dom.renderHeader(currentProject, currentProjectId)

    }

    // note: the data-id attribute shows the index of the task in the current list (the default projects, e.g. 'All'),
    // the taskId shows the index of the task in the original task list of the project the tasks belongs to (the user projects)
    function deleteTask(clicked) {
        const currentProject = factories.projectList[addHandlers.determineCurrentProjectId()];
        const currentProjectId = addHandlers.determineCurrentProjectId();
        const clickedTask = currentProject.tasks[clicked.dataset.id];
        const originProject = factories.projectList[clickedTask.projectId];
        originProject.tasks.splice(clickedTask.taskId, 1);  

        if (currentProjectId < 6) {
            determineTasks(currentProject, currentProjectId);
        } else {
            dom.renderTasks(currentProject);
        }
        dom.renderHeader(currentProject, currentProjectId)
    } 


    return {
        determineTasks,
        changeCompletionStatus,
        showTaskDetails,
        editTask,
        deleteTask,
    }

})();

export default taskEvents;