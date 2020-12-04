import { CollegeData, colleges, didFetch } from "../../../state";
import { set, useSharedState } from "statedrive";

import { EditStage } from "../../../components/UniEdit/EditStage";
import { GlCollegeData } from "./util";
import { Stage0 } from "../../../components/UniEdit/Stage0";
import { useState } from "@hydrophobefireman/ui-lib";

interface AddUniProps {
  college: GlCollegeData;
  close(): void;
}

export function AddUniversity({ college, close }: AddUniProps) {
  const [data, setData] = useSharedState(colleges);
  const [stage, setStage] = useState(0);
  function next(collegeData?: CollegeData) {
    if (stage === 0) return setStage(1);
    const draft = data ? data.slice() : [];
    set(didFetch, false);
    draft.push(collegeData);
    setData(draft);
    close();
  }
  if (stage === 0) {
    return (
      <Stage0 data={data} close={close} next={next} glCollegeData={college} />
    );
  }
  if (stage === 1) {
    return (
      <EditStage
        glCollegeData={college}
        close={close}
        next={next}
        data={data}
      />
    );
  }
}
