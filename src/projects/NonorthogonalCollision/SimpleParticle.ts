import p5, { Image } from "p5";
import { CollisionEdge } from "./CollisionEdge";

export class SimpleParticle {
    p: p5;
    pos: p5.Vector;
    spd: p5.Vector;
    rad: number;
    col: p5.Color;

    damping = .85;

    // Thanksgiving Day 2022 expansion
    // img: Image;
    // tempRot = 0;

    constructor(p: p5, pos: p5.Vector, spd: p5.Vector, rad: number = 5, col: p5.Color = p.color(p.random(40, 90), p.random(30, 170), p.random(100, 150), p.random(20, 50))) {
        this.p = p;
        this.pos = pos;
        this.spd = spd;
        this.rad = rad;
        this.col = col;

        // this.img = p.loadImage("./external_resources/turkey.png")
        // this.tempRot = p.random(-p.PI, p.PI);
    }

    move() {
        this.spd.y += .2;
        this.pos.add(this.spd);
    }

    draw() {
        this.p.noFill();
        this.p.stroke(this.col);
        this.p.ellipse(this.pos.x, this.pos.y, this.rad * 2, this.rad * 2);
        // this.p.push();
        // this.p.rotate(this.tempRot);
        // this.p.image(this.img, this.pos.x, this.pos.y, this.rad * 55, this.rad * 55);
        // this.p.pop();
    }

    checkGroundCollision(edge: CollisionEdge) {
        // Get difference between orb and ground
        let deltaX = this.pos.x - edge.pos.x;
        let deltaY = this.pos.y - edge.pos.y;

        // Precalculate trig values
        const c = this.p.cos(edge.rot);
        const s = this.p.sin(edge.rot);

        /* Rotate ground and velocity to allow 
     orthogonal collision calculations */
        let edgeXTemp = c * deltaX + s * deltaY;
        let edgeYTemp = c * deltaY - s * deltaX;
        let spdXTemp = c * this.spd.x + s * this.spd.y;
        let spdYTemp = c * this.spd.y - s * this.spd.x;

        /* Ground collision - check for surface 
         collision and also that orb is within 
         left/rights bounds of ground segment */



        if (edge.isHit(this)) {


            // if (edgeYTemp >= -this.rad &&
            //     this.pos.x > edge.head.x &&
            //     this.pos.x < edge.tail.x) {
            // keep orb from going into ground
            // if (this.spd.y > 0) {
            if (edgeYTemp > -this.rad) {
                edgeYTemp = -this.rad;
                // } else if (edgeYTemp = this.rad) {
                //     edgeYTemp = this.rad;
                // }
                // bounce and slow down orb
                spdYTemp *= -1.0;
                spdYTemp *= this.damping;


                // Reset ground, velocity and orb
                deltaX = c * edgeXTemp - s * edgeYTemp;
                deltaY = c * edgeYTemp + s * edgeXTemp;
                this.spd.x = c * spdXTemp - s * spdYTemp;
                this.spd.y = c * spdYTemp + s * spdXTemp;
                this.pos.x = edge.pos.x + deltaX;
                this.pos.y = edge.pos.y + deltaY;
            }
            // } else if (this.spd.y < 0) {
            //     if (edgeYTemp < this.rad) {
            //         edgeYTemp = this.rad;
            //         // } else if (edgeYTemp = this.rad) {
            //         //     edgeYTemp = this.rad;
            //         // }
            //         // bounce and slow down orb
            //         spdYTemp *= -1.0;
            //         spdYTemp *= this.damping;


            //         // Reset ground, velocity and orb
            //         deltaX = c * edgeXTemp - s * edgeYTemp;
            //         deltaY = c * edgeYTemp + s * edgeXTemp;
            //         this.spd.x = c * spdXTemp - s * spdYTemp;
            //         this.spd.y = c * spdYTemp + s * spdXTemp;
            //         this.pos.x = edge.pos.x + deltaX;
            //         this.pos.y = edge.pos.y + deltaY;
            //     }
            //}
        }
    }
}