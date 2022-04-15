import dayjs from 'dayjs';

const factories = (() => {

    let projectList = [
        projectFactory('All Tasks'),
        projectFactory('Due today'),
        projectFactory('Due this week'),
        projectFactory('Most important tasks'),
        projectFactory('Completed Tasks'),
        projectFactory('Notes'), 
    ];
    
    // the projectId signifies the index number of the user project the task belongs to (starting with 6)
    // the taskId signifies the original index of the task in the array of that user project
    function taskFactory(projectId, title, description, creationDate, dueDate, priority) {
        const task = {};
        task.projectId = projectId;
        task.taskId = 0;
        task.title = title;
        task.description = description;
        task.creationDate = creationDate;
        task.dueDate = dueDate;
        task.completionDate = null;
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
            taskFactory('6', 'Homework','English book, p.25, exercises 2 and 3', dayjs(new Date(2021, 11, 10)).format('YYYY-MM-DD'), dayjs(new Date(2022, 3, 16)).format('YYYY-MM-DD'),'high'), 
            taskFactory('6', 'Go grocery shopping','buy apples', dayjs(new Date(2022, 2, 5)).format('YYYY-MM-DD'), dayjs(new Date(2022, 8, 8)).format('YYYY-MM-DD'),'medium')
            );

            let demoProject2 =  projectFactory('Demo Project2');
        demoProject2.tasks.push(
            taskFactory('7', 'Homework2','English book, p.25, exercises 2 and 3', dayjs(new Date(2021, 12, 12)).format('YYYY-MM-DD'), dayjs(new Date(2022, 7, 12)).format('YYYY-MM-DD'),'low'), 
            taskFactory('7', 'Go grocery shopping2','buy apples', dayjs(new Date(2021, 3, 15)).format('YYYY-MM-DD'), dayjs(new Date(2023, 1, 12)).format('YYYY-MM-DD'),'very-high')
            );

            let demoProject3 =  projectFactory('Demo Project3');
        demoProject3.tasks.push(
            taskFactory('8', 'Homework3','English book, p.25, exercises 2 and 3', dayjs(new Date(2022, 3, 14)).format('YYYY-MM-DD'), dayjs(new Date(2022, 5, 16)).format('YYYY-MM-DD'),'very-high'), 
            taskFactory('8', 'Go grocery shopping3','buy apples', dayjs(new Date(2022, 1, 26)).format('YYYY-MM-DD'), dayjs(new Date(2022, 3, 15)).format('YYYY-MM-DD'),'low')
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