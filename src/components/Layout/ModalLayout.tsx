import { actionButton, mask, modal } from "../../styles";

import { css } from "catom";

const closeButton = css({
  position: "absolute",
  right: "0",
  top: "0",
});

export function ModalLayout(props?: {
  close: (e?: MouseEvent) => void | null;
  children?: any;
}) {
  return (
    <section
      class={mask}
      onClick={(e) =>
        props.close && e.target === e.currentTarget && props.close()
      }
    >
      <div class={modal}>
        <div class={css({ maxHeight: "80vh" })}>
          {props.close && (
            <button
              onClick={props.close}
              class={[actionButton, closeButton]}
              style={{ fontSize: "2rem", fontWeight: "normal" }}
            >
              ✖
            </button>
          )}
          {props.children}
        </div>
      </div>
    </section>
  );
}
