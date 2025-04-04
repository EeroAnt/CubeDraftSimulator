import { handleClose, handleMessage } from './service/WebSocketHandler.js';
import {
  connections,
  users,
  intervalIDs,
  messageQueues
} from './service/State.js';
import http from 'http';
import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { config } from 'dotenv';
import fs from 'fs';
import { broadcastLobbies } from './service/Broadcasts.js';
import { processMessageQueue } from './service/Messaging.js';

if (fs.existsSync('.env')) {
  config();
} else {
  console.log('.env file not found, skipping');
}

const server = http.createServer();
const wsServer = new WebSocketServer({ server: server });

wsServer.on('connection', (connection) => {
  const uuid = uuidv4();
  console.log(`New connection: (${uuid})`);
  connections[uuid] = connection;
  messageQueues[uuid] = [];
  intervalIDs[uuid] = setInterval(() => processMessageQueue(uuid), 200);
  users[uuid] = {
    uuid: uuid,
    username: "",
    token: ""
  };

  connection.on("message", message => handleMessage(message, uuid));
  connection.on("close", () => handleClose(uuid));
});

const wsPort = 3001;
server.listen(wsPort, () => {
  console.log(`Server listening on port ${wsPort}`);
});

intervalIDs['Lobby Broadcasts'] = setInterval(() =>
  broadcastLobbies(), 2000);