import p5 from "p5";
import { Curve } from "./Curve";

export class Rainbow {

    p: p5;
    position: p5.Vector;
    dimension: p5.Vector;
    colArr: p5.Color[] = []

    curvePoints: p5.Vector[] = [];
    curves: Curve[] = [];


    constructor(p: p5, position: p5.Vector, dimension: p5.Vector, colArr: p5.Color[]) {
        this.p = p;
        this.position = position;
        this.dimension = dimension;
        this.colArr = colArr;

        this.create();
    }

    create() {
        const curveSpan = this.dimension.x / 5;
        const strokeWt = 20;

        for (let i = 0; i <= 5; i++) {
            this.curvePoints.push(this.p.createVector(-this.dimension.x / 2 + curveSpan * i,
                this.p.random(-this.dimension.y / 2, this.dimension.y / 2)));
        }


        for (let i = 0; i < this.colArr.length; i++) {
            this.curves[i] = new Curve(
                this.p,
                this.p.createVector(0, 20 * i),
                this.p.createVector(this.dimension.x, this.dimension.y),
                this.colArr[i],
                strokeWt,
                //this.p.random(.5, 6),
                this.curvePoints
            );
        }
    }

    draw() {
        for (let i = 0; i < this.colArr.length; i++) {
            this.curves[i].draw();
        }

    }
}