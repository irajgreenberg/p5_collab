import p5 from "p5";

export class Spine {

    p: p5;
    interpDetail: number;
    col: p5.Color;
    strokeWt: number;

    head: p5.Vector;
    tail: p5.Vector;
    pts: p5.Vector[] = [];

    swayAmps: p5.Vector[] = [];
    swayFreqs: number[] = [];
    swayThetas: number[] = [];



    constructor(p: p5, pts: p5.Vector[], interpDetail: number, col: p5.Color, strokeWt: number) {
        this.p = p;
        this.col = col;
        this.strokeWt = strokeWt;

    }

    setSway(amp: p5.Vector, freq: number, theta: number): void {

    }

}