import {AnalyserService} from "../../music/analyser.service";
import {scale} from "../../../util";
import { Dancer, MutableDancerProp } from "../dancer.interface";
import { CircleDancerProps } from "./CircleDancer";

export type ShapeDancerProps = {
  native: {
    position: {x: number, y: number}
    color: string;
    height: number;
    width: number;
    border: {
      enabled: boolean
      color: string;
      thickness: number,
    },
    glow: {
      enabled: boolean,
      color: string,
      strength: number
    }
  },
  move_params: {
    INFLATE: {
      DISABLED: boolean,
      SPECTRUM_MIN: number,
      SPECTRUM_MAX: number,
      THRESHOLD: number,
      RADIUS_DELTA_MIN: number,
      RADIUS_DELTA_MAX: number,
      SMOOTHING: number
      oldRadius: number
    },
    NOISE_SHAKE: {
      DISABLED: boolean,
      OFFSET: number,
      SENSITIVITY: number,
      SPEED_MULT: number,
      DISTANCE_MULT: number,
      THRESHOLD: number
    },
    BORDER_INFLATE: {
      DISABLED: boolean,
      SPECTRUM_MIN: number,
      SPECTRUM_MAX: number,
      THRESHOLD: number,
      THICKNESS_DELTA_MIN: number,
      THICKNESS_DELTA_MAX: number,
      SMOOTHING: number
      oldThickness: number
    },
    GLOW_INFLATE: {
      DISABLED: boolean,
      SPECTRUM_MIN: number,
      SPECTRUM_MAX: number,
      THRESHOLD: number,
      STRENGTH_DELTA_MIN: number,
      STRENGTH_DELTA_MAX: number,
      SMOOTHING: number
      oldStrength: number
    }
  }
  temp: {
    position: {x: number, y: number}
    color: string;
    border: {
      enabled: boolean
      color: string;
      thickness: number,
    },
    glow: {
      enabled: boolean,
      color: string,
      strength: number
    }
  }
}

export abstract class ShapeDancer<T> implements Dancer {
  protected abstract props: T

  protected _highlight = false;
  protected _selected = false;

  private readonly clickListener: (e: MouseEvent) => void;

  protected constructor(private analyserService: AnalyserService, x: number, y: number) {
    this.clickListener = (e: MouseEvent) => {
      const rect = (e.target as HTMLElement).getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (this.isPointWithin(x, y)) {
        this.onclick();
      }
    }

    window.addEventListener('mousedown', this.clickListener)
  }

  protected readonly abstract moves: ((props: T, analyserService: AnalyserService) => void)[];

  protected abstract isPointWithin(x: number, y: number): boolean

  public onclick = () => { }

  public destroy() {
    window.removeEventListener('mousedown', this.clickListener);
  }

  public dance(): void {
    this.moves.forEach((move: (props: T, analyserService: AnalyserService) => void) => {
      move(this.props, this.analyserService);
    })
  }

  public abstract draw(ctx: CanvasRenderingContext2D): void;

  public abstract reset(): void;

  public highlight() {
    this._highlight = true;
  }

  public unhighlight() {
    this._highlight = false;
  }

  public select() {
    this._selected = true;
  }

  public  deselect() {
    this._selected = false;
  }

  public abstract generateMutableProps(): MutableDancerProp[]
}
