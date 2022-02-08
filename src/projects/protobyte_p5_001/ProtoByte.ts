import P5 from "p5";
import { NodeType } from "../../libPByte_p5/PByte_utils";
import { VerletAnnulus } from "../../libPByte_p5/VerletAnnulus";
import { VerletStrand } from "../../libPByte_p5/VerletStrand";
import { VerletStyle } from "../../libPByte_p5/VerletStyle";

export class Protobyte {
    p: P5;
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

    strands: VerletStrand[] = [];

    // annuli
    annulus: VerletAnnulus;
    annulus2: VerletAnnulus;
    annulus3: VerletAnnulus;

    constructor(p: P5, length: number, slices: number, radialDetail: number, radiusMinMax: P5.Vector) {
        this.p = p;
        this.length = length;
        this.slices = slices;
        this.radialDetail = radialDetail;
        this.radiusMinMax = radiusMinMax;

        // each cross-section built around x-axis
        const bodySeg = length / slices;
        const radii: number[] = [];
        for (let i = 0, k = 0; i < slices; i++) {
            const radiusDelta = this.radiusMinMax.y - this.radiusMinMax.x;
            const csPts: P5.Vector[] = [];
            const csPts_init: P5.Vector[] = [];
            const x = -length / 2 + bodySeg * i;
            this.spine.push(p.createVector(x, 0, 0));
            this.spine_init.push(p.createVector(x, 0, 0));
            this.spineThetas[i] = p.sin(p.PI / slices) * i;

            let theta = 0;
            for (let j = 0; j < radialDetail; j++) {
                const y = p.sin(theta) * (radiusMinMax.x + p.sin(k) * radiusDelta);
                const z = p.cos(theta) * (radiusMinMax.x + p.sin(k) * radiusDelta);
                csPts[j] = p.createVector(x, y, z);
                csPts_init[j] = p.createVector(x, y, z);
                theta += p.TWO_PI / radialDetail;

                // dangling strands
                if (i == 0) {
                    this.strands.push(new VerletStrand(p, csPts[j], p.random(30, 110), p.int(p.random(10, 20)), p.color(255, 200, 200, 60)));
                } else if (j % 1 == 0) {
                    this.strands.push(new VerletStrand(p, csPts[j], p.random(5, 10), p.int(p.random(3, 6)), p.color(200, 255, 200, 35)));
                }
            }
            k += p.PI * .5 / (slices - 1);
            this.pts2D.push(csPts);
            this.pts2D_init.push(csPts_init);
        }

        const vs = new VerletStyle(.3, p.color(190, 190, 255, 255), 255, NodeType.SPHERE, p.color(0), .5, .2);
        this.annulus = new VerletAnnulus(p, 200, 6, this.pts2D[2], .2, p.color(100, 200, 100), vs);
        this.annulus2 = new VerletAnnulus(p, 100, 13, this.pts2D[8], .04, p.color(100, 200, 100), vs);
        this.annulus3 = new VerletAnnulus(p, 100, 3, this.pts2D[13], .004, p.color(100, 200, 100), vs);
    }

    draw(): void {
        // spine | only draw in testing mode
        this.p.fill(0, 0);
        this.p.stroke(65, 45, 200);
        this.p.beginShape();
        for (let i = 0; i < this.spine.length; i++) {
            // this.p.vertex(this.spine[i].x, this.spine[i].y, this.spine[i].z);
        }
        this.p.endShape();

        // body
        // cross-sections
        this.p.fill(130, 150, 160);
        this.p.stroke(255, 40);
        for (let i = 0; i < this.pts2D.length; i++) {
            // radial segments
            for (let j = 0; j < this.pts2D[i].length; j++) {
                if (i < this.pts2D.length - 1) {
                    this.p.beginShape();
                    if (j < this.pts2D[i].length - 1) {
                        this.p.vertex(this.pts2D[i][j].x, this.pts2D[i][j].y, this.pts2D[i][j].z);
                        this.p.vertex(this.pts2D[i + 1][j].x, this.pts2D[i + 1][j].y, this.pts2D[i + 1][j].z);
                        this.p.vertex(this.pts2D[i + 1][j + 1].x, this.pts2D[i + 1][j + 1].y, this.pts2D[i + 1][j + 1].z);
                        this.p.vertex(this.pts2D[i][j + 1].x, this.pts2D[i][j + 1].y, this.pts2D[i][j + 1].z);
                    } else {
                        this.p.vertex(this.pts2D[i][j].x, this.pts2D[i][j].y, this.pts2D[i][j].z);
                        this.p.vertex(this.pts2D[i + 1][j].x, this.pts2D[i + 1][j].y, this.pts2D[i + 1][j].z);
                        this.p.vertex(this.pts2D[i + 1][0].x, this.pts2D[i + 1][0].y, this.pts2D[i + 1][0].z);
                        this.p.vertex(this.pts2D[i][0].x, this.pts2D[i][0].y, this.pts2D[i][0].z);
                    }
                    this.p.endShape(this.p.CLOSE);
                }
            }
        }

        //dangling strands
        for (let i = 0; i < this.strands.length; i++) {
            this.strands[i].draw();
        }


        this.annulus.draw();
        this.annulus2.draw();
        this.annulus3.draw();
        // this.annulus.verlet();
    }

    move(): void {
        // spine move
        for (let i = 0; i < this.spine.length; i++) {
            this.spine[i].y = this.spine_init[i].y + this.p.sin(this.spineThetas[i]) * 80
            this.spineThetas[i] += this.p.PI / 80;// - (this.p.frameCount * .2));

            // deform body based on spine motion
            for (let j = 0; j < this.pts2D[i].length; j++) {
                this.pts2D[i][j].x = this.pts2D_init[i][j].x + this.spine[i].y * .5;
                this.pts2D[i][j].y = this.pts2D_init[i][j].y + this.spine[i].y;
            }
        }

        for (let i = 0; i < this.strands.length; i++) {
            this.strands[i].move();
        }
    }

}