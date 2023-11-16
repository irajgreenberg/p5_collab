// Collision3DResponse
// Ira Greenberg
// Dallas, TX

// Project Description: 

import p5 from "p5";
import { Collision3DResponse } from './Collision3DResponse';


// const canvasW = 1200;
// const canvasH = 900;

// // background color
// let bgR = 0
// let bgG = 0;
// let bgB = 0;
// let bgColor: string
// let bgAlpha = 0;

// let directLightVector: p5.Vector;

// **************************************
// declare custom geom

const sketch = (p: p5) => {

    const canvasW = 1200;
    const canvasH = 900;

    // background color
    let bgR = p.int(p.random(110, 140));
    let bgG = p.int(p.random(110, 140));
    let bgB = p.int(p.random(110, 140));
    let bgColor: string
    let bgAlpha = 0;

    let directLightVector: p5.Vector;

    p.setup = () => {
        // random background color
        // bgR = p.int(p.random(110, 140));
        // bgG = p.int(p.random(110, 140));
        // bgB = p.int(p.random(110, 140));
        bgColor = "#" + p.hex(bgR, 2) + p.hex(bgG, 2) + p.hex(bgB, 2);

        p.background(bgR, bgG, bgB);
        document.body.style.backgroundColor = bgColor;
        document.title = "Collision3DResponse";

        let cnv = p.createCanvas(canvasW, canvasH, p.WEBGL);
        bgAlpha = p.random(80, 140);

        p.setAttributes('antialias', true);
        cnv.style('display', 'block');

        directLightVector = p.createVector(0, 0, 300);

        // **************************************
        // Instantiate custom geom
    };

    const resizedSketch = (p: p5) => {
        p.windowResized = () => {
            document.body.style.backgroundColor = bgColor;
            p.resizeCanvas(canvasW, canvasH);
        }
    };

    p.draw = () => {
        // plain vanilla bg
        p.background(bgR, bgG, bgB);
        p.rotateY(p.PI / 2);
        // custom fading bg
        // p.noStroke();
        // p.fill(bgR, bgG, bgB, bgAlpha);
        // p.rect(-p.width / 2 - 1, -p.height / 2 - 1, p.width + 2, p.height + 2);

        p.orbitControl();
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

    };

    p.keyTyped = () => {
        if (p.key === 'p') {
            const name = "Collision3DResponse" + "_" + p.year() + p.month() + p.day() + p.hour() + p.minute() + p.second() + ".png";
            p.save(name);
        }
    }

};

let _instance = new p5(sketch);




