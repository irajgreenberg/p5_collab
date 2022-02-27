import p5 from "p5";
import { Spine } from "./Spine";
import { TruncatedCone } from "./TruncatedCone";

export class ProtoBundler {

    p: p5;
    spine01: Spine;
    tc01: TruncatedCone;
    cones: TruncatedCone[] = []; // controleld by # of pts

    constructor(p: p5) {
        // Instantiate custom geom
        // spinePts:
        this.p = p;
        const pts: p5.Vector[] = [];
        const ptCount = 6.0;
        const len = 400.0;
        const deltaY = len / (ptCount - 1);
        for (let i = 0; i < ptCount; i++) {
            pts.push(p.createVector(0, -len / 2 + deltaY * i, p.sin(i * 9 * p.PI / 180) * 300));
        }
        this.spine01 = new Spine(p, p.createVector(0, 0, 0), pts, 3, p.color(255, 127, 0), 6);
        this.tc01 = new TruncatedCone(p, p.createVector(0, 0, 0), 4, 8, 8, 20, 80);

        // create array of cones
        for (let i = 0; i < this.spine01.pts.length; i++) {
            if (i % 1 == 0) {
                this.cones.push(new TruncatedCone(p, p.createVector(0, 0, 0), 4, 8, 20 - i, 80 - i * 2, 80));
            }
        }

    }


    move(): void {
        this.spine01.sway();
    }

    draw(): void {

        this.spine01.draw();

        // for (let i = 0; i < this.spine01.pts.length - 1; i++) {
        //     if (i % 1 == 0) {
        //         this.tc01.pos.x = this.spine01.pts[i].x
        //         this.tc01.pos.y = this.spine01.pts[i].y
        //         this.tc01.pos.z = this.spine01.pts[i].z

        //         let pt1 = this.spine01.pts[i].copy();
        //         let pt0 = this.spine01.pts[i + 1].copy();
        //         pt0.sub(pt1);
        //         pt0.normalize();
        //         this.p.push();
        //         this.p.translate(this.tc01.pos.x, this.tc01.pos.y, this.tc01.pos.z);
        //         const thetaZ = this.p.atan2(pt1.y - pt0.y, pt1.x - pt0.x)
        //         let dx = this.p.createVector(0, 1, 0);

        //         let c = this.p.acos(dx.dot(pt0));
        //         // this.p.rotateZ(thetaZ);
        //         this.p.rotateX(c);
        //         this.tc01.draw(false, false);
        //         this.p.pop();


        //     }
        // }
        this.tc01.pos.x = this.spine01.pts[this.spine01.pts.length - 1].x
        this.tc01.pos.y = this.spine01.pts[this.spine01.pts.length - 1].y
        this.tc01.pos.z = this.spine01.pts[this.spine01.pts.length - 1].z

        let pt1 = this.spine01.pts[this.spine01.pts.length - 1].copy();
        let pt0 = this.spine01.pts[this.spine01.pts.length - 5].copy();
        pt1.sub(pt0);
        pt1.normalize();
        this.p.push();
        this.p.translate(this.tc01.pos.x, this.tc01.pos.y, this.tc01.pos.z);
        const thetaZ = this.p.atan2(pt1.y - pt0.y, pt1.x - pt0.x) + this.p.PI / 2;
        //this.p.rotateZ(thetaZ);
        let dx = this.p.createVector(0, 1, 0);
        let c = this.p.acos(pt1.dot(dx));
        console.log(c);
        this.p.rotateX(c);
        this.tc01.draw(false, false);
        this.p.pop();

    }

}