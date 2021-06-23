import { ShapeDancer, ShapeDancerProps } from "./ShapeDancer";
import { MutableDancerProp } from "../dancer.interface";
import { AnalyserService } from "../../music/analyser.service";
import * as _ from 'lodash';
import { DeepOmit } from "ts-essentials";
import { BORDER_INFLATE, INFLATE, NOISE_SHAKE } from "../moves/moves";

export type TriangleDancerProps = DeepOmit<ShapeDancerProps, {
  native: {
    height: never,
    width: never,
    glow: never;
  },
  move_params: {
    GLOW_INFLATE: never
  }
  temp: {
    height: never,
    width: never,
    glow: never;
  }
}> & {
  native: {
    radius: number,
  },
  temp: {
    radius: number
  }
}

export class TriangleDancer extends ShapeDancer<TriangleDancerProps> {
  protected readonly moves: ((props: TriangleDancerProps, analyserService: AnalyserService) => void)[] = [
    INFLATE,
    NOISE_SHAKE,
    BORDER_INFLATE
  ];

  protected props: TriangleDancerProps = {
    native: {
      name: 'TriangleDancer',
      position: {
        x: 100,
        y: 100
      },
      radius: 20,
      color: '#E76F51',
      rotation: 0,
      border: {
        enabled: true,
        color: '#E9C46A',
        thickness: 5,
      },
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
      }
    },
    temp: {
      position: {x: Math.random() * 1920, y: Math.random() * 1080},
      color: "#E76F51",
      radius: 20,
      rotation: 0,
      border: {
        enabled: true,
        color: '#E9C46A',
        thickness: 5,
      },
    }
  };

  constructor(analyserService: AnalyserService, x?: number, y?: number) {
    super(analyserService);

    if (x !== undefined)
      this.props.native.position.x = x;

    if (y !== undefined)
      this.props.native.position.y = y;
  }

  protected isPointWithin(x: number, y: number): boolean {
    const _x = this.props.native.position.x
    const _y = this.props.native.position.y
    const _radius = this.props.native.radius;

    const { TOP, LEFT, RIGHT } = TriangleDancer.getPoints(_radius);

    const p1 = {x: _x + RIGHT.x, y: (_y + (_radius / 2)) + RIGHT.y}
    const p2 = {x: _x + LEFT.x, y: (_y + (_radius / 2)) + LEFT.y}
    const p3 = {x: _x + TOP.x, y: (_y + (_radius / 2)) + TOP.y}
    const p = {x, y}

    const A = TriangleDancer.getArea(p1, p2, p3);

    const A1 = TriangleDancer.getArea(p, p2, p3);
    const A2 = TriangleDancer.getArea(p1, p, p3);
    const A3 = TriangleDancer.getArea(p1, p2, p);
    return A === A1 + A2 + A3;
  }

  private static getArea(
    p1: {x: number, y: number},
    p2: {x: number, y: number},
    p3: {x: number, y: number},
  ) {
    return Math.abs((p1.x*(p2.y-p3.y) + p2.x*(p3.y-p1.y)+ p3.x*(p1.y-p2.y))/2.0);
  }

  private static getPoints(r: number) {
    const h = r * 3;
    const b = (h / 2) * Math.sqrt(3);

    return {
      RIGHT: { x: -b, y: r },
      LEFT: { x: b, y: r },
      TOP: { x: 0, y: -h }
    }
  }

  public reset(): void {
    this.props.temp = _.cloneDeep(this.props.native);
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    const {
      position,
      radius,
      color,
      border,
      rotation
    } = this.props.temp;

    const { x, y } = position;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation)

    const points = TriangleDancer.getPoints(radius)

    ctx.fillStyle = color;
    ctx.beginPath()
    ctx.moveTo(points.TOP.x, ((radius / 2)) + points.TOP.y);
    ctx.lineTo(points.LEFT.x, ((radius / 2)) + points.LEFT.y);
    ctx.lineTo(points.RIGHT.x, ((radius / 2)) + points.RIGHT.y);
    ctx.fill();

    if (border.enabled) {
      const { thickness, color } = border;
      const points = TriangleDancer.getPoints(radius);

      ctx.strokeStyle = color;
      ctx.lineWidth = thickness
      ctx.beginPath()
      ctx.moveTo(points.TOP.x, ((radius / 2)) + points.TOP.y);
      ctx.lineTo(points.LEFT.x, ((radius / 2)) + points.LEFT.y);
      ctx.lineTo(points.RIGHT.x, ((radius / 2)) + points.RIGHT.y);
      ctx.lineTo(points.TOP.x, ((radius / 2)) + points.TOP.y);
      ctx.closePath();
      ctx.stroke();
    }

    if (this._highlight) {
      const points = TriangleDancer.getPoints(radius + (border.thickness / 2));

      ctx.lineWidth = 2.5
      ctx.strokeStyle = 'red';
      ctx.beginPath()
      ctx.moveTo(points.TOP.x, ((radius / 2)) + points.TOP.y);
      ctx.lineTo(points.LEFT.x, ((radius / 2)) + points.LEFT.y);
      ctx.lineTo(points.RIGHT.x, ((radius / 2)) + points.RIGHT.y);
      ctx.lineTo(points.TOP.x, ((radius / 2)) + points.TOP.y);
      ctx.stroke();
    }

    ctx.restore();
  }

  public generateMutableProps(): MutableDancerProp[] {
    const props: MutableDancerProp[] = [
      {
        type: 'string',
        name: 'Name',
        description: 'The name (as seen in the dancer list) of this dancer',
        value: this.props.native.name,
        set: (name: string) => this.props.native.name = name
      },
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
            name: 'Rotation',
            type: 'number',
            description: 'The rotation of this dancer',
            value: this.props.native.rotation * (180 / Math.PI),
            set: (rotation: number) => this.props.native.rotation = rotation * (Math.PI / 180)
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
        ]
      }
    ]

    return props;
  }
}
