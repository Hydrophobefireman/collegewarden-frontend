import * as requests from "../util/http/requests";

import { colleges, fileAtom, passwordData } from "../state";
import { decrypt, decryptJson } from "./decrypt";
import { get, set } from "statedrive";
import {
  getFileList,
  getFileName,
  getFileType,
  uploadFileToServer,
  uploadNoteToServer,
} from "../util/fileUtil";

import { FakeSet } from "@hydrophobefireman/j-utils";
import { fileRoutes } from "../util/http/api_routes";
import { guard } from "../util/guard";
import { isNote as _isNote } from "@/pages/Dashboard/DashboardTabs/util";

export async function reEncryptUserData(
  updaterFunction: (latestUpdate: string) => void,
  oldPassword: string,
  newPassword: string
) {
  const collegeData = get(colleges);
  const errors = new FakeSet<string>();
  await getFileList();
  const fileData = get(fileAtom);
  return await Promise.all(
    fileData.map(async (x) => {
      const id = x.file_id;
      let name = getFileName(x, oldPassword);
      const fileType = getFileType(x, oldPassword);
      let isNote = _isNote(fileType);

      function removeCurrentFile() {
        requests.postJSON(fileRoutes.delete, { file_id: id });
        updaterFunction(
          `Could not download/decrypt ${name}. Removing from backend..`
        );
        return errors.add(name);
      }
      const binary = requests.getBinary(fileRoutes.download(id));

      updaterFunction(`Downloading ${name}`);
      const resp = await binary.result;
      if ("error" in resp) {
        return removeCurrentFile();
      }
      if (!guard(ArrayBuffer, resp)) return;
      const encData = { encryptedBuf: resp, meta: x.file_enc_meta };
      if (!isNote) {
        const decrypted = await decrypt(encData, oldPassword);
        if ("error" in decrypted) {
          return removeCurrentFile();
        }
        if (!guard(ArrayBuffer, decrypted)) return;

        await uploadFileToServer(
          {
            buf: decrypted,
            name,
            type: fileType,
          },
          newPassword,
          fileRoutes.edit(id)
        );
      } else {
        const { note, error } = await decryptJson(encData, oldPassword);
        if (error) {
          return removeCurrentFile();
        }
        await uploadNoteToServer({
          notes: note,
          password: newPassword,
          title: name,
          url: fileRoutes.edit(id),
        });
      }
      updaterFunction(`Successfully re-encrypted ${name}`);
    })
  ).then(() => {
    set(passwordData, newPassword);
    set(colleges, collegeData);
    getFileList();
    return Array.from(errors);
  });
}
