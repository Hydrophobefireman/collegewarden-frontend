import { arrayBufferToBase64 } from "@hydrophobefireman/j-utils";
import { EncData, encKey, generateKey } from "./util";

export async function encrypt(
  file: ArrayBuffer,
  password: string,
  additional?: any
): Promise<EncData> {
  const { key, exportableKey } = await generateKey();
  const iv = crypto.getRandomValues(new Uint8Array(50)).buffer;
  const encryptedBuf = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    file
  );
  return {
    encryptedBuf,
    meta: JSON.stringify({
      iv: await arrayBufferToBase64(iv),
      encryptedKey: encKey(exportableKey, password),
      ...additional,
    }),
  };
}
const encoder = new TextEncoder();
export function encryptJson(json: object, password: string) {
  return encrypt(encoder.encode(JSON.stringify(json)), password);
}
