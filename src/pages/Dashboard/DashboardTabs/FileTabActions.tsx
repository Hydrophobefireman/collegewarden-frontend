import { actionButton, center, mask } from "../../../styles";

import { NotesIcon } from "../../../components/Icons/Notes";
import { UploadIcon } from "../../../components/Icons/Upload";
import { css } from "catom";
import { upload } from "../../../components/FileInfo/FileUtil";

const uploadButtonOverride = {
  display: "inline-flex",
  border: "2px solid var(--current-fg)",
  color: "var(--current-text-color)",
  padding: "0.5rem",
  borderRadius: "50px",
};

export function UploadFiles({ onClick }: { onClick?(): void }) {
  return (
    <button
      onClick={onClick}
      style={uploadButtonOverride}
      class={[actionButton]}
    >
      <UploadIcon />
      <span
        class={css({
          media: {
            "(max-width:500px)": { display: "none" },
          },
        })}
      >
        upload files
      </span>
    </button>
  );
}

export function UploadNotes({ onClick }: { onClick?(): void }) {
  return (
    <button
      onClick={onClick}
      style={uploadButtonOverride}
      class={[actionButton]}
    >
      <NotesIcon />
      <span
        class={css({
          media: {
            "(max-width:500px)": { display: "none" },
          },
        })}
      >
        upload notes
      </span>
    </button>
  );
}
interface NoFilesFoundProps {
  wrapUpload(p: Promise<{ error?: string; name?: string }[]>): void;
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
