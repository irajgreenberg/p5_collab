import p5 from "p5";
import { CollisionEdge } from "./CollisionEdge";
import { SimpleParticle } from "./SimpleParticle";

// Lighting: https://www.geeksforgeeks.org/how-to-design-phong-shading-graphics-using-p5-js/


// background color
let bgR = 50;
let bgG = 20;
let bgB = 30;
let bgColValMinMax: p5.Vector;
let bgColor: string
let bgAlpha = 0;

let partCount = 200;
let edgeCount = 20;
const gravity = .15;
let parts: SimpleParticle[] = [];
let edges: CollisionEdge[] = [];

const sketch = (p: p5) => {

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

        for (let i = 0; i < partCount; i++) {
            parts.push(new SimpleParticle(
                p,
                p.createVector(p.random(-p.width / 2, p.width / 2), -p.height / 2),
                p.createVector(p.random(-5, 5), p.random(3, 8)))
            );
        }

        for (let i = 0; i < edgeCount; i++) {
            edges.push(new CollisionEdge(
                p,
                p.createVector(p.random(-p.width / 2, p.width / 2), p.random(-100, p.height / 2)),
                p.createVector(p.random(-p.width / 2, p.width / 2), p.random(-100, p.height / 2))
            ));
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
        // p.fill(bgR, bgG, bgB, 10);
        // p.rect(-1, -1, p.width + 2, p.height + 2);
        p.background(255);
        p.translate(p.width / 2, p.height / 2)
        for (let i = 0; i < partCount; i++) {
            parts[i].move();
            parts[i].draw();
        };

        for (let i = 0; i < edgeCount; i++) {
            edges[i].draw();

            const x = p.cos(edges[i].rot) * edges[i].pos.x - p.sin(edges[i].rot) * edges[i].pos.y;
            const y = p.sin(edges[i].rot) * edges[i].pos.x + p.cos(edges[i].rot) * edges[i].pos.y;


            for (let j = 0; j < partCount; j++) {



                if (parts[j].pos.dist(edges[i].pos) < 10) {
                    parts[j].spd.y *= -1;
                }
            }



        }

    };
}

let _instance = new p5(sketch);
