import factories from './factories.js';
import addHandlers from './handlers.js';

const dom = (() => {

    function renderProjects() {
        const projectList_ul = document.querySelector('[data-projectList]');
        projectList_ul.textContent = '';
        console.log(factories.userProjectList)

        for (let i = 6; i < factories.userProjectList.length; i++) {
            // li
            const listItem = document.createElement('li');
            listItem.tabIndex = 0;
            listItem.setAttribute('data-sidebarTab', '');
            listItem.setAttribute('data-id', i);
            listItem.textContent = factories.userProjectList[i].title;
            listItem.addEventListener('click', e => {
                addHandlers.chooseProject(e)
            });
            projectList_ul.appendChild(listItem);
            // div and icon spans
            const iconsDiv = document.createElement('div');
            const editIcon = document.createElement('span');
            editIcon.classList.add(
                'fa-solid',
                'fa-pen-to-square',
                'icon'
            );
            editIcon.setAttribute('projectEdit', '');
            const deleteIcon = document.createElement('span');
            deleteIcon.classList.add(
                'fa-solid',
                'fa-trash-can',
                'icon'
            );
            deleteIcon.setAttribute('projectDelete', '');
            iconsDiv.append(editIcon, deleteIcon);
            listItem.appendChild(iconsDiv);
        }
    }
    
    function renderHeader(currentProject) {
        const taskContainer_div = document.querySelector('[data-taskContainer]');
        const taskCount_span = document.querySelector('[data-taskCount]');
        const projectHeading_h2 = document.querySelector('[data-projectHeading]');

        // h2
        projectHeading_h2.textContent = currentProject.title;
        // task count
        taskCount_span.textContent = currentProject.tasks.length;
    }
 
    function renderTasks(currentProject) {
        const taskList_ul = document.querySelector('[data-taskList]');
        taskList_ul.textContent = '';
        if (currentProject == null) {
            return;
        } else if (currentProject === 'all') {
            for (let i = 0; i < addHandlers.getAllTasks(); i ++) {
                console.log('hi');
            }
        }

        for (let i = 0; i < currentProject.tasks.length; i++) {
            // li
            const listItem = document.createElement('li');
            listItem.tabIndex = 0;
            listItem.classList.add('task');
            listItem.setAttribute('data-id', i);
            taskList_ul.appendChild(listItem);
            // icon span
            const uncheckedIcon = document.createElement('span');
            uncheckedIcon.classList.add(
                'fa-regular',
                'fa-circle',
                'icon',
                'not-checked'
            );
            // div container for task details
            const taskDetails = document.createElement('div');
            taskDetails.classList.add('task-details');
            listItem.append(uncheckedIcon, taskDetails);
            // title div
            const taskTitle = document.createElement('div');
            taskTitle.textContent = currentProject.tasks[i].title;
            // task options div
            const taskOptionsDiv = document.createElement('div');
            taskOptionsDiv.classList.add('task-options');
            taskDetails.append(taskTitle, taskOptionsDiv);
            // icon spans
            const infoIcon = document.createElement('span');
            infoIcon.classList.add(
                'fa-solid',
                'fa-circle-info',
                'icon'
            );
            infoIcon.setAttribute('taskInfo', '');
            infoIcon.addEventListener('click', () => console.log('openInfoModal()'));
            
            const editIcon = document.createElement('span');
            editIcon.classList.add(
                'fa-solid',
                'fa-pen-to-square',
                'icon'
            );
            editIcon.setAttribute('taskEdit', '');
            editIcon.addEventListener('click', () => console.log('openEditModal()'));

            const deleteIcon = document.createElement('span');
            deleteIcon.classList.add(
                'fa-solid',
                'fa-trash-can',
                'icon'
            );
            deleteIcon.setAttribute('taskDelete', '');
            deleteIcon.addEventListener('click', () => console.log('deleteTask()'));

            taskOptionsDiv.append(infoIcon, editIcon, deleteIcon);
        }
    }

    return {
        renderTasks,
        renderProjects,
        renderHeader
    };
})();

export default dom;