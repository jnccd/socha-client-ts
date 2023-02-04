import { GameState } from "./gamestate"

export function decideMove(currentState: GameState) {
    let moves = currentState.getPossibleMoves()
    return moves[Math.floor(Math.random() * moves.length)]
}
