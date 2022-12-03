import p5 from "p5";

export class Cell {
    p: p5;
    pos: p5.Vector;
    velocity: p5.Vector;
    density: number;
    size: number;

    constructor(p: p5, pos: p5.Vector, velocity: p5.Vector, density: number, size: number) {
        this.p = p;
        this.pos = pos;
        this.velocity = velocity;
        this.density = density;
        this.size = size;
    }

    draw() {
        this.p.noStroke();
        this.p.fill(this.density * (255 / this.size));
        this.p.rect(this.pos.x, this.pos.y, this.size, this.size);
    }
}