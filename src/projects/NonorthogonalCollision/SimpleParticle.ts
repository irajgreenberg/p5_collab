import p5 from "p5";

export class SimpleParticle {
    p: p5;
    pos: p5.Vector;
    spd: p5.Vector;

    constructor(p: p5, pos: p5.Vector, spd: p5.Vector) {
        this.p = p;
        this.pos = pos;
        this.spd = spd;
    }

    move() {
        this.pos.add(this.spd);
    }

    draw() {
        this.p.ellipse(this.pos.x, this.pos.y, 5, 5);
    }
}