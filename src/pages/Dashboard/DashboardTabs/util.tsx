import * as requests from "../../../util/http/requests";

import {
  getDecryptedFileProp,
  getFileName,
  getFileType,
} from "../../../util/fileUtil";

import { FileData } from "../../../state";
import { RefType } from "@hydrophobefireman/ui-lib";
import { clean } from "../../../util/validate/validators";
import { decrypt } from "../../../crypto/decrypt";
import { fileRoutes } from "../../../util/http/api_routes";
import { guard } from "../../../util/guard";

export { clean } from "../../../util/validate/validators";

export const $req = window.requestAnimationFrame
  ? (cb: FrameRequestCallback) => window.requestAnimationFrame(cb)
  : setTimeout;

export interface GlCollegeData {
  id: number;
  name: string;
  city: string;
  state: string;
  springDeadline: string | null;
  fallDeadline: string | null;
  summerDeadline: string | null;
  deadlineRDRolling: string | null;
  hasFeeIntl: boolean;
  hasFeeUS: boolean;
  type: "Coed" | "Women" | "Men";
  caEssayReqd: boolean;
  hasSupl: boolean;
  url: string;
  $search: string[];
  __internal?: any;
}

const LIMIT = 100;
export function searchItems(needle: string, haystack: GlCollegeData[]) {
  const cleaned = clean(needle);
  return haystack
    .filter((next) => next.$search.some((x) => x.includes(cleaned)))
    .slice(0, LIMIT);
}
export interface SetMessage {
  (a: { message?: string; isError?: boolean }): void;
}

interface OpenFileProps {
  setDownloading(a: string): void;
  abort: RefType<boolean>;
  openFile: FileData;
  setMessage: SetMessage;
  password: string;
  setOpen(a: any): void;
  download: boolean;
  urlSet: Set<string>;
}
export function openFileExternally({
  setDownloading,
  abort,
  openFile,
  setMessage,
  password,
  setOpen,
  download,
  urlSet,
}: OpenFileProps) {
  setDownloading("downloading file..");
  requests
    .getBinary(fileRoutes.download(openFile.file_id))
    .result.then(async (x) => {
      setDownloading(null);
      if (abort.current) return;
      if ("error" in x) return setMessage({ message: x.error, isError: true });
      if (!guard(ArrayBuffer, x)) return;

      const buf = x;

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
      urlSet.add(url);
      const a = Object.assign(
        document.createElement("a"),
        {
          target: "_blank",
          href: url,
        },
        download
          ? { download: getFileName(openFile, password) || "download" }
          : null
      );
      a.click();
      // $req(() => URL.revokeObjectURL(url));
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
  unFilteredUnsortedfilesAndNotes: FileData[]
) {
  const cleaned = clean(search);
  if (!cleaned || !password) return unFilteredUnsortedfilesAndNotes;
  if (unFilteredUnsortedfilesAndNotes) {
    const d = unFilteredUnsortedfilesAndNotes.filter((x) => {
      const val = getFileName(x, password);
      return clean(val).includes(cleaned);
    });
    return d;
  }
}

export function isNote(x: string) {
  return x === "x-collegewarden/note";
}
