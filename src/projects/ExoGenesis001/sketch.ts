// ExoGenesis001
// Ira Greenberg
// Santa Fe, NM | Dallas, TX

// Project Description: 

import p5 from "p5";
import { ExoGenesis001 } from './ExoGenesis001';
import { ProtoStyle } from "../../libPByte_p5/ProtoStyle";
import { VerletStick } from "../../libPByte_p5/VerletStick";


const sketch = (p: p5) => {

    //     var gl = p.renderer.GL; 
    // // Turn off rendering to alpha
    // gl.colorMask(true, true, true, false);

    // window size
    const canvasW = 1200;
    const canvasH = 900;
    let bounds = new p5.Vector(400, 400, 100);

    // background color
    let bgR = p.int(p.random(10, 40));
    let bgG = p.int(p.random(10, 40));
    let bgB = p.int(p.random(10, 40));
    let bgColor: string

    let directLightVector: p5.Vector;

    let s1: ExoGenesis001;
    let armsRight: ExoGenesis001[] = [];
    let armsLeft: ExoGenesis001[] = [];
    let crossSupports: VerletStick[] = [];
    let vertSupportsRight: VerletStick[] = [];
    let vertSupportsLeft: VerletStick[] = [];

    p.setup = () => {
        bgColor = "#" + p.hex(bgR, 2) + p.hex(bgG, 2) + p.hex(bgB, 2);

        p.background(bgR, bgG, bgB);
        document.body.style.backgroundColor = bgColor;
        document.title = "ExoGenesis001";

        let cnv = p.createCanvas(canvasW, canvasH, p.WEBGL);


        p.setAttributes('antialias', true);
        cnv.style('display', 'block');

        directLightVector = p.createVector(0, 0, -300);

        // ****** Instantiate Custom Geom *******
        // main spine
        s1 = new ExoGenesis001(p, 40, new p5.Vector(-150, 0, 0), new p5.Vector(150, 0, 0), new p5.Vector(.004, .007), new ProtoStyle(p, p.color(1255, 127, 0), p.color(255, 127, 0), 8, 6));

        // appendages
        for (let i = 0; i < s1.nodeCount; i++) {
            let h1 = s1.centralSpine!.nodes[i].pos.copy();
            let t1 = new p5.Vector(h1.x, h1.y + 10, h1.z);
            armsRight.push(new ExoGenesis001(p, 25, h1, t1, new p5.Vector(.2, .4), new ProtoStyle(p, p.color(100, 100, 135), p.color(200, 200, 255), .8, 3)));

            let h2 = h1.copy();
            let t2 = new p5.Vector(h2.x, h2.y - 10, h2.z)
            armsLeft.push(new ExoGenesis001(p, 25, h2, t2, new p5.Vector(.2, .4), new ProtoStyle(p, p.color(100, 100, 135), p.color(200, 200, 255), .8, 3)));

            crossSupports.push(new VerletStick(p, armsRight[i].centralSpine!.nodes[24], armsLeft[i].centralSpine!.nodes[24], 1, 0));

            if (i > 0) {
                vertSupportsRight.push(new VerletStick(p, armsRight[i - 1].centralSpine!.nodes[24], armsRight[i].centralSpine!.nodes[24], 1, 0));
                vertSupportsLeft.push(new VerletStick(p, armsLeft[i - 1].centralSpine!.nodes[24], armsLeft[i].centralSpine!.nodes[24], 1, 0));
            }
        }

        s1.nudge([0, 4, 5, 7, 9, 11, s1.nodeCount - 1, s1.nodeCount - 2, s1.nodeCount - 4], new p5.Vector(0, p.random(-25, 25), 0));

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


        s1.centralSpine!.nodes[0].pos.x = p.cos(p.frameCount * p.PI / 270) * (200 + p.random(3, 5));
        s1.centralSpine!.nodes[0].pos.y = p.sin(p.frameCount * p.PI / 270) * (200 + p.random(3, 5)) + p.sin(p.cos(p.frameCount * p.PI / 90)) * (200 + p.random(3, 5));
        s1.move(new p5.Vector(400, 400, 400));
        s1.draw(false, true);
        // s1.drawBounds(p.color(200, 140, 150, 80));
        // s1.drawBoundsOutline(p.color(200, 140, 150), 1);


        for (let i = 0; i < s1.nodeCount; i++) {
            armsRight[i].centralSpine!.nodes[0].pos = s1.centralSpine!.nodes[i].pos.copy();
            armsLeft[i].centralSpine!.nodes[0].pos = s1.centralSpine!.nodes[i].pos.copy();

            armsRight[i].move(new p5.Vector(400, 400, 400));
            armsLeft[i].move(new p5.Vector(400, 400, 400));

            armsRight[i].draw(false, true);
            armsLeft[i].draw(false, true);

        }

        for (let i = 0; i < crossSupports.length; i++) {
            crossSupports[i].constrainLen();
            crossSupports[i].draw();
        }

        for (let i = 0; i < vertSupportsLeft.length; i++) {
            vertSupportsLeft[i].constrainLen();
            vertSupportsRight[i].constrainLen();

            vertSupportsLeft[i].draw();
            vertSupportsRight[i].draw();
        }
        // **************************************
    };

    p.keyTyped = () => {
        if (p.key === 'p') {
            const name = "ExoGenesis001" + "_" + p.year() + p.month() + p.day() + p.hour() + p.minute() + p.second() + ".png";
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




