import p5 from "p5";
import { SimpleParticle } from "./SimpleParticle";

export class CollisionEdge {

    p: p5;
    pos: p5.Vector // central edge position
    head: p5.Vector;
    tail: p5.Vector;
    col: p5.Color;
    strokeWt: number;

    rot: number;
    lenVec: p5.Vector;
    mag: number;
    norm: p5.Vector;

    granularity = 5;
    edgeNodes: p5.Vector[] = [];

    constructor(p: p5, head: p5.Vector, tail: p5.Vector, col: p5.Color = p.color(p.random(40, 90), p.random(30, 170), p.random(100, 150), p.random(20, 50)), strokeWt: number = .5) {
        this.p = p;
        this.head = head;
        this.tail = tail;
        this.col = col;
        this.strokeWt = strokeWt;
        this.lenVec = this.p.createVector(this.tail.x, this.tail.y);
        this.lenVec.sub(head);

        this.pos = p.createVector((this.head.x + this.tail.x) / 2, (this.head.y + this.tail.y) / 2);
        this.mag = this.lenVec.mag();
        this.norm = p.createVector(-this.lenVec.y, this.lenVec.x);
        this.norm.normalize();
        this.rot = this.p.atan2((this.tail.y - this.head.y), (this.tail.x - this.head.x));

        // for particle-edgeNode collision detection
        const nodestepX = this.lenVec.x / this.granularity;
        const nodestepY = this.lenVec.y / this.granularity;
        for (let i = 0; i < this.granularity; i++) {
            this.edgeNodes[i] = p.createVector(this.head.x + nodestepX * i, this.head.y + nodestepY * i);
        }
    }

    rotate(theta: number) {
        /*
        x' = x*cos q - y*sin q
        y' = x*sin q + y*cos q
        z' = z
        */
        const x = this.p.cos(theta) * this.pos.x - this.p.sin(theta) * this.pos.y;
        const y = this.p.sin(theta) * this.pos.x + this.p.cos(theta) * this.pos.y;
    }

    draw() {
        this.p.noFill();
        this.p.stroke(this.col);
        this.p.strokeWeight(this.strokeWt);
        this.p.beginShape();
        this.p.vertex(this.head.x, this.head.y);
        this.p.vertex(this.tail.x, this.tail.y);
        this.p.endShape();
    }

    isHit(part: SimpleParticle): boolean {
        for (let i = 0; i < this.edgeNodes.length; i++) {
            if (this.edgeNodes[i].dist(part.pos) < part.rad) {
                return true;
            }
        }
        return false;

    }

}