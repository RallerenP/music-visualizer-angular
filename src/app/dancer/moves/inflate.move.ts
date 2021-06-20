import { AnalyserService } from "../../music/analyser.service";
import { lerp, scale } from "../../../util";

export type InflateMoveParams = {
  native: {
    radius: number,
  }
  move_params: {
    INFLATE: {
      DISABLED: boolean,
      SPECTRUM_MIN: number,
      SPECTRUM_MAX: number,
      THRESHOLD: number,
      RADIUS_DELTA_MIN: number,
      RADIUS_DELTA_MAX: number,
      SMOOTHING: number,
      oldRadius: number,
    }
  },
  temp: {
    radius: number,
  }
}

export const INFLATE = (props: InflateMoveParams, analyserService: AnalyserService) => {
  // Generate default options for this move
  const {
  DISABLED,
  SPECTRUM_MIN,
  SPECTRUM_MAX,
  THRESHOLD,
  RADIUS_DELTA_MIN,
  RADIUS_DELTA_MAX,
  SMOOTHING,
  oldRadius
} = props.move_params.INFLATE;

if (DISABLED) return;

const val = analyserService.average('default', SPECTRUM_MIN, SPECTRUM_MAX);
const scaled = val / 255;

let newRadius = props.native.radius;

if (scaled > THRESHOLD) {
  newRadius += scale(scaled, THRESHOLD, 1, RADIUS_DELTA_MIN, RADIUS_DELTA_MAX);
}

if (newRadius < oldRadius && newRadius < lerp(oldRadius, props.native.radius, SMOOTHING)) {
  newRadius = lerp(oldRadius, props.native.radius, SMOOTHING);
}

props.move_params.INFLATE.oldRadius = newRadius;

props.temp.radius = newRadius;
};
