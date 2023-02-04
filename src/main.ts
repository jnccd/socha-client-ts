import { Socket } from 'net';
import Enumerable from 'linq';
import DOMParser from 'dom-parser';
import { decideMove } from './logic.js'

let host = "127.0.0.1";
let port = 13050;
let reservation = "";
let strategy = null;

let logNetwork = true;

let moveProvider = null;

export type Board = string[][]

// State
const boardSize = 8
let board: Board = [[]];
let turn: number = 0
let roomId = ""

// --- Arguments ---
let lastArg = "";
Enumerable.from(process.argv).skip(2).forEach(x => {

	if (x == "--help") {
		console.log(`Usage: start.sh [options]
-h, --host:
	The IP address of the host to connect to (default: {host}).
-p, --port:
	The port used for the connection (default: {port}).
-r, --reservation:
	The reservation code to join a prepared game.
-s, --strategy:
	The strategy used for the game.
--help:
	Print this help message.`);
		process.exit(1)
	}

	if (lastArg == "-h" || lastArg == "--host")
		host = x;
	else if (lastArg == "-p" || lastArg == "--port")
		port = parseInt(x);
	else if (lastArg == "-r" || lastArg == "--reservation")
		reservation = x;
	else if (lastArg == "-s" || lastArg == "--strategy")
		strategy = x;

	lastArg = x
});

// --- Communication ---
var client = new Socket();
client.connect(port, host, function() {
	console.log('Connected');

	if (reservation == null) {
		client.write(`<protocol><join gameType=\"swc_2023_penguins\" />`);
	} else {
		client.write(`<protocol><joinPrepared reservationCode=\"${reservation}\" />`);
	}
	
});

var responseData = "";
client.on('data', function(data) {
	responseData += data
	if (!responseData.includes("</room>") && !responseData.includes("</protocol>")) {
		return
	}

	if (logNetwork)
		console.log('Received: ' + responseData);
		
	if (responseData.includes("</protocol>")) {
		client.destroy();
		process.exit(1);
	}


	const parser = new DOMParser();
	const dom = parser.parseFromString(responseData);

	// Move Request handling
	let domData = dom.getElementsByTagName('data')
	if (domData != null && domData.length > 0) {
		if (domData.at(0).getAttribute("class") == "moveRequest") {

			let move = decideMove(board, turn, turn % 2 == 0 ? "ONE" : "TWO")

			console.log("Chose move: ")
			console.log(move)
			console.log("Converting move coordinates to hex coordinates...")
			if (move[0] == null) {
				let hexTo = move[1].arrayToHexCoords()
				client.write(`<room roomId="${roomId}">` +
								`<data class="move\">` +
									`<to x = "${hexTo.x}\" y="${hexTo.y}"/>\n` +
								`</data>` +
							`</room>`)
			} else {
				let hexFrom = move[0].arrayToHexCoords()
				let hexTo = move[1].arrayToHexCoords()
				client.write(`<room roomId="${roomId}">` +
								`<data class="move\">` +
									`<from x="${hexFrom.x}" y="${hexFrom.y}"/>` +
									`<to x = "${hexTo.x}\" y="${hexTo.y}"/>\n` +
								`</data>` +
							`</room>`)
			}
		}
	}

	// --- Parse the rest of xml input ---
	let domStates = dom.getElementsByTagName('state')
	if (domStates.length > 0) {
		turn = Number(domStates.at(0).getAttribute("turn"))
	}

	let domJoins = dom.getElementsByTagName('joined')
	if (domJoins.length > 0) {
		roomId = domJoins.at(0).getAttribute("roomId")
	}

	let domBoard = dom.getElementsByTagName('board')
	if (domBoard.length > 0) {
		
		let domFields = dom.getElementsByTagName('field').map(function(x){ return x.textContent })

		// Fill board with field data
		board = new Array(boardSize);
		for(var i = 0; i < board.length; i++){
			board[i] = new Array(boardSize);
			for(var j = 0; j < board.length; j++){
				board[i][j] = domFields[j*boardSize+i];
			}
		}
	}

	responseData = ""
});

client.on('close', function() {
	console.log('Connection closed');

	client.destroy();
	process.exit(1);
});

// --- Game Logic ---
export class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
	}

	addInP(p: Point) {
		this.x = p.x + this.x
		this.y = p.y + this.y
	}
	add(p: Point) {
		return new Point(p.x + this.x, p.y + this.y)
	}

	arrayToHexCoords() {
		return new Point(this.x * 2 + (this.y % 2 == 1 ? 1 : 0), this.y)
	}
	hexToArrayCoords() {
		return new Point(this.x / 2 - (this.y % 2 == 1 ? 1 : 0), this.y)
	}
}

// returns all possible moves, requires turn number and 2D array board
export function getPossibleMoves(turn: number, board: Board) {
	let re = []
	let currentPlayer = turn % 2 == 0 ? "ONE" : "TWO"
	let otherPlayer = turn % 2 == 1 ? "ONE" : "TWO"

	console.log(turn)
	if (turn < 8) {
		console.log(board)
		for (var x = 0; x < boardSize; x++)
			for (var y = 0; y < boardSize; y++) {
        const curField = Number(board[x][y])
				if (Number.isInteger(curField) && curField == 1){
					re.push([null, new Point(x, y)])
				}
			}
	} else {
		for (var x = 0; x < boardSize; x++)
			for (var y = 0; y < boardSize; y++)
				if (board[x][y] == currentPlayer) {

					for (var dir = 0; dir < 6; dir++) {
						const curPos = new Point(x, y)
            const curField = Number(board[curPos.x][curPos.y])
						curPos.addInP(getDirectionDisplacement(dir, curPos))
						while (curPos.x >= 0 && curPos.y >= 0 && curPos.x < 8 && curPos.y < 8 && Number.isInteger(curField) && curField != 0){
							re.push([new Point(x, y), new Point(curPos.x, curPos.y)])
							curPos.addInP(getDirectionDisplacement(dir, curPos))
						}
					}

				}
	}

	return re
}

function getDirectionDisplacement(dir: number, pos: Point) {
	if (pos.y % 2 == 0) {
		return [ new Point(-1, -1), new Point(0, -1), new Point(1, 0), new Point(0, 1), new Point(-1, 1), new Point(-1, 0) ][dir]
	} else {
		return [ new Point(0, -1), new Point(1, -1), new Point(1, 0), new Point(1, 1), new Point(0, 1), new Point(-1, 0) ][dir]
	}
}