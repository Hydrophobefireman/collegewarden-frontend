import { AnimatedInput } from "@/components/AnimatedInput";
import { FileData } from "@/state";
import {
  getDecryptedFileProp,
  getFileName,
  getFileType,
} from "@/util/fileUtil";
import { RefType, useState } from "@hydrophobefireman/ui-lib";
import { css } from "catom";
import { FileList } from "./FileList";
import { useFilteredFiles } from "./fileTabHooks";
import { SetMessage, isNote } from "./util";

export function FileTabRenderer({
  unfilteredFiles,
  password,
  setMessage,
  abort,
}: {
  unfilteredFiles: FileData[];
  password: string;
  setMessage: SetMessage;
  abort: RefType<boolean>;
}) {
  //   const [sortMode, setSortMode] = useState<"name" | "date">("name");
  //   const currentFolder = useState(".");
  const [search, setSearch] = useState("");
  const filteredFiles =
    useFilteredFiles(unfilteredFiles, search, password) || [];

  const sorted = filteredFiles.sort((a, b) => compareFunction(a, b, password));
  return (
    <section>
      <div class={css({ marginTop: "1rem", marginBottom: "1rem" })}>
        <AnimatedInput labelText="search" value={search} onInput={setSearch} />
      </div>
      <FileList
        abort={abort}
        sortedFiles={sorted}
        password={password}
        setMessage={setMessage}
        unfilteredFiles={unfilteredFiles}
      />
    </section>
  );
}

function compareFunction(
  a: FileData,
  b: FileData,
  password: string
  //   mode: "name" | "date"
) {
  const ts1 = +getDecryptedFileProp(a, password, "ts");
  const ts2 = +getDecryptedFileProp(b, password, "ts");

  const name1 = getFileName(a, password).toLowerCase();
  const name2 = getFileName(b, password).toLowerCase();

  const type1 = getFileType(a, password);
  const type2 = getFileType(b, password);

  const is1Note = isNote(type1);
  const is2Note = isNote(type2);
  if (is1Note && !is2Note) return -1;
  if (is2Note && !is1Note) return 1;

  return name1 > name2 ? 1 : name2 > name1 ? 1 : ts2 - ts1;
}
