import P5 from "p5";
import { DustParticle } from "./DustParticle";
import { Petromyzonus } from "./Petromyzonus";
import { GroundPlane } from './GroundPlane';
import { ProtoMatrix3 } from "./ProtoMatrix3";

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
let scl: number = .85;

// starting postion seed
let startPosSeed: P5.Vector;

let petroTravelTheta: P5.Vector;
let petroPointToTheta: number;
let groundRotateTheta = 0;
let directionVal = 0;
let petroTransPos: P5.Vector;
const groundPlaneY = 4500;
let petroNodeToReedDistThreshold = 4700;

let modelMat3: ProtoMatrix3;
//let modelMat3: P5.Matrix

let storyCounter = 0;
let petroStartingHeight = -3500;
let petroDynamicHeight = -3000;
let petroClimbingStep = 30;
let isOrbitable = false;
let petroRotationSpeedBoost = 2;
let isSwimmable = true;

let info: string = "Test";


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
        p.perspective(p.PI / 1.5, p.width / p.height, 0.01, 60000);

        bgAlpha = p.random(80, 140);

        p.setAttributes('antialias', true);
        // p.frustum(-0.12, 0.12, -0.04, 0.04, 0.1, 10000);
        //p.camera();

        // avoid scroll bars
        cnv.style('display', 'block');

        directionVal = p.floor(p.random(2));
        // console.log(directionVal);
        // ground plane
        gp = new GroundPlane(p, p.createVector(p.windowWidth * 55, 190, p.windowHeight * 35), 20, 20, p.createVector(bgR, bgG, bgB));

        // creature
        // scl = p.random(.95, 1.3);
        scl = 1;
        petro = new Petromyzonus(p,
            p.random(700, 4400), // length
            p.floor(p.random(10, 20)), // slices
            p.int(p.random(3, 12)), // radial detail
            p.createVector(p.random(30, 200), p.random(400, 1050)), // radius min/max
            p.int(p.random(1, 9))); // body segments

        // start postion seed for translate in draw()
        startPosSeed = p.createVector(p.random(5000), p.random(5000), p.random(5000));

        petroTravelTheta = p.createVector(p.PI, 0, p.PI);
        petroPointToTheta = 0;

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

        /*
        | a d g 0 |
        | b e h 0 |
        | c f i 0 |
        | 0 0 0 1 |
        */
        modelMat3 = new ProtoMatrix3(3, 0, 0, 0, 3, 0, 0, 0, 3);

        p.textSize(32);
    };



    const resizedSketch = (p: P5) => {
        p.windowResized = () => {
            document.body.style.backgroundColor = bgColor;
            p.resizeCanvas(p.windowWidth, p.windowHeight);
        }
    };







    p.draw = () => {
        p.background(bgR, bgG, bgB);

        // p.fill(255);
        // p.textSize(100)
        // p.text("info", 1000, 800);
        // p.fill(bgR, bgG, bgB, 80);
        // p.fill(bgR, bgG, bgB, bgAlpha);
        // p.rect(-p.width / 2 - 1, -p.height / 2 - 1, p.width + 2, p.height + 2);

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


        let pbPos = p.createVector(-20 + p.cos(startPosSeed.x + p.frameCount * p.PI / 620) * 150, 40 + p.cos(startPosSeed.y - p.frameCount * p.PI / 720) * 120, 600 + p.cos(startPosSeed.z - p.frameCount * p.PI / 720) * -200);


        // world transform
        //p.orbitControl(1, 1);
        p.translate(0, -600, -1000);
        //p.rotateY(groundRotateTheta);




        // draw rotating groundplane
        p.push();
        p.translate(0, groundPlaneY, 0);
        // p.rotateY(groundRotateTheta);
        gp.draw();
        p.pop();




        // BEGIN draw Petromyzonus
        // p.push();
        p.stroke(255, 150);
        p.strokeWeight(.2);
        // p.translate(pbPos.x, pbPos.y, pbPos.z);
        // const x = p.sin(petroTravelTheta.xp.frameCount * p.PI / 590) * 800
        // const y = p.cos(p.frameCount * p.PI / 290) * 800
        // const z = -500 + p.cos(p.frameCount * p.PI / 590) * 1500;
        const x = p.sin(petroTravelTheta.x) * p.windowWidth * 4;//1200
        const y = -p.windowWidth * .5 + p.cos(petroTravelTheta.y) * p.windowWidth * .4
        const z = -2500 + p.cos(petroTravelTheta.z) * 3500;
        //const z = p.cos(p.frameCount * p.PI / 190) * 400;

        // move creature
        petroTransPos.x = x;
        petroTransPos.y = y - petroDynamicHeight;
        petroTransPos.z = z;
        // console.log(petroTransPos.y);
        p.translate(petroTransPos);
        if (directionVal == 0) {
            petroPointToTheta = p.PI / 2 - p.atan2(z, x);
            groundRotateTheta -= p.PI / 2720
        } else {
            petroPointToTheta = -p.PI / 2 - p.atan2(z, x);
            groundRotateTheta += p.PI / 2720
        }
        p.rotateY(petroPointToTheta);

        p.scale(1);
        p.strokeWeight(.4);
        petro.draw();
        petro.move();

        if (isOrbitable && isSwimmable) {
            if (directionVal == 0) {
                petroTravelTheta.x += p.PI / 500 * petroRotationSpeedBoost; //590
                petroTravelTheta.y += p.PI / 368 * petroRotationSpeedBoost;
                petroTravelTheta.z += p.PI / 500 * petroRotationSpeedBoost;
            } else {
                petroTravelTheta.x -= p.PI / 500 * petroRotationSpeedBoost; //590
                petroTravelTheta.y -= p.PI / 368 * petroRotationSpeedBoost;
                petroTravelTheta.z -= p.PI / 500 * petroRotationSpeedBoost;

            }
        }

        // if (petroDynamicHeight > -2000) {
        //     petroDynamicHeight -= petroClimbingStep;
        // }
        // p.pop();
        // END draw Petro


        // // Dust
        // for (let i = 0; i < dustCount; i++) {
        //     dps[i].move();
        //     dps[i].draw();

        //     // statc
        //     // p.noFill();
        //     p.stroke(255, p.random(60, 170), p.random(60, 170), p.random(.5));
        //     p.strokeWeight(p.random(.1, .31));
        //     for (let j = 0; j < dustCount; j++) {
        //         const d = dps[i].pos.dist(dps[j].pos);
        //         if (i != j) {
        //             if (d > 250 && d < 250.01) {
        //                 const extraPt = p.int(p.random(dustCount));
        //                 p.line(dps[i].pos.x, dps[i].pos.y, dps[i].pos.z, dps[extraPt].pos.x, dps[extraPt].pos.y, dps[extraPt].pos.z)
        //                 p.line(dps[i].pos.x, dps[i].pos.y, dps[i].pos.z, dps[j].pos.x, dps[j].pos.y, dps[j].pos.z)

        //                 //  dps[i].col = p.color(255);
        //                 //  dps[j].col = p.color(255);
        //             } else {
        //                 //  dps[i].col = p.color(255, 60);
        //                 //   dps[j].col = p.color(255, 60);
        //             }

        //         }
        //     }
        // }


        const edgeVerts = petro.getAnnuliEdgeVerts();
        const reedtipVerts = gp.getReedTipverts();
        for (let i = 0; i < edgeVerts.length; i++) {
            const ev = p.createVector(
                edgeVerts[i].x,
                edgeVerts[i].y,
                edgeVerts[i].z);
            for (let j = 0; j < reedtipVerts.length; j++) {
                const rx = reedtipVerts[j].x - petroTransPos.x;
                const ry = reedtipVerts[j].y + groundPlaneY - petroTransPos.y
                const rz = reedtipVerts[j].z - petroTransPos.z;
                const rtv = p.createVector(
                    p.sin(-petroPointToTheta) * rz + p.cos(-petroPointToTheta) * rx,
                    ry,
                    p.cos(-petroPointToTheta) * rz - p.sin(-petroPointToTheta) * rx
                )
                if (ev.dist(rtv) < petroNodeToReedDistThreshold) {
                    p.strokeWeight(.2);
                    p.stroke(p.random(200, 255), p.random(100, 200), p.random(100, 200), 50);
                    p.push();
                    // p.rotateY(-p.PI / 2 - p.atan2(petroTransPos.z, petroTransPos.x));
                    p.beginShape(p.LINES);
                    p.vertex(ev.x, ev.y, ev.z);
                    p.vertex(rtv.x, rtv.y, rtv.z);
                    p.endShape();
                    p.pop();
                }
            }
        }
        // control narrative
        storyCounter++;

        if (petroTransPos.y > -1000) {
            petroDynamicHeight += petroClimbingStep;
        } else {
            isOrbitable = true;
        }


        // let _text = p.createGraphics(window.innerWidth - 4, window.innerHeight - 4);
        // // _text.textFont('Source Code Pro');
        // _text.textAlign(p.CENTER);
        // _text.textSize(133);
        // _text.fill(3, 7, 11);
        // _text.noStroke();
        // _text.text('test', p.width * 0.5, p.height * 0.5);
        // p.texture(_text);
        // p.plane(window.innerWidth - 4, window.innerHeight - 4);

    };

    p.keyPressed = () => {
        //X amplitude
        if (p.key === ']') {
            petro.changeAmplitudeX(15);
        } else if (p.key === '[') {
            petro.changeAmplitudeX(-15);
        }  //Y amplitude
        else if (p.key === '}') {
            petro.changeAmplitudeY(15);
        } else if (p.key === '{') {
            petro.changeAmplitudeY(-15);
        }

        // frequency
        else if (p.key === '<') {
            petro.changeFreqX(-1);
        } else if (p.key === '>') {
            petro.changeFreqX(+1);
        } else if (p.key === ',') {
            petro.changeFreqY(-1);
        } else if (p.key === '.') {
            petro.changeFreqY(+1);

            // node to reed threshold
        } else if (p.key === 'm') {
            petroNodeToReedDistThreshold += 100;
        } else if (p.key === 'n') {
            petroNodeToReedDistThreshold -= 100;
        }
        // swimmable
        else if (p.key === 'q') {
            isSwimmable = false;

            info = "End Traveling"
        } else if (p.key === 'w') {
            isSwimmable = true;

            info = "Begin Traveling"


        }

    }



};

let _instance = new P5(sketch);

