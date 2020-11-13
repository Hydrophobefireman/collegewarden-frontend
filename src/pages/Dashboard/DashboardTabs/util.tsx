import { RefType } from "@hydrophobefireman/ui-lib";
import {
  getDecryptedFileProp,
  getFileName,
  getFileType,
} from "../../../components/FileInfo/FileUtil";
import { decrypt } from "../../../crypto/decrypt";
import { FileData } from "../../../state";
import { fileRoutes } from "../../../util/http/api_routes";
import * as requests from "../../../util/http/requests";
import { clean as _clean } from "../../../util/validate/validators";

export const clean = (x: string) => _clean(x).toLowerCase();
export const $req = window.requestAnimationFrame
  ? (cb: FrameRequestCallback) => window.requestAnimationFrame(cb)
  : setTimeout;

export interface SearchCollege {
  name: string;
  alias?: string[];
  search?: string;
}

export function sanitizeCollegeData(data: SearchCollege[]) {
  return data.map(({ name, alias }) => ({
    name,
    search: clean(name),
    alias: alias && alias.map(clean),
  }));
}

const LIMIT = 100;
export function searchItems(needle: string, haystack: SearchCollege[]) {
  const cleaned = clean(needle);
  return haystack
    .filter((next) => {
      if (
        next.search.includes(cleaned) ||
        (next.alias && next.alias.some((x) => x.includes(cleaned)))
      ) {
        return true;
      }
    })
    .slice(0, LIMIT);
}
interface SetMessage {
  (a: { message?: string; isError?: boolean }): void;
}
interface OpenFileProps {
  setDownloading(a: string): void;
  abort: RefType<boolean>;
  openFile: FileData;
  setMessage: SetMessage;
  password: string;
  setOpen(a: any): void;
}
export function openFileExternally({
  setDownloading,
  abort,
  openFile,
  setMessage,
  password,
  setOpen,
}: OpenFileProps) {
  setDownloading("downloading file..");
  requests
    .getBinary(fileRoutes.download(openFile.file_id))
    .result.then(async (x) => {
      setDownloading(null);
      if (abort.current) return;
      if ("error" in x) return setMessage({ message: x.error, isError: true });

      const buf = x as ArrayBuffer;

      setDownloading("decrypting file...");
      const ret = await decrypt(
        { encryptedBuf: buf, meta: openFile.file_enc_meta },
        password
      );
      setDownloading(null);
      if ("error" in ret) {
        return setMessage({ message: ret.error, isError: true });
      }
      const blob = new Blob([ret], { type: getFileType(openFile, password) });
      const url = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement("a"), {
        target: "_blank",
        href: url,
      });
      a.click();
      $req(() => URL.revokeObjectURL(url));
      setOpen(null);
    });
}

export function wrapUpload(
  u: Promise<{ error?: string; name?: string }[]>,
  setMessage: SetMessage
) {
  setMessage({ message: "Uploading files" });
  u.then((xArr) => {
    const failedFiles = [];
    xArr.forEach((x) => {
      const { error, name } = x;
      if (error) failedFiles.push(name);
    });
    const len = failedFiles.length;
    if (len)
      return setMessage({
        message: `"${failedFiles.join(" , ")}" failed to upload`,
        isError: true,
      });
    return setMessage({ message: "upload successful" });
  });
}

export function searchFiles(
  search: string,
  password: string,
  unFilteredUnsortedfilesAndNotes: FileData[],
  setFilteredData: (d: FileData[]) => void
) {
  const cleaned = clean(search);
  if (!cleaned || !password)
    return setFilteredData(unFilteredUnsortedfilesAndNotes);
  if (unFilteredUnsortedfilesAndNotes) {
    const d = unFilteredUnsortedfilesAndNotes.filter((x) => {
      const val =
        getFileName(x, password) || getDecryptedFileProp(x, password, "title");
      return clean(val).includes(cleaned);
    });
    setFilteredData(d);
  }
}
