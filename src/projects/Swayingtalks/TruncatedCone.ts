import p5 from "p5";

export class TruncatedCone {

    p: p5;
    pos: p5.Vector;
    slices: number;
    radialDetail: number;
    radTop: number = 0;
    radBottom: number = 0;
    ht: number = 0;


    // slices & radialDetail
    pts2D: p5.Vector[][] = [];

    constructor(p: p5, pos: p5.Vector, slices: number, radialDetail: number, radTop: number, radBottom: number, ht: number) {
        this.p = p;
        this.pos = pos;
        this.slices = slices;
        this.radialDetail = radialDetail;
        this.radTop = radTop;
        this.radBottom = radBottom;
        this.ht = ht;

        this.construct();
    }

    construct(): void {
        let theta = 0;
        const radStep = (this.radBottom - this.radTop) / this.slices;
        const htStep = this.ht / this.slices;
        for (let i = 0; i < this.slices; i++) {
            let tempPts: p5.Vector[] = [];
            for (let j = 0; j < this.radialDetail; j++) {
                const x = this.p.sin(theta) * radStep * i;
                const y = -this.ht / 2 + htStep * i
                const z = this.p.cos(theta) * radStep * i;
                tempPts[j] = this.p.createVector(x, y, z);
                theta += this.p.TWO_PI / this.radialDetail;
            }
            this.pts2D.push(tempPts);

        }

    }

    wobble(): void {
    }

    draw(): void {
        this.p.beginShape(this.p.POINTS);
        for (let i = 0; i < this.slices; i++) {
            for (let j = 0; j < this.radialDetail; j++) {
                this.p.vertex(this.pts2D[i][j].x, this.pts2D[i][j].y, this.pts2D[i][j].z);
            }
        }
        this.p.endShape();
    }
}