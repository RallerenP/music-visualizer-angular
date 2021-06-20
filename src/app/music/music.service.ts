import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import * as p5 from 'p5';
import {MusicList, MusicObject} from "./music";
import {Howl, Howler} from "howler";
import {StorageService} from "../storage.service";

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  private _index = 0;

  private _sound?: Howl
  private _volume: number = 1;
  private _muted: boolean = false;

  private gain: GainNode;

  constructor(private storageService: StorageService) {
    this._autoplay(1, MusicList)

    const dest = Howler.ctx.destination;

    Howler.masterGain.disconnect();
    const gain = Howler.ctx.createGain();
    Howler.masterGain.connect(gain);

    // @ts-ignore
    gain.connect(dest);

    if (this.storageService.getItem('volume') === undefined) {
      this.storageService.setItem('volume', 0.2);
    }

    this.storageService.getItem('volume')?.subscribe((volume) => {
      gain.gain.setValueAtTime(<number>volume, Howler.ctx.currentTime);
      this._volume = <number>volume;
    })

    this.gain = gain;
  }

  get isPlaying() {
    return this._sound?.playing();
  }

  toggle() {
    if (this.isPlaying) this._sound?.pause();
    else this._sound?.play();
  }

  prev() {
    //this._index = Math.abs((this._index - 1) % this.playlist.length);
    //this._playing?.stop();
  }

  next() {
    // this._playing?.stop();
    // this._index = (this._index + 1) % this.playlist.length;
    // this.playing.next(new Music(this.playlist[this._index]));
  }

  mute() {
    if (this._muted) {
      this.gain.gain.setValueAtTime(this._volume, Howler.ctx.currentTime)
    } else {
      this.gain.gain.setValueAtTime(0, Howler.ctx.currentTime)
    }

    this._muted = !this._muted
  }

  get muted() {
    return this._muted;
  }

  private _autoplay(i: number, list: MusicObject[]) {
    this._sound = new Howl({
      src: [list[i].url],
      preload: true,
      onend: () => {
        i = (i + 1) % list.length
        this._autoplay(i, list)
      }
    })

    this._sound.play();
  }
}
