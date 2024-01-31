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

const broadcastLostConnection = (uuid, token) => {
  const message = JSON.stringify({type: 'lostConnection', name: users[uuid]['username']})
  Object.values(connections[token]).forEach(connection => connection.send(message))
}

const broadcastUserJoined = (uuid, token) => {
  const message = JSON.stringify({type: 'userJoined', name: users[uuid]['username']})
  Object.values(connections[token]).forEach(connection => connection.send(message))
}



const handleMessage = (message, uuid, token) => {
  const data = JSON.parse(JSON.parse(message))
  console.log(data)
  if (data.type === "Join Draft") {
	console.log('helo')
	users[uuid].state.status = 'waiting'
	if (drafts[token]['players'].includes(users[uuid])) {
		console.log('already in')
		console.log(drafts[token]['players'])
	} else if (drafts[token]['players'].length >= drafts[token]['player_count']) {
		console.log('full')
		console.log(drafts[token]['players'])
	} else {
	drafts[token]['players'] = drafts[token]['players'].concat(users[uuid])
	console.log(drafts[token]['players'])}
	// express.response.send("OK")
	// broadcastUserJoined(uuid, token)
	// console.log(draft.players.concat(user))
  } else if (data.type === 'pick') {
	user.state.main = user.state.main.concat(data.main)
	user.state.status = 'waiting'
	user.state.queue = user.state.queue.concat(user.state.pack)
	user.state.pack = []
  } else if (data.type === 'toMain') {
	user.state.main = user.state.main.concat(data.cards)
	user.state.side = user.state.side.filter(card => !data.cards.includes(card))
  } else if (data.type === 'toSide') {
	user.state.side = user.state.side.concat(data.cards)
	user.state.main = user.state.main.filter(card => !data.cards.includes(card))
  } else if (data.type === 'Start Draft') {
	if (drafts[token]['state'] === "lobby") {
	drafts[token]['state'] = 0
	console.log(drafts[token]['state'])
	}

  }
}

handleClose = (uuid, token) => {
  broadcastLostConnection(uuid, token)
  console.log(`Connection closed: ${uuid}`)
  delete users[uuid]
  delete connections[token][uuid]
  if (Object.keys(drafts).includes(token)) { 
	console.log('deleting')
  drafts[token]['players'] = drafts[token]['players'].filter(player => player['uuid'] !== uuid)}
}

wsServer.on('connection', (connection, request) => {
  const { username, token } = url.parse(request.url, true).query
  const uuid = uuidv4()
  console.log(`New connection: ${username}, ${token} (${uuid})`)
  if (connections[token]) {
	connections[token][uuid] = connection
  } else {
    connections[token] = {
	  [uuid]: connection
    }
  }

  users[uuid] = {
	username: username,
	uuid: uuid,
	state: { 
		'main': [],
		'side': [],
		'queue': [],
		'pack': []
	}
  }
  connection.on("message", message => handleMessage(message, uuid, token))
  connection.on("close", () => handleClose(uuid, token))
})


app.get('/api/init_draft/:player_count/:token', (request, response) => {
  response.set('Access-Control-Allow-Origin', '*')
  const player_count = request.params.player_count
  const token = request.params.token
  const filePath = './test1.json';

  fs.readFile(filePath, 'utf8', (err, data) => {
	if (err) {
		console.error(err);
		return;
	}
	
	drafts[token]['data'] = JSON.parse(data);
  });
  response.send("OK")
  drafts[token] = {
	  'player_count': player_count,
	  'players': [],
	  'state': 'lobby',
	  'round': 0
  }
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