import { CollegeData, colleges } from "../../state";
import { actionButton, bold, center } from "../../styles";
import { get, set } from "statedrive";
import {
  marginTop,
  modalActionButton,
  modalActionText,
  modalCollegeName,
  modalSection,
} from "./UniEdit.styles";

import { AnimatedInput } from "../AnimatedInput";
import { BooleanInfo } from "./BooleanProps";
import { Deadline } from "./Deadline";
import { DeleteIcon } from "../Icons/Delete";
import { Form } from "../Form";
import { GlobalCollegeInfo } from "./GlobalCollegeInfo";
import { ModalLayout } from "../Layout/ModalLayout";
import { Notes } from "./Notes";
import { StageProps } from "./util";
import { TimeLine } from "./TimeLine";
import { css } from "catom";
import { useState } from "@hydrophobefireman/ui-lib";

function boolOrDefault<T>(x: any, def: T) {
  return x == null ? def : x;
}

export function EditStage({
  glCollegeData,
  next,
  allowReadonlyMode,
  currentCollegeData,
  close,
}: StageProps) {
  const currData = currentCollegeData || (({} as any) as CollegeData);
  const [portalURL, setPortalURL] = useState(currData.portalLink || "");
  const [password, setPassword] = useState(currData.portalPassword || "");
  const [timeline, setTimeline] = useState<CollegeData["decisionTimeline"]>(
    currData.decisionTimeline || "RD"
  );
  const [applied, setApplied] = useState(boolOrDefault(currData.applied, true));
  const [accepted, setAccepted] = useState(
    boolOrDefault(currData.accepted, false)
  );
  const [finAid, setFinAid] = useState(
    boolOrDefault(currData.appliedWithFinAid, false)
  );
  const [deadline, setDeadline] = useState(currData.decisionDate || 0);
  const [notes, setNotes] = useState(currData.notes || "");

  const [submitted, setSubmitted] = useState(false);
  const [confirmDelete, setConfDelete] = useState(false);
  function handleFormSubmit() {
    const ret: CollegeData = {
      data: glCollegeData,
      portalLink: portalURL,
      portalPassword: password,
      decisionTimeline: timeline,
      decisionDate: deadline,
      applied: applied,
      appliedWithFinAid: finAid,
      notes,
      accepted,
    };

    setSubmitted(true);
    next(ret);
  }

  if (confirmDelete) {
    const closeDialog = () => setConfDelete(false);
    return (
      <section>
        <ModalLayout close={closeDialog}>
          <div>
            are you sure you want to remove{" "}
            <b class={[bold, css({ color: "var(--current-fg)" })]}>
              {glCollegeData.name}
            </b>{" "}
            from your college lists?
          </div>
          <div class={css({ textAlign: "right" })}>
            <button class={actionButton} onClick={closeDialog}>
              cancel
            </button>
            <button
              class={actionButton}
              onClick={(e) => {
                deleteCollege(currentCollegeData);
                closeDialog();
                close(e);
              }}
            >
              delete
            </button>
          </div>
        </ModalLayout>
      </section>
    );
  }
  return (
    <ModalLayout close={close}>
      <div>
        <b class={modalCollegeName}>{glCollegeData.name}</b>
        <section class={modalSection}>
          <div>
            {allowReadonlyMode && (
              <button
                style={{ color: "var(--current-text-color)" }}
                class={modalActionButton}
                onClick={() => setConfDelete(true)}
              >
                <DeleteIcon />
                <span class={modalActionText}>delete</span>
              </button>
            )}
          </div>

          <GlobalCollegeInfo college={glCollegeData} />

          <Form>
            <div class={marginTop}>
              <AnimatedInput
                labelText="portal url"
                onInput={setPortalURL}
                value={portalURL}
              />
            </div>
            <div class={marginTop}>
              <AnimatedInput
                labelText="portal password"
                onInput={setPassword}
                value={password}
              />
            </div>
            <TimeLine timeline={timeline} setTimeline={setTimeline} />
            <BooleanInfo
              value={accepted}
              setValue={setAccepted}
              text="have you been accepted yet?"
            />
            <BooleanInfo
              value={applied}
              setValue={setApplied}
              text="have you applied yet?"
            />
            <BooleanInfo
              value={finAid}
              setValue={setFinAid}
              text="are you applying for fin-aid?"
            />
            <Deadline setDeadline={setDeadline} deadline={deadline} />
            <Notes
              setNotes={setNotes}
              notes={notes}
              name={glCollegeData.name}
            />
            <div class={center}>
              {submitted && (
                <div class={marginTop}>
                  encrypting your data and sending to the server
                </div>
              )}
              <button
                class={[actionButton, css({ marginBottom: "40px" })]}
                type="button"
                onClick={handleFormSubmit}
              >
                submit
              </button>
            </div>
          </Form>
        </section>
      </div>
    </ModalLayout>
  );
}

function deleteCollege(c: CollegeData) {
  const cData = get(colleges).filter((x) =>
    "id" in c.data
      ? x.data.id !== c.data.id
      : x.data.name === (c.data as any).name
  );
  set(colleges, cData);
}
