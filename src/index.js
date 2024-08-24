import {addEventListenersForInputs, setInitialValueForStepsPerFrameInput} from "./js/inputs";
import {Simulation} from './js/simulation.js';

import './style.scss';

const STRING_LENGTH = 1;
const WAVE_VELOCITY = 1.007;
const DELTA_T = 0.0097;
const STRING_POINTS_NUMB = 98;
const DAMPING_COEFFICIENT = 0.1; // You can adjust this value

let stringCanvasHandler = new Simulation(
    STRING_LENGTH,
    WAVE_VELOCITY,
    DELTA_T,
    STRING_POINTS_NUMB,
    DAMPING_COEFFICIENT
);
stringCanvasHandler.initScene();

// Init form inputs
setInitialValueForStepsPerFrameInput();
addEventListenersForInputs();

// Add event listener for the damped checkbox
const dampedCheckbox = document.getElementById('dampedCheckbox');
dampedCheckbox.addEventListener('change', (event) => {
    stringCanvasHandler.setDamped(event.target.checked);
});
