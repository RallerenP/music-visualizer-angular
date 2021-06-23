import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as p5 from 'p5';
import {MusicService} from "../music/music.service";
import {AnalyserService} from "../music/analyser.service";
import { faPlay, faPause, faStepForward, faStepBackward, faVolumeMute, faVolumeUp, faFileDownload, faFileUpload } from "@fortawesome/free-solid-svg-icons";
import {Dancer} from "../dancer/dancer.interface";
import {loop, scale} from "../../util";
import {FormControl} from "@angular/forms";
import {StorageService} from "../storage.service";
import { StageService } from "../stage/stage.service";
import { FileChangeEvent } from "@angular/compiler-cli/src/perform_watch";

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.css']
})
export class MusicPlayerComponent implements OnInit, AfterViewInit {

  faPlay = faPlay;
  faPause = faPause;
  faStepForward = faStepForward;
  faStepBackward = faStepBackward;
  faVolumeMute = faVolumeMute;
  faVolumeUp = faVolumeUp;
  faFileDownload = faFileDownload
  faFileUpload = faFileUpload

  @ViewChild('canvasHolder') canvasHolderRef!: ElementRef<HTMLCanvasElement>;
  volumeSlider = new FormControl();

  ctx!: CanvasRenderingContext2D;
  spectrum: number[] = this.analyzerService.spectrum();

  constructor(public musicService: MusicService, private analyzerService: AnalyserService, private storageService: StorageService, public stageService: StageService) { }

  ngOnInit() {
    const vol = this.storageService.getOnce<number>('volume');

    if (!vol) return;

    this.volumeSlider.setValue(vol * 100);
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasHolderRef.nativeElement;
    canvas.height = canvas.clientHeight;
    canvas.width = canvas.clientWidth;
    this.ctx = canvas.getContext("2d")!

    loop(() => this.animate())
  }

  volume() {
    this.storageService.setItem('volume', this.volumeSlider.value / 100);
  }

  animate() {
    if (this.musicService.isPlaying ) this.spectrum = this.analyzerService.spectrum('high');
    const gap = 2;
    const { width, height } = this.ctx.canvas;

    this.ctx.clearRect(0, 0, width, height);

    this.ctx.fillStyle = "#2A9D8F"

    for (let i = 0; i < this.spectrum.length / 4; i++) {
      const mappedHeight = Math.max(scale(this.spectrum[i], 0, 255, 0, height), 2);

      const x = i * (width / 2048) * 4;
      const y = (height / 2) - (mappedHeight / 2);
      const w = (width / this.spectrum.length * 4) - gap;
      const h = mappedHeight;

      this.ctx.fillStyle = i % 10 === 0 ? 'white' : "#2A9D8F";
      this.ctx.fillRect(x,y,w,h);

      if (i % 10 === 0) {
        this.ctx.font = "12px Consolas"
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(i.toString(), x, height - 5)
      }
    }
  }

  beginFileUpload() {
    (document.querySelector('#dancerFileInput')! as HTMLInputElement).click();
  }

  handleUpload(event: Event) {
    const target = event.target as HTMLInputElement;

    const reader = new FileReader();
    const file = target.files![0];

    reader.addEventListener('load', (event: ProgressEvent<FileReader>) => {
      this.stageService.loadDancers(JSON.parse(event.target!.result as string));
    })

    reader.readAsText(file);
  }
}
