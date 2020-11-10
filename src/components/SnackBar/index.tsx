import {
  useRef,
  useEffect,
  VNode,
  useCallback,
} from "@hydrophobefireman/ui-lib";
import { css } from "catom";

import * as styles from "../../styles";
import { ErrorIcon } from "../Icons/Error";
import { InfoIcon } from "../Icons/Info";
import { appPopopClose, modalInactive, modalPopup } from "./SnackBar.styles";

interface PopupProps {
  message: string | VNode;
  onClose(e?: MouseEvent): void;
  isError?: boolean;
}
export function SnackBar(props: PopupProps) {
  const { onClose, message, isError } = props;

  const buttonRef = useRef<HTMLButtonElement>();

  useEffect(() => buttonRef.current && buttonRef.current.focus(), [message]);

  const currentTargetOnly = useCallback(
    (e: MouseEvent) => {
      const { target, currentTarget } = e;
      if (target !== currentTarget) return;
      return onClose(e);
    },
    [onClose]
  );
  const active = !!message;
  return (
    <>
      {active && (
        <div
          class={styles.mask}
          style={{ opacity: 0.5 }}
          onClick={currentTargetOnly}
        ></div>
      )}
      <section
        class={[modalPopup, active ? "" : modalInactive]}
        data-open={`${active}`}
      >
        <span
          class={css({
            display: "flex",
            alignItems: "center",
            wordBreak: "break-word",
          })}
        >
          {isError ? <ErrorIcon /> : <InfoIcon />}
          <span class={css({ marginLeft: "1rem" })}>{message}</span>
        </span>
        <button
          ref={buttonRef}
          class={[appPopopClose, styles.hoverable]}
          onClick={onClose}
        >
          OK
        </button>
      </section>
    </>
  );
}
