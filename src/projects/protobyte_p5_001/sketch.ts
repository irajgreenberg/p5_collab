import P5 from "p5";
import { DustParticle } from "./DustParticle";
import { Protobyte } from "./ProtoByte";

let pb: Protobyte;

//dust vars
let dp: DustParticle;
const particles = 900;
const pos: P5.Vector[] = [];
const spd: P5.Vector[] = [];
const spdInit: P5.Vector[] = [];
const amp: P5.Vector[] = [];
const freq: P5.Vector[] = [];
const scl: P5.Vector[] = [];

// keep dust and bg aligned
const bgShim = 4.5;
const bgR = 10;
const bgG = 20;
const bgB = 30;
let bgColor: string

const sketch = (p: P5) => {
    p.setup = () => {
        // p.camera(0, 0, 1300 + p.sin(p.frameCount * 0.1) * 400, 0, 0, 0, 0, 1, 0);
        bgColor = "#" + p.hex(bgR, 2) + p.hex(bgG, 2) + p.hex(bgB, 2);
        console.log(p.hex(bgR, 2));
        p.background(bgR, bgG, bgB);
        document.body.style.backgroundColor = bgColor;

        let cnv = p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);

        p.setAttributes('antialias', true);
        p.frustum(-0.12, 0.12, -0.04, 0.04, 0.1, 10000);
        p.camera();


        // avoid scroll bars
        cnv.style('display', 'block');

        // coordinate html and canvas bg's

        //document.bgColor = "red";

        pb = new Protobyte(p, 300, 14, 24, p.createVector(10, 70));

        // dust
        dp = new DustParticle(p);

        for (let i = 0; i < particles; i++) {
            pos[i] = p.createVector(p.random(-p.width / bgShim, p.width / bgShim), p.random(-p.height / bgShim, p.height / bgShim), 500);
            spd[i] = p.createVector(p.random(-.4, .4), p.random(-.4, .4), 0);
            spdInit[i] = p.createVector(spd[i].x, spd[i].y, spd[i].z);
            scl[i] = p.createVector(p.random(.2, 1.9), p.random(.2, 1.9), p.random(.2, 1.9));
            amp[i] = p.createVector(p.random(.5, 1.5), p.random(.5, 1.5), p.random(.5, 1.5));
            freq[i] = p.createVector(p.random(p.PI / 180, p.PI / 60), p.random(p.PI / 180, p.PI / 60), p.random(p.PI / 180, p.PI / 60));
        }
        //p.camera(0, 0, 700, 0, 0, 0, 0, 1, 0);
    };

    const resizedSketch = (p: P5) => {
        p.windowResized = () => {
            document.body.style.backgroundColor = bgColor;
            p.resizeCanvas(p.windowWidth, p.windowHeight);
        }
    };

    p.draw = () => {
        p.background(bgR, bgG, bgB);
        // p.fill(bgR, bgG, bgB, 80);
        // // p.fill(0);
        // p.rect(-p.windowWidth, -p.windowHeight, p.windowWidth * 2, p.windowHeight * 2);


        p.orbitControl();
        p.translate(0, 0, -200);


        //p.stroke(140, p.random(40, 80), 0, 0);

        for (let i = 0; i < particles; i++) {
            // p.stroke(200, 100, 75, 0);
            p.push();
            p.translate(pos[i].x, pos[i].y, pos[i].z);
            p.scale(scl[i]);
            p.strokeWeight(.9);
            dp.draw();
            p.pop();

            spd[i].x = spdInit[i].x + p.sin(p.frameCount * freq[i].x) * amp[i].x;
            spd[i].y = spdInit[i].y + p.sin(-p.frameCount * freq[i].y) * amp[i].y;
            pos[i].add(spd[i]);
            if (pos[i].x > p.width / bgShim) {
                pos[i].x = -p.width / bgShim;
            } else if (pos[i].x < -p.width / bgShim) {
                pos[i].x = p.width / bgShim;
            }

            if (pos[i].y > p.height / bgShim) {
                pos[i].y = -p.height / bgShim;
            } else if (pos[i].y < -p.height / bgShim) {
                pos[i].y = p.height / bgShim;
            }
        }
        p.ambientLight(p.random(180, 220), p.random(180, 220), p.random(180, 220));
        p.emissiveMaterial(127 + p.cos(p.frameCount * p.PI / 20) * 127, 127 + p.sin(p.frameCount * p.PI / 20) * 127, 0);
        p.specularColor(127 + p.sin(p.frameCount * p.PI / 20) * 127, 127 + p.sin(p.frameCount * p.PI / 20) * 127, 127 + p.sin(p.frameCount * p.PI / 20) * 127);
        p.pointLight(140, 80, 100, 300 + p.cos(p.frameCount * p.PI / 330) * 100, p.cos(p.frameCount * p.PI / 330) * 200, 1500);
        p.specularColor(100, 100, 100);
        p.pointLight(100, 100, 255, 300 + p.sin(p.frameCount * p.PI / 330) * 100, p.sin(p.frameCount * p.PI / 330) * 100, 100);
        p.specularMaterial(127 + p.sin(p.frameCount * p.PI / 20) * 127);
        p.stroke(255, 150);
        p.strokeWeight(.2);
        p.translate(175 + p.cos(p.frameCount * p.PI / 720) * 650, 60 + p.cos(-p.frameCount * p.PI / 720) * -60, 400 + p.cos(-p.frameCount * p.PI / 720) * -200);
        p.rotateY(p.frameCount * p.PI / 360);
        p.strokeWeight(.4);
        p.shininess(150 + p.sin(p.frameCount * p.PI / 25) * 150);

        pb.draw();
        pb.move();

    };

};

let _instance = new P5(sketch);
