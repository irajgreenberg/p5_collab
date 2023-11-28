import p5 from "p5";
import { VerletNode } from "../../libPByte_p5/VerletNode";
import { VerletStick } from "../../libPByte_p5/VerletStick";
import { VerletStrand_2N } from "../../libPByte_p5/VerletStrand_2N";
import { ProtoStyle } from "../../libPByte_p5/ProtoStyle";
import { Phys } from "../../libPByte_p5/PByte_utils";
import { ProtoMorphoBase } from "./ProtoMorphoBase";

export class Pulsar extends ProtoMorphoBase {

    // p: p5;
    // pos: p5.Vector;
    // dim: p5.Vector;
    // amp: number;
    // freq: number;
    // elasticity: number;

    // centroid: p5.Vector = new p5.Vector(0, 0, 0);

    // theta: number = 0;

    //tetrahedron structure
    // pilotNode: VerletNode | undefined;
    // nodes: VerletNode[] = [];
    // connectioNodePos: p5.Vector[] = [];
    // isNodePaired: boolean[] = []; // tracks when nodes get paired form collison/proximity
    // sticks: VerletStick[] = [];
    // supportSticks: VerletStick[] = [];
    // tails: VerletStrand_2N[] = [];

    constructor(p: p5, pos: p5.Vector, dim: p5.Vector, physObj: Phys, style?: ProtoStyle) {
        super(p, pos, dim, physObj, style);
        // this.p = p;
        // this.pos = pos;
        // this.dim = dim;
        // this.amp = physObj.amplitude;
        // this.freq = physObj.freqency;
        // this.elasticity = physObj.elasticity;

        this.setup();
    }

    setup(): void {
        // nodes of a tetrahedron
        this.pilotNode = new VerletNode(this.p, this.pos, 2, this.style.fillCol);

        this.nodes.push(new VerletNode(this.p, (new p5.Vector(this.p.sqrt(8 / 9) * this.dim.x, 0, -1 / 3)).add(this.pos), this.style.radius, this.style.fillCol));
        this.nodes.push(new VerletNode(this.p, (new p5.Vector(-this.p.sqrt(2 / 9) * this.dim.x, this.p.sqrt(2 / 3) * this.dim.y, -1 / 3 * this.dim.z)).add(this.pos), this.style.radius, this.style.fillCol));
        this.nodes.push(new VerletNode(this.p, (new p5.Vector(-this.p.sqrt(2 / 9) * this.dim.x, -this.p.sqrt(2 / 3) * this.dim.y, -1 / 3 * this.dim.z)).add(this.pos), this.style.radius, this.style.fillCol));
        this.nodes.push(new VerletNode(this.p, (new p5.Vector(0, 0, 1 * this.dim.x)).add(this.pos), this.style.radius, this.style.fillCol));

        // explicit setting false
        for (let i = 0; i < this.nodes.length; i++) {
            // n.pos.add(this.pos);
            this.isNodePaired.push(false);
            // this.connectioNodePos[i] = new p5.Vector(0, 0, 0);
        }



        // sticks of tetrahedron
        // conect nodes to pilot node
        for (let i = 0; i < this.nodes.length; i++) {
            this.sticks.push(new VerletStick(this.p, this.pilotNode, this.nodes[i], this.elasticity, 0, this.style.strokeCol));
        }

        // connect non-pilot nodes
        this.sticks.push(new VerletStick(this.p, this.nodes[0], this.nodes[1], this.elasticity, 0, this.style.strokeCol));
        this.sticks.push(new VerletStick(this.p, this.nodes[0], this.nodes[2], this.elasticity, 0, this.style.strokeCol));
        this.sticks.push(new VerletStick(this.p, this.nodes[0], this.nodes[3], this.elasticity, 0, this.style.strokeCol));
        this.sticks.push(new VerletStick(this.p, this.nodes[1], this.nodes[2], this.elasticity, 0, this.style.strokeCol));
        this.sticks.push(new VerletStick(this.p, this.nodes[2], this.nodes[3], this.elasticity, 0, this.style.strokeCol));
        this.sticks.push(new VerletStick(this.p, this.nodes[3], this.nodes[1], this.elasticity, 0, this.style.strokeCol));

        // tails
        for (let i = 0; i < this.nodes.length; i++) {
            let h1 = this.nodes[i].pos.copy();
            const tailLen = this.p.random(.5, 1.5);
            let t1 = new p5.Vector(h1.x * tailLen, h1.y * tailLen, h1.z * tailLen);
            this.tails.push(new VerletStrand_2N(this.p, h1, t1, 10, new p5.Vector(1, 1), new ProtoStyle(this.p, this.p.color(100, 100, 135), this.p.color(200, 200, 255, 90), .3, .5)));
        }
    }

    // nudge(nodeID: number = 0, vec: p5.Vector = new p5.Vector(1, 1, 1)): void {
    //     this.pilotNode!.nudge(vec);
    // }

    // setNodeVec(nodeID: number, vec: p5.Vector) {

    // }

    // move(bounds: p5.Vector = new p5.Vector(this.p.width, this.p.height, this.p.height)) {
    //     this.centroid.mult(0);



    //     const v = this.p.sin(this.theta * this.p.PI / 180.0) * this.p.random(this.amp * .8, this.amp * 1.2);
    //     this.pilotNode!.nudge(new p5.Vector(v, v, v));
    //     this.pilotNode!.verlet();

    //     for (let i = 0; i < this.nodes.length; i++) {
    //         this.nodes[i].verlet();
    //         this.nodes[i].boundsCollide(bounds);

    //         this.tails[i].nodes[0].pos = this.nodes[i].pos.copy();
    //         this.tails[i].move();

    //         this.centroid.add(this.nodes[i].pos);

    //         // if (this.isNodePaired[i]) {
    //         //this.nodes[i].pos = this.connectioNodePos[i];
    //         // }
    //     }
    //     this.centroid.div(this.nodes.length);

    //     for (let i = 0; i < this.sticks.length; i++) {
    //         this.sticks[i].constrainLen();
    //     }
    //     this.theta += this.freq;
    // }

    // draw() {
    //     for (let i = 0; i < this.sticks.length; i++) {
    //         this.p.strokeWeight(1.5);
    //         this.sticks[i].draw();
    //     }

    //     for (let i = 0; i < this.nodes.length; i++) {
    //         // this.nodes[i].draw();
    //     }



    //     for (let i = 0; i < this.tails.length; i++) {
    //         this.tails[i].draw();
    //     }
    // }

}