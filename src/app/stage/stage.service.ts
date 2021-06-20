import { Injectable } from '@angular/core';
import {CircleDancer, CircleDancerMoves} from "../dancer/dancers/CircleDancer";
import {AnalyserService} from "../music/analyser.service";
import {Dancer} from "../dancer/dancer.interface";
import {BehaviorSubject} from "rxjs";
import {BackgroundDancer} from "../dancer/dancers/BackgroundDancer";

@Injectable({
  providedIn: 'root'
})
export class StageService {

  private _dancers: Dancer[] =
    [

    ]

  public selected: BehaviorSubject<Dancer | null> = new BehaviorSubject<Dancer | null>(null);

  constructor(private analyserService: AnalyserService) {
    const bg = new BackgroundDancer(analyserService);

    this._dancers.push(bg);

    for (let i = 0; i < 1; i++) {
      const _temp = new CircleDancer(analyserService, 200, 200, 20);
      _temp.onclick = () => this.selected.next(_temp);
      //_temp.moves.push(CircleDancerMoves.NOISE_SHAKE)

      this._dancers.push(_temp)
    }

    let prev: Dancer | null = null;

    this.selected.subscribe((sel: Dancer | null) => {
      prev?.unhighlight();
      sel?.highlight();

      prev = sel;
    })

    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Delete' && prev !== null) {
        if (prev instanceof BackgroundDancer) {
          return;
        }

        prev.destroy();
        this._dancers = this.dancers.filter((dancer) => dancer !== prev);
        this.selected.next(null);


      }
    })
  }

  public Circle(x: number, y: number) {
    const dancer = new CircleDancer(this.analyserService, x, y, 20)
    dancer.onclick = () => this.selected.next(dancer);
    this._dancers.push(dancer)
  }

  public get dancers() {
    return this._dancers;
  }


}
