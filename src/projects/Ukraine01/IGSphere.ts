import p5 from "p5";

export class IGSphere {
    p: p5;
    loc: p5.Vector;
    initLoc: p5.Vector;
    radius = 4;
    spd: p5.Vector;
    detail = 12;
    material: number;
    fillCol: p5.Color;

    constructor(p: p5, loc: p5.Vector, radius: number, detail: number, material: number) {
        this.p = p;
        this.loc = loc;
        this.initLoc = new p5.Vector();
        this.initLoc.set(this.loc);
        this.radius = radius;
        this.detail = detail;
        // this.p.sphereDetail(this.detail);
        this.material = material;
        this.spd = new p5.Vector(0, 0, 0);
        this.fillCol = this.p.color(150, 225, 75);

    }

    move(): void {
        this.loc.add(this.spd);
    }

    render(): void {
        this.p.fill(this.fillCol);
        this.p.sphere(this.radius);
    }

    setfill(fillCol: p5.Color): void {
        this.fillCol = fillCol;
    }
}