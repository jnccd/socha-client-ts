import { Point, getPossibleMoves } from './main.js'

export function decideMove(board, turn, currentPlayer) {
    let moves = getPossibleMoves(turn, board)
    return moves[Math.floor(Math.random() * moves.length)]
}