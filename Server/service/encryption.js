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
