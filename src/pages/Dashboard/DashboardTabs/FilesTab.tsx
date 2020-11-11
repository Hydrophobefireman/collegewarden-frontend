import * as requests from "../../../util/http/requests";

import { FileData, files, passwordData } from "../../../state";
import {
  FileEntry,
  deleteFile,
  getFileList,
  getFileName,
  getFileType,
  upload,
} from "./FileUtil";
import { actionButton } from "../../../styles";
import { actionButtonOverride, cardWrapper } from "./DashboadTabs.style";
import { useEffect, useRef, useState } from "@hydrophobefireman/ui-lib";

import { $req } from "./util";
import { DeleteIcon } from "../../../components/Icons/Delete";
import { ExternalLinkIcon } from "../../../components/Icons/ExternalLink";
import { ModalLayout } from "../../../components/Layout/ModalLayout";
import { TabProps } from "../types";
import { css } from "catom";
import { decrypt } from "../../../crypto/decrypt";
import { fileRoutes } from "../../../util/http/api_routes";
import { useSharedStateValue } from "statedrive";
import {
  DeleteConfirmation,
  FileTabLoader,
  NoFilesFound,
  UploadFiles,
} from "./FileTabActions";

export function Files({ setMessage }: TabProps): any {
  const password = useSharedStateValue(passwordData);
  const $_unsortedfileMetaList = useSharedStateValue<FileData[]>(files);
  const [fileMetaList, setList] = useState<FileData[]>(null);
  const [loading, setLoading] = useState(false);
  const [openFile, setOpen] = useState<FileData>(null);
  const [shouldDel, setDel] = useState<boolean>(false);
  const [downloadingState, setDownloading] = useState<string>(null);
  const abort = useRef(false);
  useEffect(() => {
    setLoading(true);
    getFileList(setMessage);
    return () => (abort.current = true);
  }, []);

  useEffect(() => {
    if (!password || !$_unsortedfileMetaList) return;
    setList(
      $_unsortedfileMetaList.sort((a, b) => {
        const name1 = getFileName(a, password).toLowerCase();
        const name2 = getFileName(b, password).toLowerCase();
        if (name1 === name2) return 0;
        return name1 > name2 ? 1 : -1;
      })
    );
  }, [$_unsortedfileMetaList, password]);

  function confDelete() {
    setDel(true);
  }
  function wrapUpload(u: Promise<{ error?: string; name: string }[]>) {
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

  function openFileExternally() {
    setDownloading("downloading file..");
    requests
      .getBinary(fileRoutes.download(openFile.file_id))
      .result.then(async (x) => {
        setDownloading(null);
        if (abort.current) return;
        if ("error" in x)
          return setMessage({ message: x.error, isError: true });

        const buf = x as ArrayBuffer;

        setDownloading("decrypting file...");
        const ret = await decrypt(
          { encryptedBuf: buf, meta: openFile.file_enc_meta },
          password
        );
        setDownloading(null);
        if ("error" in ret) {
          return setMessage({ error: ret.error, isError: true });
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
  if (shouldDel)
    return (
      <DeleteConfirmation
        openFile={openFile}
        password={password}
        onCancel={() => setDel(null)}
        onDelete={() => {
          deleteFile(openFile, fileMetaList);
          setOpen(null);
          setDel(null);
        }}
      />
    );
  if (fileMetaList == null && loading && password) return <FileTabLoader />;
  if (fileMetaList && fileMetaList.length == 0) {
    return <NoFilesFound password={password} wrapUpload={wrapUpload} />;
  }
  if (fileMetaList && password) {
    return (
      <section>
        {openFile && (
          <ModalLayout close={() => setOpen(null)}>
            <div>
              <div>
                <b
                  class={css({
                    color: "var(--current-fg)",
                    fontWeight: "bold",
                  })}
                >
                  {getFileName(openFile, password)}
                </b>
              </div>
              <div>{downloadingState && <span>{downloadingState}</span>}</div>
              <div class={css({ marginTop: "2rem", textAlign: "right" })}>
                <button
                  data-id={openFile.file_id}
                  class={actionButton}
                  style={actionButtonOverride}
                  onClick={confDelete}
                >
                  <DeleteIcon />
                  delete
                </button>
                <button
                  class={actionButton}
                  style={actionButtonOverride}
                  data-id={openFile.file_id}
                  onClick={openFileExternally}
                >
                  <ExternalLinkIcon />
                  open
                </button>
              </div>
            </div>
          </ModalLayout>
        )}
        <div class={css({ marginTop: "2rem", textAlign: "right" })}>
          <UploadFiles onClick={() => wrapUpload(upload(password))} />
        </div>
        <div class={cardWrapper}>
          {fileMetaList.map((x) => (
            <FileEntry data={x} password={password} open={(x) => setOpen(x)} />
          ))}
        </div>
      </section>
    );
  }
}
