import p5 from "p5";
import { VerletNode } from "../../libPByte_p5/VerletNode";
import { VerletStick } from "../../libPByte_p5/VerletStick";
import { VerletStrand_2N } from "../../libPByte_p5/VerletStrand_2N";
import { ProtoStyle } from "../../libPByte_p5/ProtoStyle";
import { Phys } from "../../libPByte_p5/PByte_utils";
import { ProtoMorphoBase } from "./ProtoMorphoBase";

export class Helix extends ProtoMorphoBase {

    nucleicBaseCount: number;

    constructor(p: p5, pos: p5.Vector, dim: p5.Vector, nucleicBaseCount: number, physObj: Phys, style?: ProtoStyle) {
        super(p, pos, dim, physObj, style);
        this.nucleicBaseCount = nucleicBaseCount;
        this.setup();
    }

    setup(): void {

        this.pilotNode = new VerletNode(this.p, this.pos, 2, this.style.fillCol);

        const yStep = this.dim.y / (this.nucleicBaseCount / 2);
        for (let i = 0; i <= this.nucleicBaseCount; i++) {
            let z = this.p.cos(this.theta) * this.dim.x / 2;
            let x = this.p.sin(this.theta) * this.dim.x / 2;
            let y = -this.dim.y / 2 + yStep * i;
            this.nodes.push(new VerletNode(this.p, new p5.Vector(x, y, z).add(this.pos), this.style.radius, this.style.fillCol));

            z = this.p.cos(this.theta + this.p.PI) * this.dim.x / 2;
            x = this.p.sin(this.theta + this.p.PI) * this.dim.x / 2;
            y = -this.dim.y / 2 + yStep * i;

            this.nodes.push(new VerletNode(this.p, new p5.Vector(x, y, z).add(this.pos), this.style.radius, this.style.fillCol));

            this.theta += this.p.TWO_PI * 3.0 / this.nucleicBaseCount;
        }

        // this.supportSticksHidden?.push(new VerletStick(this.p, this.nodes[this.nucleicBaseCount / 2 - 2], this.pilotNode, this.elasticity, 0, this.style.strokeCol));
        // this.supportSticksHidden?.push(new VerletStick(this.p, this.nodes[this.nucleicBaseCount / 2 - 1], this.pilotNode, this.elasticity, 0, this.style.strokeCol));


        this.sticks.push(new VerletStick(this.p, this.nodes[this.nucleicBaseCount / 2 - 1], this.pilotNode, this.elasticity, 0, this.style.strokeCol));
        this.sticks.push(new VerletStick(this.p, this.nodes[this.nucleicBaseCount / 2], this.pilotNode, this.elasticity, 0, this.style.strokeCol));

        // this.sticks.push(new VerletStick(this.p, this.nodes[0], this.pilotNode, this.elasticity, 0, this.style.strokeCol));
        // this.sticks.push(new VerletStick(this.p, this.nodes[1], this.pilotNode, this.elasticity, 0, this.style.strokeCol));




        for (let i = 0; i <= this.nucleicBaseCount; i += 2) {
            this.sticks.push(new VerletStick(this.p, this.nodes[i], this.nodes[i + 1], this.elasticity, 0, this.style.strokeCol));
            this.sticks.push(new VerletStick(this.p, this.nodes[i + 1], this.nodes[i + 3], this.elasticity, 0, this.style.strokeCol));
            this.sticks.push(new VerletStick(this.p, this.nodes[i + 2], this.nodes[i], this.elasticity, 0, this.style.strokeCol));
            //diagonal
            this.sticks.push(new VerletStick(this.p, this.nodes[i + 3], this.nodes[i], this.elasticity, 0, this.style.strokeCol));
        }

        // for (let i = 0; i < this.nodes.length / 4; i++) {

        //     this.sticks.push(new VerletStick(this.p, this.nodes[i], this.nodes[this.nodes.length - 2 - i], this.elasticity, 0, this.style.strokeCol));

        // }

        // stabalizing side sticks
        this.supportSticksHidden?.push(new VerletStick(this.p, this.nodes[0], this.nodes[this.nucleicBaseCount + 1], this.elasticity, 0, this.style.strokeCol));
        this.supportSticksHidden?.push(new VerletStick(this.p, this.nodes[1], this.nodes[this.nucleicBaseCount + 2], this.elasticity, 0, this.style.strokeCol));

        this.supportSticksHidden?.push(new VerletStick(this.p, this.nodes[0], this.nodes[this.nucleicBaseCount + 2], this.elasticity, 0, this.style.strokeCol));
        this.supportSticksHidden?.push(new VerletStick(this.p, this.nodes[1], this.nodes[this.nucleicBaseCount + 1], this.elasticity, 0, this.style.strokeCol));

    }
}