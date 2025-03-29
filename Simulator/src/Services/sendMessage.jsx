import { encrypt } from "./Encryption";

export function sendMessage(connection, message) {
  // console.log("Sending message: ", message);
  const parsed = JSON.stringify(message)
  const encryptedMessage = encrypt(parsed);
  connection.sendMessage(encryptedMessage);
}
