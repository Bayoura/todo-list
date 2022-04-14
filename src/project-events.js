import dom from './dom.js';
import factories from './factories.js';
import addHandlers from './handlers.js';

const projectEvents = (() => {

    function renameProject(clicked) {
        // this ensures that user can only rename one project at a time
        if (document.querySelectorAll('[data-submitRenaming]').length > 0) {
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
        const span = document.createElement('span');
        // submit button
        const submitRenamingBtn = document.createElement('submit');
        submitRenamingBtn.setAttribute('data-submitRenaming', '');
        submitRenamingBtn.setAttribute('data-id', `${newElement.dataset.id}`);
        submitRenamingBtn.setAttribute('form', 'rename-project');
        submitRenamingBtn.ariaLabel = 'save edit';
        submitRenamingBtn.classList.add(
            'fa-regular',
            'fa-circle-check',
            'icon'
            ); 
            
            
        span.append(submitRenamingBtn)
        iconDiv.insertBefore(span, iconDiv.firstChild);
        const clickedProject = factories.projectList[newElement.dataset.id];
        
        // input field
        const renameForm = document.createElement('form');
        const renameInput = document.createElement('input');
        renameForm.action = '';
        renameForm.id = 'rename-project'
        renameForm.setAttribute('data-renameForm', '');
        renameInput.setAttribute('data-renameInput', '');
        renameInput.type = 'text';
        renameInput.required = true;
        renameInput.classList.add('rename-input');
        renameInput.value = clickedProject.title;

        renameForm.append(renameInput);

        document.querySelectorAll('[data-sidebarTab]').forEach(tab => {
            if (tab.dataset.id === newElement.dataset.id) {
                tab.textContent = '';
                tab.append(renameForm);
            }
        })
        newElement.remove();
        

        // if (document.querySelectorAll('[data-submitRenaming]').length === 1) {
        //     console.log(document.querySelectorAll('[data-submitRenaming]'))
        //     const body = document.querySelector('body');
        //     body.addEventListener('click', e => {
        //         if (!e.target.classList.contains('rename-input') && !e.target.hasAttribute('data-submitRenaming')) {
        //             dom.renderProjects(addHandlers.determineCurrentProjectId());
        //         }
        //     })
        // }
    }

    function submitRenaming(e, clicked) {
        e.preventDefault(); //stop form from submitting   
        
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
        renameProject,
        submitRenaming,
        deleteProject
    }
})()

export default projectEvents;