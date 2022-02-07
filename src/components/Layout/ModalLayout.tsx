import {css} from "catom";

import {useViewportSize} from "@/customHooks";
import {useState} from "@hydrophobefireman/ui-lib";

import {actionButton, mask, modal, modalExpanded} from "../../styles";

const closeWrap = css({
  position: "absolute",
  right: "0",
  top: "3px",
});
function ExpandStateButton({
  expanded,
  ...props
}: JSX.HTMLAttributes<HTMLButtonElement> & {expanded?: boolean}) {
  const [_, width] = useViewportSize();
  if (width < 600) return;
  return (
    <button {...props} class={[actionButton]}>
      <svg
        class=""
        fill="none"
        viewBox="0 0 24 24"
        stroke="var(--current-fg)"
        height="2rem"
        width="2rem"
      >
        {expanded ? (
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M18 12H6"
          ></path>
        ) : (
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
          ></path>
        )}
      </svg>
    </button>
  );
}
export function ModalLayout(props?: {
  close: (e?: MouseEvent) => void | null;
  children?: any;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <section
      class={mask}
      onClick={(e) =>
        props.close && e.target === e.currentTarget && props.close()
      }
    >
      <div class={expanded ? modalExpanded : modal}>
        <div
          class={expanded ? css({maxHeight: "95vh"}) : css({maxHeight: "80vh"})}
        >
          <div class={closeWrap}>
            <ExpandStateButton
              expanded={expanded}
              onClick={() => setExpanded(!expanded)}
            />
            {props.close && (
              <button
                onClick={props.close}
                class={actionButton}
                style={{fontSize: "2rem", fontWeight: "normal"}}
              >
                <svg
                  class=""
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="var(--current-fg)"
                  height="2rem"
                  width="2rem"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            )}
          </div>
          {props.children}
        </div>
      </div>
    </section>
  );
}
