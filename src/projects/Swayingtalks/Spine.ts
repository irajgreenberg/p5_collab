import p5 from "p5";

export class Spine {

    p: p5;
    interpDetail: number;
    col: p5.Color;
    strokeWt: number;

    head: p5.Vector | undefined;
    tail: p5.Vector | undefined;
    pts: p5.Vector[] = [];

    swayAmps: p5.Vector[] = [];
    swayFreqs: number[] = [];
    swayThetas: number[] = [];



    constructor(p: p5, pts: p5.Vector[], interpDetail: number, col: p5.Color, strokeWt: number) {
        this.p = p;
        this.interpDetail = interpDetail;
        this.col = col;
        this.strokeWt = strokeWt;
        for (let i = 1; i < pts.length; i++) {
            if (i == 1) {
                this.head = pts[i - 1];
            } else if (i == pts.length - 1) {
                this.tail = pts[i];
            }
            // const temp0 = pts[i - 1].copy();
            // const temp1 = pts[i].copy();
            // const deltaX = (temp1.x - temp0.x) / interpDetail;
            let delta = p5.Vector.sub(pts[i], pts[i - 1]);
            for (let j = 0; j < interpDetail; j++) {
                // const x = temp0.x + deltaX * j;
                this.pts.push(p.createVector(pts[i - 1].x + delta.x * j, pts[i - 1].y + delta.y * j, pts[i - 1].z + delta.z * j));
            }
        }

    }

    setSway(amp: p5.Vector, freq: number, theta: number): void {

    }

}