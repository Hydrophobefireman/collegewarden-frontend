import { FileData, fileAtom, passwordData } from "@/state";

import { FileTabLoader } from "@/components/FileActions";
import { useRef } from "@hydrophobefireman/ui-lib";

import { TabProps } from "../types";

import { useSharedState, useSharedStateValue } from "statedrive";

import { useFileDropHandler, useMigratedFileList } from "./fileTabHooks";
import { FileTabRenderer } from "./FileTabRenderer";

export function Files({ setMessage }: TabProps) {
  const password = useSharedStateValue(passwordData);
  const abort = useRef(false);
  const [files, setFiles] = useSharedState<FileData[]>(fileAtom);

  useFileDropHandler(password, setMessage);
  useMigratedFileList({
    setMessage,
    abort,
    files: files,
    setFiles,
    password,
  });
  if (!password) return;
  if (files == null) return <FileTabLoader />;
  return (
    <FileTabRenderer
      password={password}
      unfilteredFiles={files}
      abort={abort}
      setMessage={setMessage}
    />
  );
}
