import { css } from "catom";
export const dashboardLink = css({
  display: "inline-flex",
  alignItems: "center",
  fontSize: "1.2rem",
  color: "var(--current-text-color)",
  border: "2px solid var(--current-fg)",
  padding: "10px",
  borderRadius: "50px",
  marginTop: ".8rem",
});

export const dashboardNav = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-around",
  flexWrap: "wrap",
});

export const dashboardDataSection = css({ marginTop: "1rem" });
