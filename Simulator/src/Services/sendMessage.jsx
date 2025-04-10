import { encrypt } from "./Encryption";

export function sendMessage(connection, message) {
  const parsed = JSON.stringify(message)
  const key = import.meta.env.VITE_MY_ENCRYPTION;
  const encryptedMessage = encrypt(parsed, key);
  connection.sendMessage(encryptedMessage);
}
