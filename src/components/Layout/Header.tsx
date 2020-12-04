import Component, { useEffect } from "@hydrophobefireman/ui-lib";
import { UserData, authData } from "../../state";
import { bold, hoverable } from "../../styles";
import {
  subscribe,
  unsubscribe,
  useSetSharedState,
  useSharedStateValue,
} from "statedrive";

import { LogoutIcon } from "../Icons/Logout";
import { auth } from "../../util/auth";
import { css } from "catom";
import { logoutCss } from "./Layout.styles";

export function Header() {
  const data = useSharedStateValue(authData);

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
          <button class={[logoutCss, hoverable]} onClick={() => auth.logout()}>
            <LogoutIcon size={"1.2rem"} />
            logout
          </button>
        </>
      )}
    </header>
  );
}
