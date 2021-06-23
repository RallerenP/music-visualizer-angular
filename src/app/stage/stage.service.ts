import { Injectable } from '@angular/core';
import {CircleDancer, CircleDancerMoves} from "../dancer/dancers/CircleDancer";
import {AnalyserService} from "../music/analyser.service";
import {Dancer} from "../dancer/dancer.interface";
import {BehaviorSubject} from "rxjs";
import {BackgroundDancer} from "../dancer/dancers/BackgroundDancer";
import { TriangleDancer } from "../dancer/dancers/TriangleDancer";
import * as  FileSave  from 'file-saver';
import * as FileSaver from "file-saver";
import * as _ from "lodash";

@Injectable({
  providedIn: 'root'
})
export class StageService {

  private _dancers: Dancer[] =
    [

    ]

  public selected: BehaviorSubject<Dancer | null> = new BehaviorSubject<Dancer | null>(null);
  private _selected: Dancer | null = null;

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

      this._selected = sel;
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

  public Triangle(x: number, y: number) {
    const dancer = new TriangleDancer(this.analyserService, x, y);
    dancer.onclick = () => this.selected.next(dancer);
    this._dancers.push(dancer);
  }

  public get dancers() {
    return this._dancers;
  }

  saveDancers() {
    const _JSON: any[] = []
    this._dancers.forEach((dancer: Dancer) => {
      _JSON.push(dancer.toJSON())
    });

    const file = new File([JSON.stringify(_JSON)], 'dancers.json', { type: "text/plain" })
    FileSaver.saveAs(file)
  }

  loadDancers(json: any) {
    const dict = new Map<string, any>(
      [
        ['CircleDancer', CircleDancer],
        ['BackgroundDancer', BackgroundDancer],
        ['TriangleDancer', TriangleDancer]
      ]
    );

    this._dancers = [];

    json.forEach((_dancer: any) => {
      const dancer = new (dict.get(_dancer.type))(this.analyserService);
      dancer.fromJSON(_dancer.props);
      this._dancers.push(dancer);
    })

  }

  copy(d: Dancer) {
    const dict = new Map<string, any>(
      [
        ['CircleDancer', CircleDancer],
        ['BackgroundDancer', BackgroundDancer],
        ['TriangleDancer', TriangleDancer]
      ]
    );

    let dJson: any = JSON.stringify(d.toJSON());
    dJson = JSON.parse(dJson);

    const dancer = new (dict.get(dJson.type))(this.analyserService);
    dancer.fromJSON(dJson.props);
    this._dancers.push(dancer);

  }

}
