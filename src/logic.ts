import { GameState } from "./gamestate"
import main from "./main"

function decideMove(currentState: GameState) {

    // Add your code here

    let moves = currentState.getPossibleMoves()
    return moves[Math.floor(Math.random() * moves.length)]
}

main(decideMove)