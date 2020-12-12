import { bold } from "../../../styles";
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

export const collegeName = css({
  marginLeft: "0.5rem",
  wordBreak: "break-word",
});

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
  width: "250px",
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
  width: "200px",
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
  textAlign: "left",
  fontSize: "1rem",
  wordBreak: "break-word",
  justifyContent: "center",
  cursor: "pointer",
  media: {
    "(max-width:500px)": {
      width: "80%",
    },
  },
  pseudo: {
    ":hover": { background: "var(--current-alpha)" },
    ":focus": { background: "var(--current-alpha)" },
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

export const clgHeading = [
  bold,
  css({
    marginTop: "10px",
    fontSize: "2rem",
    marginLeft: "1rem",
    textDecoration: "underline",
  }),
];

export const acceptedCss = `${clgHeading} ${css({ color: "#00e400" })}`;

export const appliedCss = `${clgHeading} ${css({
  color: "var(--current-fg)",
})}`;
