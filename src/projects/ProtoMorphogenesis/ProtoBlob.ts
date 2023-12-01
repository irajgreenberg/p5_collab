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
        this.blobDetail = blobDetail;
        this.setup();
    }

    setup(): void {

        this.pilotNode = new VerletNode(this.p, this.pos, 2, this.style.fillCol);


        for (let i = 0; i <= this.blobDetail; i++) {
            let lat = this.p.map(i, 0, this.blobDetail, 0, this.p.PI);
            for (let j = 0; j <= this.blobDetail; j++) {
                let lon = this.p.map(j, 0, this.blobDetail, 0, this.p.TWO_PI);
                let x = this.dim.x * this.p.sin(lat) * this.p.cos(lon);
                let y = this.dim.y * this.p.sin(lat) * this.p.sin(lon);
                let z = this.dim.z * this.p.cos(lat);
                this.nodes.push(new VerletNode(this.p, new p5.Vector(x, y, z), 2, this.p.color(200, 100, 0)));
            }
        }

        let totalPlus1 = this.blobDetail + 1;
        // for (let i = 0; i < this.blobDetail; i++) {
        //     for (let j = 0; j <= this.blobDetail; j++) { // Change '<' to '<=' for longitudinal lines
        for (let i = 0; i < 1; i++) {
            for (let j = 0; j <= 1; j++) { // Change '<' to '<=' for longitudinal lines
                let index1 = i * totalPlus1 + j;
                let index2 = index1 + totalPlus1;

                // Draw lines longitudinally
                this.sticks.push(new VerletStick(this.p, this.nodes[index1], this.nodes[index2], .02, 0, this.style.strokeCol));

                // Draw lines latitudinally
                if (j < this.blobDetail) {
                    let index3 = index1 + 1;
                    this.sticks.push(new VerletStick(this.p, this.nodes[index1], this.nodes[index3], .02, 0, this.style.strokeCol));
                }


            }
        }

        // for (let i = 0; i < this.nodes.length; i++) {
        //     for (let j = i + 1; j < this.nodes.length; j++) {
        //         if (this.nodes[i].pos.dist(this.nodes[j].pos) > 150) {
        //             this.sticks.push(new VerletStick(this.p, this.nodes[i], this.nodes[j], .02, 0, this.style.strokeCol));
        //         }
        //     }
        // }


    }

}