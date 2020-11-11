import * as requests from "../../../util/http/requests";

import { FileData, files } from "../../../state";
import { dec, enc } from "../../../crypto/util";
import { fileRoutes, userRoutes } from "../../../util/http/api_routes";

import { TabProps } from "../types";
import { encrypt } from "../../../crypto/encrypt";
import { fileCard } from "./DashboadTabs.style";
import { getArrayBufferFromUser } from "../../../util/file";
import { set } from "statedrive";
import { FakeWeakMap } from "@hydrophobefireman/j-utils";

export async function upload(
  password: string
): Promise<{ data: unknown; error?: string; name: string }[]> {
  const data = await getArrayBufferFromUser();
  return Promise.all(
    data.map(async ({ buf, name, type }) => {
      const fn = enc(password);
      const { encryptedBuf, meta } = await encrypt(buf, password, {
        name: fn(name),
        type: fn(type),
      });
      const res = requests.postBinary(fileRoutes.upload, encryptedBuf, {
        "x-cw-iv": meta,
        "x-cw-data-type": "encrypted_blob",
      }).result;
      (res as any).name = name;
      return res as any;
    })
  ).then((x) => {
    getFileList();
    return x;
  });
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

const wm = new FakeWeakMap<FileData, { name?: string; type?: string }>();
export function getFileName(data: FileData, password: string): string {
  const cache = wm.get(data) || {};
  if (cache.name) {
    return cache.name;
  }
  const meta = data.file_enc_meta;
  const ret = meta ? dec(password)(JSON.parse(meta).name) : "";
  cache.name = ret;
  wm.set(data, cache);
  return ret;
}

export function getFileType(data: FileData, password: string): string {
  const cache = wm.get(data) || {};
  if (cache.type) {
    return cache.name;
  }
  const meta = data.file_enc_meta;
  const t = JSON.parse(meta).type;
  const ret = t ? dec(password)(t) : "application/octet-stream";
  cache.type = ret;
  wm.set(data, cache);
  return ret;
}
export function deleteFile(f: FileData, fList: FileData[]) {
  const file_id = f.file_id;
  requests.postJSON(fileRoutes.delete, { file_id });
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
