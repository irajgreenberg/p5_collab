import P5 from "p5";
import { Protobyte } from "./ProtoByte";

let p: Protobyte;

const sketch = (p5: P5) => {
    p5.setup = () => {
        p5.createCanvas(1024, 768, p5.WEBGL);
        //p5.fill(0, 0); // noFill not working
        p5.stroke(80);
        p = new Protobyte(p5, 800, 40, 16, p5.createVector(10, 100));
    };

    p5.draw = () => {
        p5.background(255);
        p5.noFill();
        p5.rotateY(p5.frameCount * p5.PI / 720)
        p.draw();
        p.move();
    };

};

let _instance = new P5(sketch);
