import { connections, messageQueues } from "./State.js";
import { encrypt } from "./encryption.js";

export const queueMessage = (uuid, message) => {
  const encryptedMessage = encrypt(JSON.stringify(message));
  messageQueues[uuid].push(encryptedMessage);
};

export const processMessageQueue = (uuid) => {
  if (messageQueues[uuid].length > 0) {
    connections[uuid].send(messageQueues[uuid].shift());
  }
};