// ProtoAnemone_01
// Ira Greenberg, 2022
// Santa Fe, NM | Dallas, TX

// Project Description: 

import p5 from "p5";
import { NodeType } from "../../libPByte_p5/PByte_utils";
import { VerletStyle } from "../../libPByte_p5/VerletStyle";
import { VerletBlob } from "../../libPByte_p5/VerletBlob";


const canvasW = 1200;
const canvasH = 900;

// background color
let bgR = 250;
let bgG = 220;
let bgB = 230;
let bgColor: string
let bgAlpha = 0;

let directLightVector: p5.Vector;

// **************************************
// declare custom geom
let blobRots: number[] = [];
let blobCount = 20;
let blobs: VerletBlob[] = [];

// **************************************

const sketch = (p: p5) => {

    p.setup = () => {
        // random background color
        bgR = p.int(p.random(60, 185));
        bgG = p.int(p.random(60, 185));
        bgB = p.int(p.random(60, 185));
        bgColor = "#" + p.hex(bgR, 2) + p.hex(bgG, 2) + p.hex(bgB, 2);

        p.background(bgR, bgG, bgB);
        document.body.style.backgroundColor = bgColor;
        document.title = "Floral Flow";

        let cnv = p.createCanvas(canvasW, canvasH, p.WEBGL);
        bgAlpha = p.random(80, 140);

        p.setAttributes('antialias', true);
        cnv.style('display', 'block');

        directLightVector = p.createVector(0, 0, 300);

        // **************************************

        //constructor(
        // nodeRadius: number, 
        // nodeCol: P5.Color, 
        // nodeAlpha: number, 
        // nodeType: NodeType, 
        // stickCol: P5.Color, 
        // stickWeight: number
        // )

        blobCount = p.floor(p.random(6, 12));
        const blobStep = canvasW / (blobCount - 1);
        //blobCount = 20;

        // Instantiate custom geom
        const xShift = p.random(-200, 200);
        let x1 = 0
        let x2 = 0;
        const seed = 200;
        if (p.floor(p.random(seed)) % 10 == 0) {
            x1 = 50
            x2 = 400;
        } else if (p.floor(p.random(seed)) % 6 == 0) {
            x1 = -300
            x2 = -100;
        } else if (p.floor(p.random(seed)) % 4 == 0) {
            x1 = -200
            x2 = 200;
        } else if (p.floor(p.random(seed)) % 2 == 0) {
            x1 = -100
            x2 = 100;
        } else {
            x1 = 0
            x2 = 0;
        }
        console.log(x1, " ", x2)
        for (let i = 0; i < blobCount; i++) {
            blobRots[i] = p.random(p.TWO_PI);
            blobRots[i] = 0;
            const verletStyle = new VerletStyle(
                p.random(.2, .8), //nodeRadius
                p.color(p.random(150, 255), p.random(150, 255), p.random(150, 255), 160), // nodeCol 
                200, // nodeAlpha
                NodeType.CIRCLE, // nodeType 
                p.color(p.random(180, 255), p.random(180, 255), p.random(180, 255), 10), // stickCol 
                .75 // stickWeight
            );
            blobs[i] = new VerletBlob(
                p,
                //p.createVector(p.random(-p.width / 2, p.width / 2), p.random(-p.height / 2, p.height / 2), 0),
                ///p.createVector(-p.width / 2 + blobStep * i, p.height / 2 - p.random(300, 800), p.random(-330, 330)),
                p.createVector(p.random(x1, x2), p.random(-50, 190), p.random(-800, 900)),
                p.floor(p.random(3, 60)), // nodes
                // p.random(2, 95), // radius
                p.random(2, 6), // radius
                .008,
                p.color(p.random(70, 200), p.random(70, 200), p.random(70, 200), 90),
                verletStyle
            );

            const node = p.floor(p.random(blobs[i].nodes.length));
            // blobs[i].nodes[node].pos.x += p.random(-9.2, 9.2);
            // blobs[i].nodes[node].pos.y += p.random(-9.2, 9.2);
        }
        // **************************************
    };

    const resizedSketch = (p: p5) => {
        p.windowResized = () => {
            document.body.style.backgroundColor = bgColor;
            p.resizeCanvas(canvasW, canvasH);
        }
    };

    p.draw = () => {
        //p.background(bgR, bgG, bgB);
        p.noFill();
        p.stroke(155)
        p.rect(-p.width / 2, -p.height / 2, p.width, p.height)
        if (p.frameCount == 1) {
            p.background(bgR, bgG, bgB, .2);
        }

        // plain vanilla bg
        //p.background(bgR, bgG, bgB);
        p.rotateY(p.frameCount * p.PI / 1030);
        // custom fading bg
        // p.noStroke();
        // p.fill(bgR, bgG, bgB, bgAlpha);
        // p.rect(-p.width / 2 - 1, -p.height / 2 - 1, p.width + 2, p.height + 2);

        // p.orbitControl();
        //p.translate(0, 0, -300);

        let v = p.createVector(directLightVector.x, directLightVector.y, directLightVector.z);

        p.ambientLight(20, 10, 15);

        p.directionalLight(255, 0, 0, v);

        p.shininess(255);
        p.specularColor(189);
        p.specularMaterial(250);

        // Creating the point lights at the
        // given points from the given directions
        p.pointLight(255, 255, 255, -10, 5, 200);
        p.pointLight(255, 255, 255, -60, 500, 380);

        // **************************************
        // Animate custom geom

        for (let i = 0; i < blobs.length; i++) {
            p.push();
            // p.rotateZ(blobRots[i] + p.frameCount * p.PI / 90);
            blobs[i].draw();
            p.pop();

            const node = p.floor(p.random(blobs[i].nodes.length));
            // blobs[i].nodes[node].pos.x += p.random(-3.6, 3.6);
            //blobs[i].nodes[node].pos.x += p.random(-19.6, 19.6);
            blobs[i].nodes[node].pos.x += p.random(-29.6, 29.6);
            blobs[i].nodes[node].pos.y += p.random(-1.95, -.2);
            blobs[i].nodes[node].pos.z += p.random(-28.8, 28.8);

        }
        // **************************************

    };

    p.keyTyped = () => {
        if (p.key === 'p') {
            const name = "Floral Flow" + "_" + p.year() + p.month() + p.day() + p.hour() + p.minute() + p.second() + ".png";
            p.save(name);
        }
    }

};

let _instance = new p5(sketch);




