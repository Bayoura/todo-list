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
    // the taskId signifies the original index of the task in the array of the user project
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
        let demoProject =  projectFactory('Everyday Tasks');
        demoProject.tasks.push(
            taskFactory('6', 'Discover the true meaning of life','Note: It is NOT 42...', dayjs(new Date(1997, 12, 12)).format('YYYY-MM-DD'), dayjs(new Date(2097, 12, 12)).format('YYYY-MM-DD'),'very-high'), 
            taskFactory('6', 'Clean the living room',"Don't forget to sweep under the couch and dust off all the shelves.", dayjs(new Date(2022, 3, 18)).format('YYYY-MM-DD'), dayjs(new Date(2022, 3, 20)).format('YYYY-MM-DD'),'low'),
            taskFactory('6', 'Reorganise bookshelf',"Don't arrange by colour, instead sort by genre and author. Separate hardcover and paper backs when possible. Also, one extra stack for the books you haven't read yet.", dayjs(new Date(2022, 2, 25)).format('YYYY-MM-DD'), dayjs(new Date(2022, 3, 29)).format('YYYY-MM-DD'),'medium'),
            taskFactory('6', 'Practice Piano',"At least for half an hour!", dayjs(new Date(2022, 3, 17)).format('YYYY-MM-DD'), dayjs(new Date(2022, 3, 19)).format('YYYY-MM-DD'),'medium'),
            taskFactory('6', 'Watch a Bob Ross painting tutorial',"We don't make mistakes, just happy little accidents.", dayjs(new Date(2022, 2, 14)).format('YYYY-MM-DD'), dayjs(new Date(2022, 4, 5)).format('YYYY-MM-DD'),'medium'),
            );

            let demoProject2 =  projectFactory('Web Development');
        demoProject2.tasks.push(
            taskFactory('7', 'Finish the productivity app project','To achieve this, it would be advisable to first finish the other tasks in this project.', dayjs(new Date(2021, 2, 29)).format('YYYY-MM-DD'), dayjs(new Date(2022, 3, 23)).format('YYYY-MM-DD'),'very-high'), 
            taskFactory('7', 'Add CSS','The modals are in dire need of styling, also choose a colour scheme and font!', dayjs(new Date(2021, 3, 6)).format('YYYY-MM-DD'), dayjs(new Date(2022, 3, 21)).format('YYYY-MM-DD'),'high'), 
            taskFactory('7', 'Review code','This is the last step! Be thorough.', dayjs(new Date(2022, 3, 15)).format('YYYY-MM-DD'), dayjs(new Date(2022, 3, 23)).format('YYYY-MM-DD'),'medium'),
            );

            let demoProject3 =  projectFactory('Long term goals');
        demoProject3.tasks.push(
            taskFactory('8', 'Start a workout routine','Start off with maybe two times a week and then step it up slowly.', dayjs(new Date(2021, 10, 14)).format('YYYY-MM-DD'), dayjs(new Date(2022, 5, 16)).format('YYYY-MM-DD'),'high'), 
            taskFactory('8', 'Finish the JavaScript course','', dayjs(new Date(2021, 10, 16)).format('YYYY-MM-DD'), dayjs(new Date(2022, 7, 15)).format('YYYY-MM-DD'),'very-high'),
            taskFactory('8', 'Adopt a puppy',"Or a kitten! Best would be both, so they aren't lonely.", dayjs(new Date(2021, 6, 6)).format('YYYY-MM-DD'), dayjs(new Date(2023, 9, 2)).format('YYYY-MM-DD'),'high'),
            );

        projectList[4].tasks.push(taskFactory('7', 'Create demo tasks, projects and notes','This one already makes for a good example.', dayjs(new Date(2021, 3, 12)).format('YYYY-MM-DD'), dayjs(new Date(2022, 3, 22)).format('YYYY-MM-DD'),'low'))
        projectList[4].tasks[0].completed = true;
        projectList[4].tasks[0].completionDate = dayjs(new Date(2022, 3, 19)).format('YYYY-MM-DD');
        projectList[5].tasks.push(
            taskFactory('5', null, "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.", dayjs(new Date(2022, 3, 22)).format('YYYY-MM-DD'), null, 'medium'),
            taskFactory('5', null, "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.", dayjs(new Date(2022, 1, 11)).format('YYYY-MM-DD'), null, 'low'),
            taskFactory('5', null, "Don't forget Zeke's birthday!! Buy a present, he likes leather notebooks and pencils.", dayjs(new Date(2021, 7, 27)).format('YYYY-MM-DD'), null, 'very-high'),
            taskFactory('5', null, "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.", dayjs(new Date(2021, 11, 22)).format('YYYY-MM-DD'), null, 'high'),
            )

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