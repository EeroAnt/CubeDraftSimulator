import { connections } from "./State.js";
//import { encrypt } from "./encryption.js";

export const sendMessage = (uuid, message) => {
  connections[uuid].send(JSON.stringify(message));
};