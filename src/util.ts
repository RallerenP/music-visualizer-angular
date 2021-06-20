import {BehaviorSubject, Observable, ReplaySubject} from "rxjs";

export function scale (number: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

// From p5js source
export function lerp(start: number, stop: number, amt: number) {
  return amt * (stop - start) + start;
}


const onLoops: Function[] = []
let loopStarted = false;

export function loop(fn: Function) {
  onLoops.push(fn)

  if (!loopStarted) {
    doLoop();
    loopStarted = true;
  }
}

function doLoop() {
  onLoops.forEach((fn: Function) => fn());
  window.requestAnimationFrame(() => doLoop())
}

export class ObservableValue<T> {
  private _value: T;
  private _observable: BehaviorSubject<T>;

  constructor(value: T) {
    this._value = value;
    this._observable = new BehaviorSubject<T>(value);
    this._observable.next(value);

    this._observable.subscribe((value: T) => {
      this._value = value;
    })
  }

  get val() {
    return this._value;
  }

  set val(value: T) {
    this._observable.next(value);
  }

  get observable() {
    return this._observable;
  }
}
