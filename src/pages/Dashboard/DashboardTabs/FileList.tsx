import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import {
  NoFilesFound,
  UploadFiles,
  UploadNotes,
} from "@/components/FileActions";
import { FileInfo } from "@/components/FileInfo";
import { Note } from "@/components/FileInfo/Note";

import { NoteEditor } from "@/components/NoteEditor";
import { FileData } from "@/state";
import {
  deleteFile,
  FileEntry,
  getFileName,
  getFileType,
  upload,
} from "@/util/fileUtil";
import { FakeSet } from "@hydrophobefireman/j-utils";
import {
  RefType,
  useEffect,
  useMemo,
  useState,
} from "@hydrophobefireman/ui-lib";
import { css } from "catom";
import { cardWrapper, fileTypeHeading } from "./DashboadTabs.style";
import { isNote, openFileExternally, SetMessage, wrapUpload } from "./util";

export function FileList({
  abort,
  sortedFiles,
  password,
  setMessage,
  unfilteredFiles,
}: {
  abort: RefType<boolean>;
  sortedFiles: FileData[];
  password: string;
  setMessage: SetMessage;
  unfilteredFiles: FileData[];
}) {
  const [shouldDel, setDel] = useState(false);
  const [openFile, setOpen] = useState<FileData>(null);
  const [notes, setNotes] = useState<FileData | boolean>(null);
  return (
    <>
      {shouldDel ? (
        <DeleteConfirmation
          name={getFileName(openFile, password)}
          onCancel={() => setDel(false)}
          onDelete={() => {
            deleteFile(openFile, unfilteredFiles);
            setOpen(null);
            setDel(false);
          }}
        />
      ) : !truthyArr(unfilteredFiles) ? (
        <>
          <NoFilesFound
            password={password}
            wrapUpload={(u) => wrapUpload(u, setMessage)}
            setNotes={setNotes}
          />
          <NoteComponent
            notes={notes}
            password={password}
            close={() => setNotes(null)}
            fileList={unfilteredFiles}
            setMessage={setMessage}
          />
        </>
      ) : (
        <>
          <NoteComponent
            notes={notes}
            password={password}
            close={() => setNotes(null)}
            fileList={unfilteredFiles}
            setMessage={setMessage}
          />
          <FileInfoRenderer
            openFile={openFile}
            abort={abort}
            password={password}
            setDelete={() => setDel(true)}
            setMessage={setMessage}
            setOpen={setOpen}
          />
          <UploadBox
            uploadNotes={() => setNotes(true)}
            uploadFiles={() => wrapUpload(upload(password, null), setMessage)}
          />
          <FileListRenderer
            sortedFiles={sortedFiles}
            password={password}
            setOpen={setOpen}
            setNotes={setNotes}
          />
        </>
      )}
    </>
  );
}

function FileInfoRenderer({
  openFile,
  abort,
  password,
  setMessage,
  setOpen,
  setDelete,
}: {
  openFile: FileData;
  abort: RefType<boolean>;
  password: string;
  setMessage: SetMessage;
  setOpen(x: FileData): void;
  setDelete(): void;
}) {
  const urlSet = useObjectUrlSet();
  const [downloadingState, setDownloading] = useState<string>(null);
  const extProps = {
    abort,
    openFile,
    password,
    setDownloading,
    setMessage,
    setOpen,
    urlSet,
  };
  return (
    openFile && (
      <FileInfo
        downloadingState={downloadingState}
        openFile={openFile}
        openFileExternally={() =>
          openFileExternally({ ...extProps, download: false })
        }
        downloadFile={() => openFileExternally({ ...extProps, download: true })}
        password={password}
        setDelete={setDelete}
        setOpen={setOpen}
      />
    )
  );
}
function NoteComponent({
  notes,
  close,
  password,
  fileList,
  setMessage,
}: {
  notes: FileData | boolean;
  close(): void;
  password: string;
  fileList: FileData[];
  setMessage: SetMessage;
}) {
  return (
    notes && (
      <NoteEditor
        close={close}
        password={password}
        data={typeof notes === "boolean" ? null : notes}
        list={fileList}
        setMessage={setMessage}
      />
    )
  );
}
function UploadBox({
  uploadFiles,
  uploadNotes,
}: {
  uploadFiles(): void;
  uploadNotes(): void;
}) {
  return (
    <div class={css({ marginTop: "2rem", textAlign: "right" })}>
      <UploadFiles onClick={uploadFiles} />
      <UploadNotes onClick={uploadNotes} />
    </div>
  );
}
function FileListRenderer({
  sortedFiles,
  password,
  setOpen,
  setNotes,
}: {
  sortedFiles: FileData[];
  password: string;
  setOpen(x: FileData): void;
  setNotes(x: FileData): void;
}) {
  const notes = [];
  const files = [];
  sortedFiles.forEach((x) => {
    if (isNote(getFileType(x, password))) {
      notes.push(x);
    } else {
      files.push(x);
    }
  });
  return (
    truthyArr(sortedFiles) && (
      <>
        <div>
          <div>
            <b class={fileTypeHeading}>notes</b>
          </div>
          <div class={cardWrapper}>
            {notes.length ? (
              notes.map((x) => (
                <Note open={() => setNotes(x)} data={x} password={password} />
              ))
            ) : (
              <div>No notes found</div>
            )}
          </div>
        </div>
        <div>
          <div>
            <b class={fileTypeHeading}>files</b>
          </div>
          <div class={cardWrapper}>
            {files.length ? (
              files.map((x) => (
                <FileEntry data={x} open={setOpen} password={password} />
              ))
            ) : (
              <div>No files found</div>
            )}
          </div>
        </div>
      </>
    )
  );
}
const truthyArr = (x: any[]) => x && x.length > 0;

function useObjectUrlSet() {
  const urlSet = useMemo(() => new FakeSet<string>(), []);
  useEffect(() => () => urlSet.forEach((x) => URL.revokeObjectURL(x)), []);

  return urlSet;
}
