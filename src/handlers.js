import factories from './factories.js';
import dom from './dom.js';
import taskEvents from './task-events.js';
import projectEvents from './project-events.js';
import dayjs from 'dayjs';

const addHandlers = (() => {

    
    const body = document.querySelector('body');
    
    function addClickHandlers() {
        body.addEventListener('click', e => {
            // task handlers
            if (e.target.hasAttribute('data-taskInfo')) {
                dom.renderTaskDetails(e.target);
                dom.toggleInfoModal()
            } else if (e.target.hasAttribute('data-cancelInfoBtn') ||
                       e.target.hasAttribute('data-infoOverlay')) {
                dom.toggleInfoModal()
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
            } else if (e.target.hasAttribute('data-saveRenaming')) {
                projectEvents.saveRenaming(e.target);
            }
            // hamburger button
            else if (e.target.hasAttribute('data-hamburger') ||
                     e.target.hasAttribute('data-hamburgerLine')) {
                dom.toggleSidebar();
            } else if (e.target.hasAttribute('data-taskMove')) {
                dom.renderMoveSelection(e.target);
                taskEvents.moveTask(e.target);
            }
        })
    }

    function addKeyHandlers() {
        body.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                if (e.target.hasAttribute('data-hamburger')) {
                    dom.toggleSidebar();
                    if (document.querySelector('[data-hamburgerCheck]').checked === false) {
                        document.querySelector('[data-hamburgerCheck]').checked = true;
                    } else {
                        document.querySelector('[data-hamburgerCheck]').checked = false;
                    }
                } else if (e.target.hasAttribute('data-sidebarTab')) {
                    chooseProject(e);
                } else if (e.target.hasAttribute('data-addProjectBtn')) {

                } else if (e.target.hasAttribute('data-renameInput')) {
                    e.preventDefault();
                    projectEvents.saveRenaming(e.target);
                } 
            } else if (e.key === 'Escape') {
                if (!document.querySelector('[data-overlay]').classList.contains('closed')) {
                    dom.toggleModal();
                } else if (!document.querySelector('[data-infoOverlay]').classList.contains('closed')) {
                    dom.toggleInfoModal();
                } else if (e.target.hasAttribute('data-renameInput')) {
                    dom.renderProjects(addHandlers.determineCurrentProjectId());
                }
            }
        })
    }

    function addChangeHandler() {
        const selectOption = document.querySelector('[data-select]');
        selectOption.addEventListener('change', () => {
            dom.renderTasks(factories.projectList[addHandlers.determineCurrentProjectId()]);
        });
    }

    // document.addEventListener('DOMContentLoaded', () => {   
    //     projectEvents.saveRenaming();
    // }) 

    function addNavEvents() {
        submitProject();       
        submitTask();
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
            if (tab != clickedTab) {
                tab.classList.remove('current');
                tab.parentElement.classList.remove('current');
            }
        });
        clickedTab.classList.add('current');
        if (clickedTab.dataset.id > 5) {
            clickedTab.parentElement.classList.add('current');
        }
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
                    dom.renderProjects(determineCurrentProjectId());
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
                    const creationDate = dayjs(new Date()).format('YYYY-MM-DD');
                    const dueDate = document.querySelector('[data-dateInput]').value;
                    const priority = document.querySelector('input[name=priority]:checked').value;
                    const newTask = factories.taskFactory(projectId, title, description, creationDate, dueDate, priority);
                    
                    currentProject.tasks.push(newTask);
                    dom.renderTasks(currentProject);
                    dom.renderHeader(currentProject, projectId);
                    dom.toggleModal();
                }
            })    
        });
    }
    
    return {
        addClickHandlers,
        addKeyHandlers,
        addChangeHandler,
        addNavEvents,
        chooseProject,
        setCurrentClass,
        getAllTasks,
        determineCurrentProjectId,
        updateTaskIndex,
    }

})();

export default addHandlers;
