import {Observable} from '../util/observable'

class Controller {
  Observable = new Observable();

  constructor(model, view) {
    this.init(model, view)

  }

  init(model, view) {
    for(let elem of view.button) {
      elem.DOM.addEventListener('mousedown',  elem.move)
    }
  }
}





export {Controller}