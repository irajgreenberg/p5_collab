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


const sketch = (p: p5) => {

    // window size
    const canvasW = 1200;
    const canvasH = 900;
    let bounds = new p5.Vector(500, 500, 500);

    let isAttachable = false;

    // background color
    let bgR = p.int(p.random(0, 10));
    let bgG = p.int(p.random(0, 10));
    let bgB = p.int(p.random(0, 10));
    let bgColor: string

    let directLightVector: p5.Vector;

    let h1: Hydrozoa;

    let p0: Pulsar;
    let p1: Pulsar;
    const pulsarCount = 25;
    let ps: Pulsar[] = [];
    const annulusCount = 8;
    let as: Annulus[] = [];

    let aa0: AAChain;

    let a0: Annulus;
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

        h1 = new Hydrozoa(p, 30, new p5.Vector(-450, 0, 0), new p5.Vector(450, 0, 0), new p5.Vector(.6, .8), new ProtoStyle(p, p.color(150, 75, 20), p.color(255, 200, 200), 1, 10));

        h1.setArmsStyle(new ProtoStyle(p, p.color(0, 0, 0), p.color(100, 0, 100), 20, 1));

        // p0 = new Pulsar(p, new p5.Vector(30, 30, 30), new Phys(.3, 10, .002));
        // p1 = new Pulsar(p, new p5.Vector(30, 30, 30), new Phys(.2, 15, .02));

        // pulsars
        for (let i = 0; i < pulsarCount; i++) {
            const r = p.random(10, 20);
            const initPos = new p5.Vector(
                p.random(-bounds.x / 2, bounds.x / 2),
                p.random(-bounds.y / 2, bounds.y / 2),
                p.random(-bounds.z / 2, bounds.z / 2),
            );
            ps.push(new Pulsar(p, initPos, new p5.Vector(r, r, r), new Phys(p.random(-3.4, 3.4), p.random(20, 65), p.random(.002, .3)), new ProtoStyle(p, p.color(127, 127, 127), p.color(125, 75, 255, 150), 2, 3)));
        }

        // annulus
        for (let i = 0; i < annulusCount; i++) {
            const r = p.random(15, 30);
            const initPos = new p5.Vector(
                p.random(-bounds.x / 2, bounds.x / 2),
                p.random(-bounds.y / 2, bounds.y / 2),
                p.random(-bounds.z / 2, bounds.z / 2),
            );
            const detail: number = p.floor(p.random(6, 14));
            // console.log(detail);
            as.push(new Annulus(p, initPos, new p5.Vector(r, r, r), detail, new Phys(.4, 15, p.random(.002, .1)), new ProtoStyle(p, p.color(127, 127, 127), p.color(125, 200, 255, 80), 2, 3)));
        }

        // a0 = new Annulus(p, new p5.Vector(0, 0, 0), new p5.Vector(40, 40, 30), 24, new Phys(.4, 15, .002), new ProtoStyle(p, p.color(127, 127, 127), p.color(125, 200, 255, 80), 2, 3));

        aa0 = new AAChain(p, new p5.Vector(0, 0, 0), new p5.Vector(30, 150, 0), 8, new Phys(.3, 10, .002), new ProtoStyle(p, p.color(127, 127, 127), p.color(130, 130, 65, 80), 2, 3));

        // **************************************
    };

    const resizedSketch = (p: p5) => {
        p.windowResized = () => {
            document.body.style.backgroundColor = bgColor;
            p.resizeCanvas(canvasW, canvasH);
        }
    };

    p.draw = () => {
        p.fill(0, 20);


        p.background(bgR, bgG, bgB);

        p.orbitControl();
        p.rotateY(p.frameCount * p.PI / 900);

        // p.beginShape();
        // p.vertex(-p.width / 2, -p.height / 2, 300)
        // p.vertex(p.width / 2, -p.height / 2, 300)
        // p.vertex(p.width / 2, p.height / 2, 300)
        // p.vertex(-p.width / 2, p.height / 2, 300)
        // p.endShape(p.CLOSE);
        // p.rect(-p.width / 2, -p.height / 2, p.width, p.height);

        let v = p.createVector(directLightVector.x, directLightVector.y, directLightVector.z);

        p.ambientLight(20, 10, 15);

        p.directionalLight(127, 127, 127, v);

        p.shininess(100);
        // p.specularColor(189);
        // p.specularMaterial(250);

        p.specularColor(20);
        p.specularMaterial(30);

        // Creating the point lights at the
        // given points from the given directions
        p.pointLight(255, 255, 255, -10, 5, 200);
        p.pointLight(255, 255, 255, -60, 500, 380);

        // ********* Animate Custom Geom ********

        //drawBounds(p.color(200, 140, 150, 80));
        //drawBoundsOutline(p.color(75, 75, 75), 1);

        // h1.drawSpine(true, true);
        p.push();
        p.scale(.3);
        // h1.drawArms(false, true);
        p.pop();

        // p0.move(bounds);
        // p0.draw();


        // p1.move(bounds);
        // p1.draw();

        aa0.move(bounds);
        aa0.draw();

        for (let i = 0; i < pulsarCount; i++) {
            ps[i].move(bounds);
            ps[i].draw();

            for (let j = i + 1; j < pulsarCount; j++) {
                if (ps[i].centroid.dist(ps[j].centroid) < 100) {
                    p.stroke(255, 200, 200, 150);
                    p.line(ps[i].centroid.x, ps[i].centroid.y, ps[i].centroid.z, ps[j].centroid.x, ps[j].centroid.y, ps[j].centroid.z);
                    testNodeCollision(ps[i], ps[j]);
                }
            }
        }

        for (let i = 0; i < annulusCount; i++) {
            as[i].move(bounds);
            as[i].draw();
        }
        // a0.move(bounds);
        // a0.draw();

        drawBoundsOutline();
        // h1.drawArmsBoundarySupports();
        // h1.move(bounds);
        // **************************************
    };


    p.keyTyped = () => {
        if (p.key === 'p') {
            const name = "Hydrozoa" + "_" + p.year() + p.month() + p.day() + p.hour() + p.minute() + p.second() + ".png";
            p.save(name);
        }
    }

    p.mousePressed = () => {
        isAttachable = true;
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

    function testNodeCollision(p1: Pulsar, p2: Pulsar) {
        if (isAttachable) {
            for (let i = 0; i < p1.nodes.length; i++) {
                for (let j = i; j < p2.nodes.length; j++) {
                    if (p1.nodes[i].pos.dist(p2.nodes[j].pos) < p.random(10, 40) &&
                        p1.isNodePaired[i] === false &&
                        p2.isNodePaired[j] === false) {
                        // p1.nodes[i].pos = p2.nodes[j].pos;
                        p.strokeWeight(.25);
                        p1.sticks.push(new VerletStick(p, p1.nodes[i], p2.nodes[j], p.random(.5, .003), 0, p.color(255, 30, 30, 100)));


                        //p1.connectioNodePos[i] = p2.nodes[j].pos.copy();
                        p1.nodes[i].col = p.color(255, 255, 0);
                        p2.nodes[j].col = p.color(255, 255, 0);

                        p1.isNodePaired[i] = true;
                        p2.isNodePaired[j] = true;
                    }
                }
            }
        }
    }

};

let _instance = new p5(sketch);




