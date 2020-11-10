function textToChars(text: string) {
  return text.split("").map((c) => c.charCodeAt(0));
}
function applySaltToChar(code: number, salt: string) {
  return textToChars(salt).reduce((a, b) => a ^ b, code);
}
const byteHex = (n: number) => `0${Number(n).toString(16)}`.substr(-2);

export function enc(salt: string) {
  return (text: string) =>
    text
      .split("")
      .map(textToChars)
      .map((v) => applySaltToChar(v as any, salt))
      .map(byteHex)
      .join("");
}
export function dec(salt: string) {
  return (encoded: string) =>
    encoded
      .match(/.{1,2}/g)
      .map((hex: string) => parseInt(hex, 16))
      .map((v: number) => applySaltToChar(v, salt))
      .map((charCode: number) => String.fromCharCode(charCode))
      .join("");
}

export async function generateKey() {
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  const exportableKey = await crypto.subtle.exportKey("jwk", key);
  return { key, exportableKey };
}

export function importKey(exportableKey: JsonWebKey) {
  return crypto.subtle.importKey(
    "jwk",
    exportableKey as any,
    { name: "AES-GCM" },
    true,
    ["encrypt", "decrypt"]
  );
}

export function encKey(key: JsonWebKey, password: string) {
  return enc(password)(JSON.stringify(key));
}

export function decKey(encrypted: string, password: string) {
  return JSON.parse(dec(password)(encrypted)) as JsonWebKey;
}

export interface EncData {
  encryptedBuf: ArrayBuffer;
  meta: string;
}
