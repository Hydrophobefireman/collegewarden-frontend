import { css } from "catom";

export const paperInput = css({
  display: "block",
  width: "80%",
  fontSize: "1.2rem",
  padding: "5px",
  outline: "0",
  height: "30px",
  transition: "0.1s cubic-bezier(0.46, 1, 0.74, 1.07)",
  // fontWeight: 700,
  margin: "auto",
  color: "var(--current-text-color)",
  background: "var(--current-bg)",
  textAlign: "left",
  border: "2px solid",
  borderColor: "transparent",
  borderBottomColor: "var(--current-fg)",
  pseudo: {
    " + label": {
      background: "transparent",
      transform: "translate(0px, 1rem)",
      opacity: "0.8",
      fontWeight: 700,
      userSelect: "none",
      pointerEvents: "none",
      fontSize: "1.3rem",
      transition: "transform 0.2s linear",
      left: "10%",
      position: "absolute",
      top: "0",
    },
    ":focus + label, [data-should-focus='true'] + label": {
      background: "var(--current-bg)",
      transform: "translate(0, -.85rem) scale(0.75)",
      color: "var(--current-fg)",
    },
  },
});

export const errorCss = css({ color: "red !important" });

export const wrapperCSS = css({ position: "relative" });

export const iconCSS = css({
  position: "absolute",
  transform: "translate(-20%, 50%)",
});
