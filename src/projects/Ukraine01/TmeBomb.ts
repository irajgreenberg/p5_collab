import p5 from "p5";
import { Dimension3 } from "./Dimension3";

export class TimeBomb {

    p: p5;
    loc: p5.Vector = new p5.Vector();
    dim: Dimension3;
    mass = 1;
    launchVec: p5.Vector;
    launchSpd = 0;
    spd: p5.Vector;
    accel: p5.Vector;
    gravity: number;
    damping: number;
    isWindy: boolean = false;
    wind: p5.Vector;

    constructor(p: p5, loc: p5.Vector, dim: Dimension3, mass: number) {
        this.p = p;
        this.loc = loc;
        this.dim = dim;
        this.mass = mass;
        this.dim = new Dimension3(2, 2, 2);
        this.wind = new p5.Vector(0, 0, p.random(1.5, 3.2));
        // this.p.sphereDetail(12);
        this.spd = new p5.Vector();
        this.accel = new p5.Vector();
        this.gravity = .04;
        this.damping = .55;
        this.launchVec = new p5.Vector(0, 0, 0);
    }

    setPhysics(spd: p5.Vector, gravity: number, damping: number): void {
        this.spd = spd;
        this.gravity = gravity;
        this.damping = damping;
    }

    launch(): void {
        this.p.fill(220, 30, 30);
        //spd.x += wind.x;
        this.accel.y += this.gravity;
        this.spd.add(this.accel);
        this.loc.add(this.spd);
        if (this.isWindy) {
            this.loc.add(this.wind);
        }
        this.p.push();
        this.p.translate(this.loc.x, this.loc.y, this.loc.z);
        this.p.sphere(this.dim.w);
        this.p.pop();
    }

    setCollision(surf: Dimension3): void {
        if (this.loc.y > surf.h - 14) {
            this.loc.y = surf.h - 14;
            this.spd.y *= -1;
        }
    }
}