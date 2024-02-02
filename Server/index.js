const express = require('express')
const app = express()
// const axios = require('axios')
const cors = require('cors')
const http = require('http')
const {WebSocketServer} = require('ws')
const url = require('url')
const server = http.createServer()
const wsServer = new WebSocketServer({server:server})
const uuidv4 = require('uuid').v4
const fs = require('fs');
const { send } = require('process')

let connections = { }
let users = { }
let drafts = { }
let intervalIDs = { }

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function sendCards(uuid) {
  connections[uuid].send(JSON.stringify({ status: "OK", type: "Picked Cards", commanders: users[uuid].seat.commanders, main: users[uuid].seat.main, side: users[uuid].seat.side}))
}

function checkDraftStatus(draft) {
  if (draft.state === 'drafting' && draft.players.length > 0) {
	if (draft.players.every(player => player.seat.packAtHand.length === 0 && player.seat.queue.length === 0)) {
	  draft.round ++
	  if (draft.round < draft.rounds) {
		console.log('round:',draft.round)
		draft.direction *= -1
		for (let i = 0; i < draft.player_count; i++) {
		  const player = draft.players[i]
		  const pack = [draft.packs[`round${draft.round}`][`pack${i}`]]
		  player.seat.queue = pack
	    }} else {
		draft.state = 'done'
		}
	} else {
	  for (const player of draft.players) {
		if (player.seat.packAtHand.length === 0 && player.seat.queue.length > 0) {
		  console.log('giving pack to player')
		  player.seat.packAtHand = player.seat.queue.shift()
		  connections[player.uuid].send(JSON.stringify({ status: "OK", type: "Pack", pack: player.seat.packAtHand }))
		}
	  }
	}
  } else if (draft.players.length === 0 && draft.state === 'drafting'){
	draft.state = 'disconnected'
	console.log('disconnected')

  } else if (draft.state === 'done') {
	console.log('draft ended')
	console.log(draft)
	clearInterval(intervalIDs[draft.token])
	broadcastDraftStatus(draft, "End Draft")
  } else {
	clearInterval(intervalIDs[draft.token])
	console.log('draft ended')
  }
}


const broadcastUserlist = (draft) => {
  Object.values(draft.players).forEach(player => {
	const result = draft.players.reduce((acc, player) => {
		acc.players[player.uuid] = player.username;
		return acc;
	  }, { status: "OK", type: "Playerlist", players: {} });
	const message = JSON.stringify(result)
	connections[player.uuid].send(message)
 })
}

const broadcastDraftStatus = (draft, status) => {
  Object.values(draft.players).forEach(player => {
	const message = JSON.stringify({ status: "OK", type: status })
	connections[player.uuid].send(message)
  })
}


const handleMessage = (message, uuid) => {
  const data = JSON.parse(message.toString())
  console.log(data)

  if (data.type === "Login"){
	users[uuid].username = data.username
	console.log("Login: " + data.username)


  } else if (data.type === "Create Lobby") {
	drafts[data.token].players = drafts[data.token].players.concat(users[uuid])
	users[uuid].token = data.token
	broadcastUserlist(drafts[data.token])	


  } else if (data.type === "Join Draft") {

	if (Object.keys(drafts).includes(data.token) === false) {
	  connections[uuid].send(JSON.stringify({ status : 'No Draft Found With That Token'}))

	} else if (drafts[data.token].players.length >= drafts[data.token].player_count) {
	  connections[uuid].send(JSON.stringify({ status : 'Lobby Full'}))

	} else {
	  users[uuid].token = data.token
	  users[uuid].status = 'waiting'
	  drafts[data.token].players = drafts[data.token].players.concat(users[uuid])
	  broadcastUserlist(drafts[data.token])}


  } else if (data.type === 'Start Draft') {
	if (drafts[data.token].state === "lobby") {
	  drafts[data.token].state = 'drafting'
	  broadcastDraftStatus(drafts[data.token],"Start Draft")
	  shuffleArray(drafts[data.token].players)
	  for (let i = 0; i < drafts[data.token].player_count; i++) {
		const player = drafts[data.token].players[i]
		const pack = [drafts[data.token].packs[`round${drafts[data.token].round}`][`pack${i}`]]
		player.seat = drafts[data.token].table[`seat${i}`]
		player.seat.queue = pack
		player.seat.number = i
		player.seat.commanders = []
	  }
  	}
	checkDraftStatus(drafts[data.token])
	intervalIDs[data.token] = setInterval(() => checkDraftStatus(drafts[data.token]), 300)


  } else if (data.type === 'Pick') {
	console.log(drafts[data.token].table)
	shuffleArray(users[uuid].seat.packAtHand)
    users[uuid].seat[data.zone] = users[uuid].seat[data.zone].concat(users[uuid].seat.packAtHand.filter(card => card.id === data.card)[0])
	users[uuid].seat.packAtHand = users[uuid].seat.packAtHand.filter(card => card.id !== data.card)
	const nextSeatNumber = (users[uuid].seat.number + drafts[data.token].direction) % drafts[data.token].player_count
	// console.log(nextSeatNumber)
	// console.log("TABLE")
	// console.log(drafts[data.token].table)
	// console.log("SEAT")
	// console.log(drafts[data.token].table[`seat${nextSeatNumber}`])
	// console.log("QUEUE")
	// console.log(drafts[data.token].table[`seat${nextSeatNumber}`].queue)
	drafts[data.token].table[`seat${nextSeatNumber}`].queue = drafts[data.token].table[`seat${nextSeatNumber}`].queue.concat([users[uuid].seat.packAtHand])
	users[uuid].seat.packAtHand = []
	console.log("pack after passing")
	// console.log(users[uuid].seat.packAtHand)
	console.log(typeof(users[uuid].seat.packAtHand))
	sendCards(uuid)
	

  } else if (data.type === 'Set Commander') {
	console.log(data.card)
	users[uuid].seat.commanders = users[uuid].seat.commanders.concat(data.card)
	users[uuid].seat.main = users[uuid].seat.main.filter(card => card.id !== data.card.id)
	users[uuid].seat.side = users[uuid].seat.side.filter(card => card.id !== data.card.id)
	sendCards(uuid)
	

  } else if (data.type === 'Remove Commander') {
	users[uuid].seat.commanders = users[uuid].seat.commanders.filter(card => card.id !== data.card.id)
	users[uuid].seat[data.zone] = users[uuid].seat[data.zone].concat(data.card)
	sendCards(uuid)


  } else if (data.type === 'Move Cards') {
	users[uuid].seat[data.to] = users[uuid].seat[data.to].concat(data.cards)
	console.log(data.from)
	console.log(typeof(users[uuid].seat[data.to]),typeof(data.cards), typeof(users[uuid].seat[data.from]))
	console.log(Array.isArray(users[uuid].seat[data.to]), Array.isArray(data.cards), Array.isArray(users[uuid].seat[data.from]))
	if (Array.isArray(users[uuid].seat[data.from]) && Array.isArray(data.cards)) {
		users[uuid].seat[data.from] = users[uuid].seat[data.from].filter(card => !data.cards.some(c => c.id === card.id));
	}
	sendCards(uuid)
  }
}


handleClose = (uuid) => {
  if (users[uuid].token) {
    broadcastUserlist(drafts[users[uuid].token])
    if (Object.keys(drafts).includes(users[uuid].token)) { 
	  console.log('deleting')
      drafts[users[uuid].token].players = drafts[users[uuid].token].players.filter(player => player.uuid !== uuid)
	}
  }
  console.log(`Connection closed: ${uuid}`)
  delete users[uuid]
  delete connections[uuid]
}

wsServer.on('connection', (connection, request) => {
  const uuid = uuidv4()
  console.log(`New connection: (${uuid})`)
  connections[uuid] = connection
  users[uuid] = {
	uuid: uuid,
	username: "",
	token: "",
	status: ""
  }
  connection.on("message", message => handleMessage(message, uuid))
  connection.on("close", () => handleClose(uuid))
})


app.get('/api/init_draft/:player_count/:token', (request, response) => {
  response.set('Access-Control-Allow-Origin', '*')
  const player_count = request.params.player_count
  const token = request.params.token
  const filePath = './test3.json';
  
  drafts[token] = {
	token : token,
    player_count : player_count,
    players : [],
    state : 'lobby',
    round : 0,
	direction : 1
  }
  
  fs.readFile(filePath, 'utf8', (err, data) => {
	if (err) {
		console.error(err);
		return;
	}
	
	drafts[token].table = JSON.parse(data).table;

	const filteredData = Object.keys(JSON.parse(data)).reduce((obj, key) => {
		if (key !== 'table') {
			obj[key] = JSON.parse(data)[key];
		}
		return obj;
	}, {});
	
	drafts[token].packs = filteredData;
	drafts[token].rounds = Object.keys(filteredData).length
  });
  response.send("OK")

})


app.use(cors())


const wsPort = 3001
server.listen(wsPort, () => {
	  console.log(`Server listening on port ${wsPort}`)
})

const PORT = 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})