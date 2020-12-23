// TODO restructure
import { FileData, files, passwordData } from "../../../state";
import {
  FileEntry,
  deleteFile,
  getDecryptedFileProp,
  getFileList,
  getFileName,
  getFileType,
  upload,
} from "../../../components/FileInfo/FileUtil";
import {
  FileTabLoader,
  NoFilesFound,
  UploadFiles,
  UploadNotes,
} from "./FileTabActions";
import {
  RefType,
  useEffect,
  useRef,
  useState,
} from "@hydrophobefireman/ui-lib";
import { openFileExternally, searchFiles, wrapUpload } from "./util";

import { AnimatedInput } from "../../../components/AnimatedInput";
import { DeleteConfirmation } from "../../../components/DeleteConfirmation";
import { FileInfo } from "../../../components/FileInfo";
import { Note } from "../../../components/FileInfo/Note";
import { NoteEditor } from "../../../components/NoteEditor";
import { TabProps } from "../types";
import { bold } from "../../../styles";
import { cardWrapper } from "./DashboadTabs.style";
import { css } from "catom";
import { useFileDrop } from "../../../customHooks";
import { useSharedStateValue } from "statedrive";

export function Files({ setMessage }: TabProps) {
  const password = useSharedStateValue(passwordData);
  const abort = useRef(false);
  const unFilteredUnsortedfilesAndNotes = useSharedStateValue<FileData[]>(
    files
  );
  const [sortedFileList, setList] = useState<FileData[]>(null);
  const [sortedNoteList, setNoteList] = useState<FileData[]>(null);
  const [search, setSearch] = useState("");
  const [filteredUnsortedFilesAndNotes, setFilteredData] = useState<FileData[]>(
    null
  );
  const [filesDropped, setDroppedFiles] = useFileDrop();
  useEffect(() => {
    if (!filesDropped || !password) return;
    wrapUpload(upload(password, filesDropped), setMessage);
    setDroppedFiles(null);
  }, [filesDropped, password]);

  useEffect(() => {
    return searchFiles(
      search,
      password,
      unFilteredUnsortedfilesAndNotes,
      setFilteredData
    );
  }, [search, unFilteredUnsortedfilesAndNotes, password]);

  useEffect(() => {
    getFileList(setMessage);
    return () => (abort.current = true);
  }, []);
  useEffect(() => {
    if (!password || !filteredUnsortedFilesAndNotes) return;
    const unsortedFiles: FileData[] = [];
    const unsortedNotes: FileData[] = [];
    filteredUnsortedFilesAndNotes.forEach((x) => {
      const t = getFileType(x, password);

      if (t === "x-collegewarden/note") {
        unsortedNotes.push(x);
      } else unsortedFiles.push(x);
    });
    setNoteList(
      unsortedNotes.sort((a, b) => {
        const ts1 = +getDecryptedFileProp(a, password, "ts");
        const ts2 = +getDecryptedFileProp(b, password, "ts");
        return ts1 - ts2;
      })
    );
    setList(
      unsortedFiles.sort((a, b) => {
        const name1 = getFileName(a, password).toLowerCase();
        const name2 = getFileName(b, password).toLowerCase();
        if (name1 === name2) return 0;
        return name1 > name2 ? 1 : -1;
      })
    );
  }, [filteredUnsortedFilesAndNotes, password]);

  if (
    password &&
    sortedNoteList !=
      sortedFileList /** both will only be equal if they're both null */
  ) {
    return (
      <section>
        <div class={css({ marginTop: "1rem", marginBottom: "1rem" })}>
          <AnimatedInput
            labelText="search"
            value={search}
            onInput={setSearch}
          />
        </div>
        <FilesList
          abort={abort}
          filteredUnsortedFilesAndNotes={filteredUnsortedFilesAndNotes}
          password={password}
          setMessage={setMessage}
          sortedFileList={sortedFileList}
          sortedNoteList={sortedNoteList}
          unFilteredUnsortedfilesAndNotes={unFilteredUnsortedfilesAndNotes}
        />
      </section>
    );
  }
  if (unFilteredUnsortedfilesAndNotes == null) return <FileTabLoader />;
}

interface FilesListProps extends TabProps {
  password: string;
  unFilteredUnsortedfilesAndNotes: FileData[];
  filteredUnsortedFilesAndNotes: FileData[];
  sortedNoteList: FileData[];
  sortedFileList: FileData[];
  abort: RefType<boolean>;
}

function FilesList({
  setMessage,
  password,
  unFilteredUnsortedfilesAndNotes,
  filteredUnsortedFilesAndNotes,
  sortedFileList,
  sortedNoteList,
  abort,
}: FilesListProps): any {
  const [openFile, setOpen] = useState<FileData>(null);
  const [shouldDel, setDel] = useState<boolean>(false);
  const [downloadingState, setDownloading] = useState<string>(null);
  const [notes, setNotes] = useState<FileData | boolean>(null);

  if (shouldDel)
    return (
      <DeleteConfirmation
        name={getFileName(openFile, password)}
        onCancel={() => setDel(null)}
        onDelete={() => {
          deleteFile(openFile, unFilteredUnsortedfilesAndNotes);
          setOpen(null);
          setDel(null);
        }}
      />
    );
  const notesEl = notes && (
    <NoteEditor
      close={() => setNotes(null)}
      list={filteredUnsortedFilesAndNotes}
      data={typeof notes === "boolean" ? null : notes}
      password={password}
      setMessage={setMessage}
    />
  );
  if (
    unFilteredUnsortedfilesAndNotes &&
    unFilteredUnsortedfilesAndNotes.length == 0
  ) {
    return (
      <>
        <NoFilesFound
          password={password}
          wrapUpload={(u) => wrapUpload(u, setMessage)}
          setNotes={setNotes}
        />
        {notesEl}
      </>
    );
  }

  return (
    <>
      {notesEl}
      {openFile && (
        <FileInfo
          downloadingState={downloadingState}
          openFile={openFile}
          openFileExternally={() =>
            openFileExternally({
              abort,
              openFile,
              password,
              setDownloading,
              setMessage,
              setOpen,
            })
          }
          password={password}
          setDelete={() => setDel(true)}
          setOpen={setOpen}
        />
      )}
      <div class={css({ marginTop: "2rem", textAlign: "right" })}>
        <UploadFiles onClick={() => wrapUpload(upload(password), setMessage)} />
        <UploadNotes onClick={() => setNotes(true)} />
      </div>
      <div>
        <div>
          <b
            class={[
              bold,
              css({ color: "var(--current-fg)", fontSize: "2rem" }),
            ]}
          >
            notes
          </b>
        </div>
        {truthyArr(sortedNoteList) ? (
          <div class={cardWrapper}>
            {sortedNoteList.map((x) => (
              <Note
                data={x}
                open={() => {
                  setNotes(x);
                }}
                password={password}
              />
            ))}
          </div>
        ) : (
          <div>No notes found</div>
        )}
      </div>
      <div>
        <div>
          <b
            class={[
              bold,
              css({ color: "var(--current-fg)", fontSize: "2rem" }),
            ]}
          >
            files
          </b>
        </div>
        {truthyArr(sortedFileList) ? (
          <div class={cardWrapper}>
            {sortedFileList.map((x) => (
              <FileEntry
                data={x}
                password={password}
                open={(x) => setOpen(x)}
              />
            ))}
          </div>
        ) : (
          <div>no files found</div>
        )}
      </div>
    </>
  );
}

const truthyArr = (x: any[]) => x && x.length > 0;
