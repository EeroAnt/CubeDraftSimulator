import { connections, messageQueues, last_acked_message } from "./State.js";
import { encrypt } from "./encryption.js";
import { v4 as uuidv4 } from 'uuid';

export const queueMessage = (uuid, message) => {
  console.log("Message:", message);
  const messageToEncrypt = addToken(message);
  console.log("Message with token:", messageToEncrypt);
  const encryptedMessage = encrypt(JSON.stringify(messageToEncrypt));
  messageQueues[uuid].push(encryptedMessage);
};

export const processMessageQueue = (uuid) => {
  if (messageQueues[uuid].length > 0) {
    connections[uuid].send(messageQueues[uuid].shift());
  }
};

const addToken = (message) => {
  const token = uuidv4();
  const messageWithToken = {
    ...message,
    ackToken: token,
  };
  return messageWithToken;
};