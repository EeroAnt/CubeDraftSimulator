// Encode Uint8Array to Base64 safely
// function base64ToUint8(base64) {
//   const binary = atob(base64);
//   return new TextEncoder().encode(binary);
// }

function uint8ToBase64(uint8) {
  const binary = new TextDecoder().decode(uint8);
  return btoa(binary);
}

export function encrypt(text, key) {
  const extendedKey = extendKey(key, text.length);
  const charCodes = [];

  for (let i = 0; i < text.length; i++) {
    charCodes.push(text.charCodeAt(i) ^ extendedKey.charCodeAt(i));
  }

  return uint8ToBase64(new Uint8Array(charCodes));
}

function base64ToUint8(base64) {
  return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}

export function decrypt(base64, key) {
  const bytes = base64ToUint8(base64);
  const extendedKey = extendKey(key, bytes.length);

  const decryptedBytes = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    decryptedBytes[i] = bytes[i] ^ extendedKey.charCodeAt(i);
  }

  const decoder = new TextDecoder(); // handles UTF-8 correctly
  return decoder.decode(decryptedBytes);
}

function extendKey(key, length) {
  if (typeof key !== 'string') {
    throw new Error(`Invalid key: ${key}`);
  }
  return key.repeat(Math.ceil(length / key.length)).substring(0, length);
}