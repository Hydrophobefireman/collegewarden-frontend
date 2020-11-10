import { get, handleThemeChange } from "./util";
import { hoverable, mask } from "../../styles";
import { useEffect, useState } from "@hydrophobefireman/ui-lib";

import { SwitchButtons } from "./SwitchButtons";
import { SwitchUI } from "./SwitchUI";
import { css } from "catom";
import { themeButtonCss } from "./ThemeSwitcher.styles";

interface ThemeSwitcherProps {
  size?: number;
  units?: string;
}

export function ThemeSwitcher({
  size = 2.5,
  units = "rem",
}: ThemeSwitcherProps) {
  const style = { height: size + units, width: size + units };
  const [theme, setTheme] = useState(() => get("theme", "0"));
  const [isEnabled, setEnabled] = useState(false);
  useEffect(() => {
    handleThemeChange(theme);
  }, [theme]);
  return (
    <section>
      {isEnabled && (
        <div
          class={mask}
          onClick={(e) => e.currentTarget === e.target && setEnabled(false)}
        ></div>
      )}
      <SwitchUI setTheme={setTheme} enabled={isEnabled} />
      <div
        class={css({
          position: "fixed",
          bottom: "10px",
          right: "10px",
          zIndex: 6,
        })}
      >
        <button
          aria-label="Change theme"
          title="Change theme"
          onClick={() => setEnabled(!isEnabled)}
          style={style}
          class={[
            themeButtonCss,
            css({ transform: "rotate(180deg)" }),
            hoverable,
          ]}
        >
          <SwitchButtons
            size={size}
            units={units}
            bgColor="var(--current-bg)"
            fgColor="var(--current-fg)"
          />
        </button>
      </div>
    </section>
  );
}
