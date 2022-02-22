import p5 from "p5";

export class TruncatedCone {

    p: p5;
    pos: p5.Vector;
    radTop: number = 0;
    radBottom: number = 0;
    ht: number = 0;

    constructor(p: p5, pos: p5.Vector, radTop: number, radBottom: number, ht: number) {
        this.p = p;
        this.pos = pos;
        this.radTop = radTop;
        this.radBottom = radBottom;
        this.ht = ht;
    }
}