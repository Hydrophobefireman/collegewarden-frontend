import { actionButton, bold } from "../../../styles";

import { css } from "catom";

export const tabContainer = css({ marginTop: "2rem" });

export const filterRow = css({ marginTop: "5px" });

export const searchFilterWrap = css({
  display: "flex",
  alignItems: "flex-end",
});

export const inputWrapper = css({ flex: 1 });

export const filterButton = css({
  background: "none",
  border: "none",
  display: "inline-flex",
  cursor: "pointer",
});

export const manualCollegeAddContainer = css({
  padding: "10px",
  borderTop: "2px solid var(--current-alpha)",
  borderBottom: "2px solid var(--current-alpha)",
  margin: "auto",
  marginTop: "10px",
  textAlign: "center",
});

export const manualAddCollegeButton = [
  actionButton,
  css({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  }),
];

export const filtersUsed = [css({ fontSize: "1.2rem" }), bold];

export const filterOption = [bold, css({ color: "var(--current-fg)" })];
