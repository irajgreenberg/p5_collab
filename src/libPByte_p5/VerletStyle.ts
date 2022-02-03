import P5 from "p5";
import { NodeType } from "./PByte_utils";

export class VerletStyle {
    nodeRadius: number;
    nodeCol: P5.Color;
    nodeAlpha: number;
    nodeType: NodeType;
    stickCol: P5.Color
    stickAlpha: number;
    stickWeight: number;

    constructor(nodeRadius: number, nodeCol: P5.Color, nodeAlpha: number, nodeType: NodeType, stickCol: P5.Color, stickAlpha: number, stickWeight: number) {
        this.nodeRadius = nodeRadius;
        this.nodeCol = nodeCol;
        this.nodeAlpha = nodeAlpha;
        this.nodeType = nodeType;
        this.stickCol = stickCol;
        this.stickAlpha = stickAlpha;
        this.stickWeight = stickWeight;
    }
}