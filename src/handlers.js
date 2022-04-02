import factories from './factories.js';
import dom from './dom.js';

const addHandlers = (() => {

    let currentProjectId;

    const sidebarTabs = document.querySelectorAll('[data-sidebarTab]');

    function addNavEvents() {
        sidebarTabs.forEach(tab => tab.addEventListener('click', e => {
            if (e.target.classList.contains('current')) {
                return;
            } else {
                setCurrentTab(e.target);
                determinecurrentProjectId(e.target);
                dom.renderTasks(userProjectList[currentProjectId]);
            }
        }));
    }

    function setCurrentTab(clickedTab) {
        sidebarTabs.forEach(tab => {
            if (tab != clickedTab) tab.classList.remove('current');
        });
        clickedTab.classList.add('current');
    }

    function determinecurrentProjectId(clickedTab) {
        if (clickedTab.hasAttribute('data-all')) {
            currentProjectId = 'all';
        } else if (clickedTab.hasAttribute('data-today')) {
            currentProjectId = 'today';     
        } else if (clickedTab.hasAttribute('data-week')) {
            currentProjectId = 'week';            
        } else if (clickedTab.hasAttribute('data-important')) {
            currentProjectId = 'important';            
        } else if (clickedTab.hasAttribute('data-completed')) {
            currentProjectId = 'completed';            
        } else if (clickedTab.hasAttribute('data-notes')) {
            currentProjectId = 'notes';
        } else {
            currentProjectId = clickedTab.dataset.index
        }
        // switchTab(currentProjectId);
    }

    // function switchTab(id) {
    //     if (typeof id === 'number') {
    //         dom.renderTasks(userProjectList[id]);
    //     }
    // }

    const submitTask_button = document.querySelector('[data-submitTaskBtn]');
    const taskForm_form = document.querySelector('[data-taskModalForm]');
    const addTask_button = document.querySelector('[data-addTaskBtn]');
    const modal_div = document.querySelector('[data-modal]');
    const overlay_div = document.querySelector('[data-overlay]');

    addTask_button.addEventListener('click', () => {
        modal_div.classList.remove('closed');
        overlay_div.classList.remove('closed');
    });

    // tasks
    document.addEventListener('DOMContentLoaded', () => {    
        submitTask_button.addEventListener('click', e => {    
            e.preventDefault(); //stop form from submitting   

            //check if required fields are filled out
            let checkStatus = taskForm_form.checkValidity();
            taskForm_form.reportValidity();
            if (checkStatus) {
                const title = document.querySelector('[data-taskTitleInput]').value;
                const description = document.querySelector('[data-descriptionInput]').value;
                const date = document.querySelector('[data-dateInput]').value;
                const priorityValue = document.querySelector('input[name=priority]:checked').value;
                const newTask = factories.taskFactory(title, description, date, priorityValue);
                
                userProjectList[currentProjectId].tasks.push(newTask);
                dom.renderTasks(userProjectList[currentProjectId]);
            }
        })    
    });

    const addProject_button = document.querySelector('[data-addProjectBtn]');
    const newProject_form = document.querySelector('[data-newProjectForm]');
    const submitProject_button = document.querySelector('[data-submitProjectBtn]');
    const cancelProject_button = document.querySelector('[data-cancelProjectBtn]');

    addProject_button.addEventListener('click', () => newProject_form.classList.toggle('closed'));
    cancelProject_button.addEventListener('click', () => newProject_form.classList.add('closed'));

    
    let userProjectList = [];
    // projects
    document.addEventListener('DOMContentLoaded', () => {    
        submitProject_button.addEventListener('click', e => {    
            e.preventDefault(); //stop form from submitting   

            //check if required fields are filled out
            let checkStatus = newProject_form.checkValidity();
            newProject_form.reportValidity();
            if (checkStatus) {
                const title = document.querySelector('[data-projectTitleInput]').value;
                const newProject = factories.projectFactory(title);
                userProjectList.push(newProject);
                dom.renderProjects();
            }
        })    
    });

    // get all tasks from all projects into one array
    function getAllTasks() {
        let allTasks = [];
        for (let i = 0; i < projectList.length; i++) {
            for (let j = 0; j < projectList[i].tasks.length; j++) {
                allTasks.push(projectList[i].tasks[j]);
            }
        }
        return allTasks;
    }

    const cancelTask_button = document.querySelector('[data-cancelTaskBtn]');

    cancelTask_button.addEventListener('click', () => {
        modal_div.classList.add('closed');
        overlay_div.classList.add('closed');
    })

    const sortButton_div = document.querySelector('[data-sortButton]');
    const sortOptions_div = document.querySelector('[data-sortOptions]');
    const sortDate_div = document.querySelector('[data-sortDate]');
    const sortImportance_div = document.querySelector('[data-sortImportance]');
    const sortCustom_div = document.querySelector('[data-sortCustom]');
    const sortOverlay_div = document.querySelector('[data-sortOverlay]');

    sortButton_div.addEventListener('click', () => {
        sortOptions_div.classList.add('show');
        sortOverlay_div.classList.remove('closed');
    })

    sortOverlay_div.addEventListener('click', () => {
        console.log('clicked');
        sortOptions_div.classList.remove('show');
        sortOverlay_div.classList.add('closed');
    });

    const hamburger_label = document.querySelector('[data-hamburger]');
    const sidebar_nav = document.querySelector('[data-sidebar]');
    const main_element = document.querySelector('[data-main]')

    hamburger_label.addEventListener('click', () => {
        sidebar_nav.classList.toggle('hidden');
        main_element.classList.toggle('full-page');
    })

    return {
        addNavEvents,
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