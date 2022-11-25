import p5, { Image } from "p5";
import { CollisionEdge } from "./CollisionEdge";

export class SimpleParticle {
    p: p5;
    pos: p5.Vector;
    spd: p5.Vector;
    rad: number;
    col: p5.Color;

    wind: p5.Vector;;
    gravity = .05;
    damping = 0.75;
    friction = 0.8;
    jitter = 0;
    jitterAmp = 0;
    jitterTheta = 0;
    jitterFreq = 0;

    constructor(p: p5, pos: p5.Vector, spd: p5.Vector, rad: number = 5, col: p5.Color = p.color(p.random(40, 90), p.random(30, 170), p.random(100, 150), p.random(20, 150))) {
        this.p = p;
        this.pos = pos;
        this.spd = spd;
        this.rad = rad;
        this.col = col;

        this.wind = p.createVector(p.random(-.05, .05), p.random(-.05, .05));
        //this.wind = p.createVector(p.random(.01, .5), p.random(-.05, .05));

        this.jitterAmp = this.p.random(1, 3);
        this.jitterTheta = this.p.random(this.p.TWO_PI);
        this.jitterFreq = this.p.random(1, 30);
    }

    move() {
        this.jitter = this.p.cos(this.jitterTheta * this.p.PI / 180) * this.jitterAmp;

        this.wind.x = this.p.random(-0, 0);
        this.spd.x += this.wind.x;
        this.pos.x += this.spd.x + this.jitter;


        this.spd.y += this.gravity;
        this.pos.add(this.spd);

        this.jitterTheta += this.jitterFreq;
    }

    draw() {
        // this.p.noFill();
        this.p.noStroke();
        this.p.fill(this.col);
        // this.p.stroke(this.col);
        this.p.ellipse(this.pos.x, this.pos.y, this.rad * 2, this.rad * 2);
    }

    wallsCollide() {
        if (this.pos.x > this.p.width / 2 - this.rad) {
            this.pos.x = this.p.width / 2 - this.rad;
            this.spd.x *= -1;
        } else if (this.pos.x < -this.p.width / 2 + this.rad) {
            this.pos.x = -this.p.width / 2 + this.rad;
            this.spd.x *= -1;
        }
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