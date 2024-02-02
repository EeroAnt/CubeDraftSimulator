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

let connections = { }
let users = { }
let drafts = { }



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

const broadcastStartDraft = (draft) => {
  Object.values(draft.players).forEach(player => {
	const message = JSON.stringify({ status: "OK", type: "Start Draft" })
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
	  console.log(drafts[data.token].players)
	  broadcastUserlist(drafts[data.token])}


  } else if (data.type === 'Start Draft') {
	console.log(drafts[data.token])
	if (drafts[data.token].state === "lobby") {
	  drafts[data.token].state = 'drafting'
	  broadcastStartDraft(drafts[data.token])
	  console.log(drafts[data.token].state)
	}

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
	state: ""
  }
  connection.on("message", message => handleMessage(message, uuid))
  connection.on("close", () => handleClose(uuid))
})


app.get('/api/init_draft/:player_count/:token', (request, response) => {
  response.set('Access-Control-Allow-Origin', '*')
  const player_count = request.params.player_count
  const token = request.params.token
  const filePath = './test1.json';
  drafts[token] = {
    player_count : player_count,
    players : [],
    state : 'lobby',
    round : 0
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