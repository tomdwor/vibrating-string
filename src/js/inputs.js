const DEFAULT_STEPS_PER_FRAME = 10;


export function addEventListenersForInputs() {
  let stepsPerFrameInputElem = document.getElementById('stepsPerFrame');

  stepsPerFrameInputElem.addEventListener('input', function(e){
    document.getElementById('spfVal').innerHTML=this.value;
  }, true);

  stepsPerFrameInputElem.addEventListener('contextmenu', function(e){
    e.preventDefault();
    this.value = DEFAULT_STEPS_PER_FRAME;
    document.getElementById('spfVal').innerHTML = this.value;
  }, true);
}

export function setInitialValueForStepsPerFrameInput() {
  document.getElementById('stepsPerFrame').value = DEFAULT_STEPS_PER_FRAME;
  document.getElementById('spfVal').innerHTML = DEFAULT_STEPS_PER_FRAME;
}
