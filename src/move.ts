import { Point } from "./point";

export class Move {
    from: Point | null
    to: Point

    constructor(from: Point | null, to: Point) {
        this.from = from
        this.to = to
    }
}