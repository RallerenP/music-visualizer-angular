import { Dancer, MutableDancerProp } from "../dancer.interface";
import { AnalyserService } from "../../music/analyser.service";
import { lerp, ObservableValue, scale } from "../../../util";
import { ShapeDancer, ShapeDancerProps } from "./ShapeDancer";
import { DeepOmit } from "ts-essentials";
import { NOISE_SHAKE, BORDER_INFLATE, INFLATE, GLOW_INFLATE } from "../moves/moves";

export type CircleDancerProps = DeepOmit<ShapeDancerProps, {
  native: {
    height: never,
    width: never
  }
}> & {
  native: {
    radius: number,
  },
  temp: {
    radius: number
  }
}

export const CircleDancerMoves = {

}

export class CircleDancer extends ShapeDancer<CircleDancerProps> {
  props: CircleDancerProps =
    {
      native: {
        position: {
          x: 100,
          y: 100
        },
        radius: 20,
        color: '#E76F51',
        border: {
          enabled: true,
          color: '#E9C46A',
          thickness: 5,
        },
        glow: {
          enabled: true,
          color: '#E9C46A',
          strength: 20
        }
      },
      move_params: {
        INFLATE: {
          DISABLED: false,
          SPECTRUM_MIN: 3,
          SPECTRUM_MAX: 5,
          THRESHOLD: 0,
          RADIUS_DELTA_MIN: 0,
          RADIUS_DELTA_MAX: 10,
          SMOOTHING: 1,
          oldRadius: 0
        },
        NOISE_SHAKE: {
          DISABLED: false,
          OFFSET: Math.random() * 1000,
          SENSITIVITY: 2,
          SPEED_MULT: 1,
          DISTANCE_MULT: 1,
          THRESHOLD: 0,
        },
        BORDER_INFLATE: {
          DISABLED: false,
          SPECTRUM_MIN: 3,
          SPECTRUM_MAX: 5,
          THRESHOLD: 0,
          THICKNESS_DELTA_MIN: 0,
          THICKNESS_DELTA_MAX: 5,
          SMOOTHING: 0.2,
          oldThickness: 0
        },
        GLOW_INFLATE: {
          DISABLED: false,
          SPECTRUM_MIN: 3,
          SPECTRUM_MAX: 5,
          THRESHOLD: 0,
          STRENGTH_DELTA_MIN: 0,
          STRENGTH_DELTA_MAX: 5,
          SMOOTHING: 0.2,
          oldStrength: 0
        }
      },
      temp: {
        position: {x: Math.random() * 1920, y: Math.random() * 1080},
        radius: 20,
        color: "#E76F51",
        border: {
          enabled: true,
          color: '#E9C46A',
          thickness: 5,
        },
        glow: {
          enabled: true,
          color: '#E9C46A',
          strength: 20
        }
      }
    }

  readonly moves: ((props: CircleDancerProps, analyserService: AnalyserService) => void)[] = [
    INFLATE,
    NOISE_SHAKE,
    BORDER_INFLATE,
    GLOW_INFLATE
  ];

  constructor(analyserService: AnalyserService, x: number, y: number, radius: number) {
    super(analyserService, x, y);
    this.props.native.position.x = x;
    this.props.native.position.y = y;
    this.props.native.radius = radius;
  }

  protected isPointWithin(x: number, y: number): boolean {
    const dX = (x - this.props.native.position.x) ** 2
    const dY = (y - this.props.native.position.y) ** 2

    return dX + dY < this.props.native.radius ** 2
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    const {
      position,
      radius,
      color,
      border: {
        enabled: borderEnabled,
        color: borderColor,
        thickness: borderThickness
      },
      glow
    } = this.props.temp;

    if (glow.enabled) {
      const {color, strength: glowRadius} = glow;
      const gradient = ctx.createRadialGradient(position.x, position.y, radius, position.x, position.y, radius + (borderThickness) + glowRadius);
      gradient.addColorStop(0.9, color)
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(
        position.x - ((radius + (borderThickness) + (glowRadius * 4)) / 2),
        position.y - ((radius + (borderThickness) + (glowRadius * 4)) / 2), radius + (borderThickness) + (glowRadius * 4), radius + (borderThickness) + (glowRadius * 4));
    }

    ctx.fillStyle = color;
    ctx.beginPath()
    ctx.arc(position.x, position.y, radius, 0, 2 * Math.PI);
    ctx.fill();

    if (borderEnabled) {
      ctx.lineWidth = borderThickness;
      ctx.strokeStyle = borderColor;
      ctx.beginPath()
      ctx.arc(position.x, position.y, radius + (borderThickness / 2), 0, 2 * Math.PI);
      ctx.stroke();
    }

    if (this._highlight) {
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "black";
      ctx.beginPath()
      ctx.arc(position.x, position.y, radius + (borderThickness), 0, 2 * Math.PI);
      ctx.stroke();
    }
  }

  public reset() {
    this.props.temp = {
      position: {
        x: this.props.native.position.x,
        y: this.props.native.position.y
      },
      radius: this.props.native.radius,
      color: this.props.native.color,
      border: {
        enabled: this.props.native.border.enabled,
        color: this.props.native.border.color,
        thickness: this.props.native.border.thickness
      },
      glow: {
        enabled: this.props.native.glow.enabled,
        color: this.props.native.glow.color,
        strength: this.props.native.glow.strength
      }
    };
  }

  public generateMutableProps(): MutableDancerProp[] {
    const props: MutableDancerProp[] = [
      {
        type: 'container',
        name: 'All Properties',
        description: 'All properties for this dancer',
        value: [
          {
            type: 'container',
            name: 'Position',
            description: 'X and Y position of this dancer',
            value: [
              {
                type: 'number',
                name: 'x',
                description: 'X position of this dancer',
                value: this.props.native.position.x,
                set: (x: number) => this.props.native.position.x = x
              },
              {
                type: 'number',
                name: 'y',
                description: 'Y position of this dancer',
                value: this.props.native.position.y,
                set: (y: number) => this.props.native.position.y = y
              }
            ]
          },
          {
            name: 'Radius',
            type: 'number',
            description: 'The radius of this dancer',
            value: this.props.native.radius,
            set: (radius: number) => this.props.native.radius = radius
          },
          {
            name: 'Color',
            type: 'color',
            description: 'The color of this dancer',
            value: this.props.native.color,
            set: (color: string) => this.props.native.color = color
          },
          {
            name: 'Border',
            type: 'container',
            description: 'Border of this dancer',
            value: [
              {
                name: 'Enabled',
                description: 'Toggles the border for this dancer',
                type: "checkmark",
                value: this.props.native.border.enabled,
                set: (value: boolean) => this.props.native.border.enabled = value
              },
              {
                name: 'Color',
                type: 'color',
                description: 'The color of the border',
                value: this.props.native.border.color,
                set: (color: string) => this.props.native.border.color = color
              },
              {
                name: 'Thickness',
                type: 'number',
                description: 'The thickness of the border',
                value: this.props.native.border.thickness,
                set: (thickness: number) => this.props.native.border.thickness = thickness
              }
            ]
          },
          {
            name: "Glow",
            type: 'container',
            description: 'Define the glow around this dancer',
            value: [
              {
                name: 'Enabled',
                type: 'checkmark',
                description: 'Toggles the glow of this dancer',
                value: this.props.native.glow.enabled,
                set: (value: boolean) => this.props.native.glow.enabled = value
              },
              {
                name: 'Color',
                type: 'color',
                description: 'The color of the glow',
                value: this.props.native.glow.color,
                set: (color: string) => this.props.native.glow.color = color,
              },
              {
                name: 'Radius',
                type: 'number',
                description: 'The radius (added to existing dancer radius) of the glow',
                value: this.props.native.glow.strength,
                set: (radius: number) => this.props.native.glow.strength = radius
              }
            ]
          }
        ]
      },
      {
        type: 'container',
        name: 'Moves',
        description: 'Dance moves for this dancer',
        value: [
          {
            type: 'container',
            name: 'Inflate',
            description: 'Makes the dancer increase and decrease in size',
            value: [
              {
                type: 'checkmark',
                name: 'Enabled',
                description: 'Enable or disable this move',
                value: !this.props.move_params.INFLATE.DISABLED,
                set: (value: boolean) => this.props.move_params.INFLATE.DISABLED = !value,
              },
              {
                type: 'number',
                name: 'Spect. min',
                description: "Don't include parts of the spectrum lower than this value during analysis",
                value: this.props.move_params.INFLATE.SPECTRUM_MIN,
                set: (value: number) => {
                  this.props.move_params.INFLATE.SPECTRUM_MIN = value
                }
              },
              {
                type: 'number',
                name: 'Spect. max',
                description: "Don't include parts of the spectrum higher than this value during analysis",
                value: this.props.move_params.INFLATE.SPECTRUM_MAX,
                set: (value: number) => {
                  this.props.move_params.INFLATE.SPECTRUM_MAX = value
                }
              },
              {
                type: 'number',
                name: 'Threshold',
                description: "Minimum value to react to",
                inc: 0.5,
                value: this.props.move_params.INFLATE.THRESHOLD * 100,
                set: (value: number) => {
                  this.props.move_params.INFLATE.THRESHOLD = value / 100
                }
              },
              {
                type: 'number',
                name: 'Radius offset min.',
                description: "The smallest offset of the radius when over the threshold (can be negative)",
                value: this.props.move_params.INFLATE.RADIUS_DELTA_MIN,
                set: (value: number) => {
                  this.props.move_params.INFLATE.RADIUS_DELTA_MIN = value
                }
              },
              {
                type: 'number',
                name: 'Radius offset max.',
                description: "The largest offset of the radius when when at the maximum value (highest average of spectrum)",
                value: this.props.move_params.INFLATE.RADIUS_DELTA_MAX,
                set: (value: number) => {
                  this.props.move_params.INFLATE.RADIUS_DELTA_MAX = value
                }
              },
              {
                type: 'number',
                name: 'Smoothing',
                description: 'How fast the dancer will revert to normal position after inflating (100 disables this feature, 0 means the dancer will never return',
                value: this.props.move_params.INFLATE.SMOOTHING * 100,
                set: (value: number) => {
                  this.props.move_params.INFLATE.SMOOTHING = value / 100;
                }
              }
            ]
          },
          {
            type: 'container',
            name: 'Shake',
            description: 'Will shake this dancer by rotating position around its origin.',
            value: [
              {
                type: 'checkmark',
                name: 'Enabled',
                description: 'Enable the move for this dancer',
                value: !this.props.move_params.NOISE_SHAKE.DISABLED,
                set: (value: boolean) => this.props.move_params.NOISE_SHAKE.DISABLED = !value
              },
              {
                type: 'number',
                name: 'Sensitivity',
                description: 'How much it takes to make this dancer shake. High values means more resistance',
                value: this.props.move_params.NOISE_SHAKE.SENSITIVITY,
                set: (value: number) => this.props.move_params.NOISE_SHAKE.SENSITIVITY = value
              },
              {
                type: 'number',
                name: 'Speed multiplier',
                description: 'Multiplier of speed of the rotation (default: 1)',
                inc: 0.1,
                value: this.props.move_params.NOISE_SHAKE.SPEED_MULT,
                set: (value: number) => this.props.move_params.NOISE_SHAKE.SPEED_MULT = value
              },
              {
                type: 'number',
                name: 'Distance',
                description: "The maximum distance the dancer can move from origin (default: 1)",
                inc: 0.1,
                value: this.props.move_params.NOISE_SHAKE.DISTANCE_MULT,
                set: (value: number) => this.props.move_params.NOISE_SHAKE.DISTANCE_MULT = value
              },
              {
                type: 'number',
                name: 'Threshold',
                description: "Values lower than this wont trigger this move",
                inc: 0.5,
                value: this.props.move_params.NOISE_SHAKE.THRESHOLD,
                set: (value: number) => this.props.move_params.NOISE_SHAKE.THRESHOLD = value
              }
            ]
          },
          {
            type: 'container',
            name: 'Border Inflate',
            description: 'Makes the border of the dancer increase and decrease in thickness',
            value: [
              {
                type: 'checkmark',
                name: 'Enabled',
                description: 'Enable or disable this move',
                value: !this.props.move_params.BORDER_INFLATE.DISABLED,
                set: (value: boolean) => this.props.move_params.BORDER_INFLATE.DISABLED = !value,
              },
              {
                type: 'number',
                name: 'Spect. min',
                description: "Don't include parts of the spectrum lower than this value during analysis",
                value: this.props.move_params.BORDER_INFLATE.SPECTRUM_MIN,
                set: (value: number) => {
                  this.props.move_params.BORDER_INFLATE.SPECTRUM_MIN = value
                }
              },
              {
                type: 'number',
                name: 'Spect. max',
                description: "Don't include parts of the spectrum higher than this value during analysis",
                value: this.props.move_params.BORDER_INFLATE.SPECTRUM_MAX,
                set: (value: number) => {
                  this.props.move_params.BORDER_INFLATE.SPECTRUM_MAX = value
                }
              },
              {
                type: 'number',
                name: 'Threshold',
                description: "Minimum value to react to",
                inc: 0.5,
                value: this.props.move_params.BORDER_INFLATE.THRESHOLD * 100,
                set: (value: number) => {
                  this.props.move_params.BORDER_INFLATE.THRESHOLD = value / 100
                }
              },
              {
                type: 'number',
                name: 'Radius offset min.',
                description: "The smallest offset of the thickness when over the threshold (can be negative)",
                value: this.props.move_params.BORDER_INFLATE.THICKNESS_DELTA_MIN,
                set: (value: number) => {
                  this.props.move_params.BORDER_INFLATE.THICKNESS_DELTA_MIN = value
                }
              },
              {
                type: 'number',
                name: 'Radius offset max.',
                description: "The largest offset of the thickness when when at the maximum value (highest average of spectrum)",
                value: this.props.move_params.BORDER_INFLATE.THICKNESS_DELTA_MAX,
                set: (value: number) => {
                  this.props.move_params.BORDER_INFLATE.THICKNESS_DELTA_MAX = value
                }
              },
              {
                type: 'number',
                name: 'Smoothing',
                description: 'How fast the border will revert to normal position after inflating (100 disables this feature, 0 means the border will never return',
                value: this.props.move_params.BORDER_INFLATE.SMOOTHING * 100,
                set: (value: number) => {
                  this.props.move_params.BORDER_INFLATE.SMOOTHING = value / 100;
                }
              },

            ]
          },
          {
            type: 'container',
            name: 'Glow Dance',
            description: 'Makes the glow of the dancer increase and decrease in strength',
            value: [
              {
                type: 'checkmark',
                name: 'Enabled',
                description: 'Enable or disable this move',
                value: !this.props.move_params.GLOW_INFLATE.DISABLED,
                set: (value: boolean) => this.props.move_params.GLOW_INFLATE.DISABLED = !value,
              },
              {
                type: 'number',
                name: 'Spect. min',
                description: "Don't include parts of the spectrum lower than this value during analysis",
                value: this.props.move_params.GLOW_INFLATE.SPECTRUM_MIN,
                set: (value: number) => {
                  this.props.move_params.GLOW_INFLATE.SPECTRUM_MIN = value
                }
              },
              {
                type: 'number',
                name: 'Spect. max',
                description: "Don't include parts of the spectrum higher than this value during analysis",
                value: this.props.move_params.GLOW_INFLATE.SPECTRUM_MAX,
                set: (value: number) => {
                  this.props.move_params.GLOW_INFLATE.SPECTRUM_MAX = value
                }
              },
              {
                type: 'number',
                name: 'Threshold',
                description: "Minimum value to react to",
                inc: 0.5,
                value: this.props.move_params.GLOW_INFLATE.THRESHOLD * 100,
                set: (value: number) => {
                  this.props.move_params.GLOW_INFLATE.THRESHOLD = value / 100
                }
              },
              {
                type: 'number',
                name: 'Radius offset min.',
                description: "The smallest offset of the glow strength when over the threshold (can be negative)",
                value: this.props.move_params.GLOW_INFLATE.STRENGTH_DELTA_MIN,
                set: (value: number) => {
                  this.props.move_params.GLOW_INFLATE.STRENGTH_DELTA_MIN = value
                }
              },
              {
                type: 'number',
                name: 'Radius offset max.',
                description: "The largest offset of the glow strength when when at the maximum value (highest average of spectrum)",
                value: this.props.move_params.GLOW_INFLATE.STRENGTH_DELTA_MAX,
                set: (value: number) => {
                  this.props.move_params.GLOW_INFLATE.STRENGTH_DELTA_MAX = value
                }
              },
              {
                type: 'number',
                name: 'Smoothing',
                description: 'How fast the glow will revert to normal strength after increasing (100 disables this feature, 0 means the strength will never return',
                value: this.props.move_params.GLOW_INFLATE.SMOOTHING * 100,
                set: (value: number) => {
                  this.props.move_params.GLOW_INFLATE.SMOOTHING = value / 100;
                }
              },

            ]
          },
        ]
      }
    ]

    return props;
  }
}
