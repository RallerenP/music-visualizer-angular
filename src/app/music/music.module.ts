import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MusicService} from "./music.service";
import {AnalyserService} from "./analyser.service";



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [],
  providers: [
    MusicService,
    AnalyserService
  ]
})
export class MusicModule { }
