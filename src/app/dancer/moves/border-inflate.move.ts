import { AnalyserService } from "../../music/analyser.service";
import { lerp, scale } from "../../../util";

export type BorderInflateMoveParams = {
  native: {
    border: {
      thickness: number
    }
  }
  move_params: {
    BORDER_INFLATE: {
      DISABLED: boolean,
      SPECTRUM_MIN: number,
      SPECTRUM_MAX: number,
      THRESHOLD: number,
      THICKNESS_DELTA_MIN: number,
      THICKNESS_DELTA_MAX: number,
      SMOOTHING: number,
      oldThickness: number,
    }
  },
  temp: {
    border: {
      thickness: number
    }
  }
}

export const BORDER_INFLATE = (props: BorderInflateMoveParams, analyserService: AnalyserService) => {
  const {
    DISABLED,
    SPECTRUM_MIN,
    SPECTRUM_MAX,
    THRESHOLD,
    THICKNESS_DELTA_MIN,
    THICKNESS_DELTA_MAX,
    SMOOTHING,
    oldThickness
  } = props.move_params.BORDER_INFLATE;

  if (DISABLED) return;

  const val = analyserService.average('low', SPECTRUM_MIN, SPECTRUM_MAX);
  const scaled = val / 255;

  let newThickness = props.native.border.thickness;

  if (scaled > THRESHOLD) {
    newThickness += scale(scaled, THRESHOLD, 1, THICKNESS_DELTA_MIN, THICKNESS_DELTA_MAX)
  }

  if (newThickness < oldThickness && newThickness < lerp(oldThickness, props.native.border.thickness, SMOOTHING)) {
    newThickness = lerp(oldThickness, props.native.border.thickness, SMOOTHING);
  }

  //console.log(newThickness)

  props.move_params.BORDER_INFLATE.oldThickness = newThickness;

  props.temp.border.thickness = newThickness;
}
