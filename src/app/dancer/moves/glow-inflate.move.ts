import { AnalyserService } from "../../music/analyser.service";
import { lerp, scale } from "../../../util";

export type GlowInflateMoveParams = {
  native: {
    glow: {
      strength: number
    }
  }
  move_params: {
    GLOW_INFLATE: {
      DISABLED: boolean,
      SPECTRUM_MIN: number,
      SPECTRUM_MAX: number,
      THRESHOLD: number,
      STRENGTH_DELTA_MIN: number,
      STRENGTH_DELTA_MAX: number,
      SMOOTHING: number,
      oldStrength: number,
    }
  },
  temp: {
    glow: {
      strength: number
    }
  }
}

export const GLOW_INFLATE = (props: GlowInflateMoveParams, analyserService: AnalyserService) => {
  const {
    DISABLED,
    SPECTRUM_MIN,
    SPECTRUM_MAX,
    THRESHOLD,
    STRENGTH_DELTA_MIN,
    STRENGTH_DELTA_MAX,
    SMOOTHING,
    oldStrength
  } = props.move_params.GLOW_INFLATE;

  if (DISABLED) return;

  const val = analyserService.average('default', SPECTRUM_MIN, SPECTRUM_MAX);
  const scaled = val / 255;

  let newStrength = props.native.glow.strength;

  if (scaled > THRESHOLD) {
    newStrength += scale(scaled, THRESHOLD, 1, STRENGTH_DELTA_MIN, STRENGTH_DELTA_MAX)
  }

  if (newStrength < oldStrength && newStrength < lerp(oldStrength, props.native.glow.strength, SMOOTHING)) {
    newStrength = lerp(oldStrength, props.native.glow.strength, SMOOTHING);
  }

  props.move_params.GLOW_INFLATE.oldStrength = newStrength;

  props.temp.glow.strength = newStrength;
}
