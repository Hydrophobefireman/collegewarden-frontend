import { useState } from "@hydrophobefireman/ui-lib";
import { css } from "catom";
import { AnimatedInput } from "../AnimatedInput";
import { Form } from "../Form";
import { CollegeData, colleges } from "../../state";
import { actionButton, bold, center } from "../../styles";
import { BooleanInfo } from "./BooleanProps";
import { Deadline } from "./Deadline";
import { TimeLine } from "./TimeLine";
import { StageProps } from "./util";
import { Notes } from "./Notes";
import {
  modalActionText,
  marginTop,
  modalCollegeName,
  modalActionButton,
  modalSection,
  closeButton,
} from "./UniEdit.styles";
import { EditIcon } from "../Icons/Edit";
import { ModalLayout } from "../Layout/ModalLayout";
import { DeleteIcon } from "../Icons/Delete";
import { get, set } from "statedrive";

function boolOrDefault<T>(x: any, def: T) {
  return x == null ? def : x;
}

export function EditStage({
  name,
  next,
  allowReadonlyMode,
  currentCollegeData,
  close,
}: StageProps) {
  const currData = currentCollegeData || (({} as any) as CollegeData);
  const [editMode, setEdit] = useState(false);
  const [portalURL, setPortalURL] = useState(currData.portalLink || "");
  const [password, setPassword] = useState(currData.portalPassword || "");
  const [timeline, setTimeline] = useState<CollegeData["decisionTimeline"]>(
    currData.decisionTimeline || "RD"
  );
  const [applied, setApplied] = useState(boolOrDefault(currData.applied, true));
  const [finAid, setFinAid] = useState(
    boolOrDefault(currData.appliedWithFinAid, false)
  );
  const [deadline, setDeadline] = useState(currData.decisionDate || 0);
  const [notes, setNotes] = useState(currData.notes || "");

  const [submitted, setSubmitted] = useState(false);
  const [confirmDelete, setConfDelete] = useState(false);
  function handleFormSubmit() {
    const ret: CollegeData = {
      collegeName: name,
      portalLink: portalURL,
      portalPassword: password,
      decisionTimeline: timeline,
      decisionDate: deadline,
      applied: applied,
      appliedWithFinAid: finAid,
      notes,
    };
    setSubmitted(true);
    next(ret);
  }
  const enabled = !allowReadonlyMode || editMode;
  if (confirmDelete) {
    const closeDialog = () => setConfDelete(false);
    return (
      <section>
        <ModalLayout close={closeDialog}>
          <div>
            are you sure you want to remove{" "}
            <b class={[bold, css({ color: "var(--current-fg)" })]}>{name}</b>{" "}
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
      <button
        onClick={close}
        class={[actionButton, closeButton]}
        style={{ fontSize: "2rem", fontWeight: "normal" }}
      >
        ✖
      </button>
      <div>
        <b class={modalCollegeName}>{name}</b>
        <section class={modalSection}>
          <div>
            {allowReadonlyMode && (
              <>
                <button
                  style={{ color: "var(--current-text-color)" }}
                  class={modalActionButton.concat(
                    editMode ? css({ background: "var(--current-alpha)" }) : ""
                  )}
                  onClick={() => setEdit(true)}
                >
                  <EditIcon />
                  <span class={modalActionText}>edit</span>
                </button>
                <button
                  style={{ color: "var(--current-text-color)" }}
                  class={modalActionButton}
                  onClick={() => setConfDelete(true)}
                >
                  <DeleteIcon />
                  <span class={modalActionText}>delete</span>
                </button>
              </>
            )}
          </div>
          <Form>
            <div class={marginTop}>
              <AnimatedInput
                labelText="portal url"
                onInput={setPortalURL}
                value={portalURL}
                disabled={!enabled}
              />
            </div>
            <div class={marginTop}>
              <AnimatedInput
                labelText="portal password"
                onInput={setPassword}
                value={password}
                disabled={!enabled}
              />
            </div>
            <TimeLine
              timeline={timeline}
              setTimeline={setTimeline}
              disabled={!enabled}
            />
            <BooleanInfo
              value={applied}
              setValue={setApplied}
              text="have you applied yet?"
              disabled={!enabled}
            />
            <BooleanInfo
              value={finAid}
              setValue={setFinAid}
              text="are you applying for fin-aid?"
              disabled={!enabled}
            />
            <Deadline
              setDeadline={setDeadline}
              disabled={!enabled}
              deadline={deadline}
            />
            <Notes
              setNotes={setNotes}
              notes={notes}
              name={name}
              disabled={!enabled}
            />
            <div class={center}>
              {submitted && (
                <div class={marginTop}>
                  encrypting your data and sending to the server
                </div>
              )}
              {(!allowReadonlyMode || enabled) && (
                <button
                  class={actionButton}
                  type="button"
                  onClick={handleFormSubmit}
                >
                  submit
                </button>
              )}
            </div>
          </Form>
        </section>
      </div>
    </ModalLayout>
  );
}

function deleteCollege(c: CollegeData) {
  const cData = get(colleges).filter((x) => x.collegeName !== c.collegeName);
  set(colleges, cData);
}
