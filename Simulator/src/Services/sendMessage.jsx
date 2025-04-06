import { encrypt } from "./Encryption";

export function sendMessage(connection, message) {
  const parsed = JSON.stringify(message)
  const encryptedMessage = encrypt(parsed);
  connection.sendMessage(encryptedMessage);
}
