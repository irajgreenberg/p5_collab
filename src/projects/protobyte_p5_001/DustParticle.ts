import P5 from "p5";

export class DustParticle {
    p: P5;

    constructor(p: P5) {
        this.p = p;
    }

    draw(): void {
        this.p.line(-1, -1, -1, 1, 1, 1);
        this.p.line(1, 1, 1, 2, 1, -2);
    }

}