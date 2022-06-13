import P5 from "p5";
import { DustParticle } from "./DustParticle";
import { Petromyzonus } from "./Petromyzonus";
import { GroundPlane } from './GroundPlane';

let gp: GroundPlane;
let petro: Petromyzonus;

//dust vars
let dps: DustParticle[] = [];
const dustCount = 300;


// keep dust and bg aligned
const bgShim = 4.5;
let bgR = 50;
let bgG = 20;
let bgB = 30;
let bgColor: string
let bgColor2: string
let bgAlpha = 0;
let scl: number = 1;

// starting postion seed
let startPosSeed: P5.Vector;

let petroTravelTheta: P5.Vector;
let directionVal = 0;
let petroTransPos: P5.Vector;
const groundPlaneY = 2500;


const sketch = (p: P5) => {
    p.disableFriendlyErrors = true; // disables FES
    p.setup = () => {
        p.pixelDensity(1); // turn off for mobile
        // p.camera(0, 0, 1300 + p.sin(p.frameCount * 0.1) * 400, 0, 0, 0, 0, 1, 0);
        bgR = p.int(p.random(10, 90));
        bgG = p.int(p.random(10, 90));
        bgB = p.int(p.random(10, 90));
        bgColor = "#" + p.hex(bgR, 2) + p.hex(bgG, 2) + p.hex(bgB, 2);
        p.background(bgR, bgG, bgB);

        // bgR = p.int(p.random(1, 30));
        // bgG = p.int(p.random(1, 30));
        // bgB = p.int(p.random(1, 30));
        // bgColor2 = "#" + p.hex(bgR, 2) + p.hex(bgG, 2) + p.hex(bgB, 2);

        document.body.style.backgroundColor = bgColor;
        // document.body.style.backgroundImage = "linear-gradient(, " + bgColor + ", " + bgColor2 + ")";

        let cnv = p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
        p.perspective(p.PI / 1.5, p.width / p.height, 0.01, 10000);

        bgAlpha = p.random(80, 140);

        p.setAttributes('antialias', true);
        // p.frustum(-0.12, 0.12, -0.04, 0.04, 0.1, 10000);
        //p.camera();

        // avoid scroll bars
        cnv.style('display', 'block');

        directionVal = p.floor(p.random(2));
        // console.log(directionVal);
        // ground plane
        gp = new GroundPlane(p, p.createVector(p.windowWidth * 20, 190, p.windowHeight * 10), 20, 20, p.createVector(bgR, bgG, bgB));

        // creature
        scl = p.random(.95, 1.3);
        petro = new Petromyzonus(p,
            p.random(700, 4400), // length
            p.floor(p.random(10, 20)), // slices
            p.int(p.random(3, 12)), // radial detail
            p.createVector(p.random(30, 200), p.random(400, 1050)), // radius min/max
            p.int(p.random(1, 9))); // body segments

        // start postion seed for translate in draw()
        startPosSeed = p.createVector(p.random(5000), p.random(5000), p.random(5000));

        petroTravelTheta = p.createVector(0, p.random(-p.PI), 0);

        // dust
        //constructor(pos: P5.Vector, spd: P5.Vector, rot: P5.Vector, amp: P5.Vector, freq: P5.Vector, scl: P5.Vector)
        for (let i = 0; i < dustCount; i++) {
            dps[i] = new DustParticle(p,
                p.createVector(0, 0, 0), /*pos*/
                p.createVector(0, 0, 0), /*spd*/
                p.createVector(p.random(p.TWO_PI) * .02, p.random(p.TWO_PI) * .02, p.random(p.TWO_PI) * .02), /*rot*/
                p.createVector(p.random(30, 150), p.random(60, 120), p.random(30, 140)), /*amp*/
                p.createVector(p.random(p.PI / 360, p.PI / 180), p.random(p.PI / 320, p.PI / 90), p.random(p.PI / 320, p.PI / 90)), /*freq*/
                p.createVector(p.random(.5, 1.5), p.random(.5, 1.5), p.random(.5, 1.5))  /*scl*/
            );
        }

        petroTransPos = p.createVector(0, 0, 0);
    };

    const resizedSketch = (p: P5) => {
        p.windowResized = () => {
            document.body.style.backgroundColor = bgColor;
            p.resizeCanvas(p.windowWidth, p.windowHeight);
        }
    };



    p.keyPressed = () => {
        // amplitude
        if (p.key === '}') {
            petro.changeAmplitudeY(15);

        } else if (p.key === '{') {
            petro.changeAmplitudeY(-15);
        }
        // frequency
        else if (p.key === ']') {
            petro.changeFreq(-1);

        } else if (p.key === '[') {
            petro.changeFreq(+1);
        }
    }




    p.draw = () => {
        p.background(bgR, bgG, bgB);
        // p.fill(bgR, bgG, bgB, 80);
        // p.fill(bgR, bgG, bgB, bgAlpha);
        // p.rect(-p.width / 2 - 1, -p.height / 2 - 1, p.width + 2, p.height + 2);

        let pbPos = p.createVector(-20 + p.cos(startPosSeed.x + p.frameCount * p.PI / 620) * 150, 40 + p.cos(startPosSeed.y - p.frameCount * p.PI / 720) * 120, 600 + p.cos(startPosSeed.z - p.frameCount * p.PI / 720) * -200);


        p.orbitControl(1, 1);
        p.translate(0, -600, -400);


        // draw rotating groundplane
        p.push();
        p.translate(0, groundPlaneY, 0);
        // p.rotateY(p.frameCount * p.PI / 6000);
        gp.draw();
        p.pop();


        //let al = p.random(60, 265);
        let al = 100 + p.cos(p.frameCount * p.PI / 730) * 100;
        p.ambientLight(al, al, al);
        p.pointLight(p.cos(125 + p.frameCount * p.PI / 180) * 125, p.sin(125 + p.frameCount * -p.PI / 230) * 125, p.sin(125 + p.frameCount * p.PI / 90) * 125, 0, 0, 800);
        //  p.ambientLight(p.random(180, 220), p.random(180, 220), p.random(180, 220));

        p.emissiveMaterial(127 + p.cos(p.frameCount * p.PI / 20) * 127, 127 + p.sin(p.frameCount * p.PI / 20) * 127, 0);
        p.specularColor(127 + p.sin(p.frameCount * p.PI / 20) * 127, 127 + p.sin(p.frameCount * p.PI / 20) * 127, 127 + p.sin(p.frameCount * p.PI / 20) * 127);
        p.pointLight(140, 80, 100, 300 + p.cos(p.frameCount * p.PI / 330) * 100, p.cos(p.frameCount * p.PI / 330) * 200, -4);
        p.specularColor(p.random(255), 100, 100);
        p.pointLight(100, 100, 255, 300 + p.sin(p.frameCount * p.PI / 330) * 100, p.sin(p.frameCount * p.PI / 330) * 100, 600);
        p.specularMaterial(127 + p.sin(p.frameCount * p.PI / 20) * 127);
        p.shininess(220 + p.sin(p.frameCount * p.PI / 25) * 200);


        // Draw Petromyzonus
        p.stroke(255, 150);
        p.strokeWeight(.2);
        //p.translate(pbPos.x, pbPos.y, pbPos.z);
        // const x = p.sin(petroTravelTheta.xp.frameCount * p.PI / 590) * 800
        // const y = p.cos(p.frameCount * p.PI / 290) * 800
        // const z = -500 + p.cos(p.frameCount * p.PI / 590) * 1500;

        const x = p.sin(petroTravelTheta.x) * p.windowWidth * 2.5;//1200
        const y = -p.windowWidth * .5 + p.cos(petroTravelTheta.y) * p.windowWidth
        const z = -900 + p.cos(petroTravelTheta.z) * 2000;
        //const z = p.cos(p.frameCount * p.PI / 190) * 400;

        // move creature
        petroTransPos.x = x;
        petroTransPos.y = y;
        petroTransPos.z = z;
        p.translate(petroTransPos);
        if (directionVal == 0) {
            p.rotateY(p.PI / 2 - p.atan2(z, x));
        } else {
            p.rotateY(-p.PI / 2 - p.atan2(z, x));
        }


        p.scale(scl);
        // p.rotateY(startPosSeed.x + p.frameCount * p.PI / 360);
        p.strokeWeight(.4);
        // p.resetMatrix();
        // let testMatrix = [1, 0, 0, 1, 0, 0];
        // applyMatrix(testMatrix);
        petro.draw();
        petro.move();

        if (directionVal == 0) {
            petroTravelTheta.x += p.PI / 500; //590
            petroTravelTheta.y += p.PI / 168
            petroTravelTheta.z += p.PI / 500
        } else {
            petroTravelTheta.x -= p.PI / 500; //590
            petroTravelTheta.y -= p.PI / 168
            petroTravelTheta.z -= p.PI / 500

        }

        // Dust
        for (let i = 0; i < dustCount; i++) {
            dps[i].move();
            dps[i].draw();

            // statc
            // p.noFill();
            p.stroke(255, p.random(60, 170), p.random(60, 170), p.random(.5));
            p.strokeWeight(p.random(.1, .31));
            for (let j = 0; j < dustCount; j++) {
                const d = dps[i].pos.dist(dps[j].pos);
                if (i != j) {
                    if (d > 250 && d < 250.01) {
                        const extraPt = p.int(p.random(dustCount));
                        p.line(dps[i].pos.x, dps[i].pos.y, dps[i].pos.z, dps[extraPt].pos.x, dps[extraPt].pos.y, dps[extraPt].pos.z)

                        p.line(dps[i].pos.x, dps[i].pos.y, dps[i].pos.z, dps[j].pos.x, dps[j].pos.y, dps[j].pos.z)

                        //  dps[i].col = p.color(255);
                        //  dps[j].col = p.color(255);
                    } else {
                        //  dps[i].col = p.color(255, 60);
                        //   dps[j].col = p.color(255, 60);
                    }

                }
            }
        }


        const edgeVerts = petro.getAnnuliEdgeVerts();
        const reedtipVerts = gp.getReedTipverts();
        for (let i = 0; i < edgeVerts.length; i++) {
            const ev = p.createVector(
                edgeVerts[i].x + petroTransPos.x,
                edgeVerts[i].y + petroTransPos.y,
                edgeVerts[i].z + petroTransPos.z);
            for (let j = 0; j < reedtipVerts.length; j++) {
                const rtv = p.createVector(
                    reedtipVerts[j].x,
                    reedtipVerts[j].y + groundPlaneY,
                    reedtipVerts[j].z);
                if (ev.dist(rtv) < 600) {
                    p.strokeWeight(.5);
                    p.stroke(255, p.random(50, 100));
                    p.beginShape(p.LINES);
                    p.vertex(edgeVerts[i].x, edgeVerts[i].y, edgeVerts[i].z);
                    p.vertex(reedtipVerts[j].x - petroTransPos.x, reedtipVerts[j].y - petroTransPos.y + groundPlaneY, reedtipVerts[j].z - petroTransPos.z);
                    p.endShape();
                }
            }


        }



    };


};

let _instance = new P5(sketch);
