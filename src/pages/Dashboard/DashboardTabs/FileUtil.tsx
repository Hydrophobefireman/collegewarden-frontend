import * as requests from "../../../util/http/requests";

import { FileData, files } from "../../../state";
import { dec, enc } from "../../../crypto/util";
import { fileRoutes, userRoutes } from "../../../util/http/api_routes";

import { TabProps } from "../types";
import { encrypt } from "../../../crypto/encrypt";
import { fileCard } from "./DashboadTabs.style";
import { getArrayBufferFromUser } from "../../../util/file";
import { set } from "statedrive";

export async function upload(password: string) {
  const data = await getArrayBufferFromUser();
  return Promise.all(
    data.map(async ({ buf, name, type }) => {
      const fn = enc(password);
      const { encryptedBuf, meta } = await encrypt(buf, password, {
        name: fn(name),
        type: fn(type),
      });
      return requests
        .postBinary(fileRoutes.upload, encryptedBuf, {
          "x-cw-iv": meta,
          "x-cw-data-type": "encrypted_blob",
        })
        .result.then((x) => {
          getFileList();
          return x;
        });
    })
  );
}
interface FileEntryProps {
  data: FileData;
  password: string;
  open(d: FileData): void;
}
export function FileEntry({ data, password, open }: FileEntryProps) {
  const fn = getFileName(data, password);
  return (
    <button class={fileCard} data-id={data.file_id} onClick={() => open(data)}>
      <div>{fn}</div>
    </button>
  );
}

export function getFileName(data: FileData, password: string): string {
  const meta = data.file_enc_meta;
  return meta ? dec(password)(JSON.parse(meta).name) : "";
}

export function getFileType(data: FileData, password: string): string {
  const meta = data.file_enc_meta;
  const t = JSON.parse(meta).type;
  return t ? dec(password)(t) : "application/octet-stream";
}
export function deleteFile(f: FileData, fList: FileData[]) {
  const file_id = f.file_id;
  requests.postJSON(fileRoutes.delete(file_id), { file_id });
  set(
    files,
    fList.filter((x) => x.file_id != f.file_id)
  );
}

export function getFileList(setMessage?: TabProps["setMessage"]) {
  requests
    .get<{ files: FileData[] }>(userRoutes.getFiles())
    .result.then((f) => {
      if (f.error) {
        return setMessage && setMessage({ message: f.error, isError: true });
      }
      const data = f.data;
      if (data) {
        set(files, data.files);
      }
    });
}
