import p5 from "p5";
import P5 from "p5";
import { ColorFamily, Dimension4 } from "../../libPByte_p5/PByte_utils";
import { ParticleEmitter } from "./ParticleEmitter";

// Lighting: https://www.geeksforgeeks.org/how-to-design-phong-shading-graphics-using-p5-js/


// background color
let bgR = 50;
let bgG = 20;
let bgB = 30;
let bgColValMinMax: p5.Vector;
let bgColor: string
let bgAlpha = 0;

let partCount = 200;
// let parts: ParticleEmitter[] = [];
const gravity = .15;

// declare custom geom
let ps01: ParticleEmitter;
let ps02: ParticleEmitter;
let ps03: ParticleEmitter;
let ps04: ParticleEmitter;
let ps05: ParticleEmitter;
let ps06: ParticleEmitter; // bg color
let ps07: ParticleEmitter;
let ps08: ParticleEmitter; // bg colo

const sketch = (p: P5) => {

    p.setup = () => {
        // random background color
        bgColValMinMax = p.createVector(50, 125);
        bgR = p.int(p.random(bgColValMinMax.x, bgColValMinMax.y));
        bgG = p.int(p.random(bgColValMinMax.x, bgColValMinMax.y));
        bgB = p.int(p.random(bgColValMinMax.x, bgColValMinMax.y));
        //bgColor = "#" + p.hex(bgR, 2) + p.hex(bgG, 2) + p.hex(bgB, 2);
        bgColor = "#" + p.hex(bgR, 2) + p.hex(bgR, 2) + p.hex(bgR, 2);


        //p.background(bgR, bgG, bgB);
        p.background(bgR, bgR, bgR);
        document.body.style.backgroundColor = bgColor;
        document.title = "ParticleComposer : Ira Greenberg 2022";

        let cnv = p.createCanvas(1420, 700);
        bgAlpha = p.random(80, 140);

        p.setAttributes('antialias', true);
        cnv.style('display', 'block');

        // constructor(p, pos, emissionForce, colorFamilies, radiusMinMax, partCount)
        // 
        // Blue
        ps01 = new ParticleEmitter(
            p,
            p.createVector(p.width / 2 + p.random(-400, 400), p.height / 2 + p.random(-400, 400)),
            new Dimension4(-6, 9, -35, -12),
            p.color(60, 60, 255, 3),
            p.createVector(.5, 500),
            220,
            p.createVector(-p.height, 0)
        );

        // Red
        ps02 = new ParticleEmitter(
            p,
            p.createVector(p.width / 2 + p.random(-400, 400), p.height / 2 + p.random(-400, 400)),
            new Dimension4(-9, 10.4, -10, -5),
            p.color(200, 100, 100, 1),
            p.createVector(.5, 500),
            330,
            p.createVector(-p.height, 0)
        );

        // green
        ps03 = new ParticleEmitter(
            p,
            p.createVector(p.width / 2 + p.random(-400, 400), p.height / 2 + p.random(-400, 400)),
            new Dimension4(-2, 2, -25, -7),
            p.color(100, 200, 100, 2),
            p.createVector(.5, 500),
            330,
            p.createVector(-p.height, 0)
        );

        // yellow
        ps04 = new ParticleEmitter(
            p,
            p.createVector(p.width / 2 + p.random(-400, 400), p.height / 2 + p.random(-400, 400)),
            new Dimension4(-2, 2, -20, -8),
            p.color(200, 200, 100, 3),
            p.createVector(.5, 500),
            185,
            p.createVector(-p.height, 0)
        );

        // purple
        ps05 = new ParticleEmitter(
            p,
            p.createVector(p.width / 2 + p.random(-400, 400), p.height / 2 + p.random(-400, 400)),
            new Dimension4(-4, 5, -19, -5),
            p.color(100, 50, 100, 1),
            p.createVector(.5, 500),
            430,
            p.createVector(-p.height, 0)
        );

        // bg col
        ps06 = new ParticleEmitter(
            p,
            p.createVector(p.width / 2 + p.random(-400, 400), p.height / 2 + p.random(-400, 400)),
            new Dimension4(-8, 8, -12, -4),
            // p.color(bgR, bgG, bgB, 240),
            p.color(bgR, bgR, bgR, 2),
            p.createVector(.5, 500),
            380,
            p.createVector(-p.height, 0)
        );

        // pink
        ps07 = new ParticleEmitter(
            p,
            p.createVector(p.width / 2 + p.random(-400, 400), p.height / 2 + p.random(-400, 400)),
            new Dimension4(-10, 10, -18, -5),
            p.color(255, 140, 140, 2),
            p.createVector(.5, 500),
            420,
            p.createVector(-p.height, 0)
        );

        ps08 = new ParticleEmitter(
            p,
            p.createVector(p.width / 2 + p.random(-400, 400), p.height / 2 + p.random(-400, 400)),
            new Dimension4(12, 18, -22, -14),
            // p.color(bgR, bgG, bgB, 240),
            p.color(bgR, bgR, bgR, 2),
            p.createVector(.5, 500),
            680,
            p.createVector(-p.height, 0)
        );

    }

    const resizedSketch = (p: P5) => {
        p.windowResized = () => {
            document.body.style.backgroundColor = bgColor;
            p.resizeCanvas(1000, 1000);
        }
    };

    p.draw = () => {
        // p.fill(bgR, bgG, bgB, 10);
        // p.rect(-1, -1, p.width + 2, p.height + 2);
        // p.background(255);
        ps01.run(.02, 0);
        ps02.run(.095, 0);
        ps03.run(.02, 0);
        ps04.run(.05, -.0001);
        ps05.run(.05, .0005);
        ps06.run(.05, -.00003);
        ps07.run(.05, 0);
        ps08.run(.03, 0);
    };

};

let _instance = new P5(sketch);
