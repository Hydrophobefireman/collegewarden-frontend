import { useEffect, useRef } from "@hydrophobefireman/ui-lib";
import { css } from "catom";

import { actionButton, actionButtonWrapper, bold } from "../../styles";
import { ModalLayout } from "../Layout/ModalLayout";
import { StageProps } from "./util";

export function Stage0({ data, close, next: next, name }: StageProps) {
  const alreadyAdded = !!data && data.some((x) => x.collegeName === name);
  const uniJSX = (
    <b class={[bold, css({ color: "var(--current-fg)" })]}>{name}</b>
  );
  const ref = useRef<HTMLButtonElement>();
  useEffect(() => {
    ref.current && ref.current.focus();
  }, []);
  return (
    <ModalLayout close={close}>
      {alreadyAdded ? (
        <>{uniJSX} has already been added to your colleges</>
      ) : (
        <div>
          {"do you want to add "} {uniJSX}
          {" to your colleges?"}
        </div>
      )}
      <div class={actionButtonWrapper}>
        <button class={actionButton} onClick={close}>
          cancel
        </button>
        <button
          ref={ref}
          class={[actionButton, alreadyAdded ? css({ opacity: "0.7" }) : null]}
          onClick={() => next()}
          disabled={alreadyAdded}
        >
          add
        </button>
      </div>
    </ModalLayout>
  );
}
