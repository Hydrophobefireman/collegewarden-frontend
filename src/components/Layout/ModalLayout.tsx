import { css } from "catom";
import { mask, modal } from "../../styles";

export function ModalLayout(props?: {
  close?(e?: MouseEvent): void;
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
        <div class={css({ maxHeight: "80vh" })}>{props.children}</div>
      </div>
    </section>
  );
}
