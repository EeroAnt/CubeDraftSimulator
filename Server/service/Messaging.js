import {
  connections,
  messageQueues,
  last_acked_message,
  retryCounts,
  retryTimers,
} from "./State.js";
import { encrypt } from "./encryption.js";
import { v4 as uuidv4 } from 'uuid';

const MAX_RETRIES = 5;
const RETRY_DELAY = 2000;

export const queueMessage = (uuid, message) => {
  const messageToQueue = addToken(message);
  // console.log("Message with token:", messageToQueue);
  messageQueues[uuid].push(messageToQueue);
};

export const processMessageQueue = (uuid) => {
  if (!messageQueues[uuid]) return;
  if (!connections[uuid]) return;
  if (messageQueues[uuid].length === 0) return;
  const nextMessage = messageQueues[uuid][0];

  if (!last_acked_message[uuid]) {
    try {
      const json = JSON.stringify(nextMessage);
      const encryptedMessage = encrypt(json, process.env.MY_ENCRYPTION);
      connections[uuid].send(JSON.stringify({ message: encryptedMessage }));
      last_acked_message[uuid] = nextMessage.ackToken;

      retryCounts[uuid] = 0;
      setupRetry(uuid);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  } else {
    // console.log("Last acked message:", last_acked_message[uuid]);
    // console.log("amount of messages in queue:", messageQueues[uuid].length);
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

const setupRetry = (uuid) => {
  clearTimeout(retryTimers[uuid]);

  retryTimers[uuid] = setTimeout(() => {
    retryCounts[uuid] = (retryCounts[uuid] || 0) + 1;

    if (retryCounts[uuid] > MAX_RETRIES) {
      console.warn(`Max retries reached for ${uuid}, dropping message.`);
      messageQueues[uuid].shift();
      last_acked_message[uuid] = null;
      processMessageQueue(uuid);
      return;
    }

    console.log(`Retrying message for ${uuid}, attempt #${retryCounts[uuid]}`);
    last_acked_message[uuid] = null;
    processMessageQueue(uuid);
  }, RETRY_DELAY);
};
