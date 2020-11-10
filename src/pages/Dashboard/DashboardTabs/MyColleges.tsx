import { CollegeData, colleges } from "../../../state";

import { CollegeCard } from "./CollegeCard";
import { EditStage } from "../../../components/UniEdit/EditStage";
import { css } from "catom";
import { heading } from "../../../styles";
import { useSharedState } from "statedrive";
import { useState } from "@hydrophobefireman/ui-lib";
import { cardWrapper } from "./DashboadTabs.style";

interface Props {
  data: CollegeData[];
}

function sortColleges(a: CollegeData, b: CollegeData): number {
  if (a.decisionTimeline === "ED") return -1;
  if (b.decisionTimeline === "ED") return 1;
  if (a.decisionTimeline === "ED2") {
    return -1;
  }
  return a.decisionDate - b.decisionDate;
}

export function MyColleges({ data }: Props) {
  const [college, setCollege] = useState<CollegeData>(null);
  const [cData, setCollegeData] = useSharedState(colleges);
  if (!data) return;
  const rest = data.sort(sortColleges);

  return (
    <section>
      {college && (
        <EditStage
          close={() => setCollege(null)}
          currentCollegeData={college}
          name={college.collegeName}
          next={(d: CollegeData) => {
            const draft = cData.map((x) =>
              x.collegeName === college.collegeName ? d : x
            );
            setCollegeData(draft);
          }}
          allowReadonlyMode={true}
        />
      )}
      <div class={[heading]}>
        <span
          class={css({
            textDecoration: "underline",
            textDecorationColor: "var(--current-fg)",
            textDecorationThickness: "2px",
          })}
        >
          colleges
        </span>
      </div>
      <div class={cardWrapper}>
        {rest.map((x) => (
          <CollegeCard data={x} setCollege={setCollege} />
        ))}
      </div>
    </section>
  );
}
