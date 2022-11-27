import p5 from "p5";
import { VerletStrand } from "../../libPByte_p5/VerletStrand";
import { CollisionEdge } from "./CollisionEdge";
import { SimpleParticle } from "./SimpleParticle";

// Lighting: https://www.geeksforgeeks.org/how-to-design-phong-shading-graphics-using-p5-js/

const canvasWidth = 800;
const canvasHeight = 800;
// background color
let bgR = 50;
let bgG = 20;
let bgB = 30;
let bgColValMinMax: p5.Vector;
let bgColor: string
let bgAlpha = 0;

let partCount = 5;
let edgeCount = 300;
const gravity = .15;
let parts: SimpleParticle[] = [];
let edges: CollisionEdge[] = [];

let strandCount = 100;
let strands: VerletStrand[] = [];
let rots: number[] = [];
let posSeed: number;


const sketch = (p: p5) => {

    p.setup = () => {
        partCount = p.floor(p.random(6, 50));
        edgeCount = p.floor(p.random(100, 300));
        strandCount = partCount;
        // random background color
        bgColValMinMax = p.createVector(20, 50);
        bgR = p.int(p.random(bgColValMinMax.x, bgColValMinMax.y));
        bgG = p.int(p.random(bgColValMinMax.x, bgColValMinMax.y));
        bgB = p.int(p.random(bgColValMinMax.x, bgColValMinMax.y));
        //bgColor = "#" + p.hex(bgR, 2) + p.hex(bgG, 2) + p.hex(bgB, 2);
        bgColor = "#" + p.hex(bgR, 2) + p.hex(bgG, 2) + p.hex(bgB, 2);


        //p.background(bgR, bgG, bgB);
        p.background(bgR, bgG, bgB);
        document.body.style.backgroundColor = bgColor;
        document.title = "Diaphanous Sprouts : Ira Greenberg 2022";

        let cnv = p.createCanvas(canvasWidth, canvasHeight, p.WEBGL);
        bgAlpha = p.random(80, 140);

        p.setAttributes('antialias', true);
        cnv.style('display', 'block');


        let partCol = p.color(255);


        const seed = p.round(p.random(2000));
        posSeed = p.round(p.random(3));


        for (let i = 0; i < partCount; i++) {

            const lightVal = p.random(200, 255);
            const middleVal = p.random(80, 199)
            const darkVal = p.random(10, 99)
            const alpha = p.random(2, 20);
            if (seed % 9 == 0) {
                partCol = p.color(p.random(40, 255), darkVal, darkVal, alpha); // red
            } else if (seed % 8 == 0) {
                partCol = p.color(darkVal, darkVal, p.random(40, 255), alpha); // blue
            } else if (seed % 8 == 0) {
                partCol = p.color(darkVal, p.random(125, 255), darkVal, alpha); // green
            } else if (seed % 6 == 0) {
                partCol = p.color(lightVal, lightVal * .65, darkVal, alpha); // orange
            } else if (seed % 5 == 0) {
                partCol = p.color(p.random(40, 255), darkVal, p.random(40, 255), alpha); // purple
            } else if (seed % 4 == 0) {
                partCol = p.color(lightVal, lightVal, darkVal, alpha); // yellow
            } else if (seed % 2 == 0) {
                partCol = p.color(middleVal, middleVal, middleVal, alpha); // gray
            } else {
                partCol = p.color(darkVal, darkVal, darkVal, alpha); // gray
            }

            let pos = p.createVector(0, 0);
            switch (posSeed) {
                case 0:
                    pos = p.createVector(p.random(-p.width / 2, p.width / 2), -100)
                    break;
                case 1:
                    pos = p.createVector(0, p.random(-p.height / 2, p.height / 2))
                    break;
                case 2:
                    pos = p.createVector(0, p.random(100, 200))
                    break;
                case 3:
                    pos = p.createVector(0, -100)
                    break;

            }
            parts.push(new SimpleParticle(
                p,
                //p.createVector(0, p.random(-p.height / 1.75, p.height / 2)),
                // p.createVector(p.random(-p.width / 2, p.width / 2), -100),
                pos,
                p.createVector(p.random(-.2, .2), p.random(-2, .2)),
                p.random(1.75, 4),
                partCol
            )
            );


            if (i < strandCount) {
                // rots[i] = 0
                rots[i] = p.random(p.TWO_PI);
                // if (i % 3900 == 0) {
                //     rots[i] = p.random(-p.PI, p.PI);
                // } else {
                //     rots[i] = p.random(-3 * p.PI / 180, 3 * p.PI / 180);
                // }
                // strands[i] = new VerletStrand(p, parts[i].pos, p.random(50, 160), p.floor(p.random(10, 65)), p.color(p.random(180, 255), p.random(180, 255), p.random(180, 255), 10), 1, p.createVector(.002, .3));

                const sCol = p.random(200, 255);
                if (seed % 9 == 0) {
                    partCol = p.color(p.random(40, 255), sCol, sCol, alpha); // red
                } else if (seed % 8 == 0) {
                    partCol = p.color(sCol, sCol, p.random(40, 255), alpha); // blue
                } else if (seed % 8 == 0) {
                    partCol = p.color(middleVal, p.random(40, 255), middleVal, alpha); // green
                } else if (seed % 6 == 0) {
                    partCol = p.color(lightVal, lightVal * .65, sCol, alpha); // orange
                } else if (seed % 5 == 0) {
                    partCol = p.color(p.random(40, 255), sCol, p.random(40, 255), alpha); // purple
                } else if (seed % 4 == 0) {
                    partCol = p.color(lightVal, lightVal, p.random(80, 150), alpha); // yellow
                } else if (seed % 2 == 0) {
                    partCol = p.color(middleVal, middleVal, middleVal, alpha); // gray
                } else {
                    partCol = p.color(sCol, sCol, sCol, alpha); // gray
                }


                const strandCol = p.color(sCol + p.random(-100, -10), p.random(130, 160), sCol, 10)
                strands[i] = new VerletStrand(p, parts[i].pos, p.random(50, 160), p.floor(p.random(10, 65)), strandCol, p.random(.5, 1.5), p.createVector(.02, .3));


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
            p.resizeCanvas(800, 800);
        }
    };

    p.draw = () => {
        if (p.frameCount == 1) {
            p.background(bgR, bgG, bgB);
        }
        // p.noStroke();
        // p.push();
        // p.translate(-p.width / 2, -p.height / 2)
        // p.fill(bgR, bgG, bgB, .75);
        // // p.rect(-1, -1, p.width + 2, p.height + 2);
        // p.pop();

        //

        for (let i = 0; i < partCount; i++) {
            p.push();
            if (posSeed == 2) {
                //p.rotateY(p.PI / 4);
                p.rotateZ(rots[i]);
            }

            parts[i].move();
            parts[i].draw();

            if (i < strands.length) {

                strands[i].move();
                strands[i].draw(false, true);

            }
            p.pop();
        };

        for (let i = 0; i < edgeCount; i++) {
            //edges[i].draw();
        }


        for (let i = 0; i < partCount; i++) {
            for (let j = 0; j < edgeCount; j++) {
                // parts[i].wallsCollide();
                parts[i].checkGroundCollision(edges[j]);
            }
        }
    }

    p.keyTyped = () => {
        if (p.key === 'p') {
            const name = "Diaphanous_Sprouts_" + p.year() + p.month() + p.day() + p.hour() + p.minute() + p.second() + ".png";
            p.save(name);
        }
    }
}

let _instance = new p5(sketch);
