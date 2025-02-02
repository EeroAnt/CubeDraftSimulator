import { connections } from "./State.js";
import { encrypt } from "./encryption.js";

export const sendMessage = (uuid, message) => {
  const encryptedMessage = encrypt(JSON.stringify(message));
  connections[uuid].send(encryptedMessage);
};