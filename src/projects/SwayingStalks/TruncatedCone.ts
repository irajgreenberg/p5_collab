import p5 from "p5";

export class TruncatedCone {

    p: p5;
    pos: p5.Vector;
    slices: number;
    radialDetail: number;
    radTop: number = 0;
    radBottom: number = 0;
    ht: number = 0;


    // slices & radialDetail
    pts2D: p5.Vector[][] = [];

    constructor(p: p5, pos: p5.Vector, slices: number, radialDetail: number, radTop: number, radBottom: number, ht: number) {
        this.p = p;
        this.pos = pos;
        this.slices = slices;
        this.radialDetail = radialDetail;
        this.radTop = radTop;
        this.radBottom = radBottom;
        this.ht = ht;

        this.construct();
    }

    construct(): void {
        let theta = 0;
        const radStep = (this.radBottom - this.radTop) / (this.slices - 1);

        const htStep = this.ht / this.slices;
        for (let i = 0; i < this.slices; i++) {
            let tempPts: p5.Vector[] = [];
            for (let j = 0; j < this.radialDetail; j++) {
                const x = this.p.sin(theta) * (this.radTop + radStep * i);
                const y = -this.ht / 2 + htStep * i
                const z = this.p.cos(theta) * (this.radTop + radStep * i);
                tempPts[j] = this.p.createVector(x, y, z);
                theta += this.p.TWO_PI / this.radialDetail;
            }
            this.pts2D.push(tempPts);

        }

    }

    wobble(): void {
    }

    draw(arePointsVisable: boolean = false, isWireframeVisible: boolean = true): void {

        this.p.push();
        // this.p.translate(this.pos.x, this.pos.y, this.pos.z)
        if (arePointsVisable) {
            this.p.strokeWeight(2);
            this.p.beginShape(this.p.POINTS);
            for (let i = 0; i < this.slices; i++) {
                for (let j = 0; j < this.radialDetail; j++) {
                    this.p.vertex(this.pts2D[i][j].x, this.pts2D[i][j].y, this.pts2D[i][j].z);
                }
            }
            this.p.endShape();
        }

        if (isWireframeVisible) {
            this.p.stroke(200, 100, 0)
        } else {
            this.p.noStroke();
        }
        this.p.fill(75, 75, 155, 25);

        for (let i = 0; i < this.slices; i++) {
            for (let j = 0; j < this.radialDetail; j++) {
                if (i < this.slices - 1) {
                    if (j < this.radialDetail - 1) {
                        this.p.beginShape();
                        this.p.vertex(this.pts2D[i][j].x, this.pts2D[i][j].y, this.pts2D[i][j].z);
                        this.p.vertex(this.pts2D[i][j + 1].x, this.pts2D[i][j + 1].y, this.pts2D[i][j + 1].z);
                        this.p.vertex(this.pts2D[i + 1][j + 1].x, this.pts2D[i + 1][j + 1].y, this.pts2D[i + 1][j + 1].z);
                        this.p.vertex(this.pts2D[i + 1][j].x, this.pts2D[i + 1][j].y, this.pts2D[i + 1][j].z);
                        this.p.endShape(this.p.CLOSE);
                    } else if (j == this.radialDetail - 1) {
                        this.p.beginShape();
                        this.p.vertex(this.pts2D[i][j].x, this.pts2D[i][j].y, this.pts2D[i][j].z);
                        this.p.vertex(this.pts2D[i][0].x, this.pts2D[i][0].y, this.pts2D[i][0].z);
                        this.p.vertex(this.pts2D[i + 1][0].x, this.pts2D[i + 1][0].y, this.pts2D[i + 1][0].z);
                        this.p.vertex(this.pts2D[i + 1][j].x, this.pts2D[i + 1][j].y, this.pts2D[i + 1][j].z);
                        this.p.endShape(this.p.CLOSE);
                    }

                }
            }
        }
        this.p.endShape(this.p.CLOSE);
        this.p.pop();
    }

}