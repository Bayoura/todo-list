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
                dom.toggleModal();
                dom.displayCorrectModal(e.target);
                taskEvents.editTask(e.target);
            } else if (e.target.hasAttribute('data-taskDelete')) {
                taskEvents.deleteTask(e.target);
            } else if (e.target.hasAttribute('data-taskCheck')) {
                taskEvents.changeCompletionStatus(e.target);
            } else if (e.target.hasAttribute('data-taskMove')) {
                dom.renderMoveSelection(e.target);
            } else if (e.target.hasAttribute('data-moveOverlay')) {
                dom.closeMoveSelection();
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
                dom.displayCorrectModal(e.target);
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
            } //notes button
            else if (e.target.hasAttribute('data-addNoteBtn') ||
                     e.target.hasAttribute('data-cancelNoteBtn') ||
                     e.target.hasAttribute('data-notesOverlay')) {
                dom.toggleNotesModal();
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
                } else if (e.target.hasAttribute('data-renameInput')) {
                    e.preventDefault();
                    projectEvents.saveRenaming(e.target);
                } 
            } else if (e.key === 'Escape') {
                if (!document.querySelector('[data-overlay]').classList.contains('closed')) {
                    dom.toggleModal();
                } else if (!document.querySelector('[data-infoOverlay]').classList.contains('closed')) {
                    dom.toggleInfoModal();
                }  else if (!document.querySelector('[data-notesOverlay]').classList.contains('closed')) {
                    dom.toggleNotesModal();
                }  else if (!document.querySelector('[data-moveOverlay]').classList.contains('closed')) {
                    dom.closeMoveSelection();
                } else if (e.target.hasAttribute('data-renameInput')) {
                    dom.renderProjects(addHandlers.determineCurrentProjectId());
                } else if (e.target.hasAttribute('data-projectTitleInput')) {
                    dom.displayProjectForm();
                }
            }
        })
    }

    function addChangeHandler() {
        body.addEventListener('change', e => {
            if (e.target.hasAttribute('data-select')) {
                dom.renderTasks(factories.projectList[addHandlers.determineCurrentProjectId()]);
            } else if (e.target.hasAttribute('data-moveSelection')) {
                dom.closeMoveSelection();
                taskEvents.moveTask(e.target);
                dom.renderTasks(factories.projectList[addHandlers.determineCurrentProjectId()]);
            }
        })
    }

    function addSubmitHandlers() {
        document.addEventListener('DOMContentLoaded', () => {   
            body.addEventListener('click', e => {
                if (e.target.hasAttribute('data-submitProjectBtn')) {
                    submitProject(e);
                } else if (e.target.hasAttribute('data-submitTaskBtn')) {
                    submitTask(e);
                } else if (e.target.hasAttribute('data-submitNoteBtn')) {
                    submitNote(e);
                }
            })
        }) 
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
        for (let i = 5; i < factories.projectList.length; i++) {
            for (let j = 0; j < factories.projectList[i].tasks.length; j++) {
                factories.projectList[i].tasks[j].taskId = j;
            }
        }
    }
      
    function submitProject(e) {
        e.preventDefault(); //stop form from submitting   
        
        const newProject_form = document.querySelector('[data-newProjectForm]');
        let checkStatus = newProject_form.checkValidity();
        newProject_form.reportValidity();
        if (checkStatus) {
            const title = document.querySelector('[data-projectTitleInput]').value;
            const newProject = factories.projectFactory(title);
            factories.projectList.push(newProject);
            dom.renderProjects(determineCurrentProjectId());
            dom.displayProjectForm();
        }
    }
    
    function submitTask(e) {
        e.preventDefault(); //stop form from submitting   
        
        const taskForm_form = document.querySelector('[data-taskModalForm]');
        let checkStatus = taskForm_form.checkValidity();
        taskForm_form.reportValidity();
        if (checkStatus) {
            const projectId = determineCurrentProjectId();
            const currentProject = factories.projectList[projectId];
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
    }

    function submitNote(e) {
        e.preventDefault();

        const noteForm_form = document.querySelector('[data-noteModalForm]');
        let checkStatus = noteForm_form.checkValidity();
        noteForm_form.reportValidity();
        if (checkStatus) {
            const projectId = determineCurrentProjectId();
            const currentProject = factories.projectList[projectId];
            const note = document.querySelector('[data-noteInput]').value;
            const creationDate = dayjs(new Date()).format('YYYY-MM-DD');
            const priority = document.querySelector('input[name=priority]:checked').value;
            const newNote = factories.taskFactory(projectId, null, note, creationDate, null, priority);

            currentProject.tasks.push(newNote);
            dom.renderNotes();
            dom.renderHeader(currentProject, projectId);
            dom.toggleNotesModal();
        }
    }
    
    return {
        addClickHandlers,
        addKeyHandlers,
        addChangeHandler,
        addSubmitHandlers,
        chooseProject,
        setCurrentClass,
        getAllTasks,
        determineCurrentProjectId,
        updateTaskIndex,
    }

})();

export default addHandlers;
