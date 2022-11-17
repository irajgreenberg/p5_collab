// Rainbow
// Ira Greenberg
// Dallas, TX

// Project Description: 

import p5 from "p5";
import P5 from "p5";
import { Rainbow } from "./Rainbow";


const canvasW = 1200;
const canvasH = 900;

// background color
let bgR = 50;
let bgG = 20;
let bgB = 30;
let bgColor: string
let bgAlpha = 0;

const numRainbows = 100;
// let rainbow: Rainbow;
// let rainbow2: Rainbow;
let rainbow: Rainbow;

let directLightVector: P5.Vector;

// **************************************
// declare custom geom

const sketch = (p: P5) => {

    p.setup = () => {
        // random background color
        bgR = p.int(p.random(110, 140));
        bgG = p.int(p.random(110, 140));
        bgB = p.int(p.random(110, 140));
        bgColor = "#" + p.hex(bgR, 2) + p.hex(bgG, 2) + p.hex(bgB, 2);

        p.background(bgR, bgG, bgB);
        document.body.style.backgroundColor = bgColor;
        document.title = "Rainbow";

        let cnv = p.createCanvas(canvasW, canvasH);
        bgAlpha = p.random(80, 140);

        p.setAttributes('antialias', true);
        cnv.style('display', 'block');

        directLightVector = p.createVector(0, 0, 300);

        // **************************************
        // constructor(p: p5, position: p5.Vector, dimension: p5.Vector, numCurves: number, colArr: p5.Color[])

        const cols: p5.Color[] = [];
        for (let i = 0; i < 8; i++) {
            cols[i] = p.color(p.random(70, 140), 50, p.random(180, 200));
        }
        rainbow = new Rainbow(
            p,
            p.createVector(0, 0),
            p.createVector(p.width * .75, 310),
            cols
            // [
            //     p.color(255, 0, 0),
            //     p.color(255, 255, 0),
            //     p.color(255, 0, 255),
            //     p.color(0, 255, 255),
            //     p.color(255, 127, 0)
            // ]
        );
        // **************************************
    };

    const resizedSketch = (p: P5) => {
        p.windowResized = () => {
            document.body.style.backgroundColor = bgColor;
            p.resizeCanvas(canvasW, canvasH);
        }
    };

    p.draw = () => {
        // plain vanilla bg
        p.background(bgR, bgG, bgB);
        p.translate(p.width / 2, p.height / 2);

        rainbow.draw();

        // **************************************
        // Animate custom geom

    };

};

let _instance = new P5(sketch);




