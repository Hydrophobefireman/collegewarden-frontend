import { useEffect, useRef } from "@hydrophobefireman/ui-lib";

import { DeleteIcon } from "../Icons/Delete";
import { ExternalLinkIcon } from "../Icons/ExternalLink";
import { FileData } from "../../state";
import { ModalLayout } from "../Layout/ModalLayout";
import { actionButton } from "../../styles";
import { actionButtonOverride } from "../../pages/Dashboard/DashboardTabs/DashboadTabs.style";
import { css } from "catom";
import { getFileName } from "../../util/fileUtil";
import { DownloadIcon } from "../Icons/Download";

interface FileInfoProps {
  openFile: FileData;
  setOpen(val: FileData): void;
  downloadingState: string;
  password: string;
  setDelete(e: MouseEvent): void;
  openFileExternally(): void;
  downloadFile(): void;
}
export function FileInfo({
  openFile,
  setOpen,
  downloadingState,
  password,
  setDelete,
  openFileExternally,
  downloadFile,
}: FileInfoProps) {
  const buttonFocus = useRef<HTMLButtonElement>();
  useEffect(() => {
    if (openFile) {
      const { current } = buttonFocus;
      current.focus();
    }
  }, [openFile]);
  return (
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
        <div
          class={css({
            marginTop: "2rem",
            textAlign: "right",
            media: {
              "(max-width:500px)": { textAlign: "center" },
            },
          })}
        >
          <button
            data-id={openFile.file_id}
            class={actionButton}
            style={actionButtonOverride}
            onClick={setDelete}
          >
            <DeleteIcon />
            delete
          </button>
          <button
            class={actionButton}
            style={actionButtonOverride}
            data-id={openFile.file_id}
            onClick={downloadFile}
            ref={buttonFocus}
          >
            <DownloadIcon />
            Download
          </button>
          <button
            class={actionButton}
            style={actionButtonOverride}
            data-id={openFile.file_id}
            onClick={openFileExternally}
            ref={buttonFocus}
          >
            <ExternalLinkIcon />
            Open
          </button>
        </div>
      </div>
    </ModalLayout>
  );
}
