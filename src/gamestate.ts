import { Board, boardSize } from "./board"
import { Cloneable } from "./deepcopy"
import { Move } from "./move"
import { Point } from "./point"

export function otherPlayer(player: string) {
    if (player == "ONE")
        return "TWO"
    else if (player == "TWO")
        return "ONE"
    else
        return undefined
}

export class GameState {
    board: Board = new Board()
    turn: number = 0

    currentPlayer = ""
    myselfPlayer = ""
    startPlayer = ""

    constructor() {
        
    }

    perform(m: Move): GameState {
        let re = Cloneable.deepCopy(this)
        
        re.board.fields[m.to.x][m.to.y] = re.currentPlayer

        if (m.from != null) {
            re.board.fields[m.from.x][m.from.y] = "0"

            let other = otherPlayer(re.currentPlayer)
            if (this.canMove(other))
                re.currentPlayer = other
        }
        
        re.turn++

        return re
    }

    canMove(player: string) {
        let can = false

        this.board.getAllFieldsFromPlayer(player).forEach((f) => {
            let ns = this.board.getNeighborFields(f)
            can &&= ns.some((x) => this.board.isFreeP(x))
        })

        return can
    }

    // returns all possible moves
    getPossibleMoves() {
        let re: Move[] = []

        if (this.turn < 8) {
            for (let x = 0; x < boardSize; x++)
                for (let y = 0; y < boardSize; y++) {
                    const curField = Number(this.board.fields[x][y])
                    if (Number.isInteger(curField) && curField == 1){
                        re.push(new Move(null, new Point(x, y)))
                    }
                }
        } else {
            let cpFields = this.board.getAllFieldsFromPlayer(this.currentPlayer);

            cpFields.forEach((playerField) => {
                for (let dir = 0; dir < 6; dir++) {

                    let curPos = new Point(playerField.x, playerField.y)
                    curPos.addInP(Board.getDirectionDisplacement(dir, curPos))

                    while (this.board.isInBoundsP(curPos) && this.board.isFreeP(curPos)){
                        re.push(new Move(new Point(playerField.x, playerField.y), new Point(curPos.x, curPos.y)))
                        curPos.addInP(Board.getDirectionDisplacement(dir, curPos))
                    }
                }
            });
        }

        return re
    }
}
