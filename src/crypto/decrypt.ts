import { base64ToArrayBuffer } from "@hydrophobefireman/j-utils";
import { decKey, EncData, importKey } from "./util";

export async function decrypt(p: EncData, password: string) {
  try {
    const { encryptedBuf, meta } = p;
    const { encryptedKey, iv: ivb64 } = JSON.parse(meta);
    const iv = await base64ToArrayBuffer(ivb64);
    const usableKey = decKey(encryptedKey, password);
    const key = await importKey(usableKey);
    return crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encryptedBuf);
  } catch (e) {
    return { error: "could not decrypt, check your password" };
  }
}

const decoder = new TextDecoder();

export async function decryptJson(p: EncData, password: string) {
  const ret = await decrypt(p, password);
  if (ret instanceof ArrayBuffer) {
    return JSON.parse(decoder.decode(ret));
  }
  return ret;
}
