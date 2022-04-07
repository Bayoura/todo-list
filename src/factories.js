import addHandlers from './handlers.js';

const factories = (() => {
    let projectList = [
        projectFactory('All Tasks'),
        projectFactory('Due today'),
        projectFactory('Due this week'),
        projectFactory('Most important tasks'),
        projectFactory('Completed Tasks'),
        projectFactory('Notes'), 
    ];
    
    
    function taskFactory(projectId, title, description, date, priority) {
        const task = {};
        task.projectId = projectId;
        task.title = title;
        task.description = description;
        task.date = date;
        task.priority = priority;
        task.completed = false;
        return task;
    }
    
    function projectFactory(title) {
        const project = {};
        project.title = title;
        project.tasks = [];
        return project;
    }

    if(!localStorage.getItem('projectList')) {  
        let demoProject =  projectFactory('Demo Project');
        demoProject.tasks.push(
            taskFactory(6, 'Homework','English book, p.25, exercisies 2 and 3', new Date(2022, 3, 6),'high'), 
            taskFactory(6, 'Go grocery shopping','buy apples', new Date(2022, 8, 8),'high')
            );

            let demoProject2 =  projectFactory('Demo Project2');
        demoProject2.tasks.push(
            taskFactory(7, 'Homework2','English book, p.25, exercisies 2 and 3', new Date(2022, 7, 12),'high'), 
            taskFactory(7, 'Go grocery shopping2','buy apples', new Date(2023, 1, 12),'very-high')
            );

            let demoProject3 =  projectFactory('Demo Project3');
        demoProject3.tasks.push(
            taskFactory(8, 'Homework3','English book, p.25, exercisies 2 and 3', new Date(2022, 5, 16),'very-high'), 
            taskFactory(8, 'Go grocery shopping3','buy apples', new Date(2022, 3, 10),'low')
            );
        projectList.push(demoProject);
        projectList.push(demoProject2);
        projectList.push(demoProject3);
    } else {    
        const storagedProjects = JSON.parse(localStorage.getItem('projectList')); 
        projectList = storagedProjects;
    } 

// function saveLocal() {
//     localStorage.setItem('library', JSON.stringify(myLibrary)); 
//     let books = JSON.parse(localStorage.getItem('library')); 
//     return books;
// }

    return {
        taskFactory,
        projectFactory,
        projectList
    };
})();

export default factories;