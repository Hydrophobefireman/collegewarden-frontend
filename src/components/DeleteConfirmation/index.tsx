import { useEffect, useRef } from "@hydrophobefireman/ui-lib";
import { css } from "catom";
import { actionButton, bold } from "../../styles";
import { ModalLayout } from "../Layout/ModalLayout";

interface DelConfProps {
  name: string;
  onCancel(): void;
  onDelete(): void;
}

export function DeleteConfirmation({ name, onCancel, onDelete }: DelConfProps) {
  const ref = useRef<HTMLButtonElement>();
  useEffect(() => {
    const { current } = ref;
    current && current.focus();
  });
  return (
    <ModalLayout close={onCancel}>
      <div>
        are you sure you want to delete{" "}
        <b class={[bold, css({ color: "var(--current-fg)" })]}>{name}</b>?
      </div>
      <div class={css({ textAlign: "right" })}>
        <button class={actionButton} onClick={onCancel}>
          cancel
        </button>
        <button class={actionButton} onClick={onDelete} ref={ref}>
          delete
        </button>
      </div>
    </ModalLayout>
  );
}
