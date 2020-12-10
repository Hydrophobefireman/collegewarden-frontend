import { css } from "catom";
import { previewThemeCSS } from "./ThemeSwitcher.styles";

interface SwitchButtonsProps {
  size: string | number;

  bgColor: string;
  fgColor: string;
}
export function SwitchButtons({ size, bgColor, fgColor }: SwitchButtonsProps) {
  return (
    <svg
      fill="none"
      viewBox="0 0 200 200"
      height={size}
      width={size}
      class={css({
        cursor: "pointer",
        boxShadow: "var(--box-shadow)",
        borderRadius: "50px",
      })}
    >
      <path
        fill={fgColor}
        d="M0 100C0 44.772 44.772 0 100 0v200C44.772 200 0 155.228 0 100z"
      />
      <path
        fill={bgColor}
        d="M200 100c0 55.228-44.772 100-100 100V0c55.228 0 100 44.772 100 100z"
      />
    </svg>
  );
}
