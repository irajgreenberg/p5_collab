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
    // cols: P5.Color[] = [];
    colR: number[] = [];
    colB: number[] = [];
    colG: number[] = [];

    // spine dynamics
    spineTheta = 0;
    spineThetas: number[] = [];

    strands: VerletStrand[] = [];

    // annuli
    annulus: VerletAnnulus | undefined;
    annulus2: VerletAnnulus | undefined;
    annulus3: VerletAnnulus | undefined;

    // swarm
    smarmCount = 500;
    smarmSpd: P5.Vector[] = [];
    smarmRad: number[] = [];
    smarmFreqRange: P5.Vector | undefined;
    smarmAmpRange: P5.Vector | undefined;
    smarmRadRange: P5.Vector | undefined;


    // bubbles
    bubbleCount = 300;
    bubblePos: P5.Vector[] = [];
    bubbleSpd: P5.Vector[] = [];
    bubbleSpdInit: P5.Vector[] = [];
    bubbleTempCount = 0; // for varible emission
    bubbleFreq: number[] = [];
    bubbleAmp: number[] = [];
    bubbleRad: number[] = [];
    bubbleFreqRange: P5.Vector | undefined;
    bubbleAmpRange: P5.Vector | undefined;
    bubbleRadRange: P5.Vector | undefined;
    bubbleEmissionRate = .1;

    constructor(p: P5, length: number, slices: number, radialDetail: number, radiusMinMax: P5.Vector) {
        this.p = p;
        this.length = length;
        this.slices = slices;
        this.radialDetail = radialDetail;
        this.radiusMinMax = radiusMinMax;




        // each cross-section built around x-axis
        const bodySeg = length / slices;
        const radii: number[] = [];
        for (let i = 0, k = 0, l = 0; i < slices; i++) {
            const radiusDelta = this.radiusMinMax.y - this.radiusMinMax.x;
            const csPts: P5.Vector[] = [];
            const csPts_init: P5.Vector[] = [];
            const x = -length / 2 + bodySeg * i;
            this.spine.push(p.createVector(x, 0, 0));
            this.spine_init.push(p.createVector(x, 0, 0));
            this.spineThetas[i] = p.sin(p.PI / slices) * i;
            let theta = 0;
            for (let j = 0; j < radialDetail; j++) {
                l = i * radialDetail + j;
                const y = p.sin(theta) * (radiusMinMax.x + p.sin(k) * radiusDelta);
                const z = p.cos(theta) * (radiusMinMax.x + p.sin(k) * radiusDelta);
                csPts[j] = p.createVector(x, y, z);
                csPts_init[j] = p.createVector(x, y, z);
                theta += p.TWO_PI / radialDetail;

                // dangling strands
                if (i == 0) {
                    this.strands.push(new VerletStrand(p, csPts[j], p.random(5, 160), p.int(p.random(5, 7)), p.color(0, 100, 100, 150)));
                } else if (j % 2 == 0) {
                    this.strands.push(new VerletStrand(p, csPts[j], p.random(5, 100), p.int(p.random(3, 6)), p.color(200, 255, 200, 35)));
                }
                this.colR[l] = 60 + p.random(70);
                this.colG[l] = 60 + p.random(70);
                this.colB[l] = 180 + p.random(70);

            }

            k += p.PI / (slices - 1);
            this.pts2D.push(csPts);
            this.pts2D_init.push(csPts_init);

        }

        const vs = new VerletStyle(.3, p.color(255, p.random(205, 255), 0, 255), 255, NodeType.SPHERE, p.color(0), .5, .2);
        this.annulus = new VerletAnnulus(p, 90, 8, this.pts2D[4], .002, p.color(100, 200, 100), vs);
        this.annulus2 = new VerletAnnulus(p, 120, 8, this.pts2D[8], .009, p.color(100, 200, 100), vs);
        this.annulus3 = new VerletAnnulus(p, 90, 8, this.pts2D[11], .004, p.color(100, 200, 100), vs);

        // Bubbles
        this.bubbleFreqRange = this.p.createVector(this.p.PI / 270, this.p.PI / 45);
        this.bubbleAmpRange = this.p.createVector(5, 25);
        this.bubbleRadRange = this.p.createVector(13, 16);
        for (let i = 0; i < this.bubbleCount; i++) {
            this.bubblePos[i] = this.p.createVector(this.length / 2.05, 0, 0);
            const s = this.p.createVector(this.p.random(-1, 1), this.p.random(3.4, 3.2), this.p.random(-1, 1));
            this.bubbleSpd[i] = this.p.createVector(s.x, s.y, s.z);
            this.bubbleSpdInit[i] = this.p.createVector(s.x, s.y, s.z); //deep copy of bubbleSpd
            this.bubbleFreq[i] = this.p.random(this.bubbleFreqRange.x, this.bubbleFreqRange.y);
            this.bubbleAmp[i] = this.p.random(this.bubbleAmpRange.x, this.bubbleAmpRange.y);
            this.bubbleRad[i] = this.p.random(this.bubbleRadRange.x, this.bubbleRadRange.y);
        }
    }


    draw(): void {
        // spine | only draw in testing mode
        // this.p.fill(0, 0);
        // this.p.stroke(65, 45, 200);
        // this.p.beginShape();
        // for (let i = 0; i < this.spine.length; i++) {
        //     // this.p.vertex(this.spine[i].x, this.spine[i].y, this.spine[i].z);
        // }
        // this.p.endShape();

        // // body
        // cross-sections
        // this.p.fill(130, 150, 160);
        //this.p.stroke(255, 140);
        this.p.noStroke();

        for (let i = 0, k = 0; i < this.pts2D.length; i++) {
            // radial segments
            for (let j = 0; j < this.pts2D[i].length; j++) {
                if (i < this.pts2D.length - 1) {

                    this.p.beginShape(this.p.LINES);
                    this.p.fill(this.colR[k], this.colR[k], this.colR[k]);
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

                    k++;
                }

            }

        }
        //dangling strands
        this.p.strokeWeight(14);
        for (let i = 0; i < this.strands.length; i++) {
            this.strands[i].draw();
        }

        this.p.strokeWeight(1.3);
        // this.annulus!.draw();
        // this.annulus2!.draw();
        // this.annulus3!.draw();
        // this.annulus.verlet();

        this.p.noFill();
        // Bubbles
        for (let i = 0; i < this.bubbleTempCount; i++) {
            this.p.push();
            this.p.translate(this.bubblePos[i].x, this.bubblePos[i].y, this.bubblePos[i].z);
            this.p.box(this.bubbleRad[i] * 2, this.bubbleRad[i] * 2, this.bubbleRad[i] * 2)
            this.p.pop();
        }
        if (this.bubbleTempCount < this.bubbleCount - this.bubbleEmissionRate) {
            this.bubbleTempCount += this.bubbleEmissionRate;
        }

    }

    move(): void {
        // spine move
        for (let i = 0; i < this.spine.length; i++) {
            this.spine[i].y = this.spine_init[i].y + this.p.sin(this.spineThetas[i]) * 60
            this.spineThetas[i] += this.p.PI / 90;// - (this.p.frameCount * .2));

            // deform body based on spine motion
            for (let j = 0; j < this.pts2D[i].length; j++) {
                this.pts2D[i][j].x = this.pts2D_init[i][j].x + this.spine[i].y * .5;
                this.pts2D[i][j].y = this.pts2D_init[i][j].y + this.spine[i].y;
            }
        }

        for (let i = 0; i < this.strands.length; i++) {
            this.strands[i].move();
        }

        // Bubbles
        for (let i = 0; i < this.bubbleTempCount; i++) {
            this.bubblePos[i].add(this.bubbleSpd[i]);
        }
    }

}