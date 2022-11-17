import p5 from "p5";

export class Particle {

    p: p5;
    pos: p5.Vector;
    spd: p5.Vector;
    radius: number;
    col: p5.Color;

    damping = 0.75;
    friction = 0.8;
    jitter = 0;
    jitterAmp = 0;
    jitterTheta = 0;
    jitterFreq = 0;

    constructor(p: p5, pos: p5.Vector, spd: p5.Vector, radius: number, col: p5.Color) {
        this.p = p;
        this.pos = pos;
        this.spd = spd;
        this.radius = radius;
        this.col = col;

        this.jitterAmp = this.p.random(1, 3);
        this.jitterTheta = this.p.random(this.p.TWO_PI);
        this.jitterFreq = this.p.random(1, 30);
    }

    move(gravity: number) {
        this.jitter = this.p.cos(this.jitterTheta * this.p.PI / 180) * this.jitterAmp
        this.pos.x += this.spd.x + this.jitter;
        this.spd.y += gravity;
        this.pos.y += this.spd.y;

        if (this.pos.x >= this.p.width - this.radius) {
            this.spd.x *= -1;
        } else if (this.pos.x <= this.radius) {
            this.spd.x *= -1;
        }

        if (this.pos.y > this.p.height - this.radius) {
            this.pos.y = this.p.height - this.radius;
            this.spd.y *= -1;
            this.spd.y *= this.damping;
            this.spd.x *= this.friction;
            this.jitterAmp *= this.friction;
        }
        this.jitterTheta += this.jitterFreq;
    }

    draw() {
        this.p.noFill();
        this.p.stroke(this.col);
        this.p.ellipse(this.pos.x, this.pos.y, this.radius * 2, this.radius * 2);
    }
}
