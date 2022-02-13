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

    constructor(p: P5, pos: P5.Vector, spd: P5.Vector, rot: P5.Vector, amp: P5.Vector, freq: P5.Vector, scl: P5.Vector) {
        this.p = p;
        this.pos = pos;
        this.spd = spd;
        this.rot = rot;
        this.amp = amp;
        this.freq = freq;
        this.scl = scl;
        this.spdInit = p.createVector(spd.x, spd.y, spd.z);
    }

    draw(): void {
        this.p.push();
        this.p.translate(this.pos.x, this.pos.y, this.pos.z);
        this.p.rotateX(this.rot.x);
        this.p.rotateY(this.rot.y);
        this.p.rotateZ(this.rot.z);
        this.p.scale(this.scl);
        this.p.line(-1, -1, -1, 1, 1, 1);
        this.p.line(1, 1, 1, 2, 1, -2);
        this.p.pop();
    }

}