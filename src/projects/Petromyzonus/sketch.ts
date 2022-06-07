import P5 from "p5";
import { DustParticle } from "./DustParticle";
import { Petromyzonus } from "./Petromyzonus";

let pb: Petromyzonus;

//dust vars
let dps: DustParticle[] = [];
const dustCount = 400;


// keep dust and bg aligned
const bgShim = 4.5;
let bgR = 50;
let bgG = 20;
let bgB = 30;
let bgColor: string
let bgAlpha = 0;

// starting postion seed
let startPosSeed: P5.Vector;

const sketch = (p: P5) => {
    p.setup = () => {
        // p.camera(0, 0, 1300 + p.sin(p.frameCount * 0.1) * 400, 0, 0, 0, 0, 1, 0);
        bgR = p.int(p.random(10, 60));
        bgG = p.int(p.random(10, 50));
        bgB = p.int(p.random(10, 60));
        bgColor = "#" + p.hex(bgR, 2) + p.hex(bgG, 2) + p.hex(bgB, 2);
        //console.log(p.hex(bgR, 2));
        p.background(bgR, bgG, bgB);
        document.body.style.backgroundColor = bgColor;

        let cnv = p.createCanvas(900, 900, p.WEBGL);

        bgAlpha = p.random(80, 140);

        p.setAttributes('antialias', true);
        // p.frustum(-0.12, 0.12, -0.04, 0.04, 0.1, 10000);
        //p.camera();

        // avoid scroll bars
        cnv.style('display', 'block');

        pb = new Petromyzonus(p, 400, 14, 24, p.createVector(p.random(5, 25), p.random(25, 200)), p.int(p.random(1, 5)));

        // start postion seed for translate in draw()
        startPosSeed = p.createVector(p.random(5000), p.random(5000), p.random(5000));

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
    };

    const resizedSketch = (p: P5) => {
        p.windowResized = () => {
            document.body.style.backgroundColor = bgColor;
            p.resizeCanvas(1000, 1000);
        }
    };

    p.draw = () => {
        //p.background(bgR, bgG, bgB);
        // p.fill(bgR, bgG, bgB, 80);
        p.fill(bgR, bgG, bgB, bgAlpha);
        p.rect(-p.width / 2 - 1, -p.height / 2 - 1, p.width + 2, p.height + 2);

        let pbPos = p.createVector(-20 + p.cos(startPosSeed.x + p.frameCount * p.PI / 620) * 150, 40 + p.cos(startPosSeed.y - p.frameCount * p.PI / 720) * 120, 600 + p.cos(startPosSeed.z - p.frameCount * p.PI / 720) * -200);


        //p.orbitControl();
        p.translate(0, 0, -300);



        let al = p.random(60, 65);
        p.ambientLight(al, al, al);
        p.pointLight(p.cos(125 + p.frameCount * p.PI / 180) * 125, p.sin(125 + p.frameCount * -p.PI / 230) * 125, p.sin(125 + p.frameCount * p.PI / 90) * 125, 0, 0, 800);
        //  p.ambientLight(p.random(180, 220), p.random(180, 220), p.random(180, 220));

        p.emissiveMaterial(127 + p.cos(p.frameCount * p.PI / 20) * 127, 127 + p.sin(p.frameCount * p.PI / 20) * 127, 0);
        p.specularColor(127 + p.sin(p.frameCount * p.PI / 20) * 127, 127 + p.sin(p.frameCount * p.PI / 20) * 127, 127 + p.sin(p.frameCount * p.PI / 20) * 127);
        p.pointLight(140, 80, 100, 300 + p.cos(p.frameCount * p.PI / 330) * 100, p.cos(p.frameCount * p.PI / 330) * 200, -4);
        p.specularColor(100, 100, 100);
        p.pointLight(100, 100, 255, 300 + p.sin(p.frameCount * p.PI / 330) * 100, p.sin(p.frameCount * p.PI / 330) * 100, 600);
        p.specularMaterial(127 + p.sin(p.frameCount * p.PI / 20) * 127);
        p.stroke(255, 150);
        p.strokeWeight(.2);
        p.translate(pbPos.x, pbPos.y, pbPos.z);
        p.scale(.55);
        p.rotateY(startPosSeed.x + p.frameCount * p.PI / 360);
        p.strokeWeight(.4);
        p.shininess(290 + p.sin(p.frameCount * p.PI / 25) * 100);
        //p.shininess(200);

        // Protobyte
        pb.draw();
        pb.move();

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

    };

};

let _instance = new P5(sketch);
