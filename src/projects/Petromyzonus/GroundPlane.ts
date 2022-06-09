import P5 from "p5";

export class GroundPlane {
    p: P5;
    colRange: P5.Vector;
    // 2d array to hold plane vertex data
    verts2D: P5.Vector[][] = [];
    cols2D: P5.Vector[][] = [];
    constructor(p: P5, dim: P5.Vector, cols: number, rows: number, colRange: P5.Vector) {
        this.p = p;
        this.colRange = colRange;
        const colStep = dim.x / (cols + 1);
        const rowStep = dim.z / (rows + 1);
        for (let i = 0; i < cols; i++) {
            this.verts2D[i] = [];
            this.cols2D[i] = [];
            for (let j = 0; j < rows; j++) {
                const x = -dim.x / 2 + colStep * i;
                const z = -dim.z / 2 + rowStep * j;
                this.verts2D[i][j] = p.createVector(x, p.random(dim.y), z);
                const tint = p.random(-.9, 1.1);
                this.cols2D[i][j] = p.createVector(this.colRange.x * tint, this.colRange.y * tint, this.colRange.z * tint);
            }
        }
    }

    draw() {
        // this.p.stroke(this.p.random(200, 255));
        // this.p.fill(this.p.random(100, 200), this.p.random(100, 200), this.p.random(100, 200));
        this.p.noStroke();

        for (let i = 0; i < this.verts2D.length - 1; i++) {
            for (let j = 0; j < this.verts2D[i].length - 1; j++) {
                this.p.beginShape();
                this.p.fill(this.p.color(this.cols2D[i][j].x, this.cols2D[i][j].y, this.cols2D[i][j].z, 100));
                this.p.vertex(this.verts2D[i][j].x, this.verts2D[i][j].y, this.verts2D[i][j].z);
                this.p.vertex(this.verts2D[i + 1][j].x, this.verts2D[i + 1][j].y, this.verts2D[i + 1][j].z);
                this.p.vertex(this.verts2D[i + 1][j + 1].x, this.verts2D[i + 1][j + 1].y, this.verts2D[i + 1][j + 1].z);
                this.p.vertex(this.verts2D[i][j + 1].x, this.verts2D[i][j + 1].y, this.verts2D[i][j + 1].z);
                this.p.endShape();
            }
        }


    }
}