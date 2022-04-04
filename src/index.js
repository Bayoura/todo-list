import styles from './styles.css';
import '@fortawesome/fontawesome-free/css/regular.css';
import '@fortawesome/fontawesome-free/css/solid.css';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import addHandlers from './handlers.js';
import dom from './dom.js';
import factories from './factories.js';


// make it so that users can switch a todo from one project to another
// shouldnt be able to select text of li
// make draggable project list items
// keyboard support (make li items clickable by hitting enter etc)
// when overlay is active you can still focus on list items etc. underneath the overlay (with tab)
// if project or task title input is longer than x make it like so "this is a long..." and only display the full title when you click on the details

addHandlers.addNavEvents();
dom.renderProjects();
dom.renderTasks(factories.userProjectList[0]);