import p5 from "p5";
import { IGSphere } from "./IGSphere";
import { Triangle3 } from "./Triangle3";
import { VerletSurface } from "./VerletSurface";

export class VerletEngine {
    p: p5;
    surf: VerletSurface;
    spheres: IGSphere[] = [];

    sphereCount: number = 100;
    triCount: number = 0;
    tris: Triangle3[] = [];

    gravity = .3;
    wind: p5.Vector = new p5.Vector();
    friction = .45;

    constructor(p: p5, surf: VerletSurface, spheres: IGSphere[]) {
        this.p = p;
        this.surf = surf;
        this.spheres = spheres;
        this.tris = surf.getTris();
    }

    /* 
     * check spehere-sphere collision
     */
    ballCollide(): void {
        for (let i = 0; i < this.spheres.length; i++) {
            for (let j = i + 1; j < this.spheres.length; j++) {
                const d = p5.Vector.dist(this.spheres[i].loc, this.spheres[j].loc);
                const r2 = this.spheres[i].radius + this.spheres[j].radius;
                // spheres overlapping
                if (d <= r2) {
                    // get ball motion vectors at collision
                    let s1Vec = new p5.Vector();
                    const s2Vec = new p5.Vector();
                    s1Vec.set(this.spheres[i].spd);
                    s2Vec.set(this.spheres[j].spd);
                    s1Vec.normalize();
                    s2Vec.normalize();
                    let n = p5.Vector.sub(this.spheres[i].loc, this.spheres[j].loc);
                    n.normalize();
                    let nudger = new p5.Vector();
                    nudger.set(n);
                    nudger.mult(r2);

                    // initially correct ball overlap
                    let temp = new p5.Vector();
                    temp.set(this.spheres[i].loc);
                    this.spheres[j].loc.x = temp.x - nudger.x;
                    this.spheres[j].loc.y = temp.y - nudger.y;
                    this.spheres[j].loc.z = temp.z - nudger.z;

                    // calc relfection based on velocity/momentum
                    const a1 = p5.Vector.dot(this.spheres[i].spd, n);
                    const a2 = p5.Vector.dot(this.spheres[j].spd, n);
                    // radius is used as mass
                    const p = (2.0 * (a1 - a2)) / (this.spheres[i].radius + this.spheres[j].radius);

                    let vec1 = new p5.Vector();
                    vec1.set(n);
                    vec1.mult(this.spheres[j].radius);
                    vec1.mult(p);
                    const newVec1 = p5.Vector.sub(this.spheres[i].spd, vec1);

                    let vec2 = new p5.Vector();
                    vec2.set(n);
                    vec2.mult(this.spheres[i].radius);
                    vec2.mult(p);
                    const newVec2 = p5.Vector.add(this.spheres[j].spd, vec2);

                    this.spheres[i].spd.set(newVec1);
                    this.spheres[j].spd.set(newVec2);
                }
            }
        }
    }

    /* 
     * check sphere-surface collision
     */
    surfaceCollide(): void {
        for (let i = 0; i < this.spheres.length; i++) {
            for (let j = 0; j < this.tris.length; j++) {
                let p = new p5.Vector();
                let q = new p5.Vector();
                let N = this.tris[j].getNormal();
                p.set(this.spheres[i].loc);
                q.set(this.tris[j].v0);
                p.sub(q);
                const d = -p.dot(N);
                if (d < this.spheres[i].radius && this.barycentricCheck(this.spheres[i].loc, this.tris[j]) && d > -this.spheres[i].radius * 4) {
                    // move ground
                    this.deformSurface(this.spheres[i], this.tris[j]);
                    const ground = this.findsurface(this.spheres[i], this.tris[j], d);

                    this.spheres[i].loc.y = ground.y;
                    const reflectVec = this.getReflectVec(this.spheres[i].spd, this.tris[j].getNormal());
                    this.spheres[i].spd.set(reflectVec);
                    // if(this.spheres[i].spd.y > 0){
                    this.deformSurface(this.spheres[i], this.tris[j]);
                    // }
                    this.spheres[i].spd.y *= this.spheres[i].material;
                    //spheres[i].spd.mult(spheres[i].material);
                    //spheres[i].spd.x *= .85;
                    //spheres[i].spd.z *= .55;



                }
            }
        }
    }

    /* 
     * returns surface position
     */
    findsurface(s: IGSphere, t: Triangle3, d: number): p5.Vector {
        let p = new p5.Vector();
        let q = new p5.Vector();
        let N = t.getNormal();

        const temp = new p5.Vector();
        temp.set(s.loc);
        q.set(t.v1);
        while (d < s.radius) {
            temp.sub(N);
            p.set(temp);
            p.sub(q);
            d = -p.dot(N);
        }
        return temp;
    }


    /* Barycentric Technique:
     * www.blackpawn.com/texts/pointinpoly/default.html
     */
    barycentricCheck(p: p5.Vector, tri: Triangle3): boolean {
        // Compute vectors        
        const v0 = p5.Vector.sub(tri.v2, tri.v0);
        const v1 = p5.Vector.sub(tri.v1, tri.v0);
        const v2 = p5.Vector.sub(p, tri.v0);

        // Compute dot products
        let dot00 = p5.Vector.dot(v0, v0);
        let dot01 = p5.Vector.dot(v0, v1);
        let dot02 = p5.Vector.dot(v0, v2);
        let dot11 = p5.Vector.dot(v1, v1);
        let dot12 = p5.Vector.dot(v1, v2);

        // Compute barycentric coordinates
        const invDenom = 1.0 / (dot00 * dot11 - dot01 * dot01);
        const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
        const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

        // Check if point is in triangle
        if ((u > 0) && (v > 0) && (u + v < 1)) {
            return true;
        }
        return false;
    }

    /* Law of Reflection
     * R = 2N(N.L)-L
     * 
     * N = Surface Normal
     * R = Reflection vector
     * L = Incidence Vector
     */
    getReflectVec(direction: p5.Vector, N: p5.Vector): p5.Vector {
        const l = new p5.Vector();
        const vecMag = direction.mag();
        l.set(direction);
        l.normalize();
        let r = N.copy();
        r.mult(2);
        // let r = p5.Vector.mult(N, 2);
        let dotN = p5.Vector.dot(N, l);
        r.mult(dotN);
        r.sub(l);
        r.mult(-1);
        r.mult(vecMag);

        return r;
    }

    /* 
     * deform surface based on ball collision
     */
    deformSurface(s: IGSphere, t: Triangle3): void {
        t.v0.y += (Math.abs(s.spd.y) * s.radius) * .05;
        t.v1.y += (Math.abs(s.spd.y) * s.radius) * .05;
        t.v2.y += (Math.abs(s.spd.y) * s.radius) * .05;
    }


    run(): void {
        for (let i = 0; i < this.spheres.length; i++) {
            //spheres[i].spd.x=random(wind);
            //spheres[i].spd.z+=.075;
            //spheres[i].spd.y+=gravity;
            //spheres[i].move(); // UNCOMMENT TO GET BALLS TO WORK
        }
        this.surf.start();
        //ballCollide();
        this.surfaceCollide();
        this.render();
    }

    render(): void {
        this.surf.render(false, false, true);
        //surf.render(true, true, true);
        for (let i = 0; i < this.spheres.length; i++) {
            this.p.push();
            this.p.translate(this.spheres[i].loc.x, this.spheres[i].loc.y, this.spheres[i].loc.z);
            //spheres[i].render();
            this.p.pop();
        }

        for (let i = 0; i < this.tris.length; i++) {
            // tris[i].render();
            //tris[i].renderNorm(30.0);
        }
    }
}