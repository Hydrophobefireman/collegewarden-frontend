import { inlineContainer, notesArea } from "./UniEdit.styles";

interface NotesProps {
  name: string;
  setNotes(notes: string): void;
  notes: string;
}
export function Notes({ setNotes, name, notes }: NotesProps) {
  return (
    <div class={inlineContainer}>
      <div>notes</div>
      <div>
        <textarea
          class={notesArea}
          value={notes}
          onInput={(e) => {
            setNotes(e.currentTarget.value);
          }}
          placeholder={`any information related to ${name} you'd like to save`}
        />
      </div>
    </div>
  );
}
