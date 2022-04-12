import factories from './factories.js';
import dom from './dom.js';
import taskEvents from './task-events.js';
import projectEvents from './project-events.js';

const addHandlers = (() => {

    function addNavEvents() {
        submitProject();       
        submitTask();
        addSortHandler();
    }

    function chooseProject(e) {
        if (e.target.classList.contains('current')) {
            return;
        } else {
            setCurrentClass(e.target);
            let id = determineCurrentProjectId();
            let currentProject = factories.projectList[id];
            // check if it is a default or user project
            if (id < 6) {
                taskEvents.determineTasks(currentProject, id);
                dom.renderHeader(currentProject, id);
            } else {
                dom.renderTasks(currentProject);
                dom.renderHeader(currentProject, id);
            }
        }
    }

    function setCurrentClass(clickedTab) {
        const sidebarTabs = document.querySelectorAll('[data-sidebarTab]');
        sidebarTabs.forEach(tab => {
            if (tab != clickedTab) tab.classList.remove('current');
        });
        clickedTab.classList.add('current');
    }

    function determineCurrentProjectId() {
        const sidebarTabs = document.querySelectorAll('[data-sidebarTab]');
        let id;
        sidebarTabs.forEach(tab => {
            if (tab.classList.contains('current')) {
                    id = tab.dataset.id;       
            }
        });          
        return id;
    }

    // get all tasks from all projects into one array
    function getAllTasks() {
        let allTasks = [];
        for (let i = 6; i < factories.projectList.length; i++) {
            for (let j = 0; j < factories.projectList[i].tasks.length; j++) {
                allTasks.push(factories.projectList[i].tasks[j]);
            }
        }
        return allTasks;
    }

    function updateTaskIndex() {
        for (let i = 6; i < factories.projectList.length; i++) {
            for (let j = 0; j < factories.projectList[i].tasks.length; j++) {
                factories.projectList[i].tasks[j].taskId = j;
            }
        }
    }

    function addSortHandler() {
        const sortNewOld_div = document.querySelector('[data-sortNewOld]');
        const sortOldNew_div = document.querySelector('[data-sortOldNew]');
        const sortDate_div = document.querySelector('[data-sortDate]');
        const sortImportance_div = document.querySelector('[data-sortImportance]');
    }
      
    function submitProject() {
        const submitProject_button = document.querySelector('[data-submitProjectBtn]');
        const newProject_form = document.querySelector('[data-newProjectForm]');
        document.addEventListener('DOMContentLoaded', () => {    
            submitProject_button.addEventListener('click', e => {    
                e.preventDefault(); //stop form from submitting   
    
                //check if required fields are filled out
                let checkStatus = newProject_form.checkValidity();
                newProject_form.reportValidity();
                if (checkStatus) {
                    const title = document.querySelector('[data-projectTitleInput]').value;
                    const newProject = factories.projectFactory(title);
                    factories.projectList.push(newProject);
                    dom.renderProjects();
                    dom.displayProjectForm();
                }
            })    
        });
    }
    
    function submitTask() {
        const submitTask_button = document.querySelector('[data-submitTaskBtn]');
        const taskForm_form = document.querySelector('[data-taskModalForm]');
        document.addEventListener('DOMContentLoaded', () => {    
            submitTask_button.addEventListener('click', e => {    
                e.preventDefault(); //stop form from submitting   
    
                //check if required fields are filled out
                let checkStatus = taskForm_form.checkValidity();
                taskForm_form.reportValidity();
                if (checkStatus) {
                    const currentProject = factories.projectList[determineCurrentProjectId()];
                    const projectId = determineCurrentProjectId();
                    const title = document.querySelector('[data-taskTitleInput]').value;
                    const description = document.querySelector('[data-descriptionInput]').value;
                    const dueDate = document.querySelector('[data-dateInput]').value;
                    const priority = document.querySelector('input[name=priority]:checked').value;
                    const newTask = factories.taskFactory(projectId, title, description, dueDate, priority);
                    
                    currentProject.tasks.push(newTask);
                    dom.renderTasks(currentProject);
                    dom.renderHeader(currentProject, projectId);
                    dom.toggleModal();
                }
            })    
        });
    }

    const body = document.querySelector('body');

    function handlers() {
        body.addEventListener('click', e => {
            // task handlers
            if (e.target.hasAttribute('data-taskInfo')) {
                taskEvents.renderTaskDetails(e.target);
            } else if (e.target.hasAttribute('data-taskEdit')) {
                taskEvents.editTask(e.target);
            } else if (e.target.hasAttribute('data-taskDelete')) {
                taskEvents.deleteTask(e.target);
            } else if (e.target.hasAttribute('data-taskCheck')) {
                taskEvents.changeCompletionStatus(e.target);
            } 
            // project handlers
              else if (e.target.hasAttribute('data-sidebarTab')) {
                chooseProject(e);
            } else if (e.target.hasAttribute('data-projectRename')) {
                projectEvents.renameProject(e.target);
            } else if (e.target.hasAttribute('data-projectDelete')) {
                projectEvents.deleteProject(e.target);
            } 
            // task buttons
              else if (e.target.hasAttribute('data-addTaskBtn') ||
                       e.target.hasAttribute('data-cancelTaskBtn') ||
                       e.target.hasAttribute('data-overlay')) {
                dom.toggleModal();
            } 
            // project buttons
              else if (e.target.hasAttribute('data-addProjectBtn') ||
                       e.target.hasAttribute('data-cancelProjectBtn')) {
                dom.displayProjectForm();
            } 
            // hamburger button
            else if (e.target.hasAttribute('data-hamburger')) {
                dom.toggleSidebar();
            } 
            // sort button
            else if (e.target.hasAttribute('data-sortButton') ||
                     e.target.hasAttribute('data-sortOverlay')) {
                dom.displaySortOptions();
            }
        })
    }
    
    return {
        addNavEvents,
        chooseProject,
        getAllTasks,
        determineCurrentProjectId,
        updateTaskIndex,
        handlers
    }

})();

export default addHandlers;
