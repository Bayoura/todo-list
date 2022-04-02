import addHandlers from './handlers.js';

const dom = (() => {

    const projectList_ul = document.querySelector('[data-projectList]');
    function renderProjects() {
        projectList_ul.textContent = '';
        for (let i = 0; i < addHandlers.userProjectList.length; i++) {
            // li
            const listItem = document.createElement('li');
            listItem.tabIndex = 0;
            listItem.setAttribute('data-sidebarTab', '');
            listItem.setAttribute('data-id', i);
            listItem.textContent = addHandlers.userProjectList[i].title;
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

    const taskContainer_div = document.querySelector('[data-taskContainer]');
    const taskCount_span = document.querySelector('[data-taskCount]');

    function renderHeader() {
   
        // taskCount_span.textContent = currenProject.tasks.length;

    }
 
    function renderTasks(currentProject) {
        const taskList_ul = document.querySelector('[data-taskList]');
        taskList_ul.textContent = '';
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
            taskTitle.textContent = currentProject.title;
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