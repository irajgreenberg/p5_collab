// FluidDynamics01
// Ira Greenberg
// Dallas, TX

import p5 from "p5";
import { Cell } from "./Cell";

export class FluidDynamics01 {

    p: p5
    width: number;
    height: number;
    cellSize: number;
    fluid: Cell[][] = [];

    constructor(p: p5, width: number = 500, height: number = 500, cellSize: number = 4.0) {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        this.p = p;

        this.create();
    }

    create() {
        // Create a 2D array of cells representing the fluid
        for (let i = 0; i < this.width / this.cellSize; i++) {
            this.fluid[i] = [];
            for (let j = 0; j < this.height / this.cellSize; j++) {
                this.fluid[i][j] = new Cell(
                    this.p,
                    this.p.createVector(this.cellSize * i, this.cellSize * j), // pos
                    this.p.createVector(), // velocity
                    0, // density
                    this.cellSize); // cellSize
            }
        }

        // Add a density source at the center of the fluid
        //this.fluid[this.p.floor(this.width / 2 / this.cellSize)][this.p.floor(this.height / 2 / this.cellSize)].density = 100;
        // this.fluid[this.width / 4 / this.cellSize][this.height / 5 / this.cellSize].density = 50;
        // this.fluid[this.width / 2 / this.cellSize][this.height / 4 / this.cellSize].density = 100;
    }

    updateFluid() {
        // Update the velocity of each cell based on the density gradient
        for (let i = 1; i < this.width / this.cellSize - 1; i++) {
            for (let j = 1; j < this.height / this.cellSize - 1; j++) {
                const cell = this.fluid[i][j];
                cell.velocity.x += (this.fluid[i + 1][j].density - this.fluid[i - 1][j].density) / 2;
                cell.velocity.y += (this.fluid[i][j + 1].density - this.fluid[i][j - 1].density) / 2;
            }
        }

        // Update the density of each cell based on the velocity
        for (let i = 1; i < this.width / this.cellSize - 1; i++) {
            for (let j = 1; j < this.height / this.cellSize - 1; j++) {
                const cell = this.fluid[i][j];
                cell.density += (this.fluid[i + 1][j].velocity.x - this.fluid[i - 1][j].velocity.x) / 2;
                cell.density += (this.fluid[i][j + 1].velocity.y - this.fluid[i][j - 1].velocity.y) / 2;
            }
        }
    }

    run() {
        this.move();
        this.draw();
    }

    move(time: number = 0) {
        this.updateFluid();
        this.fluid[this.p.floor(this.width / this.p.random(1, 4) / this.cellSize)][this.p.floor(this.height / this.p.random(1, 4) / this.cellSize)].density = this.p.random(0, 10);
    }

    draw() {
        for (let i = 0; i < this.fluid.length; i++) {
            for (let j = 0; j < this.fluid[i].length; j++) {
                this.fluid[i][j].draw();
            }
        }
    }
}


