import dom from './dom.js';
import factories from './factories.js';
import addHandlers from './handlers.js';
import taskEvents from './task-events.js';

const projectEvents = (() => {

    function renameProject(clicked) {
        // this ensures that user can only rename one project at a time
        if (document.querySelectorAll('[data-saveRenaming]').length > 0) {
            dom.renderProjects(addHandlers.determineCurrentProjectId());
        } 
        // when projects are newly rendered, the variable `clicked` points to an element that doesn't exist anymore
        // because after the click, the element was erased (when above condition is fulfilled) and an identical copy was rendered
        // `newElement` is the same as `clicked` but it points to the current rendered element
        const renameButtons = document.querySelectorAll('[data-projectRename]');
        let newElement = null; 
        renameButtons.forEach(button => {
            if (button.dataset.id === clicked.dataset.id) newElement = button;
        })

        const iconDiv = newElement.parentElement;
        // create save button
        const saveRenamingBtn = document.createElement('button');
        saveRenamingBtn.type = 'button';
        saveRenamingBtn.setAttribute('data-saveRenaming', '');
        saveRenamingBtn.setAttribute('data-id', `${newElement.dataset.id}`);
        
        saveRenamingBtn.ariaLabel = 'save edit';
        saveRenamingBtn.classList.add(
            'fa-regular',
            'fa-circle-check',
            'icon'
            ); 
            
        iconDiv.insertBefore(saveRenamingBtn, iconDiv.firstChild);
        const clickedProject = factories.projectList[newElement.dataset.id];
        
        // input field
        const renameForm = document.createElement('form');
        const renameInput = document.createElement('input');
        renameForm.action = '';
        renameForm.id = 'rename-project'
        renameForm.setAttribute('data-renameForm', '');
        renameInput.setAttribute('data-renameInput', '');
        renameInput.setAttribute('data-id', `${newElement.dataset.id}`)
        renameInput.type = 'text';
        renameInput.required = true;
        renameInput.classList.add('rename-input');
        renameInput.value = clickedProject.title;

        renameForm.append(renameInput);
        
        document.querySelectorAll('[data-sidebarTab]').forEach(tab => {
            if (tab.dataset.id === newElement.dataset.id) {
                tab.textContent = '';
                tab.append(renameForm);
                renameInput.focus();
            }
        })
        newElement.remove();
       
        // if (document.querySelectorAll('[data-saveRenaming]').length === 1) {
        //     console.log(document.querySelectorAll('[data-saveRenaming]'))
        //     const body = document.querySelector('body');
        //     body.addEventListener('click', e => {
        //         if (!e.target.classList.contains('rename-input') && !e.target.hasAttribute('data-saveRenaming')) {
        //             dom.renderProjects(addHandlers.determineCurrentProjectId());
        //         }
        //     })
        // }
    }

    function saveRenaming(clicked) { 
        //check if required fields are filled out
        const renameForm_form = document.querySelector('[data-renameForm]');
        let checkStatus = renameForm_form.checkValidity();
        renameForm_form.reportValidity();
        if (checkStatus) {
            const clickedProject = factories.projectList[clicked.dataset.id];
            clickedProject.title = document.querySelector('[data-renameInput]').value;

            dom.renderProjects(addHandlers.determineCurrentProjectId());
            dom.renderHeader(factories.projectList[addHandlers.determineCurrentProjectId()], addHandlers.determineCurrentProjectId());
        } 
    }

    function deleteProject(clicked) {
        factories.projectList.splice(clicked.dataset.id, 1);

        const currentProject = factories.projectList[addHandlers.determineCurrentProjectId()];
        const currentProjectId = addHandlers.determineCurrentProjectId();
        
        if (currentProjectId < 6) {
            taskEvents.determineTasks(currentProject, currentProjectId);
        } else {
            dom.renderTasks(currentProject);
        }
        dom.renderProjects(currentProjectId);
        dom.renderHeader(currentProject, currentProjectId)
    }

    return {
        renameProject,
        saveRenaming,
        deleteProject
    }
})()

export default projectEvents;