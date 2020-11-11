import { css } from "catom";
import { actionButton, bold } from "../../styles";

export const activeAction = {
  color: "var(--current-bg)",
  background: "var(--current-fg)",
};

export const marginTop = css({ marginTop: "1rem" });

export const inlineContainer = [
  marginTop,
  css({
    marginLeft: "10%",
    flexDirection: "row",
    media: { "(max-width:500px)": { flexDirection: "column" } },
  }),
];
export const notesArea = css({
  width: "80%",
  outline: "none",
  minHeight: "100px",
  border: "2px solid var(--current-fg)",
  background: "var(--current-bg)",
  marginTop: "1rem",
  borderRadius: "10px",
  padding: ".5rem",
  color: "var(--current-text-color)",
  textTransform: "none",
});

export const modalCollegeName = [
  bold,
  css({
    color: "var(--current-fg)",
    fontSize: "1.5rem",
    // display: "flex",
    // alignItems: "center",
    // justifyContent: "space-between",
  }),
];

export const modalSection = css({ marginTop: "1rem", fontWeight: "normal" });
export const modalActionButton = [
  actionButton,
  css({
    display: "inline-flex",
    alignItems: "center",
    border: "2px solid var(--current-fg)",
    borderRadius: "10px",
    paddingLeft: "5px",
    paddingRight: "5px",
  }),
];

export const modalActionText = css({ marginLeft: "0.5rem" });

export const closeButton = css({
  position: "absolute",
  right: "0",
  top: "0",
});
