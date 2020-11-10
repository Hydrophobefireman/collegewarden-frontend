import { css } from "catom";

export const submitButton = css({
  padding: ".5rem",
  paddingLeft: "1rem",
  paddingRight: "1rem",
  width: "25%",
  marginTop: "1rem",
  fontWeight: "bold",
  border: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
});

export const colorText = css({
  fontSize: "1.8rem",
  color: "var(--current-fg)",
});

export const formContainer = css({
  maxWidth: "500px",
  width: "70vw",
  padding: "2rem",
  boxShadow: "var(--box-shadow)",
  borderRadius: "10px",
  marginTop: "20px",
});

export const formSection = css({ marginTop: "10vh" });

export const buttonWrapper = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingLeft: "10%",
  paddingRight: "10%",
});

export const altLinkCSS = css({
  fontWeight: "bold",
  fontSize: "1.2rem",
  color: "var(--current-fg)",
});

export const submittedButtonCSS = css({
  background: "var(--current-bg)",
  color: "var(--current-fg)",
  border: "1px solid var(--current-text-color)",
});
export const submitButtonActionCss = css({
  background: "var(--current-fg)",
  color: "var(--current-bg)",
});
