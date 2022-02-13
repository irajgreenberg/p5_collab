import P5 from "p5";

export class DustParticle {
    p: P5;
    pos: P5.Vector
    spd: P5.Vector;
    rot: P5.Vector;
    spdInit: P5.Vector;
    amp: P5.Vector;
    freq: P5.Vector;
    scl: P5.Vector;
    theta: P5.Vector;

    col: P5.Color | undefined
    strokeWt = 0;

    constructor(p: P5, pos: P5.Vector, spd: P5.Vector, rot: P5.Vector, amp: P5.Vector, freq: P5.Vector, scl: P5.Vector) {
        this.p = p;
        this.pos = pos;
        this.spd = spd;
        this.rot = rot;
        this.amp = amp;
        this.freq = freq;
        this.scl = scl;
        this.spdInit = p.createVector(spd.x, spd.y, spd.z);

        this.theta = p.createVector(0, 0, 0);
        this.col = p.color(p.random(100, 220), p.random(80, 150), p.random(150, 205), p.random(60, 140));
        this.strokeWt = p.random(.1, 2.5);
    }

    setLineStye(col: P5.Color, strokeWt: number): void {
        this.col = col;
        this.strokeWt = strokeWt;
    }

    draw(): void {
        this.p.noFill();
        this.p.stroke(this.col!);
        this.p.strokeWeight(this.strokeWt);
        this.p.push();
        this.p.translate(this.pos.x, this.pos.y, this.pos.z);
        this.p.rotateX(this.p.frameCount * this.rot.x);
        this.p.rotateY(this.p.frameCount * this.rot.y);
        this.p.rotateZ(this.p.frameCount * this.rot.z);
        this.p.scale(this.scl);
        this.p.line(this.p.random(-2, -1), this.p.random(-2, -1), this.p.random(-2, -1),
            this.p.random(1, 2), this.p.random(1, 2), this.p.random(1, 2));
        this.p.line(this.p.random(-2, -1), this.p.random(2, 1), this.p.random(-2, -1),
            this.p.random(1, 2), this.p.random(1, 2), this.p.random(1, 2));
        this.p.pop();
    }

    move(): void {
        this.pos.x = this.p.sin(this.theta.x) * this.amp.x;
        this.pos.y = this.p.sin(this.theta.y) * this.amp.y;
        this.pos.z = this.p.cos(this.theta.z) * this.amp.z;
        console.log(this.pos.x);
        this.theta.x += this.freq.x;
        this.theta.y += this.freq.y;
        this.theta.z += this.freq.z;
    }
}