import { Object_assign } from "@hydrophobefireman/j-utils";
import { enc } from "./crypto/string_enc";
import { FileData } from "./state";
import { getDecryptedFileProp } from "./util/fileUtil";
const SCHEMA_VERSION = "1";
export function migrateFiles(files: FileData[], password: string) {
  files = files.map((x) => {
    const schemaVersion = getDecryptedFileProp(x, password, "schema_version");
    if (schemaVersion === SCHEMA_VERSION) return x;

    const meta = JSON.parse(x.file_enc_meta);
    meta.schema_version = enc(password)(SCHEMA_VERSION);

    const ts = getDecryptedFileProp(x, password, "ts");

    if (!ts) {
      meta.ts = `${+new Date()}`;
    }
    return Object_assign({}, x, { file_enc_meta: JSON.stringify(meta) });
  });
  return files;
}
