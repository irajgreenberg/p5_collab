import p5 from "p5";
import { ColorFamily, Dimension4 } from "../../libPByte_p5/PByte_utils";
import { Particle } from "./Particle";

export class ParticleEmitter {

    p: p5;
    pos: p5.Vector;
    emissionForce: Dimension4;
    colorFamilies: ColorFamily[] = [];
    radiusMinMax: p5.Vector;
    partCount: number;
    parts: Particle[] = [];

    spds: p5.Vector[] = [];
    radii: number[] = [];
    cols: p5.Color[] = [];
    partCol: p5.Color;

    damping = 0.75;
    friction = 0.8;
    jitter = 0;
    jitterAmp = 0;
    jitterTheta = 0;
    jitterFreq = 0;

    // constructor(p: p5, pos: p5.Vector, emissionForce: Dimension4, colorFamilies: ColorFamily[], radiusMinMax: p5.Vector = p.createVector(2, 10), partCount: number = 200) {

    constructor(p: p5, pos: p5.Vector, emissionForce: Dimension4, partCol: p5.Color, radiusMinMax: p5.Vector = p.createVector(2, 10), partCount: number = 200) {
        this.p = p;
        this.pos = pos;
        this.emissionForce = emissionForce;
        this.partCol = partCol;
        this.radiusMinMax = radiusMinMax
        this.partCount = partCount;

        for (let i = 0; i < partCount; i++) {
            //constructor(p: p5, pos: p5.Vector, spd: p5.Vector, radius: number, col: p5.Color)
            const r = this.p.random(this.p.red(partCol) * .85, this.p.red(partCol) * 1.15)
            const g = this.p.random(this.p.green(partCol) * .85, this.p.green(partCol) * 1.15)
            const b = this.p.random(this.p.blue(partCol) * .85, this.p.blue(partCol) * 1.15)
            const a = this.p.random(this.p.alpha(partCol) * .85, this.p.alpha(partCol) * 1.15)
            let col = p.color(r, g, b, a);
            // switch (colorFamilies[0]) {
            //     case ColorFamily.LIGHT_BLUE:
            //         col = p.color(
            //             p.random(180, 190),
            //             p.random(180, 190),
            //             p.random(235, 255),
            //             p.random(110, 125)
            //         );
            //         break;
            //     case ColorFamily.MEDIUM_BLUE:
            //         col = p.color(
            //             p.random(180, 190),
            //             p.random(180, 190),
            //             p.random(235, 255),
            //             p.random(110, 125)
            //         );
            //         break;
            //     case ColorFamily.DARK_BLUE:
            //         col = p.color(
            //             p.random(30, 50),
            //             p.random(30, 50),
            //             p.random(80, 125),
            //             p.random(110, 125)
            //         );
            //         break;

            //     case ColorFamily.LIGHT_RED:
            //         col = p.color(
            //             p.random(235, 255),
            //             p.random(180, 190),
            //             p.random(180, 190),
            //             p.random(110, 125)
            //         );
            //         break;
            //     case ColorFamily.MEDIUM_RED:
            //         col = p.color(
            //             p.random(235, 255),
            //             p.random(180, 190),
            //             p.random(180, 190),
            //             p.random(110, 125)
            //         );
            //         break;
            //     case ColorFamily.DARK_RED:
            //         col = p.color(
            //             p.random(80, 125),
            //             p.random(30, 50),
            //             p.random(30, 50),
            //             p.random(110, 125)
            //         );
            //         break;

            //     case ColorFamily.LIGHT_GREEN:
            //         col = p.color(
            //             p.random(180, 190),
            //             p.random(235, 255),
            //             p.random(180, 190),
            //             p.random(110, 125)
            //         );
            //         break;
            //     case ColorFamily.MEDIUM_GREEN:
            //         col = p.color(
            //             p.random(180, 190),
            //             p.random(235, 255),
            //             p.random(180, 190),
            //             p.random(110, 125)
            //         );
            //         break;
            //     case ColorFamily.DARK_GREEN:
            //         col = p.color(
            //             p.random(30, 50),
            //             p.random(80, 125),
            //             p.random(30, 50),
            //             p.random(110, 125)
            //         );
            //         break;

            //     case ColorFamily.LIGHT_YELLOW:
            //         col = p.color(
            //             p.random(235, 255),
            //             p.random(235, 255),
            //             p.random(180, 190),
            //             p.random(110, 125)
            //         );
            //         break;
            //     case ColorFamily.MEDIUM_YELLOW:
            //         col = p.color(
            //             p.random(235, 255),
            //             p.random(235, 255),
            //             p.random(180, 190),
            //             p.random(110, 125)
            //         );
            //         break;
            //     case ColorFamily.DARK_YELLOW:
            //         col = p.color(
            //             p.random(80, 125),
            //             p.random(80, 125),
            //             p.random(30, 50),
            //             p.random(110, 125)
            //         );
            //         break;

            //     case ColorFamily.LIGHT_PURPLE:
            //         col = p.color(
            //             p.random(235, 255),
            //             p.random(180, 190),
            //             p.random(235, 255),
            //             p.random(110, 125)
            //         );
            //         break;
            //     case ColorFamily.MEDIUM_PURPLE:
            //         col = p.color(
            //             p.random(235, 255),
            //             p.random(180, 190),
            //             p.random(235, 255),
            //             p.random(110, 125)
            //         );
            //         break;
            //     case ColorFamily.DARK_PURPLE:
            //         col = p.color(
            //             p.random(80, 125),
            //             p.random(30, 50),
            //             p.random(80, 125),
            //             p.random(110, 125)
            //         );
            //         break;

            // }

            this.parts[i] = new Particle(p, pos.copy(),
                p.createVector(p.random(this.emissionForce.minX, this.emissionForce.maxX), p.random(this.emissionForce.minY, this.emissionForce.maxY)), p.random(radiusMinMax.x, radiusMinMax.y), p.color(col));

        }

        // this.jitterAmp = this.p.random(1, 3);
        // this.jitterTheta = this.p.random(this.p.TWO_PI);
        // this.jitterFreq = this.p.random(1, 30);
    }

    run(gravity: number = .03, wind: number = 0) {
        for (let i = 0; i < this.partCount; i++) {
            this.parts[i].move(gravity, wind);
            this.parts[i].draw();
        }
    }

}
