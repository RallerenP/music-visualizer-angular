import { scale } from "../../../../util";

export class Particle {
  public dead: boolean = false;

  private frame = 0;
  constructor(
    private x: number,
    private y: number,
    private vely: number,
    private friction: number,
    private lifetime: number,
    private ctx: CanvasRenderingContext2D
  ) {
  }

  update() {
    this.vely -= this.friction;
    this.y -= this.vely;

    this.frame++;

    if(this.frame > this.lifetime) this.dead = true;


  }

  draw() {
    const val = Math.floor(255 - scale(this.frame, 0, this.lifetime, 0, 255)).toString(16).padStart(2, '0');

    this.ctx.fillStyle = `#${val}${val}${val}`;
    this.ctx.fillRect(this.x, this.y, 1, 1)
  }


}
