import { Injectable } from '@angular/core';
import {MusicModule} from "./music.module";
import {MusicService} from "./music.service";
import * as p5 from "p5";
import {Howler} from "howler";
import * as Meyda from 'meyda';
import {loop, scale } from "../../util";
import {createMeydaAnalyzer} from "meyda";
import * as ml5 from 'ml5'

@Injectable({
  providedIn: 'root'
})
export class AnalyserService {
  private readonly UPDATE_RESOLUTION = 1000 / 60;

  private analyser = Howler.ctx.createAnalyser();
  private lowAnalyser = Howler.ctx.createAnalyser();
  private highAnalyser = Howler.ctx.createAnalyser();

  private _dest = Howler.ctx.createMediaStreamDestination()

  //private highMeydaAnalyzer;

  // private lowPassFft = new p5.FFT(0.5, 2048);
  // private highPassFft = new p5.FFT(0.5, 2048);

  private _spectrumData;
  private _lowSpectrumData;
  private _highSpectrumData

  private _timeDomainData;

  private _spectrum: number[] = new Array<number>(2048);
  private _spectrumLow: number[] = new Array<number>(2048);
  private _spectrumHigh: number[] = new Array<number>(2048);

  private _timeDomain = new Array<number>(2048);
  // private _average = this._spectrum.reduce((a,b) => a + b, 0) / this.analyser.frequencyBinCount;

  constructor(private musicService: MusicService) {
    Howler.masterGain.connect(this.analyser);
    Howler.masterGain.connect(this._dest)

    // this.analyser.smoothingTimeConstant = 0.9;
    // this.lowAnalyser.smoothingTimeConstant = 0.9;
    // this.highAnalyser.smoothingTimeConstant = 0.9;

    this.analyser.fftSize = 4096;
    this.lowAnalyser.fftSize = 4096;
    this.highAnalyser.fftSize = 4096;

    const lowpass = Howler.ctx.createBiquadFilter();
    const highpass = Howler.ctx.createBiquadFilter();

    lowpass.type = 'lowpass';
    highpass.type = 'highpass'

    lowpass.frequency.value = 50;
    highpass.frequency.value = 350;


    Howler.masterGain.connect(lowpass);
    Howler.masterGain.connect(highpass);

    lowpass.connect(this.lowAnalyser);
    highpass.connect(this.highAnalyser);

    this._spectrumData = new Uint8Array(this.analyser.frequencyBinCount);
    this._lowSpectrumData = new Uint8Array(this.analyser.frequencyBinCount);
    this._highSpectrumData = new Uint8Array(this.analyser.frequencyBinCount);

    this._timeDomainData = new Float32Array(this.analyser.frequencyBinCount);

    // this.calculate();

    loop(() => this.calculate())
  }

  private calculate() {
    this.analyser.getByteFrequencyData(this._spectrumData);
    this.lowAnalyser.getByteFrequencyData(this._lowSpectrumData);
    this.highAnalyser.getByteFrequencyData(this._highSpectrumData);

    this.analyser.getFloatTimeDomainData(this._timeDomainData);
    //console.log(this._timeDomainData)

    //console.log(this.meydaAnalyser.get('spectralCentroid'));

    this.copy(); // Overwriting instead of creating gives giant performance gains because we avoid GC more.
  }

  private copy() {
    for (let i = 0; i < this._spectrum.length; i++) {
      this._spectrum[i] = this._spectrumData[i];
      this._spectrumLow[i] = this._lowSpectrumData[i];
      this._spectrumHigh[i] = this._highSpectrumData[i];
      //this._timeDomain[i] = this._timeDomainData[i];
    }
  }

  public spectrum(pass: 'default' | 'high' | 'low' = "default") {
    switch (pass) {
      case "default":
        return this._spectrum;
      case "low":
        return this._spectrumLow;
      case "high":
        return this._spectrumHigh;
    }
  }

  // Psuedo-brightness, not true
  public brightness(
    pass: 'default' | 'high' | 'low' = "default",
    min: number = 0,
    max: number = this.analyser.frequencyBinCount
  ) {
    const toBright = this.spectrum(pass).slice(min, max + 1);

    let loudestIndex = 0;
    let amp = 0;

    toBright.forEach((bin: number, index: number) => {
      if (bin <= amp) return;

      loudestIndex = index;
      amp = bin;
    })

    //console.log(loudestIndex)

    const brightness = scale(loudestIndex, 0, toBright.length, 0, 1);

    return {brightness, amp};
  }

  public rms(
    min: number = 0,
    max: number = this.analyser.frequencyBinCount
  ) {
    const toRms = this._timeDomainData.slice(min, max + 1);

    let rms = 0;
    toRms.forEach((num: number) => rms += Math.pow(num, 2));
    // let rms = 0;
    // for (let i = 0; i < this._timeDomainData.length; i++) {
    //   rms += Math.pow(this._timeDomainData[i], 2);
    // }

    rms /= toRms.length;
    rms = Math.sqrt(rms);

    //if (Math.random() > 0.9) console.log(rms)

    //console.log(rms)


    return rms
  }

  helper(pow: number, spect: number[]) {
    let num = 0;
    let denom = 0;

    for (let i = 0; i < spect.length; i++) {
      num += Math.pow(i, pow) * Math.abs(spect[i])
      denom += spect[i];
    }

    return num / denom;
  }

  centralSpectroid() {
    return this.helper(1, this._spectrumHigh);
  }

  // kurtosis() {
  //   const _1 = this.helper(1, this._spectrum)
  //   const _2 = this.helper(2, this._spectrum)
  //   const _3 = this.helper(3, this._spectrum)
  //   const _4 = this.helper(4, this._spectrum)
  //
  //   const num = -3 * Math.pow(_1, 4) + 6 * _1 * _2 - 4 * _1 * _3 + _4;
  //   const den = Math.pow(Math.sqrt(_2 - Math.pow(_1, 2)), 4);
  // }


  public average(
    pass: 'default' | 'high' | 'low' = "default",
    min: number = 0,
    max: number = this.analyser.frequencyBinCount
  ) {
    const toAvg = this.spectrum(pass).slice(min, max + 1);

    return toAvg.reduce((a: number, b: number) => a + b, 0) / ((max - min) + 1);
  }
}
