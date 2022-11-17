import P5 from "p5";
import { ColorFamily } from "../../libPByte_p5/PByte_utils";
import { ParticleEmitter } from "./ParticleEmitter";

// Lighting: https://www.geeksforgeeks.org/how-to-design-phong-shading-graphics-using-p5-js/


// background color
let bgR = 50;
let bgG = 20;
let bgB = 30;
let bgColor: string
let bgAlpha = 0;

let partCount = 60;
let parts: ParticleEmitter[] = [];
const gravity = .15;

// declare custom geom
let ps01: ParticleEmitter;
const sketch = (p: P5) => {

    p.setup = () => {
        // random background color
        bgR = p.int(p.random(50));
        bgG = p.int(p.random(50));
        bgB = p.int(p.random(50));
        bgColor = "#" + p.hex(bgR, 2) + p.hex(bgG, 2) + p.hex(bgB, 2);

        p.background(bgR, bgG, bgB);
        document.body.style.backgroundColor = bgColor;
        document.title = "ParticleComposer : Ira Greenberg 2022";

        let cnv = p.createCanvas(1200, 900);
        bgAlpha = p.random(80, 140);

        p.setAttributes('antialias', true);
        cnv.style('display', 'block');

        // constructor(p: p5, pos: p5.Vector, emissionForce: p5.Vector, colorFamilies: ColorFamily[], radiusMinMax: p5.Vector = p.createVector(, 10), partCount: number = 200)
        parts[0] = new ParticleEmitter(
            p,
            p.createVector(p.width / 2 + p.random(-10, 10), p.height - 100 + p.random(-10, 10)),
            p.createVector(p.random(-3.5, 3.5), p.random(-12.2, -8)),
            [ColorFamily.DARK_BLUE],
            p.createVector(3, 12),
            50);
    }

    const resizedSketch = (p: P5) => {
        p.windowResized = () => {
            document.body.style.backgroundColor = bgColor;
            p.resizeCanvas(1000, 1000);
        }
    };

    p.draw = () => {

        for (let i = 0; i < partCount; i++) {
            parts[i].move(gravity);
            parts[i].draw();
        }

    };

};

let _instance = new P5(sketch);
