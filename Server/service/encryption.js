import { config } from 'dotenv';
import fs from 'fs';

if (fs.existsSync('.env')) {
    config();
} else {
    console.log('.env file not found, skipping');
}


export function encrypt(text) {
  const key = extendKey(process.env.MY_ENCRYPTION, text.length);
  let encrypted = ''; 
  for (let i = 0; i < text.length; i++) {
    encrypted += String.fromCharCode(
      text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return encrypted;
}

export function decrypt(text) {
  const key = extendKey(process.env.MY_ENCRYPTION, text.length);
  return encrypt(text, key);
}

function extendKey(key, length) {
  return key.repeat(Math.ceil(length / key.length)).substring(0, length);
}

const message = "Hello, world!";
const key = "key";

// Salaa viesti
const encryptedMessage = encrypt(message, key);
console.log("Message:", message);
console.log("Encrypted:", encryptedMessage);

// Purkaa viestin
const decryptedMessage = decrypt(encryptedMessage, key);
console.log("Decrypted:", decryptedMessage);
