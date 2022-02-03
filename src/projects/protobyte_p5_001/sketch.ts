import P5 from "p5";
import { Protobyte } from "./ProtoByte";

let pb: Protobyte;

const sketch = (p: P5) => {
    p.setup = () => {
        p.createCanvas(1024, 768, p.WEBGL);
        p.stroke(80);
        pb = new Protobyte(p, 800, 20, 10, p.createVector(8, 100));
        p.fill(255, 240, 230);
        p.stroke(50, 50);
    };

    p.draw = () => {
        p.background(255);

        p.rotateY(p.frameCount * p.PI / 720)
        pb.draw();
        pb.move();
    };

};

let _instance = new P5(sketch);
