import { actionButton, bold } from "../../styles";
import { useEffect, useState } from "@hydrophobefireman/ui-lib";

import { AnimatedInput } from "../AnimatedInput";
import { Form } from "../Form";
import { ModalLayout } from "../Layout/ModalLayout";
import { PassIcon } from "../Icons/Pass";
import { css } from "catom";
import { inlineContainer } from "../UniEdit/UniEdit.styles";
import { passwordData } from "../../state";
import { set } from "../../util/idb";
import { useSetSharedState } from "statedrive";

const savePasswordBox = css({
  marginTop: "1rem",
  marginLeft: "1rem",
  fontWeight: "bold",
  color: "var(--current-fg)",
  cursor: "pointer",
  display: "inline-block",
});
export function PasswordInput() {
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const setGlobalPw = useSetSharedState(passwordData);
  useEffect(() => {
    set("auth.user-saved.password", "");
  }, []);
  return (
    <ModalLayout close={null}>
      <Form
        onSubmit={() => {
          setGlobalPw(password);
          if (checked) {
            set("auth.user-saved.password", password);
          }
        }}
      >
        <h2 class={[bold, css({ color: "var(--current-fg)" })]}>
          password required
        </h2>
        <div>please enter your password to decrypt your files</div>
        <div class={css({ marginTop: "1rem" })}>
          <AnimatedInput
            labelText="password"
            onInput={setPassword}
            value={password}
            type="password"
            icon={<PassIcon />}
          />
          <div
            class={savePasswordBox}
            onClick={(e) => {
              setChecked(!checked);
              e.stopPropagation();
            }}
          >
            <input
              class={css({ marginRight: ".5rem", cursor: "pointer" })}
              type="checkbox"
              checked={checked}
              onInput={(x) => setChecked(x.currentTarget.checked)}
            />
            <span>Save password</span>
          </div>
          <div class={inlineContainer} style={{ textAlign: "right" }}>
            <button class={actionButton}>submit</button>
          </div>
        </div>
      </Form>
    </ModalLayout>
  );
}
