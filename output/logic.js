"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decideMove = void 0;
const main_js_1 = require("./main.js");
function decideMove(board, turn, currentPlayer) {
    let moves = (0, main_js_1.getPossibleMoves)(turn, board);
    return moves[Math.floor(Math.random() * moves.length)];
}
exports.decideMove = decideMove;
