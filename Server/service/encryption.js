// Encode Uint8Array to Base64 safely
function uint8ToBase64(uint8) {
  let binary = '';
  for (let i = 0; i < uint8.length; i++) {
    binary += String.fromCharCode(uint8[i]);
  }
  return btoa(binary);
}

// Decode Base64 back to Uint8Array
function base64ToUint8(base64) {
  const binary = atob(base64);
  const uint8 = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    uint8[i] = binary.charCodeAt(i);
  }
  return uint8;
}

export function encrypt(text, key) {
  const extendedKey = extendKey(key, text.length);
  const charCodes = [];

  for (let i = 0; i < text.length; i++) {
    charCodes.push(text.charCodeAt(i) ^ extendedKey.charCodeAt(i));
  }

  return uint8ToBase64(new Uint8Array(charCodes));
}

export function decrypt(base64, key) {
  const bytes = base64ToUint8(base64);
  const extendedKey = extendKey(key, bytes.length);

  const chars = [];
  for (let i = 0; i < bytes.length; i++) {
    chars.push(String.fromCharCode(bytes[i] ^ extendedKey.charCodeAt(i)));
  }

  return chars.join('');
}

function extendKey(key, length) {
  return key.repeat(Math.ceil(length / key.length)).substring(0, length);
}
