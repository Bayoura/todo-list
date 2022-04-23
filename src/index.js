import styles from './styles.css';
import '@fortawesome/fontawesome-free/css/regular.css';
import '@fortawesome/fontawesome-free/css/solid.css';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import addHandlers from './handlers.js';
import dom from './dom.js';
import factories from './factories.js';
import taskEvents from './task-events.js';

addHandlers.addClickHandlers();
addHandlers.addKeyHandlers();
addHandlers.addChangeHandler();
addHandlers.addSubmitHandlers();
addHandlers.responsiveNotes();
dom.renderProjects('0');
taskEvents.determineTasks(factories.projectList[0], '0');
dom.renderHeader(factories.projectList[0], '0');

