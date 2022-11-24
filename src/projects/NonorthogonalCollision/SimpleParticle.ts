import p5 from "p5";
import { CollisionEdge } from "./CollisionEdge";

export class SimpleParticle {
    p: p5;
    pos: p5.Vector;
    spd: p5.Vector;
    rad: number;
    col: p5.Color;

    damping = .85;

    constructor(p: p5, pos: p5.Vector, spd: p5.Vector, rad: number = 5, col: p5.Color = p.color(40, p.random(30, 70), p.random(100, 150), 30)) {
        this.p = p;
        this.pos = pos;
        this.spd = spd;
        this.rad = rad;
        this.col = col;
    }

    move() {
        this.spd.y += .2;
        this.pos.add(this.spd);
    }

    draw() {
        this.p.noFill();
        this.p.stroke(this.col);
        this.p.ellipse(this.pos.x, this.pos.y, this.rad, this.rad);
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



        if (edge.isHit(this.pos)) {


            // if (edgeYTemp >= -this.rad &&
            //     this.pos.x > edge.head.x &&
            //     this.pos.x < edge.tail.x) {
            // keep orb from going into ground
            if (this.spd.y > 0) {
                // edgeYTemp = this.rad / 2;
            } else {
                //  edgeYTemp = this.rad / 2;
            }
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
    }
}