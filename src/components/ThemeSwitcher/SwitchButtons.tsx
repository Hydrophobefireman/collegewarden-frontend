import { css } from "catom";
import { previewThemeCSS } from "./ThemeSwitcher.styles";

interface SwitchButtonsProps {
  size: number;
  units: string;
  bgColor: string;
  fgColor: string;
}
export function SwitchButtons({
  size,
  units,
  bgColor,
  fgColor,
}: SwitchButtonsProps) {
  const style = {
    height: size + units,
    width: size + units,
    cursor: "pointer",
  };
  return (
    <>
      <div
        style={{
          ...style,
          clip: `rect(0rem ${size / 2}${units} ${size}${units} 0rem)`,
          background: fgColor,
        }}
        class={[previewThemeCSS, css({ zIndex: 10 })]}
      ></div>
      <div
        style={{ ...style, background: bgColor }}
        class={[previewThemeCSS]}
      ></div>
    </>
  );
}
