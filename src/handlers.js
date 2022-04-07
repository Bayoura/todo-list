import factories from './factories.js';
import dom from './dom.js';

const addHandlers = (() => {

    function addNavEvents() {
        const sidebarTabs = document.querySelectorAll('[data-sidebarTab]');
        const addProject_button = document.querySelector('[data-addProjectBtn]');
        const cancelProject_button = document.querySelector('[data-cancelProjectBtn]');

        sidebarTabs.forEach(tab => tab.addEventListener('click', e => {
            chooseProject(e)
        }));
        addProject_button.addEventListener('click', dom.displayProjectForm)
        cancelProject_button.addEventListener('click',  dom.displayProjectForm) 
        submitProject();       
    }
    
    function addMainEvents() {
        submitTask();
        addSortHandler();
        const cancelTask_button = document.querySelector('[data-cancelTaskBtn]');
        const overlay_div = document.querySelector('[data-overlay]');
        const hamburger_label = document.querySelector('[data-hamburger]');
        cancelTask_button.addEventListener('click', dom.displayModal);
        overlay_div.addEventListener('click', dom.displayModal);
        hamburger_label.addEventListener('click', dom.toggleSidebar);
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
                dom.determineTasks(currentProject, id);
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
                    let date = document.querySelector('[data-dateInput]').value;
                    date = new Date(date);
                    const priorityValue = document.querySelector('input[name=priority]:checked').value;
                    const newTask = factories.taskFactory(project, projectId, title, description, date, priorityValue);
                    
                    currentProject.tasks.push(newTask);
                    dom.renderTasks(currentProject);
                    dom.renderHeader(currentProject, determineCurrentProjectId());
                    dom.displayModal();
                }
            })    
        });
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

    function addSortHandler() {
        const sortButton_div = document.querySelector('[data-sortButton]');
        const sortNewOld_div = document.querySelector('[data-sortNewOld]');
        const sortOldNew_div = document.querySelector('[data-sortOldNew]');
        const sortDate_div = document.querySelector('[data-sortDate]');
        const sortImportance_div = document.querySelector('[data-sortImportance]');
        const sortOverlay_div = document.querySelector('[data-sortOverlay]');
    
        sortButton_div.addEventListener('click', dom.displaySortOptions);
        sortOverlay_div.addEventListener('click', dom.displaySortOptions);
    }

    return {
        addNavEvents,
        addMainEvents,
        chooseProject,
        getAllTasks,
        determineCurrentProjectId
    }

})();

export default addHandlers;

//THIS ONLY WORKS ONE TIME EACH

// const notCheckedIcons_span = document.querySelectorAll('[data-notChecked]');
// const checkedIcons_span = document.querySelectorAll('[data-checked]');

// notCheckedIcons_span.forEach(icon => {
//     icon.addEventListener('click', () => {
//         icon.classList.remove('fa-regular');
//         icon.classList.remove('not-checked');
//         icon.classList.add('fa-solid');
//         icon.classList.add('checked'); 
// })
// })

// checkedIcons_span.forEach(icon => {
//     icon.addEventListener('click', () => {
//         icon.classList.remove('fa-solid');
//         icon.classList.remove('checked');
//         icon.classList.add('fa-regular');
//         icon.classList.add('not-checked'); 
// })
// })


// render project list
// render task list