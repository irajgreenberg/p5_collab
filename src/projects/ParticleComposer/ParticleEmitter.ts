import p5 from "p5";
import { ColorFamily } from "src/libPByte_p5/PByte_utils";
import { Particle } from "./Particle";

export class ParticleEmitter {

    p: p5;
    pos: p5.Vector;
    emissionForce: p5.Vector;
    colorFamilies: ColorFamily[] = [];
    radiusMinMax: p5.Vector;
    partCount: number;
    parts: Particle[] = [];

    spds: p5.Vector[] = [];
    radii: number[] = [];
    cols: p5.Color[] = [];

    damping = 0.75;
    friction = 0.8;
    jitter = 0;
    jitterAmp = 0;
    jitterTheta = 0;
    jitterFreq = 0;

    constructor(p: p5, pos: p5.Vector, emissionForce: p5.Vector, colorFamilies: ColorFamily[], radiusMinMax: p5.Vector = p.createVector(2, 10), partCount: number = 200) {
        this.p = p;
        this.pos = pos;
        this.emissionForce = emissionForce;
        this.colorFamilies = colorFamilies;
        this.radiusMinMax = radiusMinMax
        this.partCount = partCount;

        for (let i = 0; i < partCount; i++) {
            //constructor(p: p5, pos: p5.Vector, spd: p5.Vector, radius: number, col: p5.Color)
            let col = p.color(255);
            switch (colorFamilies[0]) {
                case ColorFamily.LIGHT_BLUE:
                    col = p.color(
                        p.random(180, 190),
                        p.random(180, 190),
                        p.random(235, 255)
                    );
                    break;
                case ColorFamily.MEDIUM_BLUE:
                    break;
                case ColorFamily.DARK_BLUE:
                    break;

            }

            this.parts[i] = new Particle(p, pos, emissionForce, p.random(radiusMinMax.x, radiusMinMax.y), p.color(col));
        }

        this.jitterAmp = this.p.random(1, 3);
        this.jitterTheta = this.p.random(this.p.TWO_PI);
        this.jitterFreq = this.p.random(1, 30);

        // Particle
        //constructor(p: p5, pos: p5.Vector, spd: p5.Vector, radius: number, col: p5.Color) 
    }

    move(gravity: number) {

    }

    draw() {

    }
}
