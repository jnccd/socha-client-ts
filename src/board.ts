import Enumerable from "linq";
import { Player } from "./player";
import { Point } from "./point"

export const boardSize = 8

export class Board {
    fields: string[][] = [[]]

    constructor() {
        this.fields = new Array(boardSize);
		for(let i = 0; i < this.fields.length; i++){
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

    isFree(x: number, y: number) {
        let n = Number(this.fields[x][y]);
        return Number.isInteger(n) && n != 0
    }
    isFreeP(p: Point) {
        return this.isFree(p.x, p.y)
    }

    isEmpty(x: number, y: number) {
        let n = Number(this.fields[x][y]);
        return Number.isInteger(n) && n == 0
    }
    isEmptyP(p: Point) {
        return this.isEmpty(p.x, p.y)
    }

    getNeighborFields(p: Point) {
        let ps = Enumerable.range(0,6).select((x) => { return Board.getDirectionDisplacement(x,p) }).toArray()
        let rs: Point[] = []

        ps.forEach((p) => {
            if (this.isInBoundsP(p))
                rs.push(p)
        })

        return rs
    }

    getAllFieldsFromPlayer(player: Player) {
        let re = []

        for (let x = 0; x < boardSize; x++)
            for (let y = 0; y < boardSize; y++)
                if (this.fields[x][y] === player.identifier) {
                    re.push(new Point(x, y))
                }

        return re
    }

    static getDirectionDisplacement(dir: number, pos: Point) {
        if (pos.y % 2 == 0) {
            return [ new Point(-1, -1), new Point(0, -1), new Point(1, 0), new Point(0, 1), new Point(-1, 1), new Point(-1, 0) ][dir]
        } else {
            return [ new Point(0, -1), new Point(1, -1), new Point(1, 0), new Point(1, 1), new Point(0, 1), new Point(-1, 0) ][dir]
        }
    }
}