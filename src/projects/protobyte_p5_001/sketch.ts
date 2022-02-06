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
const bgShim = 3.5;
const bgR = 30;
const bgG = 50;
const bgB = 70;
let bgColor: string

const sketch = (p: P5) => {
    p.setup = () => {

        let cnv = p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
        // avoid scroll bars
        cnv.style('display', 'block');

        // coordinate html and canvas bg's
        bgColor = "#" + bgR + bgG + bgB;
        document.body.style.backgroundColor = bgColor;

        pb = new Protobyte(p, 300, 14, 18, p.createVector(8, 60));

        // dust
        dp = new DustParticle(p);

        for (let i = 0; i < particles; i++) {
            pos[i] = p.createVector(p.random(-p.width / bgShim, p.width / bgShim), p.random(-p.height / bgShim, p.height / bgShim), 500);
            spd[i] = p.createVector(p.random(-.4, .4), p.random(-.4, .4), 0);
            spdInit[i] = p.createVector(spd[i].x, spd[i].y, spd[i].z);
            scl[i] = p.createVector(p.random(.2, .9), p.random(.2, .9), p.random(.2, .9));
            amp[i] = p.createVector(p.random(.5, 1.5), p.random(.5, 1.5), p.random(.5, 1.5));
            freq[i] = p.createVector(p.random(p.PI / 180, p.PI / 60), p.random(p.PI / 180, p.PI / 60), p.random(p.PI / 180, p.PI / 60));
        }
    };

    const resizedSketch = (p: P5) => {
        p.windowResized = () => {
            document.body.style.backgroundColor = bgColor;
            p.resizeCanvas(p.windowWidth, p.windowHeight);
        }
    };

    p.draw = () => {
        p.fill(bgR, bgG, bgB, 40);
        p.rect(-p.width / 2, -p.height / 2, p.width + 2, p.height + 2);

        p.stroke(90, 70, 90, 200);
        for (let i = 0; i < particles; i++) {
            p.push();
            p.translate(pos[i].x, pos[i].y, pos[i].z);
            p.scale(scl[i]);
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
        p.ambientLight(100);
        p.specularColor(100, 100, 100);
        p.pointLight(140, 80, 100, p.cos(p.frameCount * p.PI / 330) * 100, p.cos(p.frameCount * p.PI / 330) * 200, 500);
        p.specularColor(100, 100, 100);
        p.pointLight(100, 100, 255, p.sin(p.frameCount * p.PI / 330) * 100, p.sin(p.frameCount * p.PI / 330) * 100, 600);
        p.specularMaterial(255);
        p.stroke(255, 150);
        p.strokeWeight(.2);
        p.translate(0, 0, 500 + p.cos(p.frameCount * p.PI / 720) * 200);
        // p.rotateY(p.frameCount * p.PI / 720);
        p.strokeWeight(.4);
        p.shininess(8);
        pb.draw();
        pb.move();

    };

};

let _instance = new P5(sketch);
