import {AnalyserService} from "../../music/analyser.service";
import {scale} from "../../../util";
import {ShapeDancerProps} from "../dancers/ShapeDancer";

export type NoiseShakeMoveParams = {
  native: {
    position: {
      x: number,
      y: number
    },
  },
  move_params: {
    NOISE_SHAKE: {
      DISABLED: boolean,
      OFFSET: number,
      SPEED_MULT: number,
      SENSITIVITY: number,
      THRESHOLD: number,
      DISTANCE_MULT: number,
    }
  },
  temp: {
    position: {
      x: number,
      y: number
    },
  }
}

export const NOISE_SHAKE = (props: NoiseShakeMoveParams, analyserService: AnalyserService) => {
  if (props.move_params.NOISE_SHAKE.DISABLED) return;

  const brightness = analyserService.brightness('low', 0, 5);
  const scaled = scale(brightness.amp, 0, 255, 0, 1);

  props.move_params.NOISE_SHAKE.OFFSET += (brightness.brightness * (Math.PI * 2) * props.move_params.NOISE_SHAKE.SPEED_MULT);

  const {
    OFFSET,
    SENSITIVITY,
    THRESHOLD,
    DISTANCE_MULT
  } = props.move_params.NOISE_SHAKE;

  if (scaled < THRESHOLD) return;

  let xoff = Math.sin(OFFSET);
  let yoff = Math.cos(OFFSET);

  xoff *= scaled**SENSITIVITY;
  yoff *= scaled**SENSITIVITY;

  let x = props.native.position.x;
  let y = props.native.position.y;

  x += xoff * DISTANCE_MULT;
  y += yoff * DISTANCE_MULT;

  props.temp.position.x = x;
  props.temp.position.y = y;
}
