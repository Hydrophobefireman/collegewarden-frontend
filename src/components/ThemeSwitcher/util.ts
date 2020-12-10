import { contrast } from "../../util/contrastCalculator";
import { getVariableValue } from "../../util/cssVar";

function getThemeCount() {
  const style = getComputedStyle(document.documentElement);
  let count = 0;
  while (style.getPropertyValue(`--theme-${count}-bg`)) {
    count++;
  }
  return count;
}

export const TOTAL_THEMES = getThemeCount();

export function set(k: string, v: string | number) {
  localStorage.setItem(k, v + "");
}

export function get(k: string, def?: string | number): string {
  return localStorage.getItem(k) || def + "";
}

export function handleThemeChange(theme: string): void {
  set("theme", theme);
  const doc = document.documentElement;
  doc.style.setProperty("--current-bg", `var(--theme-${theme}-bg)`);
  doc.style.setProperty("--current-fg", `var(--theme-${theme}-fg)`);
  doc.style.setProperty("--current-alpha", `var(--theme-${theme}-alpha)`);
  const computed = getComputedStyle(doc);
  const bg = getVariableValue(`--theme-${theme}-bg`, computed);
  const cont1 = contrast(bg, getVariableValue("--light-theme-color", computed));
  const cont2 = contrast(bg, getVariableValue("--dark-theme-color", computed));
  let attr: string;
  if (cont1 > cont2) {
    attr = "light";
  } else {
    attr = "dark";
  }
  doc.setAttribute("data-theme", attr);
}
