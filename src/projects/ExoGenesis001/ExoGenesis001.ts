// ExoGenesis001
// Ira Greenberg
// Santa Fe, NM | Dallas, TX

// Class Description: 

import p5 from "p5";
import { VerletNode } from "../../libPByte_p5/VerletNode";
import { VerletStick } from "../../libPByte_p5/VerletStick";
import { VerletStrand } from "../../libPByte_p5/VerletStrand";
import { VerletStrand_2N } from "../../libPByte_p5/VerletStrand_2N";
import { ProtoStyle } from "../../libPByte_p5/ProtoStyle";

export class ExoGenesis001 {

    p: p5
    nodeCount: number;
    spineLen: number;
    style: ProtoStyle;
    nodes: VerletNode[] = [];
    sticks: VerletStick[] = [];
    // centralSpine: VerletStrand | undefined;
    centralSpine: VerletStrand_2N | undefined;
    bounds: p5.Vector | undefined

    constructor(p: p5, nodeCount: number, spineLen: number, style: ProtoStyle) {
        this.p = p;
        this.nodeCount = nodeCount;
        this.spineLen = spineLen;
        this.style = style;

        this.create();
    }

    create() {
        this.centralSpine = new VerletStrand_2N(
            this.p,
            new p5.Vector(-this.spineLen / 2, 0, 0),
            new p5.Vector(this.spineLen / 2, 0, 0),
            this.nodeCount,
            this.style
        )
        for (let i = 0; i < this.centralSpine.nodes.length; i++) {
            this.centralSpine.nodes[i].nudge(new p5.Vector(0, this.p.random(-15, 15), 0));
        }
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

    draw() {
        if (this.centralSpine) {
            this.centralSpine.draw(true, true);
        }
    }

    drawBounds() {
        if (this.bounds) {
            this.p.beginShape();
            this.p.vertex(-this.bounds.x / 2, -this.bounds.y / 2, this.bounds.z);
            this.p.vertex(this.bounds.x / 2, -this.bounds.y / 2, this.bounds.z);
            this.p.vertex(this.bounds.x / 2, this.bounds.y / 2, this.bounds.z);
            this.p.vertex(-this.bounds.x / 2, this.bounds.y / 2, this.bounds.z);
            this.p.endShape();

        }
    }

}


