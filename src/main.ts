import { Socket } from 'net';
import Enumerable from 'linq';
import DOMParser from 'dom-parser';

import { decideMove } from './logic'
import { Point } from './point'
import { GameState } from './gamestate';
import { boardSize } from './board';

let host = "127.0.0.1";
let port = 13050;
let reservation: string | null = null;
let strategy = null;
let roomId = ""
let currentState: GameState = new GameState()

let logNetwork = true;

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
let client = new Socket();
client.connect(port, host, function() {
	console.log('Connected');

	if (reservation == null) {
		client.write(`<protocol><join gameType=\"swc_2023_penguins\" />`);
	} else {
		client.write(`<protocol><joinPrepared reservationCode=\"${reservation}\" />`);
	}
	
});

let responseData = "";
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

			if (currentState.turn == 0)
				currentState.myselfPlayer = currentState.startPlayer
			else if (currentState.turn == 1)
				currentState.myselfPlayer = currentState.otherPlayer(currentState.startPlayer)
			currentState.currentPlayer = currentState.myselfPlayer

			let move = decideMove(currentState)

			console.log("Chose move: ")
			console.log(move)
			console.log("Converting move coordinates to hex coordinates...")
			if (move.from == null) {
				let hexTo = move.to.arrayToHexCoords()
				client.write(`<room roomId="${roomId}">` +
								`<data class="move\">` +
									`<to x = "${hexTo.x}\" y="${hexTo.y}"/>\n` +
								`</data>` +
							`</room>`)
			} else {
				let hexFrom = move.from.arrayToHexCoords()
				let hexTo = move.to.arrayToHexCoords()
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
		currentState.turn = Number(domStates.at(0).getAttribute("turn"))
	}

	let domJoins = dom.getElementsByTagName('joined')
	if (domJoins.length > 0) {
		roomId = domJoins.at(0).getAttribute("roomId")
	}

	let domStartTeam = dom.getElementsByTagName('startTeam')
	if (domStartTeam.length > 0) {
		currentState.startPlayer = currentState.playerFromString(domStartTeam[0].innerHTML);
	}

	let domBoard = dom.getElementsByTagName('board')
	if (domBoard.length > 0) {
		
		let domFields = dom.getElementsByTagName('field').map(function(x){ return x.textContent })

		// Fill board with field data
		for(let i = 0; i < currentState.board.fields.length; i++){
			for(let j = 0; j < currentState.board.fields.length; j++){
				currentState.board.fields[i][j] = domFields[j*boardSize+i];
			}
		}
	}

	let domWinner = dom.getElementsByTagName('winner')
	if (domWinner.length > 0) {
		let winner = domWinner[0].getAttribute("team")
		console.log(`Team ${winner} won!\nCongratulations!\nIm gonna shut down now`);

		client.destroy();
		process.exit(0);
	}

	let domScores = dom.getElementsByTagName('scores')
	if (domScores.length > 0) {
		console.log(`A draw!\nCongratulations to both teams!\nIm gonna shut down now`);

		client.destroy();
		process.exit(0);
	}

	responseData = ""
});

client.on('close', function() {
	console.log('Connection closed');

	client.destroy();
	process.exit(1);
});