import { TextEncoder, TextDecoder } from 'util';

export function encrypt(text, key) {
  const encoder = new TextEncoder();
  const textBytes = encoder.encode(text);
  const extendedKey = extendKey(key, textBytes.length);

  const encryptedBytes = new Uint8Array(textBytes.length);
  for (let i = 0; i < textBytes.length; i++) {
    encryptedBytes[i] = textBytes[i] ^ extendedKey.charCodeAt(i);
  }

  return Buffer.from(encryptedBytes).toString('base64');
}


export function decrypt(base64, key) {
  const byteArray = Uint8Array.from(Buffer.from(base64, 'base64'));
  const extendedKey = extendKey(key, byteArray.length);

  const chars = [];
  for (let i = 0; i < byteArray.length; i++) {
    chars.push(String.fromCharCode(byteArray[i] ^ extendedKey.charCodeAt(i)));
  }

  return chars.join('');
}

function extendKey(key, length) {
  return key.repeat(Math.ceil(length / key.length)).substring(0, length);
}
