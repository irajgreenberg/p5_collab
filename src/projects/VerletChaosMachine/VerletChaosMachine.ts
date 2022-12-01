// VerletChaosMachine
// Ira Greenberg
// Dallas, TX

import p5 from "p5";
import { VerletNode } from "src/libPByte_p5/VerletNode";
import { VerletStick } from "src/libPByte_p5/VerletStick";

export class VerletChaosMachine {

    p: p5;
    nodeCount = 50;
    nodes: VerletNode[] = [];
    sticks: VerletStick[] = [];


    constructor(p: p5) {
        this.p = p;
        for (let i = 0; i < this.nodeCount; i++) {
            this.nodes.push(
                new VerletNode(p, p.createVector(-p.random(p.width / 2, p.width / 2), -p.random(p.height / 2, p.height / 2), -p.random(-200, 200)), 1, p.color(127))
            )
        }


        this.create();

    }

    create() {
    }

    move(time: number = 0) {
    }

    draw() {
    }
}


