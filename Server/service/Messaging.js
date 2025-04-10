import { connections, messageQueues, last_acked_message } from "./State.js";
import { encrypt } from "./encryption.js";
import { v4 as uuidv4 } from 'uuid';

export const queueMessage = (uuid, message) => {
  console.log("Message:", message);
  const messageToQueue = addToken(message);
  console.log("Message with token:", messageToQueue);
  messageQueues[uuid].push(messageToQueue);
};

export const processMessageQueue = (uuid) => {
  if (!messageQueues[uuid]) return;
  if (!connections[uuid]) return;
  if (messageQueues[uuid].length === 0) return;
  const nextMessage = messageQueues[uuid][0];

  if (!last_acked_message[uuid]) {
    try {
      console.log("Sending message:", nextMessage);
      const encryptedMessage = encrypt(
        JSON.stringify(nextMessage),
        process.env.MY_ENCRYPTION
      );
      console.log("Encrypted message:", encryptedMessage);
      connections[uuid].send(JSON.stringify(encryptedMessage));
      last_acked_message[uuid] = nextMessage.ackToken;
    } catch (error) {
      console.error("Error sending message:", error);
    }
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