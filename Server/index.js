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

const connections = { }
const users = { }
const drafts = { }
  
const broadcastLostConnection = (uuid, token) => {
  const message = JSON.stringify({type: 'lostConnection', name: users[uuid]['username']})
  Object.values(connections[token]).forEach(connection => connection.send(message))
}

const broadcastUserJoined = (uuid, token) => {
  const message = JSON.stringify({type: 'userJoined', name: users[uuid]['username']})
  Object.values(connections[token]).forEach(connection => connection.send(message))
}

const handleMessage = (message, uuid, token) => {
  const data = JSON.parse(message)
  const user = users[uuid]
  const draft = drafts[token]
  if (data.type === 'join') {
	user.state.status = 'waiting'
	draft.players = draft.players.concat(user)
	broadcastUserJoined(uuid, token)
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
  }

  console.log(data)
}

handleClose = (uuid, token) => {
  broadcastLostConnection(uuid, token)
  console.log(`Connection closed: ${uuid}`)
  delete users[uuid]
  delete connections[token][uuid]
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

const wsPort = 3001
server.listen(wsPort, () => {
	  console.log(`Server listening on port ${wsPort}`)
})



app.use(cors())

app.get('/api/init_draft/:player_count/:token', (request, response) => {
  const player_count = request.params.player_count
  const token = request.params.token
  console.log(player_count)
  console.log(token)
  console.log(Object.keys(drafts))
  console.log(drafts)
  response.send("OK")
  drafts[token] = {
	  'player_count': player_count,
	  'players': [],
	  'state': 'lobby'
  }
})

const PORT = 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})