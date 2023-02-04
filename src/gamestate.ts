import { Point } from "./point"

export type Board = string[][]

export class GameState {
    boardSize = 8
    board: Board = [[]]
    turn: number = 0

    constructor() {

    }

    // returns all possible moves, requires turn number and 2D array board
    getPossibleMoves() {
        let re = []
        let currentPlayer = this.turn % 2 == 0 ? "ONE" : "TWO"
        let otherPlayer = this.turn % 2 == 1 ? "ONE" : "TWO"

        console.log(this.turn + ": " + currentPlayer)
        if (this.turn < 8) {
            console.log(this.board)
            for (var x = 0; x < this.boardSize; x++)
                for (var y = 0; y < this.boardSize; y++) {
            const curField = Number(this.board[x][y])
                    if (Number.isInteger(curField) && curField == 1){
                        re.push([null, new Point(x, y)])
                    }
                }
        } else {
            for (var x = 0; x < this.boardSize; x++)
                for (var y = 0; y < this.boardSize; y++)
                    if (this.board[x][y] == currentPlayer) {

                        for (var dir = 0; dir < 6; dir++) {
                            const curPos = new Point(x, y)
                            curPos.addInP(this.getDirectionDisplacement(dir, curPos))
                            while (curPos.x >= 0 && curPos.y >= 0 && curPos.x < 8 && curPos.y < 8 && Number.isInteger(Number(this.board[curPos.x][curPos.y])) && Number(this.board[curPos.x][curPos.y]) != 0){
                                console.log(x + "|" + y + " " + dir + ": " + curPos + ", " + Number(this.board[curPos.x][curPos.y]) + ", " + this.board[curPos.x][curPos.y])

                                re.push([new Point(x, y), new Point(curPos.x, curPos.y)])
                                curPos.addInP(this.getDirectionDisplacement(dir, curPos))
                            }
                        }

                    }
        }

        return re
    }

    getDirectionDisplacement(dir: number, pos: Point) {
        if (pos.y % 2 == 0) {
            return [ new Point(-1, -1), new Point(0, -1), new Point(1, 0), new Point(0, 1), new Point(-1, 1), new Point(-1, 0) ][dir]
        } else {
            return [ new Point(0, -1), new Point(1, -1), new Point(1, 0), new Point(1, 1), new Point(0, 1), new Point(-1, 0) ][dir]
        }
    }
}
