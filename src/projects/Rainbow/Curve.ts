// Rainbow
// Ira Greenberg
// Dallas, TX

import p5 from "p5";

export class Curve {

    p: p5;
    position: p5.Vector;
    dimension: p5.Vector;
    col: p5.Color
    strokeWt: number;

    // curve points
    curvePoints: p5.Vector[] = [];


    constructor(p: p5, position: p5.Vector, dimension: p5.Vector, col: p5.Color, strokeWt: number, curvePoints: p5.Vector[]) {
        this.p = p;
        this.position = position;
        this.dimension = dimension;
        this.col = col;
        this.strokeWt = strokeWt;
        this.curvePoints = curvePoints;

        this.create();
    }

    create() {
        //console.log(this);
        const curveSpan = this.dimension.x / 5;
        if (this.curvePoints.length == 0) {
            for (let i = 0; i <= 5; i++) {
                this.curvePoints.push(this.p.createVector(-this.dimension.x / 2 + curveSpan * i,
                    this.p.random(-this.dimension.y / 2, this.dimension.y / 2)));
            }
        }
    }



    move(time: number = 0) {
    }

    draw() {
        this.p.noFill();
        this.p.stroke(this.col)
        this.p.strokeWeight(this.strokeWt);
        this.p.beginShape();
        for (let i = 0; i <= 5; i++) {
            this.p.curveVertex(this.curvePoints[i].x, this.position.y + this.curvePoints[i].y);
        }
        this.p.endShape();
    }
}


