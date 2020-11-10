import { CollegeData, colleges } from "../../../state";
import { useSharedState } from "statedrive";
import { EditStage } from "../../../components/UniEdit/EditStage";
import { useState } from "@hydrophobefireman/ui-lib";
import { Stage0 } from "../../../components/UniEdit/Stage0";

interface AddUniProps {
  name: string;
  close(): void;
}

export function AddUniversity({ name, close }: AddUniProps) {
  const [data, setData] = useSharedState(colleges);
  const [stage, setStage] = useState(0);
  function next(collegeData?: CollegeData) {
    if (stage === 0) return setStage(1);
    const draft = data ? data.slice() : [];
    draft.push(collegeData);
    setData(draft);
    close();
  }
  if (stage === 0) {
    return <Stage0 data={data} close={close} next={next} name={name} />;
  }
  if (stage === 1) {
    return <EditStage name={name} close={close} next={next} data={data} />;
  }
}
