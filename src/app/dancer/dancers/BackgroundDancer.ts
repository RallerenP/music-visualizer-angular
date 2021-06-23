import {Dancer, MutableDancerProp} from "../dancer.interface";
import {AnalyserService} from "../../music/analyser.service";
import { lerp, scale } from "src/util";
import { Particle } from "./BackgroundDancer/Particle";

export interface BackgroundDancerProps {
  native: {
    color: string;
    particles: {
      enabled: boolean
      amount: number,
      speed_mult: number,
      rms_boost: number
      friction: number,
      lifetime: number
    }
  },
  move_params: {
    COLOR_BLEND: {
      DISABLED: boolean;
      END_COLOR: string;
      MIN_SPECTRUM: number;
      MAX_SPECTRUM: number;
      THRESHOLD: number;
      SMOOTHING: number;
      temps?: any
    }
  },
  temp: {
    color: string;
  }
}

export const BackgroundDancerMoves = {
  COLOR_BLEND: (props: BackgroundDancerProps, analyserService: AnalyserService) => {
    const {
      DISABLED,
      END_COLOR,
      MIN_SPECTRUM,
      MAX_SPECTRUM,
      THRESHOLD,
      SMOOTHING
    } = props.move_params.COLOR_BLEND;

    if (DISABLED) return;

    const val = analyserService.average('default', MIN_SPECTRUM, MAX_SPECTRUM);
    let scaled = val / 255;

    scaled = scale(scaled, THRESHOLD, 1, 0, 1);

    if (scaled < 0) scaled = 0;

    if (
      props.move_params.COLOR_BLEND.temps.old &&
      scaled < props.move_params.COLOR_BLEND.temps.old - SMOOTHING
    ) {
      scaled = props.move_params.COLOR_BLEND.temps.old - SMOOTHING
      //console.log('smoothed')
    }

    //console.log(scaled, props.move_params.COLOR_BLEND.temps.old - SMOOTHING)
    //console.log(scaled)

    props.move_params.COLOR_BLEND.temps.old = scaled;



    //if (scaled < THRESHOLD) return;



    const _c1 = props.native.color;
    const _c2 = END_COLOR;

    const c1 =
      [
        parseInt(_c1.substring(1, 3), 16),
        parseInt(_c1.substring(3, 5), 16),
        parseInt(_c1.substring(5, 7), 16),
      ]

    const c2 =
      [
        parseInt(_c2.substring(1, 3), 16),
        parseInt(_c2.substring(3, 5), 16),
        parseInt(_c2.substring(5, 7), 16),
      ]

    const blended = [
      Math.round(lerp(c1[0], c2[0], Math.abs(scaled))).toString(16).padStart(2, '0'),
      Math.round(lerp(c1[1], c2[1], Math.abs(scaled))).toString(16).padStart(2, '0'),
      Math.round(lerp(c1[2], c2[2], Math.abs(scaled))).toString(16).padStart(2, '0')
    ]

    props.temp.color = `#${blended[0]}${blended[1]}${blended[2]}`

  }
}

export class BackgroundDancer implements Dancer {
  particles: Particle[] = []

  constructor(private analyserService: AnalyserService) {

  }

  private props: BackgroundDancerProps = {
    native: {
      color: '#000000',
      particles: {
        enabled: true,
        rms_boost: 5,
        amount: 100,
        speed_mult: 0.5,
        friction: 0.002,
        lifetime: 1000
      }
    },
    move_params: {
      COLOR_BLEND: {
        DISABLED: true,
        END_COLOR: '#ffffff',
        MIN_SPECTRUM: 0,
        MAX_SPECTRUM: 200,
        THRESHOLD: 0,
        SMOOTHING: 0.002,
        temps: {

        }
      }
    },
    temp: {
      color: '#000000'
    }
  }

  public moves: ((props: BackgroundDancerProps, analyserService: AnalyserService) => void)[] = [
    BackgroundDancerMoves.COLOR_BLEND
  ];

  dance(): void {
    this.moves.forEach((move: (props: BackgroundDancerProps, analyserService: AnalyserService) => void) => {
      move(this.props, this.analyserService);
    })
  }

  destroy(): void {
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const height = ctx.canvas.clientHeight;
    const width = ctx.canvas.clientWidth;

    const { color } = this.props.temp;
    const { particles } = this.props.native;

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);



    if (particles.enabled) {
      const { amount, lifetime, friction, speed_mult, rms_boost } = particles;
      const rms = this.analyserService.rms();

      for (let i = 0; i < (this.analyserService.rms()) * amount; i++) {
        this.particles.push(
          new Particle(
            Math.random() * ctx.canvas.width,
            ctx.canvas.height,
            (rms * rms_boost) * (Math.random() * speed_mult),
            Math.random() * friction,
            Math.random() * lifetime,
            ctx)
        )
    }
    }

    this.particles = this.particles.filter(particle => {
      particle.update();

      if (!particle.dead) {
        particle.draw();
        return true;
      } else {
        return false;
      }
    });


  }

  generateMutableProps(): MutableDancerProp[] {
    return [
      {
      name: 'Native Properties',
      type: 'container',
      description: 'All native properties for this dancer',
      value: [
        {
          name: 'Color',
          type: 'color',
          description: 'The color of this dancer',
          value: this.props.native.color,
          set: (color: string) => this.props.native.color = color
        }
      ]
      },
      {
        name: 'Moves',
        type: 'container',
        description: 'Moves for this dancer',
        value: [
          {
            name: 'Color blend',
            type: 'container',
            description: 'Blends colors based on spectrum amplitude',
            value: [
              {
                name: 'Enabled',
                type: 'checkmark',
                description: 'Enable or disable this move (default: disabled)',
                value: !this.props.move_params.COLOR_BLEND.DISABLED,
                set: (value: boolean) => this.props.move_params.COLOR_BLEND.DISABLED = !value
              },
              {
                name: 'End color',
                type: 'color',
                description: 'Higher amplitudes means this color will be more visible',
                value: this.props.move_params.COLOR_BLEND.END_COLOR,
                set: (color: string) => this.props.move_params.COLOR_BLEND.END_COLOR = color
              },
              {
                name: 'Spectrum min.',
                type: 'number',
                description: 'The min cutoff for spectrum analysis for this move (default: 0)',
                value: this.props.move_params.COLOR_BLEND.MIN_SPECTRUM,
                set: (value: number) => this.props.move_params.COLOR_BLEND.MIN_SPECTRUM = value
              },
              {
                name: 'Spectrum max.',
                type: 'number',
                description: 'The max cutoff for spectrum analysis for this move (default: 200)',
                value: this.props.move_params.COLOR_BLEND.MAX_SPECTRUM,
                set: (value: number) => this.props.move_params.COLOR_BLEND.MAX_SPECTRUM = value
              },
              {
                name: 'Threshold',
                type: 'number',
                description: 'Spectrum values beneath threshold will be ignored (default: 0)',
                value: this.props.move_params.COLOR_BLEND.THRESHOLD * 100,
                set: (value: number) => this.props.move_params.COLOR_BLEND.THRESHOLD = value / 100
              },
              {
                name: 'Smoothing',
                type: 'number',
                description: 'Color can\'t return to native at a rater faster than smoothing (higher means faster) (default: 0.002)',
                inc: 0.001,
                value: this.props.move_params.COLOR_BLEND.SMOOTHING,
                set: (value: number) => this.props.move_params.COLOR_BLEND.SMOOTHING = value
              }
            ]
          },
          {
            type: 'container',
            name: 'Particles',
            description: 'Particle system for this dancer',
            value:  [
              {
                type: 'checkmark',
                name: 'Enabled',
                description: 'Enables or disables particles',
                value: this.props.native.particles.enabled,
                set: (value: boolean) => this.props.native.particles.enabled = value
              },
              {
                type: 'number',
                name: 'Amount',
                description: 'Max amount of particles generated per frame',
                value: this.props.native.particles.amount,
                set: (value: number) => this.props.native.particles.amount = value
              },
              {
                type: 'number',
                name: 'Speed mult',
                description: 'Max speed multiplier for particles',
                value: this.props.native.particles.speed_mult,
                inc: 0.1,
                set: (value: number) => this.props.native.particles.speed_mult = value
              },
              {
                type: 'number',
                name: 'RMS Boost',
                description: 'Boosts particle speed by RMS, multiplied by this amount',
                value: this.props.native.particles.rms_boost,
                set: (value: number) => this.props.native.particles.rms_boost = value
              },
              {
                type: 'number',
                name: 'Friction',
                description: 'How quickly a particle loses speed',
                value: this.props.native.particles.friction,
                inc: 0.001,
                set: (value: number) => this.props.native.particles.friction = value
              },
              {
                type: 'number',
                name: 'Life time',
                description: 'Maximum life time (in frames) of particle',
                value: this.props.native.particles.lifetime,
                set: (value: number) => this.props.native.particles.lifetime = value
              },
            ]
          }
        ]
      }
    ];
  }

  highlight(): void {
  }

  onclick(): void {
  }

  reset(): void {
    this.props.temp.color = this.props.native.color;
  }

  unhighlight(): void {
  }

  toJSON(): Object {
    return {
      type: this.constructor.name,
      props: this.props
    };
  }

  fromJSON(props: any) {
    this.props = props;
  }

}
