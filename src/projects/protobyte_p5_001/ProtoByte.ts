import P5 from "p5";

export class Protobyte {
    p5: P5;
    length: number;
    slices: number;
    radiusMinMax: P5.Vector;
    radialDetail: number;
    pts2D: P5.Vector[][] = [];
    pts2D_init: P5.Vector[][] = [];
    spine: P5.Vector[] = [];
    spine_init: P5.Vector[] = []; // copy of spine data used for movement

    // spine dynamics
    spineTheta = 0;
    spineThetas: number[] = [];

    constructor(p5: P5, length: number, slices: number, radialDetail: number, radiusMinMax: P5.Vector) {
        this.p5 = p5;
        this.length = length;
        this.slices = slices;
        this.radialDetail = radialDetail;
        this.radiusMinMax = radiusMinMax;

        // each cross-section built around x-axis
        const bodySeg = length / slices;
        const radii: number[] = [];
        for (let i = 0, k = 0; i < slices; i++) {
            let theta = 0;
            const radiusDelta = this.radiusMinMax.y - this.radiusMinMax.x;
            const csPts: P5.Vector[] = [];
            const csPts_init: P5.Vector[] = [];
            const x = -length / 2 + bodySeg * i;
            this.spine.push(p5.createVector(x, 0, 0));
            this.spine_init.push(p5.createVector(x, 0, 0));
            this.spineThetas[i] = p5.sin(p5.PI / slices) * i;

            for (let j = 0; j < radialDetail; j++) {
                const y = p5.sin(theta) * (radiusMinMax.x + p5.sin(k) * radiusDelta);
                const z = p5.cos(theta) * (radiusMinMax.x + p5.sin(k) * radiusDelta);
                csPts[j] = p5.createVector(x, y, z);
                csPts_init[j] = p5.createVector(x, y, z);
                theta += p5.TWO_PI / radialDetail;
            }
            k += p5.PI / (slices - 1);
            this.pts2D.push(csPts);
            this.pts2D_init.push(csPts_init);
        }
    }

    draw(): void {
        // spine | only draw in testing mode
        this.p5.beginShape();
        for (let i = 0; i < this.spine.length; i++) {
            // this.p5.vertex(this.spine[i].x, this.spine[i].y, this.spine[i].z);
        }
        this.p5.endShape();

        // body
        for (let i = 0; i < this.pts2D.length; i++) {
            this.p5.beginShape();
            for (let j = 0; j < this.pts2D[i].length; j++) {
                if (i < this.pts2D.length - 1 && j < this.pts2D[i].length - 1) {
                    this.p5.vertex(this.pts2D[i][j].x, this.pts2D[i][j].y, this.pts2D[i][j].z);
                    this.p5.vertex(this.pts2D[i + 1][j].x, this.pts2D[i + 1][j].y, this.pts2D[i + 1][j].z);
                    this.p5.vertex(this.pts2D[i + 1][j + 1].x, this.pts2D[i + 1][j + 1].y, this.pts2D[i + 1][j + 1].z);
                    this.p5.vertex(this.pts2D[i][j + 1].x, this.pts2D[i][j + 1].y, this.pts2D[i][j + 1].z);
                }
            }
            this.p5.endShape(this.p5.CLOSE);
        }
    }

    move(): void {
        // spine move
        for (let i = 0; i < this.spine.length; i++) {
            this.spine[i].y = this.spine_init[i].y + this.p5.sin(this.spineThetas[i]) * 50
            this.spineThetas[i] += this.p5.PI / 90;

            // deform body based on spine motion
            for (let j = 0; j < this.pts2D[i].length; j++) {
                this.pts2D[i][j].x = this.pts2D_init[i][j].x + this.spine[i].y * .5;
                this.pts2D[i][j].y = this.pts2D_init[i][j].y + this.spine[i].y;
            }
        }

    }
}