import { useState } from "@hydrophobefireman/ui-lib";
import { css } from "catom";
import { useSetSharedState } from "statedrive";
import { passwordData } from "../../state";
import { actionButton, bold, center, mask, modal } from "../../styles";
import { AnimatedInput } from "../AnimatedInput";
import { Form } from "../Form";
import { PassIcon } from "../Icons/Pass";
import { ModalLayout } from "../Layout/ModalLayout";
import { inlineContainer } from "../UniEdit/UniEdit.styles";

export function PasswordInput() {
  const [password, setPassword] = useState("");
  const setGlobalPw = useSetSharedState(passwordData);
  return (
    <ModalLayout>
      <Form onSubmit={() => setGlobalPw(password)}>
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
          <div class={inlineContainer} style={{ textAlign: "rght" }}>
            <button class={actionButton}>submit</button>
          </div>
        </div>
      </Form>
    </ModalLayout>
  );
}
