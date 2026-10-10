const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const toBase64Url = (bytes) => {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

const fromBase64Url = (value) => {
  if (typeof value !== 'string' || !/^[A-Za-z0-9_-]*$/.test(value)) throw new Error('invalid base64url');
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - value.length % 4) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
};

export const randomBytes = (length) => {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
};

export const randomToken = (length = 32) => toBase64Url(randomBytes(length));

export const sha256 = async (value) => new Uint8Array(await crypto.subtle.digest('SHA-256', typeof value === 'string' ? textEncoder.encode(value) : value));

export const pkceChallenge = async (verifier) => toBase64Url(await sha256(verifier));

export const constantTimeEqual = (left, right) => {
  if (typeof left !== 'string' || typeof right !== 'string') return false;
  const leftBytes = textEncoder.encode(left);
  const rightBytes = textEncoder.encode(right);
  let difference = leftBytes.length ^ rightBytes.length;
  const length = Math.max(leftBytes.length, rightBytes.length);
  for (let index = 0; index < length; index += 1) {
    difference |= (leftBytes[index] || 0) ^ (rightBytes[index] || 0);
  }
  return difference === 0;
};

const encryptionKey = async (secret) => {
  if (typeof secret !== 'string' || secret.length < 16) throw new Error('encryption key is not configured');
  return crypto.subtle.importKey('raw', await sha256(secret), 'AES-GCM', false, ['encrypt', 'decrypt']);
};

export const encryptJson = async (value, secret) => {
  const iv = randomBytes(12);
  const key = await encryptionKey(secret);
  const plaintext = textEncoder.encode(JSON.stringify(value));
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext));
  const output = new Uint8Array(iv.length + ciphertext.length);
  output.set(iv);
  output.set(ciphertext, iv.length);
  return toBase64Url(output);
};

export const decryptJson = async (value, secret) => {
  const encoded = fromBase64Url(value);
  if (encoded.length <= 12) throw new Error('invalid encrypted value');
  const key = await encryptionKey(secret);
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: encoded.slice(0, 12) }, key, encoded.slice(12));
  return JSON.parse(textDecoder.decode(plaintext));
};

export const isValidPkceVerifier = (value) => typeof value === 'string' && /^[A-Za-z0-9._~-]{43,128}$/.test(value);
export const isBoundedToken = (value, max = 512) => typeof value === 'string' && value.length > 0 && value.length <= max && !/[\u0000-\u001f\u007f]/.test(value);
