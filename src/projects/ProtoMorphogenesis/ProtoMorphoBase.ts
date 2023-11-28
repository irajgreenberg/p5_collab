import p5 from "p5";
import { Phys } from "../../libPByte_p5/PByte_utils";
import { VerletNode } from "../../libPByte_p5/VerletNode";
import { VerletStick } from "../../libPByte_p5/VerletStick";
import { VerletStrand_2N } from "../../libPByte_p5/VerletStrand_2N";

export abstract class ProtoMorphoBase {

    p: p5;
    pos: p5.Vector;
    dim: p5.Vector;
    amp: number;
    freq: number;
    elasticity: number;

    centroid: p5.Vector = new p5.Vector(0, 0, 0);
    theta: number = 0;

    //tetrahedron structure
    pilotNode: VerletNode | undefined;
    nodes: VerletNode[] = [];
    connectioNodePos: p5.Vector[] = [];
    isNodePaired: boolean[] = []; // tracks when nodes get paired form collison/proximity
    sticks: VerletStick[] = [];
    supportSticks: VerletStick[] = [];
    tails: VerletStrand_2N[] = [];

    supportSticksHidden?: VerletStick[] = [];

    constructor(p: p5, pos: p5.Vector, dim: p5.Vector, physObj: Phys) {
        this.p = p;
        this.pos = pos;
        this.dim = dim;
        this.amp = physObj.amplitude;
        this.freq = physObj.freqency;
        this.elasticity = physObj.elasticity;

        this.setup();
    }

    // overridden by all derived classes
    setup(): void {

    }

    nudge(nodeID: number = 0, vec: p5.Vector = new p5.Vector(1, 1, 1)): void {
        this.pilotNode!.nudge(vec);
    }

    move(bounds: p5.Vector = new p5.Vector(this.p.width, this.p.height, this.p.height)) {
        this.centroid.mult(0);



        const v = this.p.sin(this.theta * this.p.PI / 180.0) * this.p.random(this.amp * .8, this.amp * 1.2);
        this.pilotNode!.nudge(new p5.Vector(v, v, v));
        this.pilotNode!.verlet();

        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].verlet();
            this.nodes[i].boundsCollide(bounds);

            this.tails[i].nodes[0].pos = this.nodes[i].pos.copy();
            this.tails[i].move();

            this.centroid.add(this.nodes[i].pos);

            // if (this.isNodePaired[i]) {
            //this.nodes[i].pos = this.connectioNodePos[i];
            // }
        }
        this.centroid.div(this.nodes.length);

        for (let i = 0; i < this.sticks.length; i++) {
            this.sticks[i].constrainLen();
        }

        if (this.supportSticksHidden) {
            for (let i = 0; i < this.supportSticksHidden.length; i++) {
                this.supportSticksHidden[i].constrainLen();
            }
        }


        this.theta += this.freq;

    }

    draw() {
        for (let i = 0; i < this.sticks.length; i++) {
            this.p.strokeWeight(1.5);
            this.sticks[i].draw();
        }

        for (let i = 0; i < this.nodes.length; i++) {
            // this.nodes[i].draw();
        }



        for (let i = 0; i < this.tails.length; i++) {
            this.tails[i].draw();
        }
    }
}