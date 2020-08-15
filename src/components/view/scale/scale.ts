import { roundToMultiple, createHTML } from '../../../ts/mixins';
import Observable from '../../../ts/observable';
import IConfig from '../../interface/IConfig';
import Point from '../point/point';
import Button from '../button/button';

class Scale {
  Observable = new Observable();
  points: Point[] = [];
  isInvert!: boolean;
  isRange!: boolean;
  DOM: Element;

  constructor(
    parent: Element,
    options: { points: number; numberForEach: number; longForEach: number }
  ) {
    this.DOM = createHTML('<div class="js-scale-range"></div>', parent);
    const { points, numberForEach, longForEach } = options;
    this.createPoints(points, numberForEach, longForEach);
  } // constructor end

  // create scale points
  createPoints(points: number, numberForEach: number, longForEach: number) {
    for (let i = 0; i < points; i += 1) {
      const isNumber = i % numberForEach === 0;
      const isLong   = i % longForEach === 0;

      this.points[i] = new Point(this.DOM, isNumber, isLong);
    }
  }

  // sets scale according to parameters
  setScale(size: number, config: IConfig) {
    const { isInvert, isRange, minValue, maxValue, step } = config;
    this.isInvert = isInvert;
    this.isRange = isRange;

    this.setValue(minValue, maxValue, step);
    this.determineСoordScale(size);
  }

  // sets scale values
  setValue(minValue: number, maxValue: number, sliderStep: number) {
    const rangeValues = Math.abs(minValue) + maxValue;
    const step = rangeValues / (this.points.length - 1);

    let currentValue: number;
    currentValue = this.isInvert ? maxValue : minValue;

    this.points.forEach((elem) => {
      const point: Point = elem;
      point.value = roundToMultiple(currentValue, sliderStep);

      if (point.numberDOM) {
        point.numberDOM.innerText = String(point.value);
      }

      currentValue = this.isInvert ? (currentValue - step) : (currentValue + step);
    });
  }

  // determination coordinates of the points on scale
  determineСoordScale(rangeSize: number) {
    const step = rangeSize / this.points.length;
    let coord = this.isInvert ? rangeSize : 0;

    this.points.forEach((elem) => {
      const point = elem;
      point.coord = coord;
      coord = this.isInvert ? (coord - step) : (coord + step);
    });
  }

  // click handler on the points
  handleScalePointClick(buttons: Button[], index: number) {
    const point = this.points[index].coord;

    let btnIndex;
    if (!this.isRange) {
      btnIndex = 0;
    } else {
      // getting from buttons actually coord
      const btn1 = buttons[0].coord;
      const btn2 = buttons[1].coord;

      const range = btn2 - btn1;
      const diapason = range / 2 + btn1;

      btnIndex = point > diapason ? 1 : 0;
    }

    this.Observable.notify({
      value: this.points[index].value,
      index: btnIndex,
    });
  }
} // class

export default Scale;