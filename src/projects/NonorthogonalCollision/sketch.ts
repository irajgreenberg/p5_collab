import p5 from "p5";
import { VerletStrand } from "../../libPByte_p5/VerletStrand";
import { CollisionEdge } from "./CollisionEdge";
import { SimpleParticle } from "./SimpleParticle";

// Lighting: https://www.geeksforgeeks.org/how-to-design-phong-shading-graphics-using-p5-js/

const canvasWidth = 1200;
const canvasHeight = 600;
// background color
let bgR = 50;
let bgG = 20;
let bgB = 30;
let bgColValMinMax: p5.Vector;
let bgColor: string
let bgAlpha = 0;

let partCount = 30;
let edgeCount = 900;
const gravity = .15;
let parts: SimpleParticle[] = [];
let edges: CollisionEdge[] = [];

let strands: VerletStrand[] = [];


const sketch = (p: p5) => {

    p.setup = () => {
        // random background color
        bgColValMinMax = p.createVector(40, 95);
        bgR = p.int(p.random(bgColValMinMax.x, bgColValMinMax.y));
        bgG = p.int(p.random(bgColValMinMax.x, bgColValMinMax.y));
        bgB = p.int(p.random(bgColValMinMax.x, bgColValMinMax.y));
        //bgColor = "#" + p.hex(bgR, 2) + p.hex(bgG, 2) + p.hex(bgB, 2);
        bgColor = "#" + p.hex(bgR, 2) + p.hex(bgG, 2) + p.hex(bgB, 2);


        //p.background(bgR, bgG, bgB);
        p.background(bgR, bgG, bgB);
        document.body.style.backgroundColor = bgColor;
        document.title = "ParticleComposer : Ira Greenberg 2022";

        let cnv = p.createCanvas(canvasWidth, canvasHeight);
        bgAlpha = p.random(80, 140);

        p.setAttributes('antialias', true);
        cnv.style('display', 'block');

        for (let i = 0; i < partCount; i++) {
            parts.push(new SimpleParticle(
                p,
                //p.createVector(p.random(-300, 300), p.random(-200, -100)),
                p.createVector(p.random(-5, 5), p.random(-p.height / 2, -p.height / 2 + 100)),
                //p.createVector(p.random(-1, 1), p.random(-25, .1)),
                p.createVector(p.random(-.1, .1), p.random(-2, .1)),
                p.random(.75, 3))
            );

            if (i < 30) {
                strands[i] = new VerletStrand(p, parts[i].pos, p.random(130, 225), p.floor(p.random(20, 60)), p.color(255, p.random(180, 255), p.random(180, 255), p.random(215, 245)), 1, p.createVector(.002, .2))
            }
        }

        for (let i = 0; i < edgeCount; i++) {
            const x = p.random(-p.width / 2 + 30, p.width / 2 - 30);
            const y = p.random(-p.height / 2 + -30, p.height / 2 - 30);

            const g = p.random(20, 100);
            edges.push(new CollisionEdge(
                p,
                p.createVector(x, y),
                p.createVector(x + p.random(10, 40), y + p.random(-30, 30)),
                p.color(g, g, g, 2),
                .5
            )
            );
            //console.log(p.random(20, 100));
            // console.log(edges[edges.length - 1].tail);
        }


    }

    const resizedSketch = (p: p5) => {
        p.windowResized = () => {
            document.body.style.backgroundColor = bgColor;
            p.resizeCanvas(1000, 1000);
        }
    };

    p.draw = () => {
        p.fill(bgR, bgG, bgB, .5);
        p.rect(-1, -1, p.width + 2, p.height + 2);
        p.background(255);
        p.translate(p.width / 2, p.height / 2)
        for (let i = 0; i < partCount; i++) {
            parts[i].move();
            parts[i].draw();

            if (i < strands.length) {
                strands[i].move();
                strands[i].draw();
            }
        };

        for (let i = 0; i < edgeCount; i++) {
            edges[i].draw();
        }




        for (let i = 0; i < partCount; i++) {
            for (let j = 0; j < edgeCount; j++) {
                parts[i].wallsCollide();
                parts[i].checkGroundCollision(edges[j]);
            }
        }



    }

}

let _instance = new p5(sketch);
