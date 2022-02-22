import p5 from "p5";

export class Spine {
    p: p5;
    pos: p5.Vector
    interpDetail: number;
    col: p5.Color;
    strokeWt: number;

    head: p5.Vector | undefined;
    tail: p5.Vector | undefined;
    pts: p5.Vector[] = [];
    ptsInit: p5.Vector[] = [];

    swayAmps: p5.Vector[] = [];
    swayFreqs: number[] = [];
    swayThetas: number[] = [];

    amps: p5.Vector[] = [];
    freqs: number[] = [];
    thetas: number[] = [];

    constructor(p: p5, pos: p5.Vector, pts: p5.Vector[], interpDetail: number, col: p5.Color, strokeWt: number) {
        this.p = p;
        this.pos = pos;
        this.interpDetail = interpDetail;
        this.col = col;
        this.strokeWt = strokeWt;
        for (let i = 1, k=1; i < pts.length; i++) {
            if (i == 1) {
                this.head = pts[i - 1];
            } else if (i == pts.length - 1) {
                this.tail = pts[i];
            }
            // const temp0 = pts[i - 1].copy();
            // const temp1 = pts[i].copy();
            // const deltaX = (temp1.x - temp0.x) / interpDetail;
            let delta = p5.Vector.sub(pts[i], pts[i - 1]);
            delta.div(interpDetail-1);
            for (let j = 0; j < interpDetail-1; j++) {
                // const x = temp0.x + deltaX * j;
                this.pts.push(p.createVector(pts[i - 1].x + delta.x * j, pts[i - 1].y + delta.y * j, pts[i - 1].z + delta.z * j));
                this.ptsInit.push(p.createVector(pts[i - 1].x + delta.x * j, pts[i - 1].y + delta.y * j, pts[i - 1].z + delta.z * j));

               //this.p.random(52, 52)
                this.thetas.push(this.p.random(-this.p.PI*.01, this.p.PI*.01));
               // this.freqs.push(this.p.PI/(50-k*.095));
                this.freqs.push(this.p.PI/50);
                this.amps.push(p.createVector(k*k*k*.03, 0, k*k*k*.03));
                k++
            }
        }
          //console.log(this.pts);
    }

    sway(): void {
        for (let i = 0; i < this.pts.length; i++) {
           this.pts[i].x = this.ptsInit[i].x + this.p.cos(this.thetas[i])*this.amps[i].x;
        //    this.pts[i].y = this.ptsInit[i].y+ this.p.sin(this.thetas[i])*this.amps[i].y;
            this.pts[i].z = this.ptsInit[i].z + this.p.cos(this.thetas[i])*this.amps[i].z;

           this.thetas[i] += this.freqs[i];
        }
    }

    // sway(amp: p5.Vector, freq: number, theta: number): void {
    // }

    draw(): void {
        this.p.strokeWeight(this.strokeWt)
        this.p.stroke(255, 255, 0);
        this.p.noFill();
       
        this.p.push();
        this.p.translate(this.pos.x, this.pos.y, this.pos.z);
        this.p.beginShape(this.p.POINTS);
        for (let i = 0; i < this.pts.length; i++) {
            this.p.vertex(this.pts[i].x, this.pts[i].y, this.pts[i].z);
        }
        this.p.endShape();
        this.p.pop();
    }


}