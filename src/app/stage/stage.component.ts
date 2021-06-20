import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as p5 from "p5";
import {StageService} from "./stage.service";
import {Dancer} from "../dancer/dancer.interface";
import { loop } from 'src/util';
import {AnalyserService} from "../music/analyser.service";

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.css']
})
export class StageComponent implements OnInit, AfterViewInit {

  @ViewChild('stageHolder') stageHolderRef!: ElementRef<HTMLCanvasElement>

  ctx!: CanvasRenderingContext2D;

  constructor(private stageService: StageService, private analyserService: AnalyserService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const stage = this.stageHolderRef.nativeElement;
    stage.height = stage.clientHeight;
    stage.width = stage.clientWidth;
    this.ctx = stage.getContext("2d")!;

    loop(() => this.animate())
    // const stageHolder = this.stageHolderRef.nativeElement;
    //
    // const stage = (p: p5) => {
    //   p.setup = () => {
    //     const w = stageHolder.clientWidth, h = stageHolder.clientHeight;
    //
    //     const _cv = p.createCanvas(w, h, p.WEBGL);
    //     _cv.parent(stageHolder);
    //   }
    //
    //   p.draw = () => {
    //     p.translate(-p.width / 2, -p.height / 2);
    //     p.background(255);
    //     this.stageService.dancers.forEach((dancer: Dancer) => {
    //       dancer.dance();
    //       dancer.draw(p);
    //       dancer.reset();
    //     })
    //   }
  }

  animate() {
    this.ctx.fillStyle = `white`;
    this.ctx.fillRect(0, 0, this.ctx.canvas.clientWidth, this.ctx.canvas.clientHeight);


    this.stageService.dancers.forEach((dancer: Dancer) => {
      dancer.dance();
      dancer.draw(this.ctx);
      dancer.reset();
    })
    //
    this.ctx.fillStyle = 'black';
    this.ctx.font = "30px Arial";
    this.ctx.fillText("RMS: " + this.analyserService.rms(), 10, 50)
    this.ctx.fillText('S Centroid: ' + this.analyserService.centralSpectroid(), 10, 100)
    // this.ctx.fillText('Kurt: ' + this.analyserService.kurtosis(), 10, 150)

  }

}
