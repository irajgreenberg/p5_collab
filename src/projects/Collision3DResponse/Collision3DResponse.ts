// Collision3DResponse
// Ira Greenberg
// Dallas, TX

import p5 from "p5";
import { Part } from "../../libPByte_p5/PByte_utils";

export class Collision3DResponse {

    p: p5
    parts: Part[] = [];

    constructor(p: p5) {
        this.p = p;
        this.create();
    }

    create() {
    }

    move(time: number = 0) {
    }

    draw() {
    }
}


// Set up the WebGL canvas and mode
let canvas = createCanvas(400, 400, WEBGL);

// Define the radius of each sphere
let r1 = 50;
let r2 = 30;

// Define the positions of each sphere
let pos1 = createVector(0, 0, 0);
let pos2 = createVector(100, 0, 0);

// Define the velocities of each sphere
let vel1 = createVector(5, 0, 0);
let vel2 = createVector(-5, 0, 0);

// Define a variable to keep track of the time elapsed
let timeElapsed = 0;

function draw() {
    // Clear the canvas
    clear();

    // Check if the spheres are colliding
    let dist = pos1.dist(pos2);
    if (dist < r1 + r2) {
        // If the spheres are colliding, calculate the new velocities
        // of each sphere after the collision
        let v1 = vel1.copy();
        let v2 = vel2.copy();
        let n = p5.Vector.sub(pos2, pos1).normalize();
        let v1n = v1.dot(n);
        let v2n = v2.dot(n);
        let v1t = v1.sub(n.mult(v1n));
        let v2t = v2.sub(n.mult(v2n));
        vel1 = v2t.add(n.mult(v1n));
        vel2 = v1t.add(n.mult(v2n));
    }

    // Update the positions of each sphere based on their velocities
    pos1.add(vel1);
    pos2.add(vel2);

    // Draw the spheres
    push();
    translate(pos1.x, pos1.y, pos1.z);
    sphere(r1);
    pop();
    push();
    translate(pos2.x, pos2.y, pos2.z);
    sphere(r2);
    pop();

    // Increment the time elapsed
    timeElapsed++;
}



