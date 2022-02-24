import p5 from "p5";
import { Spine } from "./Spine";
import { TruncatedCone } from "./TruncatedCone";

export class ProtoBundler {

    p: p5;
    spine01: Spine;
    tc01: TruncatedCone;

    constructor(p: p5) {
        // Instantiate custom geom
        // spinePts:
        this.p = p;
        const pts: p5.Vector[] = [];
        const ptCount = 12.0;
        const len = 400.0;
        const deltaY = len / (ptCount - 1);
        for (let i = 0; i < ptCount; i++) {
            pts.push(p.createVector(0, -len / 2 + deltaY * i, p.sin(i * 9 * p.PI / 180) * 300));
        }
        this.spine01 = new Spine(p, p.createVector(0, 0, 0), pts, 3, p.color(255, 127, 0), 5);
        this.tc01 = new TruncatedCone(p, p.createVector(0, 0, 0), 8, 12, 30, 50, 120);
    }


    move(): void {
        this.spine01.sway();
    }

    draw(): void {

        this.spine01.draw();
        this.tc01.pos.x = this.spine01.pts[this.spine01.pts.length - 1].x
        this.tc01.pos.y = this.spine01.pts[this.spine01.pts.length - 1].y
        this.tc01.pos.z = this.spine01.pts[this.spine01.pts.length - 1].z

        let pt0 = this.spine01.pts[this.spine01.pts.length - 1].copy();
        let pt1 = this.spine01.pts[this.spine01.pts.length - 2].copy();
        pt1.sub(pt0);
        pt1.normalize();
        this.p.push();
        this.p.translate(this.tc01.pos.x, this.tc01.pos.y, this.tc01.pos.z);
        const thetaZ = this.p.atan2(pt1.y - pt0.y, pt1.x - pt0.x) + this.p.PI / 2;
        this.p.rotateZ(thetaZ);
        const thetaX = this.p.atan2(pt0.y - pt1.y, pt0.z - pt1.z);
        this.p.rotateX(thetaX);
        this.tc01.draw(false, false);
        this.p.pop();

    }

}