import {css} from "catom";

export const heading = css({fontSize: "3rem"});

export const center = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
});

export const cwHeading = css({
  fontWeight: "normal",
  marginTop: "15vh",
  marginBottom: "2rem",
});
export const bold = css({fontWeight: "bold"});
export const underlined = css({textDecoration: "underline"});

export const hoverable = css({
  pseudo: {
    ":not([disabled])": {
      cursor: "pointer",
      transition: "0.3s ease-in-out",
      transformStyle: "preserve-3d",
    },
    ":active:not([disabled])": {
      transform: "perspective(1px) scale(1.048) translateZ(0)",
    },
    ":focus:not([disabled])": {
      transform: "perspective(1px) scale(1.048) translateZ(0)",
    },
    ":hover:not([disabled])": {
      transform: "perspective(1px) scale(1.048) translateZ(0)",
    },
  },
});
export const mask = css({
  height: "100vh",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "var(--mask-color)",
  position: "fixed",
  width: "100vw",
  margin: "auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  zIndex: 5,
});

export const actionButton = css({
  display: "inline-flex",
  alignContent: "center",
  fontSize: "1.1rem",
  color: "var(--current-fg)",
  background: "transparent",
  border: "none",
  fontWeight: "bold",
  cursor: "pointer",
  marginLeft: "0.5rem",
  marginRight: "0.5rem",
  transition: "0.3s linear",
  pseudo: {
    ":hover": {background: "var(--current-alpha)"},
    ":focus": {background: "var(--current-alpha)"},
  },
});
export const actionButtonWrapper = css({
  marginTop: "1rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
});

const _modal = css({
  boxShadow: "var(--box-shadow)",
  background: "var(--current-bg)",
  borderRadius: "10px",
  animation: "scale_anim 0.1s linear",
  animationFillMode: "forwards",
  overflowY: "auto",
  padding: "2rem",
});
export const modal = [
  _modal,
  css({
    width: "70%",
    maxWidth: "450px",
  }),
].join(" ");

export const modalExpanded = [
  _modal,
  css({
    width: "85%",
  }),
].join(" ");
