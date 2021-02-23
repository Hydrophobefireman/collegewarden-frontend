import { bold, hoverable } from "../../styles";

import { A } from "@hydrophobefireman/ui-lib";
import { LockIcon } from "../Icons/Lock";
import { LogoutIcon } from "../Icons/Logout";
import { auth } from "../../util/auth";
import { authData } from "../../state";
import { css } from "catom";
import { headerActionButtonCss } from "./Layout.styles";
import { useLocation } from "../../customHooks";
import { useSharedStateValue } from "statedrive";

export function Header() {
  const data = useSharedStateValue(authData);
  const loc = useLocation();
  return (
    <header
      class={css({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: "1rem",
        paddingRight: "1rem",
      })}
    >
      {data && data.name && (
        <>
          <div>
            Hi, <span class={bold}>{data.name}</span>
          </div>
          <div class={css({ display: "flex", justifyContent: "space-evenly" })}>
            {loc !== "/security" && (
              <A href="/security" class={css({ textDecoration: "none" })}>
                <button class={[hoverable, headerActionButtonCss]}>
                  <LockIcon size="1.2rem" /> Security
                </button>
              </A>
            )}
            <button
              class={[headerActionButtonCss, hoverable]}
              onClick={() => auth.logout()}
            >
              <LogoutIcon size={"1.2rem"} />
              logout
            </button>
          </div>
        </>
      )}
    </header>
  );
}
