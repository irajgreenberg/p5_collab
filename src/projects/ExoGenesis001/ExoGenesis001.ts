// ExoGenesis001
// Ira Greenberg
// Santa Fe, NM | Dallas, TX

// Class Description: 

import p5 from "p5";
import { VerletNode } from "../../../src/libPByte_p5/VerletNode";
import { VerletStick } from "../../../src/libPByte_p5/VerletStick";
import { VerletStrand } from "../../../src/libPByte_p5/VerletStrand";
import { VerletStrand_2N } from "../../../src/libPByte_p5/VerletStrand_2N";

export class ExoGenesis001 {

    p: p5
    nodeCount: number
    spineLen: number
    nodes: VerletNode[] = [];
    sticks: VerletStick[] = [];
    // centralSpine: VerletStrand | undefined;
    centralSpine: VerletStrand_2N | undefined;

    constructor(p: p5, nodeCount: number, spineLen: number) {
        this.p = p;
        this.nodeCount = nodeCount;
        this.spineLen = spineLen

        this.create();
    }

    create() {
        this.centralSpine = new VerletStrand_2N(
            this.p,
            new p5.Vector(-this.spineLen / 2, 0, 0),
            new p5.Vector(this.spineLen / 2, 0, 0),
            this.nodeCount,
            this.p.color(200, 150, 150),
            .5
        )
        for (let i = 0; i < this.centralSpine.nodes.length; i++) {
            this.centralSpine.nodes[i].nudge(new p5.Vector(0, this.p.random(-15, 15), 0));
        }
    }

    move(time: number = 0) {
        if (this.centralSpine) {
            this.centralSpine.move();
        }
    }

    draw() {
        if (this.centralSpine) {
            this.centralSpine.draw(true, true);
        }
    }
}


