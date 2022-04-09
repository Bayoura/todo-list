import styles from './styles.css';
import '@fortawesome/fontawesome-free/css/regular.css';
import '@fortawesome/fontawesome-free/css/solid.css';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import addHandlers from './handlers.js';
import dom from './dom.js';
import factories from './factories.js';
import taskEvents from './task-events.js';


// make it so that users can switch a todo from one project to another
// shouldnt be able to select text of li
// make draggable project list items
// keyboard support (make li items clickable by hitting enter etc)
// when overlay is active you can still focus on list items etc. underneath the overlay (with tab)
// if project or task title input is longer than x make it like so "this is a long..." and only display the full title when you click on the details

addHandlers.addNavEvents();
addHandlers.addMainEvents();
dom.renderProjects();
taskEvents.determineTasks(factories.projectList[0], '0');
dom.renderHeader(factories.projectList[0], '0');
