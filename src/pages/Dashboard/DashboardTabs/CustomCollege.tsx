import { actionButton, center } from "../../../styles";

import { AnimatedInput } from "../../../components/AnimatedInput";
import { EditStage } from "../../../components/UniEdit/EditStage";
import { Form } from "../../../components/Form";
import { ModalLayout } from "../../../components/Layout/ModalLayout";
import { colleges } from "../../../state";
import { css } from "catom";
import { useSharedState } from "statedrive";
import { useState } from "@hydrophobefireman/ui-lib";

interface CustomCollegeProps {
  close(): void;
}
export function CustomCollege({ close }: CustomCollegeProps) {
  const [collegeName, setCollege] = useState("");
  const [collegeData, setCollegeData] = useSharedState(colleges);
  const [stage, setStage] = useState(0);
  const data = { name: collegeName, id: +new Date() };
  return stage === 0 ? (
    <ModalLayout close={close}>
      <Form onSubmit={() => setStage(1)}>
        <AnimatedInput
          labelText="College Name"
          value={collegeName}
          onInput={setCollege}
          maxLength={100}
        />
        <div class={[center, css({ marginTop: "10px" })]}>
          <button class={actionButton}>next</button>
        </div>
      </Form>
    </ModalLayout>
  ) : (
    <EditStage
      glCollegeData={
        {
          __internal: data,
          ...data,
        } as any
      }
      close={close}
      next={(v) => {
        const draft = collegeData ? collegeData.slice() : [];
        draft.push(v);
        setCollegeData(draft);
        close();
      }}
    />
  );
}
