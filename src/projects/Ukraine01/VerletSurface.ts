/** 
 * Abstract class for building
 * Verlet surfaces.
 * By: Ira Greenberg 
 * December 2010
 */

import p5 from "p5";
import { Dimension3 } from "./Dimension3";
import { VerletNode } from "src/libPByte_p5/VerletNode"
import { VerletStick } from "src/libPByte_p5/VerletStick";
import { Triangle3 } from "./Triangle3";


export abstract class VerletSurface {

    p: p5;
    loc: p5.Vector;
    dim: Dimension3;
    // for tethering surface
    anchors: p5.Vector[] = [];
    isFixedIndex: boolean[] = [];

    // for verlet sticks
    tension = .4;

    vBalls: VerletNode[] = []
    vBalls2D: VerletNode[][] = []; // convenience datatype
    vBallInitPos: p5.Vector[] = [];
    vSticks: VerletStick[] = [];
    uvs: p5.Vector[][] = [] // UV Texturing

    // Used to calculate vertex normals for smooth shading
    tris: Triangle3[] = [];
    //PVector[] sNorms;
    vNorms: p5.Vector[] = [];
    // Used for applied force to surface
    theta = 0.0;

    constructor(p: p5, loc: p5.Vector, dim: Dimension3) {
        this.p = p;
        this.loc = loc;
        this.dim = dim;
    }
    // implement these in subclass

    abstract init(): void;
    abstract createVBalls(): void;
    abstract createVSticks(): void;
    abstract createTris(): void;
    abstract createAnchors(): void;
    abstract setAnchors(): void;
    abstract render(isBallVisible: boolean, isStickVisible: boolean, isSurfaceVisible: boolean): void;

    createVertexNormals(): void {
        for (let i = 0; i < this.vBalls.length; i++) {
            let vn = new p5.Vector();
            let triCntr = 0;
            for (let j = 0; j < this.tris.length; j++) {
                if (this.vBalls[i].pos == this.tris[j].v0 || this.vBalls[i].pos == this.tris[j].v1 || this.vBalls[i].pos == this.tris[j].v2) {
                    triCntr++;
                    vn.add(this.tris[j].getNormal());
                }
            }
            vn.div(triCntr);
            this.vNorms[i] = vn;
        }
    }

    // apply mouse touch (2D screen coord) to object deformation (3D model coord)
    // use gluProject
    // screenX/screenY not currently implemented in p5
    // supposedly this adds it: https://github.com/bohnacker/p5js-screenPosition
    // haven't looked at it yet.
    // applyForce(mx: number, my: number, amp: number, freq: number): void {
    //     let id = 0;
    //     let x = this.p.screenX(this.vBalls[0].pos.x, this.vBalls[0].pos.y, this.vBalls[0].pos.z);
    //     let y = this.p.screenY(this.vBalls[0].pos.x, this.vBalls[0].pos.y, this.vBalls[0].pos.z);
    //     let d = this.p.dist(mx, my, x, y);
    //     for (let i = 1; i < this.vBalls.length; i++) {
    //         x = screenX(vBalls[i].pos.x, vBalls[i].pos.y, vBalls[i].pos.z);
    //         y = screenY(vBalls[i].pos.x, vBalls[i].pos.y, vBalls[i].pos.z);
    //     float d2 = dist(mx, my, x, y);
    //         if (d2 < d) {
    //             id = i;
    //             d = d2;
    //         }
    //     }
    //     //vBalls[id].pos.y = vBallInitPos[id].y+cos(theta)*amp;
    //     vBalls[id].pos.y += amp/*5400;*/ /*40*/;
    //     //vBalls[id].pos.y = vBallInitPos[id].y+amp;
    //     theta += freq * PI / 180;
    //     amp *= .1;
    // }

    // Starts Verlet and constraints, including anchors
    start(): void {
        // start verlet
        for (let i = 0; i < this.vBalls.length; i++) {
            this.vBalls[i].verlet();
            this.setAnchors();
        }

        // Start constrain
        for (let i = 0; i < this.vSticks.length; i++) {
            this.vSticks[i].constrainLen();
        }
    }

    getTris(): Triangle3[] | null {
        if (this.tris != null) {
            return this.tris;
        }
        return null;
    }

    getVBalls(): VerletNode[] {
        return this.vBalls;
    }

    getVNorms(): p5.Vector[] {
        return this.vNorms;
    }

    imgReset(id: number): void { };
}