import { Board, boardSize } from "./board"
import { Cloneable } from "./deepcopy"
import { Move } from "./move"
import { Player } from "./player"
import { Point } from "./point"

export class GameState {
    board: Board = new Board()
    turn: number = 0

    currentPlayer: Player = null
    myselfPlayer: Player = null
    startPlayer: Player = null

    onePlayer: Player = new Player("ONE", 1, 0)
    twoPlayer: Player = new Player("TWO", 2, 0)

    constructor() { }

    perform(m: Move): GameState {
        let re = Cloneable.deepCopy(this)
        
        this.currentPlayer.fishes += Number(re.board.fields[m.to.x][m.to.y])
        re.board.fields[m.to.x][m.to.y] = re.currentPlayer.identifier

        if (m.from != null) {
            re.board.fields[m.from.x][m.from.y] = "0"

            let other = this.otherPlayer(re.currentPlayer)
            if (this.canMove(other))
                re.currentPlayer = other
        }
        
        re.turn++
        return re
    }

    canMove(player: Player) {
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

    playerFromString(str: string) {
        if (str == "ONE")
            return this.onePlayer
        else if (str == "TWO")
            return this.twoPlayer
        else
            return undefined
    }

    otherPlayer(player: Player) {
        if (player.identifier == "ONE")
            return this.twoPlayer
        else if (player.identifier == "TWO")
            return this.onePlayer
        else
            return undefined
    }
}
