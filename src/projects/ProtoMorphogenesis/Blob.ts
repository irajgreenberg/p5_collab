import p5 from "p5";
import { VerletNode } from "../../libPByte_p5/VerletNode";
import { VerletStick } from "../../libPByte_p5/VerletStick";
import { VerletStrand_2N } from "../../libPByte_p5/VerletStrand_2N";
import { ProtoStyle } from "../../libPByte_p5/ProtoStyle";
import { Phys } from "../../libPByte_p5/PByte_utils";
import { ProtoMorphoBase } from "./ProtoMorphoBase";

export class Blob extends ProtoMorphoBase {

    blobDetail: number;
    blobVertices: VerletNode[][] = [];

    constructor(p: p5, pos: p5.Vector, dim: p5.Vector, blobDetail: number, physObj: Phys, style?: ProtoStyle) {
        super(p, pos, dim, physObj, style);
        this.blobDetail = blobDetail;
        this.setup();
    }

    setup(): void {

        this.pilotNode = new VerletNode(this.p, this.pos, 2, this.style.fillCol);

        let angleStep = this.p.TWO_PI / this.blobDetail;

        for (let i = 0; i <= this.blobDetail; i++) {
            let lat = this.p.map(i, 0, this.blobDetail, 0, this.p.PI);
            this.blobVertices[i] = [];
            for (let j = 0; j <= this.blobDetail; j++) {
                let lon = this.p.map(j, 0, this.blobDetail, 0, this.p.TWO_PI);
                let x = this.dim.x * this.p.sin(lat) * this.p.cos(lon);
                let y = this.dim.y * this.p.sin(lat) * this.p.sin(lon);
                let z = this.dim.z * this.p.cos(lat);
                this.blobVertices[i].push(new VerletNode(this.p, new p5.Vector(x, y, z), 2, this.p.color(100, 100, 255)));
                this.nodes.push(this.blobVertices[i][j]);
            }
        }



        this.supportSticksHidden?.push(new VerletStick(this.p, this.nodes[0], this.pilotNode, this.elasticity, 0, this.style.strokeCol));
        this.supportSticksHidden?.push(new VerletStick(this.p, this.nodes[1], this.pilotNode, this.elasticity, 0, this.style.strokeCol));

        for (let i = 0; i <= this.blobDetail; i += 2) {
            this.sticks.push(new VerletStick(this.p, this.nodes[i], this.nodes[i + 1], this.elasticity, 0, this.style.strokeCol));
            this.sticks.push(new VerletStick(this.p, this.nodes[i + 1], this.nodes[i + 3], this.elasticity, 0, this.style.strokeCol));
            this.sticks.push(new VerletStick(this.p, this.nodes[i + 2], this.nodes[i], this.elasticity, 0, this.style.strokeCol));
            //diagonal
            this.sticks.push(new VerletStick(this.p, this.nodes[i + 3], this.nodes[i], this.elasticity, 0, this.style.strokeCol));
        }

        // stabalizing side sticks
        this.supportSticksHidden?.push(new VerletStick(this.p, this.nodes[0], this.nodes[this.blobDetail + 1], this.elasticity, 0, this.style.strokeCol));
        this.supportSticksHidden?.push(new VerletStick(this.p, this.nodes[1], this.nodes[this.blobDetail + 2], this.elasticity, 0, this.style.strokeCol));

        this.supportSticksHidden?.push(new VerletStick(this.p, this.nodes[0], this.nodes[this.blobDetail + 2], this.elasticity, 0, this.style.strokeCol));
        this.supportSticksHidden?.push(new VerletStick(this.p, this.nodes[1], this.nodes[this.blobDetail + 1], this.elasticity, 0, this.style.strokeCol));

    }
}