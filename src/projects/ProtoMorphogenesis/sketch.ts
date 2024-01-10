// Hydrozoa
// Ira Greenberg
// Santa Fe, NM | Dallas, TX

// Project Description: 

import p5, { Vector } from "p5";
import { ProtoStyle } from "../../libPByte_p5/ProtoStyle";
import { Hydrozoa } from "./Hydrozoa";
import { Pulsar } from "./Pulsar";
import { Phys } from "../../libPByte_p5/PByte_utils";
import { VerletStick } from "../../libPByte_p5/VerletStick";
import { Annulus } from "./Annulus";
import { AAChain } from "./AAChain";
import { Helix } from "./Helix";
import { ProtoBlob } from "./ProtoBlob";
import { ProtoBlock } from "./ProtoBlock";
import { ProtoMorphoBase } from "./ProtoMorphoBase";


const sketch = (p: p5) => {

    // window size
    const canvasW = 200;
    const canvasH = 200;
    let bounds = new p5.Vector(100, 100, 100);

    let isWorldAttachable = false;

    // background color
    // let bgR = p.int(p.random(210, 230));
    // let bgG = p.int(p.random(210, 230));
    // let bgB = p.int(p.random(210, 230));

    let bgR = p.int(p.random(30, 80));
    let bgG = p.int(p.random(30, 80));
    let bgB = p.int(p.random(30, 80));

    let bgColor: string

    let directLightVector: p5.Vector;

    const pulsarCount = 5;
    let ps: Pulsar[] = [];

    const annulusCount = 2;
    let as: Annulus[] = [];

    // let aa0: AAChain;
    const AAChainCount = 2;
    let aas: AAChain[] = [];

    const protoBlobCount = 10;
    let blobs: ProtoBlob[] = [];

    const protoBlockCount = 3;
    let pBlocks: ProtoBlock[] = [];

    let protoOrgs: ProtoMorphoBase[] = [];

    p.setup = () => {
        bgColor = "#" + p.hex(bgR, 2) + p.hex(bgG, 2) + p.hex(bgB, 2);

        p.background(bgR, bgG, bgB);
        document.body.style.backgroundColor = bgColor;
        document.title = "ProtoMorphogenesis";

        let cnv = p.createCanvas(canvasW, canvasH, p.WEBGL);


        p.setAttributes('antialias', true);
        cnv.style('display', 'block');

        directLightVector = p.createVector(0, 0, -300);

        // ****** Instantiate Custom Geom *******

        // pulsars
        for (let i = 0; i < pulsarCount; i++) {
            const r = p.random(30, 60);
            const initPos = new p5.Vector(
                p.random(-bounds.x / 2, bounds.x / 2),
                p.random(-bounds.y / 2, bounds.y / 2),
                p.random(-bounds.z / 2, bounds.z / 2),
            );
            // protoOrgs.push(new Pulsar(p, initPos, new p5.Vector(r, r, r), new Phys(p.random(-3.4, 3.4), p.random(20, 65), p.random(.002, .3)), new ProtoStyle(p, p.color(127, 127, 127), p.color(125, 75, 255, 150), 2, 3)));
        }

        // annulus
        for (let i = 0; i < annulusCount; i++) {
            const r = p.random(130, 200);
            const initPos = new p5.Vector(
                p.random(-bounds.x / 2, bounds.x / 2),
                p.random(-bounds.y / 2, bounds.y / 2),
                p.random(-bounds.z / 2, bounds.z / 2),
            );
            const detail: number = p.floor(p.random(10, 30));

            // protoOrgs.push(new Annulus(p, initPos, new p5.Vector(r, r, r), detail, new Phys(.4, 15, p.random(.002, .1)), new ProtoStyle(p, p.color(127, 127, 127), p.color(125, 200, 255, 80), 1, 3)));
        }

        // AAChain
        for (let i = 0; i < AAChainCount; i++) {
            const r = p.random(100, 100);
            const initPos = new p5.Vector(
                p.random(-bounds.x / 2, bounds.x / 2),
                p.random(-bounds.y / 2, bounds.y / 2),
                p.random(-bounds.z / 2, bounds.z / 2),
            );
            const detail: number = p.floor(p.random(30, 50));

            // protoOrgs.push(new AAChain(p, initPos, new p5.Vector(r * .1, r * 6, r), detail, new Phys(1.5, 15, p.random(.002, .3)), new ProtoStyle(p, p.color(127, 127, 127), p.color(255, 180, 180, 95), 2, 3)));
        }


        // Blobs
        for (let i = 0; i < protoBlobCount; i++) {
            const r = p.random(1, 1);
            const initPos = new p5.Vector(
                p.random(-bounds.x / 2, bounds.x / 2),
                p.random(-bounds.y / 2, bounds.y / 2),
                p.random(-bounds.z / 2, bounds.z / 2),
            );
            const detail: number = p.floor(p.random(30, 50));

            const rad = p.random(3, 10);
            protoOrgs.push(new ProtoBlob(p, initPos, new p5.Vector(rad, rad, rad), p.floor(p.random(3, 5)), new Phys(p.random(2, 5), p.random(5, 8), p.random(.002, .09)), new ProtoStyle(p, p.color(127, 127, 127), p.color(100, 100, 100, 255), 1, 1)));

            protoOrgs[protoOrgs.length - 1].setTailCol(p.color(p.random(150, 200), p.random(150, 200), 185, p.random(60, 100)));
        }


        // Blocks
        for (let i = 0; i < protoBlockCount; i++) {
            const rad = p.random(50, 100);
            const initPos = new p5.Vector(
                p.random(-bounds.x / 2, bounds.x / 2),
                p.random(-bounds.y / 2, bounds.y / 2),
                p.random(-bounds.z / 2, bounds.z / 2),
            );
            const detail: number = p.floor(p.random(30, 50));

            // protoOrgs.push(new ProtoBlock(p, initPos, new p5.Vector(rad, rad, rad), p.floor(p.random(4, 7)), new Phys(p.random(1, 3), p.random(1, 3), p.random(.003, .007)), new ProtoStyle(p, p.color(127, 127, 127), p.color(200, 200, 200, 95), 1, 1)));
        }


        // protoOrgs.push(new ProtoBlock(p, new p5.Vector(0, 0, 0), new p5.Vector(30, 30, 30), 3, new Phys(2.5, 15, p.random(.001, .003)), new ProtoStyle(p, p.color("#FC0FC0"), p.color(200, 200, 200, 95), 2, 3)));
        // **************************************
    };

    const resizedSketch = (p: p5) => {
        p.windowResized = () => {
            document.body.style.backgroundColor = bgColor;
            p.resizeCanvas(canvasW, canvasH);
        }
    };

    p.draw = () => {
        p.fill(0, 5);


        p.background(bgR * 1.2, bgG * 1.2, bgB * 1.2);
        // p.background(255);

        p.orbitControl();
        p.rotateY(p.frameCount * p.PI / 900);

        let v = p.createVector(directLightVector.x, directLightVector.y, directLightVector.z);

        // p.ambientLight(20, 10, 15);

        // p.directionalLight(127, 127, 127, v);

        p.shininess(75);
        // p.specularColor(189);
        // p.specularMaterial(250);

        p.specularColor(255);
        p.specularMaterial(150);

        // Creating the point lights at the
        // given points from the given directions
        p.pointLight(155, 100, 100, 60, 5, 1200);
        p.pointLight(200, 200, 255, -60, 500, 1380);

        // ********* Animate Custom Geom ********

        //drawBounds(p.color(200, 140, 150, 80));
        //drawBoundsOutline(p.color(75, 75, 75), 1);

        for (let i = 0; i < protoOrgs.length; i++) {
            protoOrgs[i].move(bounds);
            protoOrgs[i].draw(false, false);

            for (let j = i + 1; j < protoOrgs.length; j++) {
                if (protoOrgs[i].centroid.dist(protoOrgs[j].centroid) < 90) {
                    p.stroke(255, 200, 200, p.random(50, 100));
                    p.line(protoOrgs[i].centroid.x, protoOrgs[i].centroid.y, protoOrgs[i].centroid.z, protoOrgs[j].centroid.x, protoOrgs[j].centroid.y, protoOrgs[j].centroid.z);

                    // p.curve(protoOrgs[i].centroid.x, protoOrgs[i].centroid.y, protoOrgs[i].centroid.z, protoOrgs[j].centroid.x, protoOrgs[j].centroid.y, protoOrgs[j].centroid.z);

                    testNodeCollision(protoOrgs[i], protoOrgs[j]);
                }
            }
        }

        drawBoundsOutline();
        // **************************************
    };


    p.keyTyped = () => {
        if (p.key === 'p') {
            const name = "Hydrozoa" + "_" + p.year() + p.month() + p.day() + p.hour() + p.minute() + p.second() + ".png";
            p.save(name);
        }
    }

    p.mousePressed = () => {
        isWorldAttachable = true;
    }

    function drawBounds(fill: p5.Color = p.color(200), stroke: p5.Color = p.color(50)) {
        p.noStroke();
        p.fill(fill);
        p.stroke(stroke);
        p.box(bounds.x, bounds.y, bounds.z);
    }
    function drawBoundsOutline(stroke: p5.Color = p.color(100, 50, 0), strokeWt: number = 1) {
        p.noFill();
        p.stroke(stroke);
        p.strokeWeight(strokeWt);
        p.box(bounds.x, bounds.y, bounds.z);
    }

    function testNodeCollision(p1: ProtoMorphoBase, p2: ProtoMorphoBase) {
        if (isWorldAttachable) {
            for (let i = 0; i < p1.nodes.length; i++) {
                for (let j = i; j < p2.nodes.length; j++) {
                    if (p1.nodes[i].pos.dist(p2.nodes[j].pos) < p.random(5, 5) &&
                        p1.isNodePaired[i] === false &&
                        p2.isNodePaired[j] === false &&
                        p1.isAttachable || p2.isAttachable) {
                        // p1.nodes[i].pos = p2.nodes[j].pos;
                        p.strokeWeight(.25);
                        p1.sticks.push(new VerletStick(p, p1.nodes[i], p2.nodes[j], p.random(.5, .003), 0, p.color(255, 30, 30, 100)));


                        //p1.connectioNodePos[i] = p2.nodes[j].pos.copy();
                        p1.nodes[i].col = p.color(255, 255, 0);
                        p2.nodes[j].col = p.color(255, 255, 0);

                        p1.isNodePaired[i] = true;
                        p2.isNodePaired[j] = true;

                        p1.isAttachable = false;
                        p2.isAttachable = false;
                    }
                }
            }
        }
    }

};

let _instance = new p5(sketch);




