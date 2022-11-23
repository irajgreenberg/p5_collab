import p5 from "p5";
import { SingleEntryPlugin } from "webpack";

export class CollisionEdge {

    p: p5;
    head: p5.Vector;
    tail: p5.Vector

    lenVec: p5.Vector;
    mag: number
    norm: p5.Vector

    constructor(p: p5, head: p5.Vector, tail: p5.Vector) {
        this.p = p;
        this.head = head;
        this.tail = tail;

        this.lenVec = tail.copy();
        this.lenVec.sub(head);
        this.mag = this.lenVec.mag();
        this.norm = p.createVector(-this.lenVec.y, this.lenVec.x);
        this.norm.normalize();
    }

    rot(theta: number) {

        const x = cos(theta) * this.lenVec.x - Sin(theta)
        const y = 
    }

}