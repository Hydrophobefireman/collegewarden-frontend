import {css} from "catom";
import {set} from "statedrive";

import {useEffect, useRef, useState} from "@hydrophobefireman/ui-lib";

import {decryptJson} from "../../crypto/decrypt";
import {FileData, fileAtom} from "../../state";
import {actionButton} from "../../styles";
import {
  deleteFile,
  evictWeakMapCache,
  getDecryptedFileProp,
  getFileList,
  getFileName,
  uploadNoteToServer,
} from "../../util/fileUtil";
import {guard} from "../../util/guard";
import {fileRoutes} from "../../util/http/api_routes";
import * as requests from "../../util/http/requests";
import {AnimatedInput} from "../AnimatedInput";
import {DeleteConfirmation} from "../DeleteConfirmation";
import {Form} from "../Form";
import {ModalLayout} from "../Layout/ModalLayout";
import {inlineContainer, notesArea} from "../UniEdit/UniEdit.styles";

interface NoteEditorProps {
  close(): void;
  data: FileData;
  list: FileData[];
  password: string;
  setMessage(e: {isError?: boolean; message: string}): void;
}
export function NoteEditor({
  close,
  data,
  list,
  password,
  setMessage,
}: NoteEditorProps) {
  const isNewNote = data == null;
  const getTitle = () => getFileName(data, password);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(data ? getTitle : "");
  const [notes, setNotes] = useState<string>(null);
  const preview = data ? getDecryptedFileProp(data, password, "preview") : "";
  const [del, setDel] = useState(false);
  const lastSavedNote = useRef<string>();
  useEffect(() => {
    if (!data) {
      return;
    }
    evictWeakMapCache(data);
    setTitle(getTitle);
  }, [data && data.file_enc_meta, data && data.file_id]);
  useEffect(() => {
    if (!data) {
      return;
    }
    setTitle(getTitle);
    const {result, controller, headers} = requests.getBinary(
      fileRoutes.download(data.file_id)
    );
    result.then(async (x) => {
      const h = await headers;
      if ("error" in x) {
        return setMessage({isError: true, message: x.error});
      }
      if (!guard(ArrayBuffer, x)) return;
      const buf = x as ArrayBuffer;
      const old = data.file_enc_meta;
      const curr = h.get("x-file-meta");

      let meta = old;
      // we're checking if somehow the note got updated (other device/tab), in that case
      // the encryption meta data would change and decrypt would throw
      // even with a valid key
      if (curr && old != curr) {
        meta = curr;
        // data.file_enc_meta = curr;
        set(fileAtom, (old) =>
          old.map((x) => {
            if (x.file_id === data.file_id) {
              x.file_enc_meta = curr;
            }
            return x;
          })
        );
      }
      decryptJson({encryptedBuf: buf, meta}, password).then((x) => {
        if (x.error) return setMessage({isError: true, message: x.error});
        const {note} = x;
        setNotes(note);
        lastSavedNote.current = note;
      });
    });
    return () => controller.abort();
  }, [data, password]);

  async function sendNotes() {
    if (loading) return;
    setLoading(true);
    setMessage({message: "Uploading note"});
    const res = await uploadNoteToServer({
      notes,
      password,
      title,
      url: data ? fileRoutes.edit(data.file_id) : fileRoutes.upload,
    });

    setLoading(false);
    setMessage({
      message: res.error || "upload successful",
      isError: !!res.error,
    });
    getFileList(setMessage);
    close();
  }
  function deleteNote() {
    deleteFile(data, list);
    close();
  }
  const intervalRef = useRef<any>();
  const [autosaveState, setAutoSaveState] = useState<
    "saving" | "idle" | "unsaved"
  >("idle");

  function handleAutoSave(v: string) {
    // if(isNewNote)return;
    console.log("Clearing timeout");
    clearTimeout(intervalRef.current);
    if (v === lastSavedNote.current) return console.log("Equal..ignore");
    intervalRef.current = setTimeout(async () => {
      setAutoSaveState("saving");
      const res = await uploadNoteToServer({
        notes: v,
        password,
        title,
        url: fileRoutes.edit(data.file_id),
      });
      lastSavedNote.current = v;
      if (res.error) {
        setAutoSaveState("unsaved");
      } else {
        setAutoSaveState("idle");
      }
    }, 1000);
  }
  if (del)
    return (
      <DeleteConfirmation
        name="this note"
        onCancel={() => setDel(false)}
        onDelete={deleteNote}
      />
    );
  return (
    <ModalLayout close={close}>
      {loading ? (
        <div>uploading....</div>
      ) : (
        <>
          <section>
            <div>
              <b
                class={css({
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                  color: "var(--current-color)",
                })}
              >
                notes
              </b>
            </div>
            <div class={css({marginTop: "2rem"})}>
              <Form>
                <AnimatedInput
                  labelText="note title"
                  onInput={setTitle}
                  value={title}
                />
                <div
                  class={[
                    css({
                      textAlign: "center",
                      fontSize: ".85rem",
                    }),
                    autosaveState === "idle" ? css({opacity: "0"}) : null,
                  ]}
                >
                  {autosaveState === "saving"
                    ? "Saving.."
                    : autosaveState === "unsaved"
                    ? "•"
                    : "Idle"}
                </div>
                <div class={inlineContainer}>
                  <textarea
                    value={
                      notes == null ? (preview ? preview + "...." : "") : notes
                    }
                    class={[notesArea, css({height: "50vh"})]}
                    onInput={(e) => {
                      const v = e.currentTarget.value;
                      setNotes(v);
                      if (isNewNote) return;
                      handleAutoSave(v);
                    }}
                  ></textarea>
                  <div>
                    <button class={actionButton} onClick={sendNotes}>
                      submit
                    </button>
                    {data && (
                      <button class={actionButton} onClick={() => setDel(true)}>
                        delete
                      </button>
                    )}
                  </div>
                </div>
              </Form>
            </div>
          </section>
        </>
      )}
    </ModalLayout>
  );
}
