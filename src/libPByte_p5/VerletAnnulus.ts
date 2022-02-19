import P5 from "p5";
import { VerletBase } from "./VerletBase";
import { VerletNode } from "./VerletNode";
import { VerletStick } from "./VerletStick";
import { VerletStrand } from "./VerletStrand";
import { VerletStyle } from "./VerletStyle";

export class VerletAnnulus extends VerletBase {

    radius: number
    ringEdgeCount: number;
    innerRing: P5.Vector[] = [];
    centroid: P5.Vector;

    ringLen: number;
    outerRing: P5.Vector[] = [];
    outerRingInit: P5.Vector[] = [];
    outerRingThetas: number[] = [];
    outerRingFreqs: number[] = [];
    outerRingAmps: number[] = [];
    radialSeg: number = 0;

    strands: VerletStrand[] = [];




    constructor(p: P5, radius: number, ringEdgeCount: number, innerRing: P5.Vector[], elasticity: number, fillCol: P5.Color, style: VerletStyle) {
        super(p, p.createVector(radius * 2, radius * 2, radius * 2), elasticity, fillCol, style);
        this.radius = radius;
        this.ringEdgeCount = ringEdgeCount;
        this.innerRing = innerRing;
        this.ringLen = this.innerRing.length;
        this.centroid = p.createVector(0, 0, 0);
        this.init();
    }

    init(): void {

        // for outerRing
        const outerRingFreqSeed = this.p.random(this.p.PI / 20, this.p.PI / 120);
        const outerRingAmpSeed = this.p.random(50, 90);

        // get centroid to properly scale annuli at origin
        for (let i = 0; i < this.innerRing.length; i++) {
            this.centroid.add(this.innerRing[i]);
        }
        this.centroid.div(this.innerRing.length - 1);

        // calculate radial segment length between consective rings
        this.radialSeg = (this.radius - this.innerRing[0].mag()) / this.ringEdgeCount;
        for (let i = 0; i < this.ringEdgeCount; i++) {
            const ring: VerletNode[] = [];
            let v = this.p.createVector(0, 0, 0);
            let v2 = this.p.createVector(0, 0, 0);
            for (let j = 0; j < this.innerRing.length; j++) {

                v = this.p.createVector(0, this.innerRing[j].y, this.innerRing[j].z);
                // v.x += v.x;
                // console.log(v.x);
                v.normalize();
                // v.mult(this.radialSeg * i)
                v.y *= (this.radialSeg * i);
                v.z *= (this.radialSeg * i);

                v.y += this.innerRing[j].y;
                v.z += this.innerRing[j].z;

                const vn = new VerletNode(this.p, v, this.style.nodeRadius, this.style.nodeCol);
                ring[j] = vn;
                this.nodes.push(vn)

                // outer ring
                if (i == this.ringEdgeCount - 1) {

                    this.outerRing.push(this.p.createVector(vn.pos.x, vn.pos.y, vn.pos.z));
                    this.outerRingInit.push(this.p.createVector(vn.pos.x, vn.pos.y, vn.pos.z));
                    this.outerRingThetas.push(this.p.sin(this.p.PI / this.ringEdgeCount) * j);
                    this.outerRingFreqs.push(outerRingFreqSeed);
                    this.outerRingAmps.push(outerRingAmpSeed);

                    this.strands.push(new VerletStrand(this.p, vn.pos, this.p.random(40, 90), this.p.random(8, 11), this.p.color(255, this.p.random(125, 185), this.p.random(125, 185), this.p.random(20, 60)), this.p.random(.25, 2.9)));
                }
            }
            this.nodes2D.push(ring);
        }

        // create sticks
        for (let i = 0; i < this.nodes2D.length; i++) {
            for (let j = 0; j < this.nodes2D[i].length; j++) {
                // rings
                if (j < this.nodes2D[i].length - 1) {
                    this.sticks.push(new VerletStick(this.p, this.nodes2D[i][j], this.nodes2D[i][j + 1], this.elasticity, 0, this.p.color(200, 100, 100, this.p.random(20, 90))));
                } else {
                    this.sticks.push(new VerletStick(this.p, this.nodes2D[i][j], this.nodes2D[i][0], this.elasticity, 0, this.p.color(200, 100, 100, this.p.random(20, 90))));
                }

                // spines
                if (i < this.nodes2D.length - 1) {
                    this.sticks.push(new VerletStick(this.p, this.nodes2D[i][j], this.nodes2D[i + 1][j], this.elasticity, 0,
                        this.p.color(255, 255, 255, this.p.random(20, 90))));
                }

                // cross-supports
                // if (i > 0 && j < this.nodes2D[i].length / 2) {
                //     this.sticks.push(new VerletStick(this.p, this.nodes2D[i][j],
                //         this.nodes2D[i][(this.ringLen - 1) - j], 0, 3));
                // }

            }

        }

        // more  cross-supports
        // for (let i = 0; i < this.nodes.length; i++) {
        //     for (let j = this.nodes.length - 1; j > 0; j--) {
        //         const k = this.p.random(this.nodes.length);
        //         if (i != j) {
        //             //   this.sticks.push(new VerletStick(this.p, this.nodes[i], this.nodes[j], 0, 3));
        //         }
        //     }
        // }
        for (let i = 0; i < this.strands.length; i++) {
            this.strands[i].setStickTension(this.p.createVector(.001, .005));
        }
    }

    draw() {

        for (let i = 0; i < this.innerRing.length; i++) {
            this.centroid.add(this.innerRing[i]);

            // attach annulus to body ring
            this.nodes2D[0][i].pos.set(this.innerRing[i]);
        }
        this.centroid.div(this.innerRing.length);

        for (let i = 0, k = 0; i < this.nodes.length; i++) {
            // this.nodes[i].draw();
            if (i > this.innerRing.length) {
                this.nodes[i].verlet();
            }

            // stablize annulus to outer ring
            if (i > this.nodes.length - this.innerRing.length - 1) {
                this.outerRing[k].x = this.outerRingInit[k].x + this.p.sin(this.outerRingThetas[k]) * this.outerRingAmps[k];
                // this.outerRing[k].y = this.outerRingInit[k].y + this.p.sin(this.outerRingThetas[k]) * 100;
                // this.outerRing[k].z = this.outerRingInit[k].z + this.p.sin(this.outerRingThetas[k]) * 100;
                this.nodes[i].pos.x = this.outerRing[k].x + this.centroid.x;
                this.nodes[i].pos.y = this.outerRing[k].y + this.centroid.y;
                this.nodes[i].pos.z = this.outerRing[k].z + this.centroid.z;
                // this.outerRingThetas[k] += this.p.PI / 45;
                this.outerRingThetas[k] += this.outerRingFreqs[k];
                k++
            }
        }

        for (let i = 0; i < this.sticks.length; i++) {
            //this.sticks[i].draw();
            this.sticks[i].constrainLen();
        }

        // render annulus skin
        this.p.fill(this.p.color(this.fillCol));
        this.p.stroke(this.p.color(this.style.stickCol));
        this.p.strokeWeight(this.style.stickWeight);
        //this.p.noStroke();
        for (let i = 0; i < this.nodes2D.length; i++) {
            for (let j = 0; j < this.nodes2D[i].length; j++) {
                this.p.beginShape();
                if (i < this.nodes2D.length - 1) {
                    if (j < this.nodes2D[i].length - 1) {
                        this.p.vertex(this.nodes2D[i][j].pos.x, this.nodes2D[i][j].pos.y, this.nodes2D[i][j].pos.z);
                        this.p.vertex(this.nodes2D[i][j + 1].pos.x, this.nodes2D[i][j + 1].pos.y, this.nodes2D[i][j + 1].pos.z);
                        this.p.vertex(this.nodes2D[i + 1][j + 1].pos.x, this.nodes2D[i + 1][j + 1].pos.y, this.nodes2D[i + 1][j + 1].pos.z);
                        this.p.vertex(this.nodes2D[i + 1][j].pos.x, this.nodes2D[i + 1][j].pos.y, this.nodes2D[i + 1][j].pos.z);
                    } else {
                        this.p.vertex(this.nodes2D[i][j].pos.x, this.nodes2D[i][j].pos.y, this.nodes2D[i][j].pos.z);
                        this.p.vertex(this.nodes2D[i][0].pos.x, this.nodes2D[i][0].pos.y, this.nodes2D[i][0].pos.z);
                        this.p.vertex(this.nodes2D[i + 1][0].pos.x, this.nodes2D[i + 1][0].pos.y, this.nodes2D[i + 1][0].pos.z);
                        this.p.vertex(this.nodes2D[i + 1][j].pos.x, this.nodes2D[i + 1][j].pos.y, this.nodes2D[i + 1][j].pos.z);

                    }
                }
                this.p.endShape(this.p.CLOSE);
            }

        }
        for (let i = 0; i < this.strands.length; i++) {
            this.strands[i].move();
            this.strands[i].draw();
        }

    }

}
