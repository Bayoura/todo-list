import dom from './dom.js';
import factories from './factories.js';
import addHandlers from './handlers.js';

const projectEvents = (() => {


    function displayInput() {
        // const inp = document.createElement('input');
        // inp.type = 'text';

        // const listItems = document.querySelectorAll('[data-sidebarTab]');
        // listItems[6];

        const currentProjectId = addHandlers.determineCurrentProjectId();
        const currentProject = factories.projectList[currentProjectId];
        
        console.log(currentProject)
    }

    function renameProject(clicked) {
        displayInput();
        // const currentProjectId = addHandlers.determineCurrentProjectId();
        // const currentProject = factories.projectList[currentProjectId];
        // const clickedTask = currentProject.tasks[clicked.dataset.id];

        // document.querySelector('[data-taskTitleInput]').value = clickedTask.title;
        // document.querySelector('[data-descriptionInput]').value = clickedTask.description;
        // document.querySelector('[data-dateInput]').value = dayjs(clickedTask.dueDate).format('YYYY-MM-DD');  
        // document.querySelectorAll('input[name=priority]').forEach(input => {
        //     if (input.value === clickedTask.priority) input.checked = true;
        // })
        // const submitEdit_button = document.querySelector('[data-submitEditBtn]');
        // submitEdit_button.onclick = e => submitEdit(e, clickedTask);

    }

    function submitRename(e, clickedTask) {
        e.preventDefault(); //stop form from submitting   
        
        //check if required fields are filled out
        const taskForm_form = document.querySelector('[data-taskModalForm]');
        let checkStatus = taskForm_form.checkValidity();
        taskForm_form.reportValidity();
        if (checkStatus) {
            const currentProject = factories.projectList[addHandlers.determineCurrentProjectId()];
            const projectId = addHandlers.determineCurrentProjectId();
            clickedTask.title = document.querySelector('[data-taskTitleInput]').value;
            clickedTask.description = document.querySelector('[data-descriptionInput]').value;
            clickedTask.dueDate = document.querySelector('[data-dateInput]').value;
            clickedTask.priority = document.querySelector('input[name=priority]:checked').value;
            
            dom.renderTasks(currentProject);
            dom.renderHeader(currentProject, projectId);
            dom.toggleModal();
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
        deleteProject
    }
})()

export default projectEvents;