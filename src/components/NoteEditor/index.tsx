import * as requests from "../../util/http/requests";

import {
  closeButton,
  inlineContainer,
  notesArea,
} from "../UniEdit/UniEdit.styles";
import {
  deleteFile,
  getDecryptedFileProp,
  getFileList,
} from "../FileInfo/FileUtil";
import { useEffect, useState } from "@hydrophobefireman/ui-lib";

import { AnimatedInput } from "../AnimatedInput";
import { DeleteConfirmation } from "../DeleteConfirmation";
import { FileData } from "../../state";
import { Form } from "../Form";
import { ModalLayout } from "../Layout/ModalLayout";
import { actionButton } from "../../styles";
import { css } from "catom";
import { decryptJson } from "../../crypto/decrypt";
import { enc } from "../../crypto/util";
import { encryptJson } from "../../crypto/encrypt";
import { fileRoutes } from "../../util/http/api_routes";
import { guard } from "../../util/guard";

interface NoteEditorProps {
  close(): void;
  data: FileData;
  list: FileData[];
  password: string;
  setMessage(e: { isError?: boolean; message: string }): void;
}
export function NoteEditor({
  close,
  data,
  list,
  password,
  setMessage,
}: NoteEditorProps) {
  const getTitle = () => getDecryptedFileProp(data, password, "title");
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(data ? getTitle : "");
  const [notes, setNotes] = useState<string>(null);
  const preview = data ? getDecryptedFileProp(data, password, "preview") : "";
  const [del, setDel] = useState(false);
  useEffect(() => {
    if (!data) {
      return;
    }
    setTitle(getTitle);
    const { result, controller } = requests.getBinary(
      fileRoutes.download(data.file_id)
    );
    result.then((x) => {
      if ("error" in x) {
        return setMessage({ isError: true, message: x.error });
      }
      if (!guard(ArrayBuffer, x)) return;
      const buf = x as ArrayBuffer;
      decryptJson(
        { encryptedBuf: buf, meta: data.file_enc_meta },
        password
      ).then((x) => {
        if (x.error) return setMessage({ isError: true, message: x.error });
        const { note } = x;
        setTitle(title);
        setNotes(note);
      });
    });
    return () => controller.abort();
  }, [data, password]);

  async function sendNotes() {
    if (loading) return;
    setLoading(true);
    setMessage({ message: "Uploading note" });
    const preview = (notes || "").substr(0, 25);
    const func = enc(password);
    const encData = await encryptJson({ note: notes }, password, {
      title: func(title),
      preview: func(preview),
      ts: func(+new Date() + ""),
      type: func("x-collegewarden/note"),
    });
    const { encryptedBuf, meta } = encData;
    const { result } = requests.postBinary(
      data ? fileRoutes.edit(data.file_id) : fileRoutes.upload,
      encryptedBuf,
      {
        "x-cw-iv": meta,
        "x-cw-data-type": "encrypted_blob",
      }
    );
    const res = await result;
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
          <button
            onClick={close}
            class={[actionButton, closeButton]}
            style={{ fontSize: "2rem", fontWeight: "normal" }}
          >
            ✖
          </button>
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
            <div class={css({ marginTop: "2rem" })}>
              <Form>
                <AnimatedInput
                  labelText="note title"
                  onInput={setTitle}
                  value={title}
                />
                <div class={inlineContainer}>
                  <textarea
                    value={
                      notes == null ? (preview ? preview + "...." : "") : notes
                    }
                    class={[notesArea, css({ height: "40vh" })]}
                    onInput={(e) => setNotes(e.currentTarget.value)}
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
