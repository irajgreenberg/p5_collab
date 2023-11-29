import p5 from "p5";
import { VerletNode } from "../../libPByte_p5/VerletNode";
import { VerletStick } from "../../libPByte_p5/VerletStick";
import { VerletStrand_2N } from "../../libPByte_p5/VerletStrand_2N";
import { ProtoStyle } from "../../libPByte_p5/ProtoStyle";
import { Phys } from "../../libPByte_p5/PByte_utils";
import { ProtoMorphoBase } from "./ProtoMorphoBase";

export class AAChain extends ProtoMorphoBase {

    aminoAcidCount: number;

    constructor(p: p5, pos: p5.Vector, dim: p5.Vector, aminoAcidCount: number, physObj: Phys, style?: ProtoStyle) {
        super(p, pos, dim, physObj, style);
        this.aminoAcidCount = aminoAcidCount;
        this.setup();
    }

    setup(): void {

        this.pilotNode = new VerletNode(this.p, this.pos, 2, this.style.fillCol);

        const yStep = this.dim.y / this.aminoAcidCount;
        for (let i = 0; i <= this.aminoAcidCount; i++) {
            this.nodes.push(new VerletNode(this.p, new p5.Vector(-this.dim.x / 2, yStep * i, 0).add(this.pos), this.style.radius, this.style.fillCol));
            this.nodes.push(new VerletNode(this.p, new p5.Vector(this.dim.x / 2, yStep * i, 0).add(this.pos), this.style.radius, this.style.fillCol));
        }

        this.supportSticksHidden?.push(new VerletStick(this.p, this.nodes[0], this.pilotNode, this.elasticity, 0, this.style.strokeCol));
        this.supportSticksHidden?.push(new VerletStick(this.p, this.nodes[1], this.pilotNode, this.elasticity, 0, this.style.strokeCol));

        for (let i = 0; i <= this.aminoAcidCount; i += 2) {
            this.sticks.push(new VerletStick(this.p, this.nodes[i], this.nodes[i + 1], this.elasticity, 0, this.style.strokeCol));
            this.sticks.push(new VerletStick(this.p, this.nodes[i + 1], this.nodes[i + 3], this.elasticity, 0, this.style.strokeCol));
            this.sticks.push(new VerletStick(this.p, this.nodes[i + 2], this.nodes[i], this.elasticity, 0, this.style.strokeCol));
            //diagonal
            this.sticks.push(new VerletStick(this.p, this.nodes[i + 3], this.nodes[i], this.elasticity, 0, this.style.strokeCol));
        }

        // stabalizing side sticks
        this.supportSticksHidden?.push(new VerletStick(this.p, this.nodes[0], this.nodes[this.aminoAcidCount + 1], this.elasticity, 0, this.style.strokeCol));
        this.supportSticksHidden?.push(new VerletStick(this.p, this.nodes[1], this.nodes[this.aminoAcidCount + 2], this.elasticity, 0, this.style.strokeCol));

        this.supportSticksHidden?.push(new VerletStick(this.p, this.nodes[0], this.nodes[this.aminoAcidCount + 2], this.elasticity, 0, this.style.strokeCol));
        this.supportSticksHidden?.push(new VerletStick(this.p, this.nodes[1], this.nodes[this.aminoAcidCount + 1], this.elasticity, 0, this.style.strokeCol));

    }
}