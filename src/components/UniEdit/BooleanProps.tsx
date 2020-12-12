import { activeAction, inlineContainer } from "./UniEdit.styles";

import { actionButton } from "../../styles";

interface BoolProps {
  value: boolean;
  setValue(a: boolean): void;
  text: string;
}
export function BooleanInfo({ value, setValue, text }: BoolProps) {
  function updateApplied(e: JSX.TargetedMouseEvent<HTMLButtonElement>) {
    setValue(e.currentTarget.dataset.value !== "false");
  }
  return (
    <div class={inlineContainer}>
      <div>{text}</div>
      <div>
        <button
          type="button"
          data-value={true}
          class={actionButton}
          style={value === true ? activeAction : ""}
          onClick={updateApplied}
        >
          yes
        </button>
        <button
          type="button"
          data-value={"false"}
          class={actionButton}
          style={value === false ? activeAction : ""}
          onClick={updateApplied}
        >
          no
        </button>
      </div>
    </div>
  );
}
