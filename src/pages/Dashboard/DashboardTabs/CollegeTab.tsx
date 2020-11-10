import { A } from "@hydrophobefireman/ui-lib";

import { MyColleges } from "./MyColleges";
import { SadIcon } from "../../../components/Icons/Sad";
import { TabProps } from "../types";
import { center } from "../../../styles";

export function CollegeTab({ collegeData }: TabProps): any {
  if (collegeData && !collegeData.length) return <NoCollegeAdded />;
  return <MyColleges data={collegeData} />;
}

function NoCollegeAdded() {
  return (
    <div class={center}>
      <div>
        <SadIcon />
      </div>
      <div>you do not have any colleges added</div>
      <div>
        go to <A href="/dashboard/search">search colleges</A> to add them to
        your list
      </div>
    </div>
  );
}
