// Hydrozoa
// Ira Greenberg
// Santa Fe, NM | Dallas, TX

// Class Description: 

import p5 from "p5";
import { VerletNode } from "../../libPByte_p5/VerletNode";
import { VerletStick } from "../../libPByte_p5/VerletStick";
import { VerletStrand } from "../../libPByte_p5/VerletStrand";
import { VerletStrand_2N } from "../../libPByte_p5/VerletStrand_2N";
import { ProtoStyle } from "../../libPByte_p5/ProtoStyle";

export class Hydrozoa {

    p: p5
    nodeCount: number;
    head: p5.Vector;
    tail: p5.Vector;
    stickTensionRange: p5.Vector;

    style: ProtoStyle;
    nodes: VerletNode[] = [];
    sticks: VerletStick[] = [];
    // centralSpine: VerletStrand | undefined;
    centralSpine: VerletStrand_2N | undefined;
    bounds: p5.Vector | undefined

    // constructor(p: p5, nodeCount: number, spineLen: number, style: ProtoStyle) {
    //     this.p = p;
    //     this.nodeCount = nodeCount;
    //     this.spineLen = spineLen;
    //     this.style = style;

    //     this.create();
    // }

    constructor(p: p5, nodeCount: number, head: p5.Vector, tail: p5.Vector, stickTensionRange: p5.Vector = p.createVector(.5, .5), style: ProtoStyle = new ProtoStyle(p, p.color(127, 127, 127), p.color(25, 25, 25), 1, 3)) {
        this.p = p;
        this.nodeCount = nodeCount;
        this.head = head;
        this.tail = tail;
        this.stickTensionRange = stickTensionRange;
        // this.spineLen = spineLen;
        this.style = style;

        this.create();
    }

    create() {
        this.centralSpine = new VerletStrand_2N(
            this.p,
            this.head,
            this.tail,
            this.nodeCount,
            this.stickTensionRange,
            this.style
        )
    }

    move(bounds?: p5.Vector) {
        // if (bounds) {
        this.bounds = bounds;
        // }
        if (this.centralSpine) {
            if (bounds) {
                this.centralSpine.move(bounds);
            } else {
                this.centralSpine.move();
            }

        }
    }

    // start Verlet with initial offset
    nudge(ns: number[], v: p5.Vector | p5.Vector[]) {
        for (let i = 0; i < ns.length; i++) {
            if (this.centralSpine) {
                if (Array.isArray(v)) {
                    this.centralSpine.nodes[ns[i]].nudge(v[i]);
                } else {
                    this.centralSpine.nodes[ns[i]].nudge(v);
                }
            }
        }
    }

    draw(isFill: boolean = true, isStroke: boolean = true) {
        if (this.centralSpine) {
            this.centralSpine.draw(isFill, isStroke, this.style);
        }
    }

    drawBounds(fill: p5.Color = this.p.color(200), stroke: p5.Color = this.p.color(50)) {
        if (this.bounds) {
            this.p.noStroke();
            this.p.fill(fill);
            this.p.stroke(stroke);
            this.p.box(this.bounds.x, this.bounds.y, this.bounds.z);
        }
    }
    drawBoundsOutline(stroke: p5.Color = this.p.color(50), strokeWt: number = 1) {
        if (this.bounds) {
            this.p.noFill();
            this.p.stroke(stroke);
            this.p.strokeWeight(strokeWt);
            this.p.box(this.bounds.x, this.bounds.y, this.bounds.z);

        }
    }


}


