import P5 from "p5";
import { Protobyte } from "./ProtoByte";

let pb: Protobyte;

const sketch = (p: P5) => {
    p.setup = () => {
        p.createCanvas(1080, 1080, p.WEBGL);
        // set its frustum
        //p.frustum(-0.1, 0.1, -0.1, 0.1, .5, 9000);
        pb = new Protobyte(p, 300, 15, 12, p.createVector(8, 50));
    };

    p.draw = () => {
        p.fill(30, 50, 70, 40);
        p.rect(-p.width / 2, -p.height / 2, p.width + 2, p.height + 2);
        p.shininess(20);
        p.ambientLight(150);
        p.specularColor(100, 100, 100);
        p.pointLight(40, 200, 100, 0, -50, 500);
        p.specularColor(100, 100, 100);
        p.pointLight(100, 100, 255, 0, 50, 600);
        p.specularMaterial(255);

        p.noFill();
        p.stroke(255);
        p.strokeWeight(.2);
        p.translate(0, 0, 500);
        p.rotateY(p.frameCount * p.PI / 720);
        p.strokeWeight(.4);
        p.shininess(8);
        pb.draw();
        pb.move();
    };

};

let _instance = new P5(sketch);
