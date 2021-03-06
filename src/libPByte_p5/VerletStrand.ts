import P5 from "p5";

import { VerletNode } from "./VerletNode";
import { VerletStick } from "./VerletStick";

export class VerletStrand {
    p: P5;
    head: P5.Vector;
    len: number;
    nodeCount: number;
    col: P5.Color;
    strokeWt: number;

    nodes: VerletNode[] = [];
    sticks: VerletStick[] = [];

    stickTension: P5.Vector;

    constructor(p: P5, head: P5.Vector, len: number, nodeCount: number, col: P5.Color, strokeWt: number) {
        this.p = p;
        this.head = head;
        this.len = len;
        this.nodeCount = nodeCount;
        this.col = col;
        this.strokeWt = strokeWt;
        this.stickTension = p.createVector(.01, .3);

        const lenSeg = len / nodeCount;
        for (let i = 0; i < nodeCount; i++) {
            let n: P5.Vector | undefined;
            if (i == 0) {
                n = head;
            } else {
                n = p.createVector(head.x, head.y + lenSeg * i, head.z);
            }
            this.nodes[i] = new VerletNode(p, n, .2, col);
            if (i > 0) {
                this.sticks.push(new VerletStick(p, this.nodes[i - 1], this.nodes[i], p.random(this.stickTension.x, this.stickTension.y), 0, col));
            }
        }
    }

    setStickTension(stickTension: P5.Vector): void {
        this.stickTension = stickTension;
    }



    move(): void {
        for (let i = 0; i < this.nodeCount; i++) {
            this.nodes[i].verlet();
            if (i > 0) {
                this.sticks[i - 1].constrainLen();
            }
        }
    }

    draw(): void {
        this.p.strokeWeight(this.strokeWt);
        for (let i = 0; i < this.nodeCount; i++) {
            this.nodes[i].draw();
            if (i > 0) {
                this.sticks[i - 1].draw();
            }
        }
    }

}