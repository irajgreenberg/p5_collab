import p5 from "p5";
import { VerletNode } from "../../libPByte_p5/VerletNode";
import { VerletStick } from "../../libPByte_p5/VerletStick";
import { VerletStrand_2N } from "../../libPByte_p5/VerletStrand_2N";
import { ProtoStyle } from "../../libPByte_p5/ProtoStyle";
import { Phys } from "../../libPByte_p5/PByte_utils";
import { ProtoMorphoBase } from "./ProtoMorphoBase";

export class ProtoBlob extends ProtoMorphoBase {

    blobDetail: number;
    blobVertices: VerletNode[][] = [];

    constructor(p: p5, pos: p5.Vector, dim: p5.Vector, blobDetail: number, physObj: Phys, style?: ProtoStyle) {
        super(p, pos, dim, physObj, style);
        // requires minimum blobDetail of 3 
        this.blobDetail = blobDetail > 2 ? blobDetail : 3;
        this.setup();
    }

    setup(): void {
        this.pilotNode = new VerletNode(this.p, this.pos, 2, this.style.fillCol);

        // top node
        let x = this.p.cos(-this.p.PI / 2) * this.dim.x;
        let y = this.p.sin(-this.p.PI / 2) * this.dim.y;
        let z = 0.0;
        this.nodes.push(new VerletNode(this.p, new p5.Vector(x, y, z).add(this.pos), 2, this.p.color(200, 100, 0)));

        // body nodes
        this.theta = -this.p.PI / 2 + this.p.PI / this.blobDetail;
        for (let i = 0; i < this.blobDetail - 1; i++) {
            this.nodes2D.push([]);
            // let lat = this.p.map(i, 0, this.blobDetail, 0, this.p.PI);
            const x = this.p.cos(this.theta) * this.dim.x;
            const y = this.p.sin(this.theta) * this.dim.y;
            const z = 0.0;
            for (let j = 0; j < this.blobDetail; j++) {
                const x1 = this.p.sin(this.phi) * z + this.p.cos(this.phi) * x;
                const y1 = y
                const z1 = this.p.cos(this.phi) * z - this.p.sin(this.phi) * x;
                const vn = new VerletNode(this.p, new p5.Vector(x1, y1, z1).add(this.pos), 2, this.p.color(200, 100, 0))
                this.nodes.push(vn);
                this.nodes2D[i][j] = vn;
                this.phi += this.p.TWO_PI / this.blobDetail;
            }
            this.theta += this.p.PI / this.blobDetail;
        }

        // bottom node
        x = this.p.cos(this.p.PI / 2) * this.dim.x;
        y = this.p.sin(this.p.PI / 2) * this.dim.y;
        z = 0.0;
        this.nodes.push(new VerletNode(this.p, new p5.Vector(x, y, z).add(this.pos), 2, this.p.color(200, 100, 0)));

        // sticks (main body - latitude)
        for (let i = 0, k = 0; i < this.nodes2D.length; i++) {
            for (let j = 0; j < this.blobDetail; j++) {
                if (j < this.blobDetail - 1) {
                    this.sticks.push(new VerletStick(this.p, this.nodes2D[i][j], this.nodes2D[i][j + 1], .02, 0, this.style.strokeCol));
                    // close
                } else {
                    this.sticks.push(new VerletStick(this.p, this.nodes2D[i][j], this.nodes2D[i][0], .02, 0, this.style.strokeCol));
                }
            }
        }

        // sticks (main body - longitude)
        for (let i = 0; i < this.blobDetail; i++) {
            for (let j = 0; j < this.blobDetail; j++) {
                if (j < this.blobDetail - 2) {
                    this.sticks.push(new VerletStick(this.p, this.nodes2D[j][i], this.nodes2D[j + 1][i], .02, 0, this.style.strokeCol));
                }
            }
        }

        // caps
        for (let i = 0; i < this.blobDetail; i++) {
            // top
            this.sticks.push(new VerletStick(this.p, this.nodes[0], this.nodes2D[0][i], .02, 0, this.style.strokeCol));

            // bottom
            this.sticks.push(new VerletStick(this.p, this.nodes[this.nodes.length - 1], this.nodes2D[this.blobDetail - 2][i], .02, 0, this.style.strokeCol));
        }

        // pilot-node sticks
        for (let i = 0; i < this.nodes.length; i++) {
            if (i % 1 === 0) {
                this.supportSticksHidden!.push(new VerletStick(this.p, this.pilotNode, this.nodes[i], .02, 0, this.style.strokeCol));
            }
        }

        // support sticks
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i; j < this.nodes.length; j++) {
                if (this.nodes[i].pos.dist(this.nodes[j].pos) > this.dim.x * 1.75) {
                    this.sticks.push(new VerletStick(this.p, this.nodes[i], this.nodes[j], .02, 0, this.p.color(200, 200, 0, 20)));
                }
            }

        }

        // tails
        for (let i = 0; i < this.nodes.length; i++) {
            let tail = this.nodes[i].pos.copy();
            tail.sub(this.pos);
            tail.normalize();
            const tailLen = this.p.random(180, 220);
            tail.mult(tailLen);
            tail.add(this.nodes[i].pos)
            this.tails.push(new VerletStrand_2N(this.p, this.nodes[i].pos, tail, 20, new p5.Vector(1, 1), new ProtoStyle(this.p, this.p.color(100, 100, 135), this.tailCol, .3, .5)));
        }
    }

    resetTails(): void {
        this.tails.length = 0;
        for (let i = 0; i < this.nodes.length; i++) {
            let tail = this.nodes[i].pos.copy();
            tail.sub(this.pos);
            tail.normalize();
            const tailLen = this.p.random(180, 220);
            tail.mult(tailLen);
            tail.add(this.nodes[i].pos)
            this.tails.push(new VerletStrand_2N(this.p, this.nodes[i].pos, tail, 20, new p5.Vector(1, 1), new ProtoStyle(this.p, this.p.color(100, 100, 135), this.tailCol, .3, .5)));
        }

    }
}
