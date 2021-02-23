import * as requests from "../../util/http/requests";

import {
  loadURL,
  redirect,
  useEffect,
  useState,
} from "@hydrophobefireman/ui-lib";

import { AnimatedInput } from "../../components/AnimatedInput";
import { Form } from "../../components/Form";
import { ModalLayout } from "../../components/Layout/ModalLayout";
import { SnackBar } from "../../components/SnackBar";
import { actionButton } from "../../styles";
import { css } from "catom";
import { get } from "statedrive";
import { set as idbSet } from "../../util/idb";
import { passwordData } from "../../state";
import { reEncryptUserData } from "../../crypto/re-encrypt";
import { userRoutes } from "../../util/http/api_routes";

export default function Security() {
  const close = () => loadURL("/dashboard");
  const [step, setStep] = useState<0 | 1 | 2>(0);
  function cancel() {
    setStep(0);
  }
  const password = get(passwordData);
  useEffect(() => {
    if (!password) return redirect("/dashboard/colleges?ref=_get_pass");
  }, []);
  return (
    <ModalLayout close={close}>
      <h1>Settings</h1>
      {step === 0 && (
        <>
          <button class={actionButton} onClick={() => setStep(1)}>
            Change your password
          </button>
          <button class={actionButton} onClick={() => setStep(2)}>
            re-encrypt your files
          </button>
        </>
      )}
      {step === 1 && <ChangePassword cancel={cancel} />}
      {step === 2 && (
        <ReEncrypt
          cancel={cancel}
          oldPassword={password}
          newPassword={password}
        />
      )}
    </ModalLayout>
  );
}
function ReEncrypt({
  force,
  cancel,
  oldPassword,
  newPassword,
}: {
  force?: boolean;
  cancel?(): void;
  oldPassword: string;
  newPassword: string;
}) {
  const [m, setMessage] = useState(null);
  const [dataLog, setDataLog] = useState([]);
  useEffect(() => setDataLog([...dataLog, m]), [m]);
  const [enable, setEnable] = useState(force);
  const [errorMessage, setErrorMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  useEffect(async () => {
    if (!enable) return;

    const errors = await reEncryptUserData(
      setMessage,
      oldPassword,
      newPassword
    );
    if (errors.length)
      return setErrorMessage(`Could not re encrypt: ${errors.join(", ")}`);
    setSuccess(true);
  }, [enable]);
  if (success) return <div>Files have been successfully re-encrypted</div>;
  return (
    <div>
      <SnackBar onClose={cancel} message={errorMessage} isError={true} />
      {enable ? (
        <>
          <span>
            <span>
              Your data is being downloaded on your device and being encrypted
              with your new password. Do Not close this window till the process
              is over or you might not be able to use your CollegeWarden account
              as your data will be corrupted with no way to restore it.
            </span>
          </span>
          <div>
            <textarea
              readOnly
              class={css({
                background: "var(--current-bg)",
                color: "var(--current-text-color)",
                width: "90%",
                height: "80px",
              })}
            >
              {dataLog.join("\n")}
            </textarea>
            <div>{m || "updates will appear here"}</div>
          </div>
        </>
      ) : (
        <div>
          <span>
            Are you sure you want to re encrypt your files? You cannot go back
          </span>
          <div>
            <button class={actionButton} onClick={cancel} type="button">
              cancel
            </button>
            <button class={actionButton} onClick={() => setEnable(true)}>
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
function clearSavedPassword() {
  idbSet("auth.user-saved.password", "");
}
const inputCls = css({ marginTop: "1rem" });
function ChangePassword({ cancel }: { cancel(): void }) {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState(null);
  async function submit() {
    if (loading) return;
    setLoading(true);
    setMessage("Loading...");
    const result = await requests.postJSON(userRoutes.changePassword, {
      current_password: current,
      new_password: newPass,
    }).result;
    if (result.error) {
      setLoading(false);
      return setMessage(result.error);
    }
    clearSavedPassword();
    setCompleted(true);
  }
  if (completed) {
    return (
      <ReEncrypt
        oldPassword={current}
        newPassword={newPass}
        force={true}
        cancel={cancel}
      />
    );
  }
  return (
    <div>
      <SnackBar
        isError={true}
        message={message}
        onClose={() => setMessage(null)}
      />
      <Form onSubmit={submit}>
        <AnimatedInput
          value={current}
          onInput={setCurrent}
          wrapperClass={inputCls}
          labelText="Current Password"
          type="password"
          required
        />
        <AnimatedInput
          value={newPass}
          onInput={setNewPass}
          wrapperClass={inputCls}
          labelText="New Password"
          type="password"
          required
          minLength={3}
        />
        <div class={css({ marginTop: "1rem", marginLeft: "1rem" })}>
          <div>
            <button class={actionButton} onClick={cancel} type="button">
              cancel
            </button>
            <button class={actionButton}>Submit</button>
          </div>
        </div>
      </Form>
    </div>
  );
}
