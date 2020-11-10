import { css } from "catom";

export const landingNavLink = css({
  flex: 1,
  border: "2px solid var(--current-fg)",
  borderRadius: "5px",
  padding: ".5rem",
  marginLeft: "1rem",
  marginRight: "1rem",
  marginTop: "0.5rem",
  textDecoration: "none",
  textAlign: "center",
  transition: "0.3s linear",
  pseudo: {
    ":hover": {
      background: "rgb(29 29 29 / 25%)",
      color: "var(--current-fg)",
      boxShadow: "var(--box-shadow)",
    },
  },
});

export const mainAction = css({
  background: "var(--current-fg)",
  color: "var(--current-bg)",
});
export const register = css({
  color: "var(--current-fg)",
  background: "var(--current-bg)",
  //   pseudo: { ":hover": { background: "rgb(167 167 167)" } },
});

export const landingLinkFlex = css({
  display: "flex",
  width: "50%",
  marginTop: "2rem",
  media: { "(max-width:500px)": { flexDirection: "column" } },
});
