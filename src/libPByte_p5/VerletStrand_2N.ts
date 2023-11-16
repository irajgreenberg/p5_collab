import p5 from "p5";

import { VerletNode } from "./VerletNode";
import { VerletStick } from "./VerletStick";

export class VerletStrand_2N {
    p: p5;
    head: p5.Vector;
    tail: p5.Vector | undefined;
    nodeCount: number;
    col: p5.Color;
    strokeWt: number;

    nodes: VerletNode[] = [];
    sticks: VerletStick[] = [];

    stickTension: p5.Vector;

    constructor(p: p5, head: p5.Vector, tail: p5.Vector, nodeCount: number, col: p5.Color, strokeWt: number, stickTension: p5.Vector = p.createVector(.01, .3)) {
        this.p = p;
        this.head = head;
        this.tail = tail;
        let strandVector = this.tail.copy().sub(this.head);

        let strandVectorNormalized = strandVector.copy().normalize();
        let len = this.tail.copy().sub(this.head).mag();
        this.nodeCount = nodeCount;
        this.col = col;
        this.strokeWt = strokeWt;
        this.stickTension = stickTension;

        const lenSeg = len / nodeCount;
        for (let i = 0; i <= nodeCount; i++) {
            let n: p5.Vector | undefined;
            if (i == 0) {
                n = head;
            } if (i == this.nodeCount) {
                n = tail;
            } else {
                const x = this.head.x + strandVectorNormalized.x * lenSeg * i;
                const y = this.head.y + strandVectorNormalized.y * lenSeg * i;
                const z = this.head.z + strandVectorNormalized.z * lenSeg * i;
                n = p.createVector(x, y, z);
            }
            this.nodes[i] = new VerletNode(p, n, 20, col);
            if (i > 0) {
                this.sticks.push(new VerletStick(p, this.nodes[i - 1], this.nodes[i], p.random(this.stickTension.x, this.stickTension.y), 0, col));
            }
        }
    }

    // this doesn't due anything if I don't update Sticks
    setStickTension(stickTension: p5.Vector): void {
        this.stickTension = stickTension;
    }



    move(lockedNode: number = 0): void {
        for (let i = 0; i < this.nodeCount; i++) {
            // this.nodes[i].verlet();
            if (lockedNode == 0) {
                if (i > 0) {
                    this.nodes[i].verlet();
                    this.sticks[i - 1].constrainLen();
                }
            } else if (lockedNode == 1) {
                if (i < this.nodes.length - 2) {
                    this.nodes[i].verlet();
                    this.sticks[i].constrainLen();
                }
            }
        }
    }

    draw(isNodeDrawable: boolean = false, isStickDrawable: boolean = true): void {
        this.p.strokeWeight(this.strokeWt);
        for (let i = 0; i < this.nodeCount; i++) {
            if (isNodeDrawable) {
                // this.nodes[i].radius = this;
                this.nodes[i].draw(1);

                // this.nodes[i].set
            }
            if (i > 0 && isStickDrawable) {
                this.sticks[i - 1].draw();
            }
        }
    }

}