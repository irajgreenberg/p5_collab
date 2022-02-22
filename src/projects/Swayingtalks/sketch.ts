import P5 from "p5";
import { Spine } from "./Spine";



// background color
let bgR = 50;
let bgG = 20;
let bgB = 30;
let bgColor: string
let bgAlpha = 0;

// declare custom geom
let spine: Spine;
const spineCount = 12;

const sketch = (p: P5) => {
    p.setup = () => {
        // random background color
        bgR = p.int(p.random(10, 40));
        bgG = p.int(p.random(10, 40));
        bgB = p.int(p.random(10, 40));
        bgColor = "#" + p.hex(bgR, 2) + p.hex(bgG, 2) + p.hex(bgB, 2);

        p.background(bgR, bgG, bgB);
        document.body.style.backgroundColor = bgColor;

        let cnv = p.createCanvas(1200, 900, p.WEBGL);
        bgAlpha = p.random(80, 140);

        p.setAttributes('antialias', true);
        cnv.style('display', 'block');

        // Instantiate custom geom
        // spinePts:
        const pts: P5.Vector[] = [];
        const ptCount = 12.0;
        const len = 800.0;
        const deltaY = len / (ptCount - 1);
        for (let i = 0; i < ptCount; i++) {
            pts.push(p.createVector(0, -len / 2 + deltaY * i, p.sin(i * 9 * p.PI / 180) * 300));
        }
        //console.log(pts);

        //constructor(p: p5, pos: p5.Vector, pts: p5.Vector[], interpDetail: number, col: p5.Color, strokeWt: number)
        spine = new Spine(p, p.createVector(0, 0, 0), pts, 3, p.color(255, 127, 0), 5);
    };

    const resizedSketch = (p: P5) => {
        p.windowResized = () => {
            document.body.style.backgroundColor = bgColor;
            p.resizeCanvas(1000, 1000);
        }
    };

    p.draw = () => {
        // plain vanilla bg
        p.background(bgR, bgG, bgB);

        // custom fading bg
        // p.noStroke();
        // p.fill(bgR, bgG, bgB, bgAlpha);
        p.rect(-p.width / 2 - 1, -p.height / 2 - 1, p.width + 2, p.height + 2);

        p.orbitControl();
        //p.translate(0, 0, -300);

        // lighting
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
        p.translate(0, 0, 0);
        p.scale(.55);
        //    / p.rotateY(p.frameCount * p.PI / 360);
        // p.rotateY(90 * p.PI / 180);
        p.strokeWeight(.4);
        p.shininess(290 + p.sin(p.frameCount * p.PI / 25) * 100);

        // Animate custom geom
        // for (let i = 0; i < spineCount; i++) {
        //     p.push();
        //     p.rotateY(p.TWO_PI / 12 * i);
        spine.sway();
        spine.draw();
        //     p.pop();
        // }

    };

};

let _instance = new P5(sketch);
