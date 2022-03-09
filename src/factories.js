const factories = (() => {
    function taskFactory(title, description, date, priority) {
        const task = {};
        task.title = title;
        task.description = description;
        task.date = date;
        task.priority = priority;
        console.log(task);
        return task;
    }
    
    function projectFactory(title) {
        const project = {};
        project.title = title;
        project.tasks = [];
        return project;
    }

    return {
        taskFactory,
        projectFactory
    };
})();

export default factories;