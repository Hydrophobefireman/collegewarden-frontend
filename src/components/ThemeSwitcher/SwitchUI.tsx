import { SwitchButtons } from "./SwitchButtons";
import { TOTAL_THEMES } from "./util";
import { css } from "catom";
import { hoverable } from "../../styles";
import { themeButtonCss } from "./ThemeSwitcher.styles";

interface SwitchUIProps {
  setTheme(theme: string): unknown;
  enabled: boolean;
}
export function SwitchUI({ setTheme, enabled }: SwitchUIProps) {
  function changeTheme(e: MouseEvent) {
    const button = e.currentTarget as HTMLButtonElement;
    const index = button.dataset.index;
    setTheme(index);
  }
  return (
    <section
      style={{ transform: enabled ? "" : "translateX(200vw)" }}
      class={css({
        display: "flex",
        position: "fixed",
        right: "15px",
        bottom: "100px",
        transition: "0.3s linear",
        maxWidth: "80vw",
        flexWrap: "wrap",
        zIndex: 6,
      })}
    >
      {Array.from({ length: TOTAL_THEMES }).map((_, i) => (
        <div
          class={[
            css({
              display: "inline-flex",
              margin: "1rem",
              media: { "(min-width:500px)": { marginBottom: "0px" } },
            }),
            hoverable,
          ]}
        >
          <button
            data-index={i}
            class={themeButtonCss}
            onClick={changeTheme}
            aria-label={"Switch to theme " + i}
          >
            <SwitchButtons
              size="1.75rem"
              bgColor={`var(--theme-${i}-bg)`}
              fgColor={`var(--theme-${i}-fg)`}
            />
          </button>
          {/* <span>Theme {i + 1}</span> */}
        </div>
      ))}
    </section>
  );
}
