import p5 from "p5";
import { Phys } from "../../libPByte_p5/PByte_utils";
import { VerletNode } from "../../libPByte_p5/VerletNode";
import { VerletStick } from "../../libPByte_p5/VerletStick";
import { VerletStrand_2N } from "../../libPByte_p5/VerletStrand_2N";
import { ProtoMorphoBase } from "./ProtoMorphoBase";
import { ProtoStyle } from "../../libPByte_p5/ProtoStyle";

export class Annulus extends ProtoMorphoBase {

    detail: number;




    // pilotNode: VerletNode | undefined;
    // nodes: VerletNode[] = [];
    // connectioNodePos: p5.Vector[] = [];
    // isNodePaired: boolean[] = []; // tracks when nodes get paired form collison/proximity
    // sticks: VerletStick[] = [];
    // supportSticks: VerletStick[] = [];
    // tails: VerletStrand_2N[] = [];

    constructor(p: p5, pos: p5.Vector, dim: p5.Vector, detail: number, physObj: Phys, style?: ProtoStyle) {
        super(p, pos, dim, physObj, style);
        this.detail = detail % 2 == 0 ? detail : detail + 1;
        this.setup();
    }

    setup(): void {
        // Annulus nodes
        this.pilotNode = new VerletNode(this.p, this.pos, 2, this.p.color(127, 90, 0));

        let t = 0.0;
        for (let i = 0; i < this.detail; i++) {
            const x = this.p.cos(t) * this.dim.x;
            const y = this.p.sin(t) * this.dim.x;
            const z = 0
            this.nodes.push(new VerletNode(this.p, new p5.Vector(x, y, z).add(this.pos), this.style.radius, this.style.fillCol));
            t += this.p.TWO_PI / this.detail;
        }

        // explicit setting false
        for (let i = 0; i < this.nodes.length; i++) {
            // n.pos.add(this.pos);
            this.isNodePaired.push(false);
            // this.connectioNodePos[i] = new p5.Vector(0, 0, 0);
        }

        // Annulus sticks
        // conect nodes to pilot node
        for (let i = 0; i < this.nodes.length; i++) {
            this.sticks.push(new VerletStick(this.p, this.pilotNode, this.nodes[i], this.elasticity, 0, this.p.color(150, 150, 255, 30)));
            // this.supportSticksHidden?.push((new VerletStick(this.p, this.pilotNode, this.nodes[i], this.elasticity, 0, this.style.strokeCol)));

            // connect perimeter
            // if (i < this.nodes.length - 1) {
            //     this.sticks.push(new VerletStick(this.p, this.nodes[i], this.nodes[i + 1], this.elasticity, 0, this.style.strokeCol));
            // } else {
            //     this.sticks.push(new VerletStick(this.p, this.nodes[i], this.nodes[0], this.elasticity, 0, this.style.strokeCol));
            // }
        }

        // cross-supports
        for (let i = 0; i < this.nodes.length / 2; i++) {
            this.supportSticksHidden?.push(new VerletStick(this.p, this.nodes[i], this.nodes[i + this.nodes.length / 2], this.elasticity * .8, 0, this.p.color(0, 0, 255)));
        }


        // tails
        for (let i = 0; i < this.nodes.length; i++) {
            let h1 = this.nodes[i].pos.copy();
            const tailLen = this.p.random(.5, 1.5);
            let t1 = new p5.Vector(h1.x * tailLen, h1.y * tailLen, h1.z * tailLen);
            this.tails.push(new VerletStrand_2N(this.p, h1, t1, 10, new p5.Vector(1, 1), new ProtoStyle(this.p, this.p.color(100, 100, 135), this.p.color(200, 200, 255, 80), .3, .5)));
        }

    }
}
