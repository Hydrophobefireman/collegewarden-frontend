import {
  A,
  ComponentChildren,
  redirect,
  useEffect,
  useState,
} from "@hydrophobefireman/ui-lib";
import {
  buttonWrapper,
  formContainer,
  formSection,
  colorText,
  submitButton,
  altLinkCSS,
  submittedButtonCSS,
  submitButtonActionCss,
} from "./AuthForm.styles";

import { Form } from "../Form";
import { SnackBar } from "../SnackBar";
import { hoverable } from "../../styles";
import { css } from "catom";
import { ChunkLoading } from "../ChunkLoadingComponent";
import { useSharedStateValue } from "statedrive";
import { authData } from "../../state";

interface FormProps {
  children?: ComponentChildren;
  onSubmit(e: Event): Promise<unknown>;
  onClose(e: MouseEvent): any;
  message: string;
  isError: boolean;
  buttonText?: string;
  altLink: string;
}

export function AuthForm({
  children,
  onSubmit,
  message,
  isError,
  onClose,
  buttonText,
  altLink,
}: FormProps) {
  const [submitted, setSubmitted] = useState(false);
  const data = useSharedStateValue(authData);
  useEffect(() => {
    data && data.user && redirect("/dashboard");
  }, [data && data.user]);

  function onSubmitWrapper(e: JSX.TargetedEvent<HTMLFormElement>) {
    if (submitted) return;
    setSubmitted(true);
    onSubmit(e).then(() => {
      setSubmitted(false);
    });
  }

  return (
    <>
      <SnackBar message={message} isError={isError} onClose={onClose} />
      <section class={formSection}>
        <div>
          <A class={[colorText]} href="/">
            college warden
          </A>
        </div>
        <Form onSubmit={onSubmitWrapper}>
          <div class={formContainer}>
            <div class={[colorText, css({ textAlign: "center" })]}>
              {buttonText}
            </div>
            {children}
            <div class={buttonWrapper}>
              <A href={"/" + altLink} class={altLinkCSS}>
                {altLink}
              </A>
              <button
                class={[
                  hoverable,
                  submitButton,
                  submitted ? submittedButtonCSS : submitButtonActionCss,
                ]}
              >
                {submitted ? (
                  <ChunkLoading size={16} />
                ) : (
                  buttonText || "submit"
                )}
              </button>
            </div>
          </div>
        </Form>
      </section>
    </>
  );
}
