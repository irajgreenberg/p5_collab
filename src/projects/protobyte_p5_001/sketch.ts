import P5 from "p5";
import { Protobyte } from "./ProtoByte";

let pb: Protobyte;

const sketch = (p: P5) => {
    p.setup = () => {
        p.createCanvas(1920, 1080, p.WEBGL);
        pb = new Protobyte(p, 600, 15, 12, p.createVector(8, 80));
    };

    p.draw = () => {
        // p.background(20, 10, 0);
        p.fill(255, 125, 100, 50);
        p.rect(-p.width / 2, -p.height / 2, p.width + 2, p.height + 2);
        p.lights();
        p.noFill();
        p.stroke(255);
        p.strokeWeight(.2);
        p.sphere(500);
        p.rotateY(p.frameCount * p.PI / 720);
        p.strokeWeight(.8);
        pb.draw();
        pb.move();
    };

};

let _instance = new P5(sketch);
