export class StringEquation {
  constructor(f, v, deltaT) {
    this.f = f;
    this.v = v;
    this.deltaT = deltaT;
    this.endX = f[f.length - 1].x;
    this.pointsNumb = this.f.length;
    this.deltaX = this.endX / (this.pointsNumb - 1);
    this._initEulerDifferentialNet();
  }

  _getInitialE () {
    return Array(this.pointsNumb).fill(0);
  }

  _getYValuesOfPoints (points) {
    let yValues = [];
    for (let i = 0; i < (points.length); i++) {
      yValues[i] = points[i].y;
    }
    return yValues;
  }

  _makeFunctionPointsFromYValues (yValues) {
    let func = [];
    for (let i = 0; i < this.f.length; i++) {
      func[i] = {x: this.f[i].x, y: yValues[i]};
    }
    return func;
  }

  _initEulerDifferentialNet () {
    this.eulerDifferentialNet = {
      'e': this._getInitialE(),
      'u': this._getYValuesOfPoints(this.f),
    };
  }

  _calculateNextStep () {
    let currentE = this.eulerDifferentialNet['e'];
    let currentU = this.eulerDifferentialNet['u'];
    let nextE = [];
    let nextU = [];

    // Apply boundary conditions
    nextE[0] = 0;
    nextE[this.pointsNumb - 1] = 0;
    nextU[0] = 0;
    nextU[this.pointsNumb - 1] = 0;

    // Calculations for other points
    for (let i = 1; i < (this.pointsNumb - 1); i++) {
      nextE[i] = currentE[i] + Math.pow(this.v, 2) * ((currentU[i+1] - 2*currentU[i] + currentU[i-1]) / Math.pow(this.deltaX, 2)) * this.deltaT;
    }
    for (let i = 1; i < (this.pointsNumb - 1); i++) {
      nextU[i] = currentU[i] + nextE[i] * this.deltaT;
    }

    this.eulerDifferentialNet = {
      'e': nextE,
      'u': nextU,
    };
  }

  getNextU () {
    this._calculateNextStep();
    return this._makeFunctionPointsFromYValues(this.eulerDifferentialNet['u']);
  }
}
