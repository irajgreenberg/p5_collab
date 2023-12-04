// ProtoMorphogensis
// December, 2023
// Created during gazell.io residency

// Description:
// Verlet Cube class in ProtoMorphogenesis project
// includes style, phys, binding and motion capabilities


import p5 from "p5";
import { Phys } from "../../libPByte_p5/PByte_utils";
import { VerletNode } from "../../libPByte_p5/VerletNode";
import { VerletStick } from "../../libPByte_p5/VerletStick";
import { VerletStrand_2N } from "../../libPByte_p5/VerletStrand_2N";
import { ProtoMorphoBase } from "./ProtoMorphoBase";
import { ProtoStyle } from "../../libPByte_p5/ProtoStyle";

export class ProtoBlock extends ProtoMorphoBase {

    detail: number;

    constructor(p: p5, pos: p5.Vector, dim: p5.Vector, detail: number, physObj: Phys, style?: ProtoStyle) {
        super(p, pos, dim, physObj, style);
        this.detail = detail % 2 == 0 ? detail : detail + 1;
        this.setup();
    }

    setup(): void {
        this.pilotNode = new VerletNode(this.p, this.pos, this.style.radius, this.style.fillCol);

        // Cube nodes
        this.nodes.push(new VerletNode(this.p, new p5.Vector(-1, -1, -1).mult(this.dim), this.style.radius, this.style.fillCol));
        this.nodes.push(new VerletNode(this.p, new p5.Vector(1, -1, -1).mult(this.dim), this.style.radius, this.style.fillCol));
        this.nodes.push(new VerletNode(this.p, new p5.Vector(1, 1, -1).mult(this.dim), this.style.radius, this.style.fillCol));
        this.nodes.push(new VerletNode(this.p, new p5.Vector(-1, 1, -1).mult(this.dim), this.style.radius, this.style.fillCol));
        this.nodes.push(new VerletNode(this.p, new p5.Vector(-1, -1, 1).mult(this.dim), this.style.radius, this.style.fillCol));
        this.nodes.push(new VerletNode(this.p, new p5.Vector(1, -1, 1).mult(this.dim), this.style.radius, this.style.fillCol));
        this.nodes.push(new VerletNode(this.p, new p5.Vector(1, 1, 1).mult(this.dim), this.style.radius, this.style.fillCol));
        this.nodes.push(new VerletNode(this.p, new p5.Vector(-1, 1, 1).mult(this.dim), this.style.radius, this.style.fillCol));

        // cube indices
        let indices = [
            [0, 1, 2], [0, 2, 3],  // Front face
            [1, 5, 6], [1, 6, 2],  // Right face
            [5, 4, 7], [5, 7, 6],  // Back face
            [4, 0, 3], [4, 3, 7],  // Left face
            [4, 5, 1], [4, 1, 0],  // Bottom face
            [3, 2, 6], [3, 6, 7]   // Top face
        ];

        // cube basic sticks
        for (let i = 0; i < indices.length; i++) {
            for (let j = 0; j < indices[i].length - 1; j++) {
                this.sticks.push(new VerletStick(this.p, this.nodes[indices[i][j]], this.nodes[indices[i][j + 1]], this.elasticity, 0, this.style.strokeCol));
            }
        }

        // 8 cubes sticks to pilot node at origin (center)
        for (let i = 0; i < this.nodes.length; i++) {
            this.sticks.push(new VerletStick(this.p, this.nodes[i], this.pilotNode, this.elasticity, 0, this.style.strokeCol));
        }

        // cube hiddon diagnol support sticks
        //sticks
        this.sticks.push(new VerletStick(this.p, this.nodes[0], this.nodes[6], this.elasticity, 0, this.p.color(255, 255, 0)));
        this.sticks.push(new VerletStick(this.p, this.nodes[1], this.nodes[7], this.elasticity, 0, this.p.color(255, 255, 0)));
        this.sticks.push(new VerletStick(this.p, this.nodes[2], this.nodes[4], this.elasticity, 0, this.p.color(255, 255, 0)));
        this.sticks.push(new VerletStick(this.p, this.nodes[3], this.nodes[5], this.elasticity, 0, this.p.color(255, 255, 0)));


        // Cube sticks
        // conect nodes to pilot node
        // for (let i = 0; i < this.nodes.length; i++) {
        //     this.sticks.push(new VerletStick(this.p, this.pilotNode, this.nodes[i], this.elasticity, 0, this.p.color(150, 150, 255, 30)));
        //     // this.supportSticksHidden?.push((new VerletStick(this.p, this.pilotNode, this.nodes[i], this.elasticity, 0, this.style.strokeCol)));

        //     // connect perimeter
        //     // if (i < this.nodes.length - 1) {
        //     //     this.sticks.push(new VerletStick(this.p, this.nodes[i], this.nodes[i + 1], this.elasticity, 0, this.style.strokeCol));
        //     // } else {
        //     //     this.sticks.push(new VerletStick(this.p, this.nodes[i], this.nodes[0], this.elasticity, 0, this.style.strokeCol));
        //     // }
        // }

        // // cross-supports
        // for (let i = 0; i < this.nodes.length / 2; i++) {
        //     this.supportSticksHidden?.push(new VerletStick(this.p, this.nodes[i], this.nodes[i + this.nodes.length / 2], this.elasticity * .8, 0, this.p.color(0, 0, 255)));
        // }


        // // tails
        // for (let i = 0; i < this.nodes.length; i++) {
        //     let h1 = this.nodes[i].pos.copy();
        //     const tailLen = this.p.random(.5, 1.5);
        //     let t1 = new p5.Vector(h1.x * tailLen, h1.y * tailLen, h1.z * tailLen);
        //     this.tails.push(new VerletStrand_2N(this.p, h1, t1, 10, new p5.Vector(1, 1), new ProtoStyle(this.p, this.p.color(100, 100, 135), this.p.color(200, 200, 255, 80), .3, .5)));
        // }

    }
}
