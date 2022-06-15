/*  Convenience 3x3 matrix for improved control/access 
    of transformed Model states

    | a d g 0 |
    | b e h 0 |
    | c f i 0 |
    | 0 0 0 1 |
*/

export class ProtoMatrix3 {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
    g: number;
    h: number;
    i: number;

    constructor(a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
        this.g = g;
        this.h = h;
        this.i = i;
    }

    get(): number[] {
        return [
            this.a, this.b, this.c,
            this.d, this.e, this.f,
            this.g, this.h, this.i
        ];
    }

}