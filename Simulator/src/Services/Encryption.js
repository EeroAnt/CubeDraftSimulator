export function encrypt(text) {
  const key = extendKey(import.meta.env.VITE_MY_ENCRYPTION, text.length);
  let encrypted = ''; 
  for (let i = 0; i < text.length; i++) {
    encrypted += String.fromCharCode(
      text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return encrypted;
}

export function decrypt(text) {
  const key = extendKey(import.meta.env.VITE_MY_ENCRYPTION, text.length);
  return encrypt(text, key); // XOR-salaus on symmetrinen
}

function extendKey(key, length) {
  return key.repeat(Math.ceil(length / key.length)).substring(0, length);
}