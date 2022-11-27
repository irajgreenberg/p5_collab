import p5 from "p5";
import { VerletBlob } from "src/libPByte_p5/VerletBlob";
import { VerletNode } from "src/libPByte_p5/VerletNode";

export class ProtoEnviron {

    p: p5;
    blobCount: number;
    blobs: VerletBlob[] = [];

    constructor(p: p5, blobCount: number) {
        this.p = p;
        this.blobCount = blobCount;

        for (let i = 0; i < blobCount; i++) {
            this.blobs[i] = new VerletBlob(p, p.createVector(p.random(150, p.width - 150), p.random(150, p.height - 150)), 12, 175, .03, p.color(100, 100, 30, 200));
        }

    }

    draw() {
        for (let i = 0; i < this.blobs.length; i++) {
            this.blobs[i].draw();
        }

    }

}