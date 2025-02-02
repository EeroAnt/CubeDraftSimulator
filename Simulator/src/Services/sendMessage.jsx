import { encrypt } from "./Encryption";

export function sendMessage(connection, message) {
  console.log("Sending message: ", message);
  const parsed = JSON.stringify(message)
  const encryptedMessage = encrypt(parsed);
  console.log("Encrypted message: ", encryptedMessage);
  connection.sendMessage(encryptedMessage);
}
