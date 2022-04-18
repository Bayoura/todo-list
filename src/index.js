import styles from './styles.css';
import '@fortawesome/fontawesome-free/css/regular.css';
import '@fortawesome/fontawesome-free/css/solid.css';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import addHandlers from './handlers.js';
import dom from './dom.js';
import factories from './factories.js';
import taskEvents from './task-events.js';


// shouldnt be able to select text of li
// make draggable project list items

addHandlers.addClickHandlers();
addHandlers.addKeyHandlers();
addHandlers.addChangeHandler();
addHandlers.addSubmitHandlers();
dom.renderProjects('0');
taskEvents.determineTasks(factories.projectList[0], '0');
dom.renderHeader(factories.projectList[0], '0');

