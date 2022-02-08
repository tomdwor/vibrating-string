import {addEventListenersForInputs, setInitialValueForStepsPerFrameInput} from "./js/inputs";
import {Simulation} from './js/simulation.js';

import './style.scss';

/*
The solution will be stable if the following condition is true:
(WAVE_VELOCITY * DELTA_T) / (STRING_LENGTH * DELTA X) <= 1
when DELTA_X = STRING_LENGTH / (STRING_POINTS_NUMB - 1)
*/

const STRING_LENGTH = 1;
const WAVE_VELOCITY = 1.007;
const DELTA_T = 0.0097;
const STRING_POINTS_NUMB = 98;

let stringCanvasHandler = new Simulation(
    STRING_LENGTH,
    WAVE_VELOCITY,
    DELTA_T,
    STRING_POINTS_NUMB
);
stringCanvasHandler.initScene();


// Init form inputs
setInitialValueForStepsPerFrameInput();
addEventListenersForInputs();
