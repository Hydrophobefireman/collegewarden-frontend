import { css } from "catom";
import { UploadIcon } from "../../../components/Icons/Upload";
import { ModalLayout } from "../../../components/Layout/ModalLayout";
import { FileData } from "../../../state";
import { actionButton, bold, center, mask } from "../../../styles";
import { getFileName, upload } from "./FileUtil";

export function UploadFiles({ onClick }: { onClick?(): void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        border: "2px solid var(--current-fg)",
        color: "var(--current-text-color)",
        padding: "0.5rem",
      }}
      class={[actionButton]}
    >
      <UploadIcon /> upload files
    </button>
  );
}
interface NoFilesFoundProps {
  wrapUpload(p: Promise<{ error?: string }[]>): void;
  password: string;
}
export function NoFilesFound({ wrapUpload, password }: NoFilesFoundProps) {
  return (
    <div class={center}>
      <div>no files found</div>
      <div class={css({ marginTop: "3rem" })}>
        <div>
          <UploadFiles onClick={() => wrapUpload(upload(password))} />
        </div>
      </div>
    </div>
  );
}

export function FileTabLoader() {
  return (
    <div class={mask}>
      <loading-spinner />
    </div>
  );
}
interface DelConfProps {
  openFile: FileData;
  password: string;
  onCancel(): void;
  onDelete(): void;
}

export function DeleteConfirmation({
  openFile,
  password,
  onCancel,
  onDelete,
}: DelConfProps) {
  return (
    <ModalLayout>
      <div>
        are you sure you want to delete{" "}
        <b class={[bold, css({ color: "var(--current-fg)" })]}>
          {getFileName(openFile, password)}
        </b>
        ?
      </div>
      <div class={css({ textAlign: "right" })}>
        <button class={actionButton} onClick={onCancel}>
          cancel
        </button>
        <button class={actionButton} onClick={onDelete}>
          delete
        </button>
      </div>
    </ModalLayout>
  );
}
