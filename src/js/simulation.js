import Konva from 'konva';
import {two_points_to_line} from './analytic-geometry.js';
import {StringEquation} from './string-equation.js';

const MOUSE_LEFT_BTN_CODE = 0;
const MOUSE_RIGHT_BTN_CODE = 2;
const MI = 0.1

export class Simulation {
  constructor (
    string_length,
    wave_v,
    delta_t,
    string_points_numb,
  ) {
    this.string_func_end_x = string_length;
    this.wave_v = wave_v;
    this.delta_t = delta_t;
    this.string_points_numb = string_points_numb;

    this.width = document.getElementById('scene').offsetWidth;
    this.height = document.getElementById('scene').offsetHeight;

    this.graph_pos_x = 50;
    this.graph_pos_y = this.height / 2;
    this.canvas_string_length = this.width - 100;
    this.canvas_string_end_pos_x = this.graph_pos_x + this.canvas_string_length;
    this.canvas_string_hold_limit_x = -60;
    this.canvas_string_hold_limit_y = 120;

    this.stage = new Konva.Stage({
      container: 'scene',
      width: this.width,
      height: this.height,
    });

    this.stringIsHeld = false;
    this.anim = null;
    this.layer = new Konva.Layer();
    this.stringLine = this._getInitialStringLine();
  }

  _getInitialStringLine () {
    return new Konva.Line({
      points: [0, 0, this.canvas_string_length, 0],
      stroke: '#0066cc',
      strokeWidth: 3,
      lineCap: 'round',
      lineJoin: 'round',
    });
  }

  _correctStringHoldPosToLimits (pos) {
    let xMin = -this.canvas_string_hold_limit_x;
    let xMax = this.canvas_string_length + this.canvas_string_hold_limit_x;

    let yMax = this.height / 2 - this.canvas_string_hold_limit_y;
    let yMin = -yMax;

    if (pos.x < xMin) {
      pos.x = xMin;
    }
    if (pos.x > xMax) {
      pos.x = xMax;
    }

    if (pos.y < yMin) {
      pos.y = yMin;
    }
    if (pos.y > yMax) {
      pos.y = yMax;
    }

    return pos;
  }

  _holdString (event) {
    let pointerPos = this._getPointerPos(event);
    let pos = {x: pointerPos.x - this.graph_pos_x, y: pointerPos.y - this.graph_pos_y};
    pos = this._correctStringHoldPosToLimits(pos);
    let points = [0, 0, pos.x, pos.y, this.canvas_string_length, 0];
    this.stringLine.points(points);
    this.stringIsHeld = true;
  }

  _initialPointsToCanvasPoints(initialPoints) {
    // initialPoints = [0, 0, x, y, stringCanvasHandler.canvas_string_length, 0];

    let beginX = initialPoints[0];
    let beginY = initialPoints[1];
    let holdX = initialPoints[2];
    let holdY = initialPoints[3];
    let endX = initialPoints[4];
    let endY = initialPoints[5];
    let delta = this.canvas_string_length / (this.string_points_numb - 1);

    let lineA = two_points_to_line(beginX, beginY, holdX, holdY);
    let lineB = two_points_to_line(holdX, holdY, endX, endY);

    let canvasPoints = [];
    for (let i = 0; i < this.string_points_numb; i++) {
      let x = i * delta;
      let y = (x < holdX) ? (lineA.a * x + lineA.b) : (lineB.a * x + lineB.b);
      canvasPoints.push(x);
      canvasPoints.push(y);
    }

    return canvasPoints;
  }

  _canvasPointsToFPoints(canvasPoints) {
    let fPoints = [];
    let fDelta = this.string_func_end_x / (this.string_points_numb - 1);
    for (let i = 0; i < canvasPoints.length; i+=2) {
      let canvasY = canvasPoints[i+1];
      let x = (i/2) * fDelta;
      let y = -canvasY * (this.string_func_end_x / this.canvas_string_length);
      fPoints.push({x: x, y: y});
    }
    return fPoints;
  }

  _fPointsToCanvasPoints(fPoints) {
    let delta = this.canvas_string_length / (this.string_points_numb - 1);
    let canvasPoints = [];
    for (let i = 0; i < fPoints.length; i++) {
      let x = i * delta;
      let y = -fPoints[i].y * (this.canvas_string_length / this.string_func_end_x);
      canvasPoints.push(x);
      canvasPoints.push(y);
    }
    return canvasPoints;
  }

  _resetString () {
    this.stringLine.points([0, 0, this.canvas_string_length, 0]);
    this.stringIsHeld = false;
  }

  _animateReleasedString(holdingPos) {
    this._stopAnim();

    holdingPos = this._correctStringHoldPosToLimits (holdingPos);
    let x = holdingPos.x;
    let y = holdingPos.y;

    let canvasPoints = this._initialPointsToCanvasPoints([0, 0, x, y, this.canvas_string_length, 0]);
    let fPoints = this._canvasPointsToFPoints(canvasPoints);
    let vibratingString = new StringEquation(fPoints, this.wave_v, this.delta_t, MI);

    let that = this;
    this.anim = new Konva.Animation(function () {
      let u = null;
      let steps_per_frame = document.getElementById("stepsPerFrame").value;
      for (let i = 0; i < steps_per_frame; i++) {
        let dampingEnabled = document.getElementById('damping').checked;
        u = vibratingString.getNextU(dampingEnabled);
      }
      that.stringLine.points(that._fPointsToCanvasPoints(u));
    }, this.layer);

    this.anim.start();
  }

  _stopAnim() {
    if (this.anim !== null && this.anim.isRunning()) {
      this.anim.stop();
    }
  }

  _getMounting () {
    return new Konva.Circle({
      radius: 6,
      fill: '#0066cc',
    });
  }

  _getPointerPos (event) {
    let pointerPos = null;
    if (['touchstart', 'touchmove', 'touchend'].includes(event.type)) {
      pointerPos = event.currentTarget.pointerPos;
    } else {
      pointerPos = event.target.getStage().getPointerPosition();
    }
    return pointerPos;
  }

  _setEvents () {
    let that = this;

    this.stage.on('mousedown touchstart contextmenu', function (event) {
      if (MOUSE_RIGHT_BTN_CODE === event.evt.button || event.type === 'contextmenu') {
        that.stringIsHeld = false;
        that._stopAnim();
        that._resetString();
      }
      if (MOUSE_LEFT_BTN_CODE === event.evt.button || event.type === 'touchstart') {
        that._stopAnim();
        that._holdString(event);
      }
    });

    this.stage.on('mousemove', function (event) {
      if (!that.stringIsHeld) {
        return;
      }
      that._holdString(event);
    });

    this.stage.on('mouseup touchend', function (event) {
      if (MOUSE_RIGHT_BTN_CODE === event.evt.button) {
        that.stringIsHeld = false;
        return;
      }
      if (that.stringIsHeld) {
        let pointerPos = that._getPointerPos(event);
        that.stringIsHeld = false;
        let pos = {x: pointerPos.x - that.graph_pos_x, y: pointerPos.y - that.graph_pos_y};
        that._animateReleasedString(pos);
      }
    });

    this.stage.on('mouseleave', function () {
      if (that.stringIsHeld) {
        that._resetString();
      }
    });

    this.stage.addEventListener('contextmenu', function(event) {
      event.preventDefault();
    }, false);
  }

  initScene() {
    let mounting1 = this._getMounting();
    let mounting2 = this._getMounting();

    this.stringLine.move({x: this.graph_pos_x, y: this.graph_pos_y});
    mounting1.move({x: this.graph_pos_x, y: this.graph_pos_y});
    mounting2.move({x: this.canvas_string_end_pos_x, y: this.graph_pos_y});

    this.layer.add(this.stringLine);
    this.layer.add(mounting1);
    this.layer.add(mounting2);

    this.stage.add(this.layer);

    this._setEvents();
  }
}
