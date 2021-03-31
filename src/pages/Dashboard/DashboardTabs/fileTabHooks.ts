import { useFileDrop } from "@/customHooks";
import { migrateFiles } from "@/jsonMigrations";
import { FileData } from "@/state";
import { getFileList, upload } from "@/util/fileUtil";
import {
  RefType,
  useEffect,
  useRef,
  useState,
} from "@hydrophobefireman/ui-lib";
import { searchFiles, SetMessage, wrapUpload } from "./util";

export function useFilteredFiles(
  unfilteredFiles: FileData[],
  search: string,
  password: string
) {
  const [files, setFiles] = useState<FileData[]>(null);

  useEffect(() => {
    setFiles(searchFiles(search, password, unfilteredFiles));
  }, [unfilteredFiles, search, password]);
  return files;
}

export function useFileDropHandler(password: string, setMessage: SetMessage) {
  const [droppedFiles, reset] = useFileDrop();

  useEffect(() => {
    if (!droppedFiles || !password) return;
    wrapUpload(upload(password, droppedFiles), setMessage);
    reset();
  }, [droppedFiles, password]);
}
interface UseFileListProps {
  setMessage: SetMessage;
  abort: RefType<boolean>;
  files: FileData[];
  setFiles: (x: FileData[]) => void;
  password: string;
}
export function useMigratedFileList({
  abort,
  files,
  password,
  setFiles,
  setMessage,
}: UseFileListProps) {
  const didMigrate = useRef(false);
  useEffect(() => {
    getFileList(setMessage);
    return () => (abort.current = true);
  }, []);
  useEffect(() => {
    if (files && password && !didMigrate.current) {
      const m = migrateFiles(files, password);
      //   console.log(m);
      setFiles(m);
      didMigrate.current = true;
      return;
    }
    // reset didMigrate.current, to let us re migrate any new files that may be added
    didMigrate.current = false;
  }, [password, files]);
}
