import { useFileDrop } from "@/customHooks";
import { colleges, passwordData } from "@/state";

import { redirect, useEffect, useState } from "@hydrophobefireman/ui-lib";
import { css } from "catom";
import { useSharedStateValue } from "statedrive";
import { UploadFiles } from "@/components/FileActions";

import { getDataFromUser } from "@/util/bufUtil";
import { Importer } from "./Importer";
import { ImportFile } from "./types";

export default function Import() {
  const [file, setFile] = useDragAndDrop();
  const password = useSharedStateValue(passwordData);

  useEffect(() => !password && redirect("/dashboard?_ref=import"), [password]);
  return (
    <section>
      <h2>Interactive Importer</h2>
      <div
        class={css({ margin: "auto", textAlign: "center", marginTop: "2rem" })}
      >
        {!file ? (
          <>
            <div>
              Upload your files or if you prefer drag and drop them here
            </div>
            <div>
              Note: Files should either be a CSV or a JSON Array which contains
              the data in a list like
              <div>
                <code class={css({ fontFamily: "monospace" })}>
                  [ ["College Name","portal url"]... ]
                </code>
              </div>
            </div>
            <div class={css({ marginTop: "1rem" })}>
              <UploadFiles
                onClick={() =>
                  getDataFromUser(null, "string").then((x) =>
                    setFile(x[0] as any)
                  )
                }
              />
            </div>
          </>
        ) : (
          <Importer file={file} reset={() => setFile(null)} />
        )}
      </div>
    </section>
  );
}

function useDragAndDrop() {
  const [file, setFile] = useState<ImportFile>(null);
  const [droppedFiles, resetDroppedFiles] = useFileDrop();
  useEffect(() => {
    if (!droppedFiles) return;
    getDataFromUser(droppedFiles, "string").then((x) => setFile(x[0] as any));
    resetDroppedFiles();
  }, [droppedFiles]);
  return [file, setFile] as [ImportFile, any];
}
