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

    if(!localStorage.getItem('projects')) {  
        let demoProject =  projectFactory('Everyday Tasks');
        demoProject.tasks.push(
            taskFactory('6', 'Discover the true meaning of life','Note: It is NOT 42...', dayjs(new Date(1997, 12, 12)).format('YYYY-MM-DD'), dayjs(new Date(2097, 12, 12)).format('YYYY-MM-DD'),'very-high'), 
            taskFactory('6', 'Clean the living room',"Don't forget to sweep under the couch and dust off all the shelves.", dayjs(new Date(2022, 3, 18)).format('YYYY-MM-DD'), dayjs(new Date(2022, 3, 20)).format('YYYY-MM-DD'),'low'),
            taskFactory('6', 'Reorganise bookshelf',"Don't arrange by colour, instead sort by genre and author. Separate hardcover and paper backs when possible. Also, one extra stack for the books you haven't read yet.", dayjs(new Date(2022, 2, 25)).format('YYYY-MM-DD'), dayjs(new Date(2022, 3, 29)).format('YYYY-MM-DD'),'medium'),
            taskFactory('6', 'Practice Piano',"At least for half an hour!", dayjs(new Date(2022, 3, 17)).format('YYYY-MM-DD'), dayjs(new Date(2022, 3, 19)).format('YYYY-MM-DD'),'high'),
            taskFactory('6', 'Watch a Bob Ross painting tutorial',"We don't make mistakes, just happy little accidents.", dayjs(new Date(2022, 2, 14)).format('YYYY-MM-DD'), dayjs(new Date(2022, 4, 5)).format('YYYY-MM-DD'),'low'),
            );

            let demoProject2 =  projectFactory('Web Development');
        demoProject2.tasks.push(
            taskFactory('7', 'Learn React','', dayjs(new Date(2022, 2, 14)).format('YYYY-MM-DD'), dayjs(new Date(2022, 6, 20)).format('YYYY-MM-DD'),'very-high'), 
            taskFactory('7', 'Take a closer look at regular expressions','They allow you to search through strings in a really advanced way. Very useful for validation etc.', dayjs(new Date(2021, 11, 29)).format('YYYY-MM-DD'), dayjs(new Date(2022, 5, 15)).format('YYYY-MM-DD'),'low'), 
            taskFactory('7', 'Learn about APIs','', dayjs(new Date(2022, 2, 24)).format('YYYY-MM-DD'), dayjs(new Date(2022, 5, 3)).format('YYYY-MM-DD'),'high'), 
            );

            let demoProject3 =  projectFactory('Long term goals');
        demoProject3.tasks.push(
            taskFactory('8', 'Start a workout routine','Start off with maybe two times a week and then step it up slowly.', dayjs(new Date(2021, 10, 14)).format('YYYY-MM-DD'), dayjs(new Date(2022, 5, 16)).format('YYYY-MM-DD'),'high'), 
            taskFactory('8', 'Finish the JavaScript course','', dayjs(new Date(2021, 10, 16)).format('YYYY-MM-DD'), dayjs(new Date(2022, 7, 15)).format('YYYY-MM-DD'),'very-high'),
            taskFactory('8', 'Adopt a puppy',"Or a kitten! Best would be both, so they aren't lonely.", dayjs(new Date(2021, 6, 6)).format('YYYY-MM-DD'), dayjs(new Date(2023, 9, 2)).format('YYYY-MM-DD'),'high'),
            );

        projectList[4].tasks.push(
            taskFactory('7', 'Create demo tasks, projects and notes','This one already makes for a good example.', dayjs(new Date(2021, 3, 12)).format('YYYY-MM-DD'), dayjs(new Date(2022, 3, 22)).format('YYYY-MM-DD'),'low'),
            taskFactory('7', 'Add CSS','The modals are in dire need of styling, also choose a colour scheme and font!', dayjs(new Date(2021, 3, 6)).format('YYYY-MM-DD'), dayjs(new Date(2022, 3, 21)).format('YYYY-MM-DD'),'high'), 
            taskFactory('7', 'Review code','This is the last step! Be thorough.', dayjs(new Date(2022, 3, 15)).format('YYYY-MM-DD'), dayjs(new Date(2022, 3, 23)).format('YYYY-MM-DD'),'medium'),
            taskFactory('7', 'Finish the productivity app project','To achieve this, it would be advisable to first finish the other tasks in this project.', dayjs(new Date(2021, 2, 29)).format('YYYY-MM-DD'), dayjs(new Date(2022, 3, 23)).format('YYYY-MM-DD'),'very-high'), 
        )
        projectList[4].tasks[0].completed = true;
        projectList[4].tasks[1].completed = true;
        projectList[4].tasks[2].completed = true;
        projectList[4].tasks[3].completed = true;
        projectList[4].tasks[0].completionDate = dayjs(new Date(2022, 3, 19)).format('YYYY-MM-DD');
        projectList[4].tasks[1].completionDate = dayjs(new Date(2022, 3, 21)).format('YYYY-MM-DD');
        projectList[4].tasks[2].completionDate = dayjs(new Date(2022, 3, 23)).format('YYYY-MM-DD');
        projectList[4].tasks[3].completionDate = dayjs(new Date(2022, 3, 23)).format('YYYY-MM-DD');
        projectList[5].tasks.push(
            taskFactory('5', null, "There was once an invisible man who had grown tired of being unseen. It was not that he was actually invisible. It was that people had become used to not seeing him. And if no one sees you, are you really there at all?", dayjs(new Date(2022, 3, 22)).format('YYYY-MM-DD'), null, 'low'),
            taskFactory('5', null, "Whereas, our argument shows that the power and capacity of learning exists in the soul already; and that just as the eye was unable to turn from darkness to light without the whole body, so too the instrument of knowledge can only by the movement of the whole soul be turned from the world of becoming into that of being, and learn by degrees to endure the sight of being, and of the brightest and best of being, or in other words, of the good.", dayjs(new Date(2022, 1, 11)).format('YYYY-MM-DD'), null, 'high'),
            taskFactory('5', null, "In debating the merits of pursuing hidden treasure, one must weigh the risk of whether it was never meant to be found and if so, why?", dayjs(new Date(2021, 7, 27)).format('YYYY-MM-DD'), null, 'very-high'),
            taskFactory('5', null, "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", dayjs(new Date(2021, 11, 22)).format('YYYY-MM-DD'), null, 'medium'),
            taskFactory('5', null, "Depending on who you ask, sometimes ghost stories are all that is left of history. History is full of ghosts, because it's full of myth. All of it woven together depending on who survived to do the telling.", dayjs(new Date(2022, 1, 4)).format('YYYY-MM-DD'), null, 'medium'),
            )

        projectList.push(demoProject);
        projectList.push(demoProject2);
        projectList.push(demoProject3);
    } else {    
        const storagedProjects = JSON.parse(localStorage.getItem('projects')); 
        projectList = storagedProjects;
    } 

function saveLocal() {
    localStorage.setItem('projects', JSON.stringify(projectList)); 
    const storagedProjects = JSON.parse(localStorage.getItem('projects'));  
    return storagedProjects;
}

    return {
        projectList,
        taskFactory,
        projectFactory,
        saveLocal
    };
})();

export default factories;