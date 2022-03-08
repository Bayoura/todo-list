export default function taskFactory(title, description, date, priority) {
    const task = {};
    task.title = title;
    task.description = description;
    task.date = date;
    task.priority = priority;
    console.log(task);
    return task;
}