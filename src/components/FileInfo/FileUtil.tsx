import * as requests from "../../util/http/requests";

import { FileData, files } from "../../state";
import { dec, enc } from "../../crypto/util";
import { fileRoutes, userRoutes } from "../../util/http/api_routes";

import { TabProps } from "../../pages/Dashboard/types";
import { encrypt } from "../../crypto/encrypt";
import { fileCard } from "../../pages/Dashboard/DashboardTabs/DashboadTabs.style";
import { getArrayBufferFromUser } from "../../util/file";
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

      return res.then((x: any) => {
        x.name = name;
        return x as any;
      });
    })
  ).then((x) => {
    getFileList();
    return x;
  });
}
export interface FileEntryProps {
  data: FileData;
  password: string;
  open(d?: FileData): void;
}
export function FileEntry({ data, password, open }: FileEntryProps) {
  const fn = getFileName(data, password);
  return (
    <button class={fileCard} data-id={data.file_id} onClick={() => open(data)}>
      <div>{fn}</div>
    </button>
  );
}
interface CacheKeys {
  name?: string;
  type?: string;
  preview?: string;
  title?: string;
  ts?: string;
}

const wm = new FakeWeakMap<FileData, CacheKeys>();

export function evictWeakMapCache(f: FileData) {
  return wm.delete(f);
}

export function getFileName(data: FileData, password: string): string {
  return getDecryptedFileProp(data, password, "name");
}

export function getFileType(data: FileData, password: string): string {
  return getDecryptedFileProp(
    data,
    password,
    "type",
    "application/octet-stream"
  );
}

export function getDecryptedFileProp(
  data: FileData,
  password: string,
  prop: keyof CacheKeys,
  def?: any
): string {
  const cache = wm.get(data) || {};
  if (cache[prop]) {
    return cache[prop];
  }
  const ret = getDecryptedMetaObject(data, password, prop, def || "");
  cache[prop] = ret;
  wm.set(data, cache);
  return ret;
}

function getDecryptedMetaObject(
  data: FileData,
  password: string,
  field: keyof CacheKeys,
  def?: string
) {
  const meta = data.file_enc_meta;
  const t = JSON.parse(meta)[field];
  return t ? dec(password)(t) : def || "";
}
export function deleteFile(f: FileData, fList: FileData[]) {
  const file_id = f.file_id;
  requests.postJSON(fileRoutes.delete, { file_id });
  const xx = fList.filter((x) => x.file_id != f.file_id);
  set(files, xx);
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
