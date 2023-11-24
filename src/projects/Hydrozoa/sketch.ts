// Hydrozoa
// Ira Greenberg
// Santa Fe, NM | Dallas, TX

// Project Description: 

import p5 from "p5";
import { ProtoStyle } from "../../libPByte_p5/ProtoStyle";
import { Hydrozoa } from "./Hydrozoa";


const sketch = (p: p5) => {

    // window size
    const canvasW = 1200;
    const canvasH = 900;
    let bounds = new p5.Vector(800, 800, 800);

    // background color
    let bgR = p.int(p.random(10, 40));
    let bgG = p.int(p.random(10, 40));
    let bgB = p.int(p.random(10, 40));
    let bgColor: string

    let directLightVector: p5.Vector;

    let h1: Hydrozoa;

    p.setup = () => {
        bgColor = "#" + p.hex(bgR, 2) + p.hex(bgG, 2) + p.hex(bgB, 2);

        p.background(bgR, bgG, bgB);
        document.body.style.backgroundColor = bgColor;
        document.title = "Hydrozoa";

        let cnv = p.createCanvas(canvasW, canvasH, p.WEBGL);


        p.setAttributes('antialias', true);
        cnv.style('display', 'block');

        directLightVector = p.createVector(0, 0, -300);

        // ****** Instantiate Custom Geom *******

        h1 = new Hydrozoa(p, 30, new p5.Vector(-450, 0, 0), new p5.Vector(450, 0, 0), new p5.Vector(.6, .8), new ProtoStyle(p, p.color(150, 75, 20), p.color(255, 200, 200), 1, 10));

        h1.setArmsStyle(new ProtoStyle(p, p.color(0, 0, 0), p.color(100, 0, 100), 20, 1));

        // **************************************
    };

    const resizedSketch = (p: p5) => {
        p.windowResized = () => {
            document.body.style.backgroundColor = bgColor;
            p.resizeCanvas(canvasW, canvasH);
        }
    };

    p.draw = () => {
        p.background(bgR, bgG, bgB);

        p.orbitControl();
        p.rotate(p.frameCount * p.PI / 360);

        let v = p.createVector(directLightVector.x, directLightVector.y, directLightVector.z);

        p.ambientLight(20, 10, 15);

        p.directionalLight(127, 127, 127, v);

        p.shininess(100);
        // p.specularColor(189);
        // p.specularMaterial(250);

        p.specularColor(20);
        p.specularMaterial(30);

        // Creating the point lights at the
        // given points from the given directions
        p.pointLight(255, 255, 255, -10, 5, 200);
        p.pointLight(255, 255, 255, -60, 500, 380);

        // ********* Animate Custom Geom ********

        //drawBounds(p.color(200, 140, 150, 80));
        //drawBoundsOutline(p.color(75, 75, 75), 1);

        // h1.drawSpine(true, true);
        p.push();
        p.scale(.3);
        h1.drawArms(false, true);
        p.pop();
        // h1.drawArmsBoundarySupports();
        h1.move(bounds);
        // **************************************
    };

    p.keyTyped = () => {
        if (p.key === 'p') {
            const name = "Hydrozoa" + "_" + p.year() + p.month() + p.day() + p.hour() + p.minute() + p.second() + ".png";
            p.save(name);
        }
    }

    function drawBounds(fill: p5.Color = p.color(200), stroke: p5.Color = p.color(50)) {
        p.noStroke();
        p.fill(fill);
        p.stroke(stroke);
        p.box(bounds.x, bounds.y, bounds.z);
    }
    function drawBoundsOutline(stroke: p5.Color = p.color(50), strokeWt: number = 1) {
        p.noFill();
        p.stroke(stroke);
        p.strokeWeight(strokeWt);
        p.box(bounds.x, bounds.y, bounds.z);
    }

};

let _instance = new p5(sketch);




