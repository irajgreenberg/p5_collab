// PhysPainter02
// Ira Greenberg
// Santa Fe, NM | Dallas, TX

// Class Description: 

import p5 from "p5";
import { VerletBase } from "../../libPByte_p5/VerletBase";

export class PhysPainter02 extends VerletBase {

    p: p5

    //constructor(p: p5, dim: P5.Vector, elasticity: number, fillCol: P5.Color, style: VerletStyle =
    //new VerletStyle(2, p.color(255, 127, 0), 255, NodeType.CIRCLE, p.color(50, 50, 50, 100), .5))

    constructor(p: p5) {

        super(p, new p5.Vector(10, 10, 0), .04, p.color(100, 245, 90));
        this.p = p;
        this.init();
    }

    init() {
    }

    move(time: number = 0) {
    }

    draw() {
    }
}


