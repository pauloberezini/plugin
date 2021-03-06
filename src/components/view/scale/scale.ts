import { roundToMultiple, createHTML } from '../../../ts/mixins';
import IConfig from '../../interface/IConfig';
import Point from '../point/point';

class Scale {
  points: Point[] = [];
  DOM: HTMLElement;

  constructor(parent: HTMLElement, public config: IConfig) {
    this.DOM = createHTML('<div class="js-scale-range"></div>', parent);
    this.createPoints();
  } // constructor

  // устанавливает шкалу согласно параметрам
  setScale(size: number) {
    this.setValue();
    this.determineСoordScale(size);
  }

  // устанавливает значения шкалы
  setValue() {
    const { minValue, maxValue, step, isInvert } = this.config;

    const rangeValues = Math.abs(minValue) + maxValue;
    const stepBetween = rangeValues / (this.points.length - 1);

    let currentValue: number;
    currentValue = isInvert ? maxValue : minValue;

    this.points.forEach((elem) => {
      const point: Point = elem;
      point.value = roundToMultiple(currentValue, step);

      if (point.numberDOM) {
        point.numberDOM.innerText = String(point.value);
      }

      currentValue = isInvert ? currentValue - stepBetween : currentValue + stepBetween;
    });
  }

  // создать точки шкалы
  private createPoints() {
    const { points, numberForEach, longForEach } = this.config;

    for (let i = 0; i < points; i += 1) {
      const isNumber = i % numberForEach === 0;
      const isLong = i % longForEach === 0;

      this.points[i] = new Point(this.DOM, isNumber, isLong);
    }
  }

  // определение координат точек на шкале
  private determineСoordScale(rangeSize: number) {
    const { isInvert } = this.config;

    const step = rangeSize / (this.points.length - 1);
    let coord = isInvert ? rangeSize : 0;

    this.points.forEach((elem) => {
      const point = elem;
      point.coord = coord;
      coord = isInvert ? (coord -= step) : (coord += step);
    });
  }
} // class

export default Scale;
