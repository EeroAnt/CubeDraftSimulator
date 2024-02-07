const axios = require('axios')
const http = require('http')
const {WebSocketServer} = require('ws')
const server = http.createServer()
const wsServer = new WebSocketServer({server:server})
const uuidv4 = require('uuid').v4


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


function calculateNextSeatNumber(seatNumber, direction, player_count) {
  if (seatNumber + direction < 0) {
	return player_count - 1
  } else { return (seatNumber + direction) % player_count }
}


function sendCards(uuid) {
  connections[uuid].send(JSON.stringify({ status: "OK", type: "Picked Cards", commanders: users[uuid].seat.commanders, main: users[uuid].seat.main, side: users[uuid].seat.side}))
}


function checkIfRoundIsDone(table) {
  for (const seat in table) {
	if (table[seat].packAtHand.length > 0) {
	  return false
	}
	if (table[seat].queue.length > 0) {
	  return false
	}
  } return true
}


function checkDraftStatus(draft) {
  if (draft.state === 'drafting' && draft.players.length > 0) {
	if (checkIfRoundIsDone(draft.table)) {
	  draft.round ++
	  if (draft.round < draft.rounds) {
		console.log('round:',draft.round)
		draft.direction *= -1
		for (let i = 0; i < draft.player_count; i++) {
		  const player = draft.players[i]
		  const pack = [draft.packs[`round${draft.round}`][`pack${i}`]]
		  const playerOnTheLeft = users[draft.table[`seat${[calculateNextSeatNumber(player.seat.number, 1, draft.player_count)]}`].player]
		  const playerOnTheRight = users[draft.table[`seat${[calculateNextSeatNumber(player.seat.number, -1, draft.player_count)]}`].player]
		  connections[draft.players[i].uuid].send(JSON.stringify({ status: "OK", type: "Neighbours", left: playerOnTheLeft.username, right: playerOnTheRight.username, direction: draft.direction, seatToken: player.seat.token}))
		  player.seat.queue = pack
	    }} else {
		draft.state = 'done'
		}
	} else {
	  for (const seat in draft.table) {
		if (draft.table[seat].packAtHand.length === 0 && draft.table[seat].queue.length > 0) {
		  console.log('giving pack to player')

		  draft.table[seat].packAtHand = draft.table[seat].queue.shift()
		  connections[draft.table[seat].player].send(JSON.stringify({ status: "OK", type: "Pack", pack: draft.table[seat].packAtHand}))
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
	if (Object.keys(connections).includes(player.uuid)) {
	connections[player.uuid].send(message)}
 })
}


const broadcastDraftStatus = (draft, status) => {
  Object.values(draft.players).forEach(player => {
	const message = JSON.stringify({ status: "OK", type: status })
	connections[player.uuid].send(message)
  })
}


const broadcastCanalDredger = (draft, seatNumber) => {
  Object.values(draft.players).forEach(player => {
	if (player.seat.number === seatNumber) {
	  const message = JSON.stringify({ status: "OK", type: "Canal Dredger", seat: seatNumber, owner: true})
	  connections[player.uuid].send(message)
	} else {
	const message = JSON.stringify({ status: "OK", type: "Canal Dredger", seat: seatNumber, owner: false})
	connections[player.uuid].send(message)
}})
}


const handleMessage = (message, uuid) => {
  const data = JSON.parse(message.toString())
  console.log(data)

  if (data.type === "Login"){
	users[uuid].username = data.username
	users[uuid].token = ""
	console.log("Login: " + data.username)


  } else if (data.type === "Create Lobby") {
	if (users[uuid].token === "") {
	  users[uuid].token = data.token
	  getDraft(data.token, data.player_count, uuid)
	} else {
	  console.log("Wait for setting up the draft")
	}


  } else if (data.type === "Join Draft") {

	if (Object.keys(drafts).includes(data.token) === false) {
	  connections[uuid].send(JSON.stringify({ status : 'No Draft Found With That Token'}))

	} else if (drafts[data.token].players.length >= drafts[data.token].player_count) {
	  connections[uuid].send(JSON.stringify({ status : 'Lobby Full'}))

	} else if (drafts[data.token].state === 'drafting') {
	  connections[uuid].send(JSON.stringify({ status : 'Draft Already Started'}))
	} else {
	  users[uuid].token = data.token
	  drafts[data.token].players = drafts[data.token].players.concat(users[uuid])
	  broadcastUserlist(drafts[data.token])}


  } else if (data.type === 'Start Draft') {
	if (drafts[data.token].state === "lobby") {
	  drafts[data.token].state = 'drafting'
	  broadcastDraftStatus(drafts[data.token],"Start Draft")
	  shuffleArray(drafts[data.token].players)
	  for (let i = 0; i < drafts[data.token].player_count; i++) {
		drafts[data.token].table[`seat${i}`].player = drafts[data.token].players[i].uuid
		const player = drafts[data.token].players[i]
		player.seat = drafts[data.token].table[`seat${i}`]
		player.seat.number = i
		player.seat.commanders = []
	  }
  	}
	checkDraftStatus(drafts[data.token])
	intervalIDs[data.token] = setInterval(() => checkDraftStatus(drafts[data.token]), 500)


  } else if (data.type === 'Pick') {
	shuffleArray(users[uuid].seat.packAtHand)
    users[uuid].seat[data.zone] = users[uuid].seat[data.zone].concat(users[uuid].seat.packAtHand.filter(card => card.id === data.card)[0])
	users[uuid].seat.packAtHand = users[uuid].seat.packAtHand.filter(card => card.id !== data.card)

	if (data.card === 1887) {
	  console.log("Canal Dredger")
	  broadcastCanalDredger(drafts[data.token], users[uuid].seat.number)
	}
	
	const nextSeatNumber = calculateNextSeatNumber(users[uuid].seat.number, drafts[data.token].direction, drafts[data.token].player_count)
	
	console.log("Next player",nextSeatNumber)

	drafts[data.token].table[`seat${nextSeatNumber}`].queue = drafts[data.token].table[`seat${nextSeatNumber}`].queue.concat([users[uuid].seat.packAtHand])
	users[uuid].seat.packAtHand = []
	sendCards(uuid)
	
  } else if (data.type === 'Give Last Card') {
	drafts[data.token].table[`seat${data.seat}`].queue = drafts[data.token].table[`seat${data.seat}`].queue.concat([users[uuid].seat.packAtHand])
	users[uuid].seat.packAtHand = []

  } else if (data.type === 'Set Commander') {
	users[uuid].seat.commanders = users[uuid].seat.commanders.concat(data.card)
	users[uuid].seat.main = users[uuid].seat.main.filter(card => card.id !== data.card.id)
	users[uuid].seat.side = users[uuid].seat.side.filter(card => card.id !== data.card.id)
	sendCards(uuid)
	

  } else if (data.type === 'Remove Commander') {
	users[uuid].seat.commanders = users[uuid].seat.commanders.filter(card => card.id !== data.card.id)
	users[uuid].seat[data.zone] = users[uuid].seat[data.zone].concat(data.card)
	sendCards(uuid)


  } else if (data.type === 'Move Cards') {
	for (const card of data.cards) {
	  !users[uuid].seat[data.to].includes(card) ? (users[uuid].seat[data.to] = users[uuid].seat[data.to].concat(card)) : ("Card already in the zone")
	  users[uuid].seat[data.from] = users[uuid].seat[data.from].filter(c => c.id !== card.id)
	}

	sendCards(uuid)
  } else if (data.type === 'Rejoin Draft') {
	if (Object.keys(drafts).includes(data.table)) {
	  for (const seat in drafts[data.table].table) {
		if (drafts[data.table].table[seat].token === data.seat && drafts[data.table].table[seat].player === "") {

		  drafts[data.table].table[seat].player = uuid
		  drafts[data.table].players = drafts[data.table].players.concat(users[uuid])
		  users[uuid].token = data.table
		  users[uuid].seat = drafts[data.table].table[seat]
		  users[uuid].seat.number = parseInt(seat.replace('seat',''))
		  const playerOnTheLeft = users[drafts[data.table].table[`seat${[calculateNextSeatNumber(users[uuid].seat.number, 1, drafts[data.table].player_count)]}`].player]
		  const playerOnTheRight = users[drafts[data.table].table[`seat${[calculateNextSeatNumber(users[uuid].seat.number, -1, drafts[data.table].player_count)]}`].player]
		  connections[uuid].send(JSON.stringify({ status: "OK", type: "Neighbours", left: playerOnTheLeft.username, right: playerOnTheRight.username, direction: drafts[data.table].direction, seatToken: users[uuid].seat.token}))
		  connections[uuid].send(JSON.stringify({ status : 'OK', type : 'Rejoin Draft'}))
		  sendCards(uuid)
		  if (Array(drafts[data.table].table[seat].packAtHand).length > 0) {
			connections[uuid].send(JSON.stringify({ status : 'OK', type : 'Pack', pack : drafts[data.table].table[seat].packAtHand}))
		  }
	  }}} else {
		connections[uuid].send(JSON.stringify({ status : 'Draft Disappeared'}))
	  }}
}


handleClose = (uuid) => {
  if (users[uuid].token) {
    broadcastUserlist(drafts[users[uuid].token])
    if (Object.keys(drafts).includes(users[uuid].token)) { 
	  console.log('deleting')
      drafts[users[uuid].token].players = drafts[users[uuid].token].players.filter(player => player.uuid !== uuid)
	  console.log(users[uuid])
	  users[uuid].seat ? users[uuid].seat.player="" : console.log("Not seated")
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
	token: ""
  }
  connection.on("message", message => handleMessage(message, uuid))
  connection.on("close", () => handleClose(uuid))
})



// function getDraft(token, player_count, uuid) {

// 	const filePath = './draft2g2b.json';
	
//   drafts[token] = {
// 	token : token,
//     player_count : player_count,
//     players : [users[uuid]],
//     state : 'lobby',
//     round : -1,
// 	direction : -1
//   }
	
// 	fs.readFile(filePath, 'utf8', (err, data) => {
// 	  if (err) {
// 		  console.error(err);
// 		  return;
// 	  }
	  
// 	  drafts[token].table = JSON.parse(data).table;
  
// 	  const filteredData = Object.keys(JSON.parse(data)).reduce((obj, key) => {
// 		  if (key !== 'table') {
// 			  obj[key] = JSON.parse(data)[key];
// 		  }
// 		  return obj;
// 	  }, {});
	  
// 	  drafts[token].packs = filteredData;
// 	  drafts[token].rounds = Object.keys(filteredData).length
// 	  connections[uuid].send(JSON.stringify({ status: "Setup OK"}))
// 	  broadcastUserlist(drafts[token])
// 	});
// }


const wsPort = 3001
server.listen(wsPort, () => {
	  console.log(`Server listening on port ${wsPort}`)
})


function getDraft(token, player_count, uuid) {

axios.get(`http://127.0.0.1:5002/${player_count}/${token}`).then(res => {
  const data = JSON.stringify(res.data)

  drafts[token] = {
	token : token,
    player_count : player_count,
    players : [users[uuid]],
    state : 'lobby',
    round : -1,
	direction : -1
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
	connections[uuid].send(JSON.stringify({ status: "Setup OK"}))
	broadcastUserlist(drafts[token])
  })
  .catch(error => {
	console.error('Error fetching data:', error);

  });
}