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
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

if (fs.existsSync('.env')) {
  config();
} else {
  console.log('.env file not found, skipping');
}

const server = http.createServer();
const wsServer = new WebSocketServer({ server: server });

wsServer.on('connection', (connection) => {

  const uuid = uuidv4();
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
server.listen(wsPort, '0.0.0.0', () => {
  console.log(`Server listening on port ${wsPort}`);
});
wsServer.on('error', (error) => {
  console.error('WebSocket server error:', error);
});

server.on('error', (error) => {
  console.error('HTTP server error:', error);
});
intervalIDs['Lobby Broadcasts'] = setInterval(() =>
  broadcastLobbies(), 2000);
