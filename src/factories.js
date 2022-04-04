const factories = (() => {
    let userProjectList = [];
    
    function taskFactory(title, description, date, priority) {
        const task = {};
        task.title = title;
        task.description = description;
        task.date = date;
        task.priority = priority;
        task.done = false;
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
            taskFactory('Homework','English book, p.25, exercisies 2 and 3','12.01.2023','high'), 
            taskFactory('Go grocery shopping','buy apples','12.01.2023','high')
            );
        userProjectList.push(demoProject);
        // console.log(userProjectList);
        // console.log(demoProject);
    } else {    
        const storagedProjects = JSON.parse(localStorage.getItem('projectList')); 
        userProjectList = storagedProjects;
    } 

// function saveLocal() {
//     localStorage.setItem('library', JSON.stringify(myLibrary)); 
//     let books = JSON.parse(localStorage.getItem('library')); 
//     return books;
// }

    return {
        taskFactory,
        projectFactory,
        userProjectList
    };
})();

export default factories;