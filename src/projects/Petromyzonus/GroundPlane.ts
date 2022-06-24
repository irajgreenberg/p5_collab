import P5 from "p5";
import { VerletStrand } from "../../libPByte_p5/VerletStrand";

export class GroundPlane {
    p: P5;
    colRange: P5.Vector;
    // 2d array to hold plane vertex data
    verts2D: P5.Vector[][] = [];
    vertsInit2D: P5.Vector[][] = [];
    cols2D: P5.Vector[][] = [];

    // seaweed stalks
    seaWeedStalks: VerletStrand[] = [];
    reedTipverts: P5.Vector[] = []; // for elctrical transmissio between reeds and creature
    //motionVecs

    // pulsing reed tips
    lights: P5.Color[] = [];
    lightAmps: number[] = [];
    lightFreqs: number[] = [];
    lightThetas: number[] = [];

    constructor(p: P5, dim: P5.Vector, cols: number, rows: number, colRange: P5.Vector) {
        this.p = p;
        this.colRange = colRange;
        const colStep = dim.x / (cols + 1);
        const rowStep = dim.z / (rows + 1);
        for (let i = 0, k = 0; i < cols; i++) {
            this.verts2D[i] = [];
            this.vertsInit2D[i] = [];
            this.cols2D[i] = [];
            for (let j = 0; j < rows; j++) {
                const x = -dim.x / 2 + colStep * i;
                const z = -dim.z / 2 + rowStep * j;
                this.verts2D[i][j] = p.createVector(x, p.random(dim.y * 2), z);
                this.vertsInit2D[i][j] = this.verts2D[i][j].copy();
                const tint = p.random(-.9, 1.1);
                this.cols2D[i][j] = p.createVector(this.colRange.x * tint, this.colRange.y * tint, this.colRange.z * tint);

                if (i % 1 == 0 && j % 2 == 0) {
                    this.seaWeedStalks.push(new VerletStrand(this.p,
                        this.verts2D[i][j], //head
                        p.random(-600, -150), // lenth
                        p.int(p.random(2, 4)), // nodeCount
                        p.color(this.p.color(p.random(255), p.random(50, 90))), // color
                        p.random(.75, 1)));  // strokeWeight
                }
            }
        }
        for (let i = 0; i < this.seaWeedStalks.length; i++) {
            this.seaWeedStalks[i].nodes[this.seaWeedStalks[i].nodes.length - 1].pos.x += this.p.random(-20, 20);
            this.seaWeedStalks[i].nodes[this.seaWeedStalks[i].nodes.length - 1].pos.z += this.p.random(-20, 20);

            // pulsing reed tips
            this.lights.push(p.color(255 - p.random(40), 255 - p.random(40), 255 - p.random(40), 255));
            this.lightAmps.push(255);
            this.lightFreqs.push(p.PI / p.random(2, 15));
            this.lightThetas.push(0);
        }
    }

    draw() {
        this.p.noStroke();

        for (let i = 0; i < this.verts2D.length - 1; i++) {
            for (let j = 0; j < this.verts2D[i].length - 1; j++) {
                this.p.beginShape();
                this.p.fill(this.p.color(this.cols2D[i][j].x, this.cols2D[i][j].y, this.cols2D[i][j].z, 100)); //100
                this.p.vertex(this.vertsInit2D[i][j].x, this.vertsInit2D[i][j].y, this.vertsInit2D[i][j].z);
                this.p.vertex(this.vertsInit2D[i + 1][j].x, this.vertsInit2D[i + 1][j].y, this.vertsInit2D[i + 1][j].z);
                this.p.vertex(this.vertsInit2D[i + 1][j + 1].x, this.vertsInit2D[i + 1][j + 1].y, this.vertsInit2D[i + 1][j + 1].z);
                this.p.vertex(this.vertsInit2D[i][j + 1].x, this.vertsInit2D[i][j + 1].y, this.vertsInit2D[i][j + 1].z);
                this.p.endShape(this.p.CLOSE);

            }
        }

        // Add a little inertial jitter to tail, based on organim's path
        // keeps tail behind body
        // const x = this.spine[this.spine.length - 1].x - this.spine[0].x;
        // const y = this.spine[this.spine.length - 1].y - this.spine[0].y;
        // const z = this.spine[this.spine.length - 1].z - this.spine[0].z;
        // let motionVec = this.p.createVector(x, y, z);
        // motionVec.normalize();
        // motionVec.mult(this.p.random(-2, -6.2));

        for (let i = 0; i < this.seaWeedStalks.length; i++) {
            let motionVec = this.p.createVector(0, -10, 0);
            // motionVec.normalize();
            motionVec.mult(this.p.random(.2, .75));
            this.seaWeedStalks[i].nodes[this.seaWeedStalks[i].nodes.length - 1].pos.y += motionVec.y;
            this.seaWeedStalks[i].nodes[this.seaWeedStalks[i].nodes.length - 1].pos.x += this.p.random(-1, 1)
            this.seaWeedStalks[i].nodes[0].pos.y += this.p.random(-1, 1)


            this.seaWeedStalks[i].draw();
            this.seaWeedStalks[i].move(0);


            // blinking lights
            this.p.push();
            this.p.translate(this.seaWeedStalks[i].nodes[this.seaWeedStalks[i].nodes.length - 1].pos);
            this.p.noStroke();
            this.p.fill(this.lights[i]);
            this.p.rect(-40, -40, 80, 80);
            this.p.pop();
            let ColComp = this.p.sin(this.lightThetas[i]) * this.lightAmps[i];
            this.lights[i] = this.p.color(255 - this.p.random(80), 255 - this.p.random(80), 255 - this.p.random(80), ColComp);
            this.lightThetas[i] += this.lightFreqs[i];

            this.reedTipverts[i] = this.seaWeedStalks[i].nodes[this.seaWeedStalks[i].nodes.length - 1].pos;
        }
    }

    getReedTipverts(): P5.Vector[] {
        return this.reedTipverts;
    }
}