import { A } from "@hydrophobefireman/ui-lib";
import { css } from "catom";
import { useSharedStateValue } from "statedrive";
import { bold, center, cwHeading, heading } from "../../styles";
import {
  landingLinkFlex,
  landingNavLink,
  mainAction,
  register,
} from "./Landing.styles";
import { authData } from "../../state";

export function Introduction() {
  const authInfo = useSharedStateValue(authData);
  const isLoggedIn = authInfo && !!authInfo.user;
  return (
    <section class={center}>
      <h1 class={[heading, cwHeading]}>college warden</h1>
      <div class={[bold, css({ textAlign: "center" })]}>
        an easy way to manage your college applications
      </div>
      <div class={landingLinkFlex}>
        {isLoggedIn ? (
          <A href="/dashboard" class={[landingNavLink, mainAction]}>
            dashboard
          </A>
        ) : (
          <>
            <A href="/login" class={[landingNavLink, mainAction]}>
              login
            </A>
            <A href="/register" class={[landingNavLink, register]}>
              register
            </A>
          </>
        )}
      </div>
    </section>
  );
}
