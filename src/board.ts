import { Point } from "./point"

export const boardSize = 8

export class Board {
    fields: string[][] = [[]]

    constructor() {
        this.fields = new Array(boardSize);
		for(var i = 0; i < this.fields.length; i++){
			this.fields[i] = new Array(boardSize);
        }
    }

    get(x: number, y: number) {
        return this.fields[x][y];
    }

    isInBounds(x: number, y: number) {
        return x >= 0 && y >= 0 && x < boardSize && y < boardSize;
    }
    isInBoundsP(p: Point) {
        return this.isInBounds(p.x, p.y);
    }
}