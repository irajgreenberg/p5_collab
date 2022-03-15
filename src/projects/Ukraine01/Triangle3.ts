/** 
 * Simple 3D traingle face class
 * encapsulating three Vectors.
 * Includes own getNormal method.
 * Ira Greenberg 
 * Original Processing code: Dec 2010
 * Ported to p5: Feb 2022
 */

import p5 from "p5";

export class Triangle3 {

    p: p5
    v0: p5.Vector;
    v1: p5.Vector;
    v2: p5.Vector;
    vs: p5.Vector[] = [];
    n: p5.Vector;

    constructor(p: p5, v0: p5.Vector, v1: p5.Vector, v2: p5.Vector) {
        this.p = p;
        this.v0 = v0;
        this.v1 = v1;
        this.v2 = v2;
        this.vs.push(v0);
        this.vs.push(v1);
        this.vs.push(v2);
        this.n = this.p.createVector();
    }

    getNormal(): p5.Vector {
        const v1 = p5.Vector.sub(this.v1, this.v2);
        const v2 = p5.Vector.sub(this.v0, this.v2);

        this.n = v1.cross(v2);
        this.n.normalize();
        return (this.n);
    }

    render(): void {
        this.p.fill(127);
        //stroke(0);
        this.p.beginShape(this.p.TRIANGLES);
        for (let i = 0; i < 3; i++) {
            this.p.vertex(this.vs[i].x, this.vs[i].y, this.vs[i].z);
        }
        this.p.endShape();
    }

    renderNorm(len: number): void {
        this.p.stroke(200, 100, 0);
        this.p.noFill();
        this.n = this.getNormal();
        this.n.mult(len);
        const o: p5.Vector = this.getOrigin();
        this.p.beginShape();
        this.p.vertex(o.x, o.y, o.z);
        this.p.vertex(o.x - this.n.x, o.y - this.n.y, o.z - this.n.z);
        this.p.endShape();
    }

    getOrigin(): p5.Vector {
        let origin = this.p.createVector();
        origin.set(this.v0);
        origin.add(this.v1);
        origin.add(this.v2);
        origin.div(3);
        return origin;
    }
}