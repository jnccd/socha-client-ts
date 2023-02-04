import { Board, getPossibleMoves } from './main.js'

export function decideMove(board: Board, turn: number, currentPlayer: string) {
    let moves = getPossibleMoves(turn, board)
    return moves[Math.floor(Math.random() * moves.length)]
}