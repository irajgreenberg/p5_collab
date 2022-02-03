import P5 from "p5";
import { VerletBase } from "./VerletBase";
import { VerletStyle } from "./VerletStyle";

export class VerletAnnulus extends VerletBase {

    radius: number
    ringEdgeCount: number;
    innerRing: P5.Vector[] = [];

    outerRing: P5.Vector[] = [];

    constructor(p: P5, radius: number, ringEdgeCount: number, innerRing: P5.Vector[], dim: P5.Vector, elasticity: number, fillCol: P5.Color, style: VerletStyle) {
        super(p, p.createVector(radius * 2, radius * 2, radius * 2), elasticity, fillCol, style);
        this.radius = radius;
        this.ringEdgeCount = ringEdgeCount;
        this.innerRing = innerRing;
    }


    init(): void {

    }

}