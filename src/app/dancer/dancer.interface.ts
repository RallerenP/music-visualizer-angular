import * as p5 from "p5";
import {AnalyserService} from "../music/analyser.service";
import {BehaviorSubject, Observable} from "rxjs";

export interface Dancer {
  dance(): void;
  draw(p: CanvasRenderingContext2D): void;
  reset(): void;

  generateMutableProps(): MutableDancerProp[];
  highlight(): void;
  unhighlight(): void;
  destroy(): void;
  onclick(): void;
}

export interface MutableDancerProp {
  type: 'container' | 'number' | 'string' | 'color'| 'checkmark',
  name: string,
  description: string,
  value: MutableDancerProp[] | number | string | boolean,
  inc?: number,
  max?: number,
  min?: number
  set?: ((value: string) => void) | ((value: number) => void) |  ((value: boolean) => void);
}

