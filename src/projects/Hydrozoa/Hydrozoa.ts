// Hydrozoa
// Ira Greenberg
// Santa Fe, NM | Dallas, TX

// Class Description: 

import p5 from "p5";
import { VerletNode } from "../../libPByte_p5/VerletNode";
import { VerletStick } from "../../libPByte_p5/VerletStick";
import { VerletStrand } from "../../libPByte_p5/VerletStrand";
import { VerletStrand_2N } from "../../libPByte_p5/VerletStrand_2N";
import { ProtoStyle } from "../../libPByte_p5/ProtoStyle";

export class Hydrozoa {
    p: p5
    nodeCount: number;
    head: p5.Vector;
    tail: p5.Vector;
    stickTensionRange: p5.Vector;

    style: ProtoStyle;
    armStyle: ProtoStyle;

    nodes: VerletNode[] = [];
    sticks: VerletStick[] = [];
    centralSpine: VerletStrand_2N | undefined;
    bounds: p5.Vector | undefined
    armLength = 85;
    armEndNodeIndex = 0;
    armsRight: VerletStrand_2N[] = [];
    armsLeft: VerletStrand_2N[] = [];
    crossSupports: VerletStick[] = [];
    spineSupportsRight: VerletStick[] = [];
    spineSupportsLeft: VerletStick[] = [];
    vertSupportsRight: VerletStick[] = [];
    vertSupportsLeft: VerletStick[] = [];

    constructor(p: p5, nodeCount: number, head: p5.Vector, tail: p5.Vector, stickTensionRange: p5.Vector = p.createVector(.5, .5), style: ProtoStyle = new ProtoStyle(p, p.color(127, 127, 127), p.color(25, 25, 25), 1, 3),
        armStyle: ProtoStyle = new ProtoStyle(p, p.color(100, 100, 135), p.color(200, 200, 255), .8, 3)) {
        this.p = p;
        this.nodeCount = nodeCount;
        this.head = head;
        this.tail = tail;
        this.stickTensionRange = stickTensionRange;
        // this.spineLen = spineLen;
        this.style = style;
        this.armStyle = armStyle;

        this.create();
    }

    create() {
        this.centralSpine = new VerletStrand_2N(
            this.p,
            this.head,
            this.tail,
            this.nodeCount,
            this.stickTensionRange,
            this.style
        )


        this.centralSpine = new VerletStrand_2N(this.p, this.head, this.tail, this.nodeCount, this.stickTensionRange, this.style);

        // appendages
        for (let i = 0; i < this.centralSpine.nodeCount; i++) {
            this.armLength = 1 + this.p.abs(this.p.sin(i * this.p.PI * 4 / this.centralSpine.nodeCount) * 85);
            // console.log(armLength);

            let h1 = this.centralSpine!.nodes[i].pos.copy();
            let t1 = new p5.Vector(h1.x, h1.y + this.armLength, h1.z);
            this.armsRight.push(new VerletStrand_2N(this.p, h1, t1, 15, new p5.Vector(.2, .4), new ProtoStyle(this.p, this.p.color(100, 100, 135), this.p.color(200, 200, 255), .8, 13)));

            let h2 = h1.copy();
            let t2 = new p5.Vector(h2.x, h2.y - this.armLength, h2.z)
            this.armsLeft.push(new VerletStrand_2N(this.p, h2, t2, 15, new p5.Vector(.2, .4), new ProtoStyle(this.p, this.p.color(100, 100, 135), this.p.color(200, 200, 255), .8, 13)));

            this.armEndNodeIndex = this.armsRight[i].nodes.length - 1;
            this.crossSupports.push(new VerletStick(this.p, this.armsRight[i].nodes[this.armEndNodeIndex], this.armsLeft[i].nodes[this.armEndNodeIndex], 1, 0));

            this.spineSupportsRight.push(new VerletStick(this.p, this.armsLeft[i].nodes[this.armEndNodeIndex], this.centralSpine!.nodes[i], 1, 0, this.p.color(200, 20, 200)));
            this.spineSupportsLeft.push(new VerletStick(this.p, this.armsRight[i].nodes[this.armEndNodeIndex], this.centralSpine!.nodes[i], 1, 0, this.p.color(200, 20, 200)));


            if (i > 0) {
                this.vertSupportsRight.push(new VerletStick(this.p, this.armsRight[i - 1].nodes[this.armEndNodeIndex], this.armsRight[i].nodes[this.armEndNodeIndex], 1, 0));
                this.vertSupportsLeft.push(new VerletStick(this.p, this.armsLeft[i - 1].nodes[this.armEndNodeIndex], this.armsLeft[i].nodes[this.armEndNodeIndex], 1, 0));
            }
            this.armLength = 45 + this.p.cos(i * this.p.PI / 180) * 45;
        }

        this.nudge([0, 4, 5, 7, 9, 11, this.centralSpine.nodeCount - 1, this.centralSpine.nodeCount - 2, this.centralSpine.nodeCount - 4], new p5.Vector(0, this.p.random(-25, 25), 0));
    }

    setSpineStyle(style: ProtoStyle): void {
        this.style = style;
    }

    setArmsStyle(armStyle: ProtoStyle): void {
        this.armStyle = armStyle;
    }


    move(bounds?: p5.Vector) {
        // if (bounds) {
        this.bounds = bounds;
        // }
        if (this.centralSpine) {
            if (bounds) {
                this.centralSpine.move(bounds);
            } else {
                this.centralSpine.move();
            }
        }


        this.centralSpine!.nodes[0].pos.x = this.p.cos(this.p.frameCount * this.p.PI / 270) * (300 + this.p.random(3, 5));
        this.centralSpine!.nodes[0].pos.y = this.p.sin(this.p.frameCount * this.p.PI / 270) * (300 + this.p.random(3, 5)) +
            this.p.sin(this.p.cos(this.p.frameCount * this.p.PI / 85)) * (400 + this.p.random(3, 5));

        this.centralSpine!.nodes[this.p.floor(this.centralSpine!.nodes.length / 2)].pos.y = this.p.sin(this.p.frameCount * this.p.PI / 360) * 350
        this.centralSpine!.nodes[this.centralSpine!.nodes.length - 1].pos.y = this.p.cos(this.p.frameCount * this.p.PI / 45) * 50


        for (let i = 0; i < this.centralSpine!.nodeCount; i++) {
            this.armsRight[i].nodes[0].pos = this.centralSpine!.nodes[i].pos.copy();
            this.armsLeft[i].nodes[0].pos = this.centralSpine!.nodes[i].pos.copy();

            this.armsRight[i].move(bounds);
            this.armsLeft[i].move(bounds);

            // this.armsRight[i].draw(false, true, this.armStyle);
            // this.armsLeft[i].draw(false, true, this.armStyle);

            this.spineSupportsRight[i].constrainLen();
            this.spineSupportsLeft[i].constrainLen();

            // this.spineSupportsRight[i].draw();
            // this.spineSupportsLeft[i].draw();
            // if (i > 0) {

            //     this.p.stroke(255, 200, 20);
            //     // right connections
            //     this.p.line(
            //         this.armsRight[i - 1].nodes[this.armEndNodeIndex].pos.x,
            //         this.armsRight[i - 1].nodes[this.armEndNodeIndex].pos.y,
            //         this.armsRight[i - 1].nodes[this.armEndNodeIndex].pos.z,
            //         this.armsRight[i].nodes[this.armEndNodeIndex].pos.x,
            //         this.armsRight[i].nodes[this.armEndNodeIndex].pos.y,
            //         this.armsRight[i].nodes[this.armEndNodeIndex].pos.z
            //     );
            //     // left connections
            //     this.p.line(
            //         this.armsLeft[i - 1].nodes[this.armEndNodeIndex].pos.x,
            //         this.armsLeft[i - 1].nodes[this.armEndNodeIndex].pos.y,
            //         this.armsLeft[i - 1].nodes[this.armEndNodeIndex].pos.z,
            //         this.armsLeft[i].nodes[this.armEndNodeIndex].pos.x,
            //         this.armsLeft[i].nodes[this.armEndNodeIndex].pos.y,
            //         this.armsLeft[i].nodes[this.armEndNodeIndex].pos.z
            //     );
            // }
        }

        for (let i = 0; i < this.crossSupports.length; i++) {
            this.crossSupports[i].constrainLen();
            // this.crossSupports[i].draw();
        }

        for (let i = 0; i < this.vertSupportsLeft.length; i++) {
            this.vertSupportsLeft[i].constrainLen();
            this.vertSupportsRight[i].constrainLen();

            // this.vertSupportsLeft[i].draw();
            // this.vertSupportsRight[i].draw();
        }
        // **************************************



    }

    // start Verlet with initial offset
    nudge(ns: number[], v: p5.Vector | p5.Vector[]) {
        for (let i = 0; i < ns.length; i++) {
            if (this.centralSpine) {
                if (Array.isArray(v)) {
                    this.centralSpine.nodes[ns[i]].nudge(v[i]);
                } else {
                    this.centralSpine.nodes[ns[i]].nudge(v);
                }
            }
        }
    }

    draw(isFill: boolean = true, isStroke: boolean = true) {
        if (this.centralSpine) {
            // this.centralSpine.draw(isFill, isStroke, this.style);
        }
    }

    drawBounds(fill: p5.Color = this.p.color(200), stroke: p5.Color = this.p.color(50)) {
        if (this.bounds) {
            this.p.noStroke();
            this.p.fill(fill);
            this.p.stroke(stroke);
            this.p.box(this.bounds.x, this.bounds.y, this.bounds.z);
        }
    }

    drawBoundsOutline(stroke: p5.Color = this.p.color(50), strokeWt: number = 1) {
        if (this.bounds) {
            this.p.noFill();
            this.p.stroke(stroke);
            this.p.strokeWeight(strokeWt);
            this.p.box(this.bounds.x, this.bounds.y, this.bounds.z);

        }
    }

    drawArmsBoundarySupports(strokeCol: p5.Color = this.p.color(255, 200, 20)): void {
        for (let i = 0; i < this.centralSpine!.nodeCount; i++) {
            if (i > 0) {
                this.p.stroke(strokeCol);
                // right connections
                this.p.line(
                    this.armsRight[i - 1].nodes[this.armEndNodeIndex].pos.x,
                    this.armsRight[i - 1].nodes[this.armEndNodeIndex].pos.y,
                    this.armsRight[i - 1].nodes[this.armEndNodeIndex].pos.z,
                    this.armsRight[i].nodes[this.armEndNodeIndex].pos.x,
                    this.armsRight[i].nodes[this.armEndNodeIndex].pos.y,
                    this.armsRight[i].nodes[this.armEndNodeIndex].pos.z
                );
                // left connections
                this.p.line(
                    this.armsLeft[i - 1].nodes[this.armEndNodeIndex].pos.x,
                    this.armsLeft[i - 1].nodes[this.armEndNodeIndex].pos.y,
                    this.armsLeft[i - 1].nodes[this.armEndNodeIndex].pos.z,
                    this.armsLeft[i].nodes[this.armEndNodeIndex].pos.x,
                    this.armsLeft[i].nodes[this.armEndNodeIndex].pos.y,
                    this.armsLeft[i].nodes[this.armEndNodeIndex].pos.z
                );
            }
        }
    }

    drawArms(isNodeDrawable: boolean = false, isStickDrawable: boolean = true): void {
        for (let i = 0; i < this.centralSpine!.nodeCount; i++) {
            this.armsRight[i].draw(isNodeDrawable, isStickDrawable, this.armStyle);
            this.armsLeft[i].draw(isNodeDrawable, isStickDrawable, this.armStyle);
        }
    }

    drawSpine(isNodeDrawable: boolean = false, isStickDrawable: boolean = true): void {
        if (this.centralSpine) {
            this.centralSpine.draw(isNodeDrawable, isStickDrawable, this.style);
        }
    }

    drawAll(): void {

    }


}


