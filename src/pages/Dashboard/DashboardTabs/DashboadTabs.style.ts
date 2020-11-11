import { css } from "catom";

export const searchResultBox = css({
  boxShadow: "var(--box-shadow)",
  borderRadius: "10px",
  padding: "2rem",
  marginTop: "1rem",
});

export const searchResultButton = css({
  display: "flex",
  transition: "0.3s linear",
  width: "100%",
  alignItems: "center",
  background: "var(--current-bg)",
  border: "none",
  color: "var(--current-text-color)",
  fontSize: "1.2rem",
  cursor: "pointer",
  padding: ".5rem",
  pseudo: {
    ">button": { opacity: 0 },
    ":hover>button": { opacity: 1 },
    ":focus>button": { opacity: 1 },
    ":hover": { boxShadow: "var(--box-shadow)" },
    ":focus": { boxShadow: "var(--box-shadow)" },
  },
});

export const searchResultTitle = css({
  marginLeft: "1rem",
  textAlign: "left",
  flex: 1,
});

export const addButton = css({
  background: "transparent",
  border: "none",
  cursor: "pointer",
});

export const viewMoreWrapper = css({
  display: "flex",
  flexDirection: "row",
  flex: 1,
  justifyContent: "flex-end",
  alignItems: "flex-end",
});

export const infoWrap = css({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  marginTop: "1rem",
});

export const collegeName = css({ marginLeft: "0.5rem" });

export const nameLogoWrap = css({
  display: "inline-block",
  borderRadius: "50%",
  cursor: "pointer",
});

export const uniName = css({
  fontWeight: "bold",
  fontSize: "1.3rem",
  display: "flex",
  alignItems: "center",
});

export const uniCard = css({
  maxWidth: "250px",
  padding: "2rem",
  borderRadius: "10px",
  margin: "1rem",
  boxShadow: "var(--box-shadow)",
  transition: "0.3s linear",
  display: "flex",
  flexDirection: "column",
});
export const fileCard = css({
  // maxWidth: "150px",
  padding: "2rem",
  borderRadius: "10px",
  margin: "1rem",
  boxShadow: "var(--box-shadow)",
  transition: "0.3s linear",
  display: "flex",
  flexDirection: "column",
  background: "transparent",
  border: "none",
  color: "var(--current-color)",
  fontSize: "1rem",
  wordBreak: "break-word",
  media: {
    "(max-width:500px)": {
      width: "80%",
    },
  },
  pseudo: {
    ":hover": { background: "var(--current-alpha)", cursor: "pointer" },
  },
});
export const cardWrapper = css({
  display: "flex",
  flexWrap: "wrap",
  flexDirection: "row",
  alignItems: "stretch",
  justifyContent: "center",
  marginTop: "1rem",
});

export const actionButtonOverride = {
  color: "var(--current-text-color)",
  border: "2px solid var(--current-fg)",
  borderRadius: "10px",
};
