import { CollegeData, colleges } from "../../../state";

import { CollegeCard } from "./CollegeCard";
import { EditStage } from "../../../components/UniEdit/EditStage";
import { css } from "catom";
import { heading } from "../../../styles";
import { useSharedState } from "statedrive";
import { useMemo, useState } from "@hydrophobefireman/ui-lib";
import { cardWrapper } from "./DashboadTabs.style";

interface Props {
  data: CollegeData[];
}

function defaultSort(a: CollegeData, b: CollegeData): number {
  const timelineA = a.decisionTimeline;
  const timelineB = b.decisionTimeline;
  if (timelineA === "ED" && timelineB !== "ED") return -1;
  if (timelineB === "ED") return 1;
  if (timelineA === "ED2" && timelineB !== "ED2") {
    return -1;
  }
  if (timelineB === "ED2") return 1;

  if (!a.applied && b.applied) return -1;
  if (!b.applied && a.applied) return 1;
  const nameA = a.collegeName;
  const nameB = b.collegeName;
  return (
    a.decisionDate - b.decisionDate ||
    (nameA > nameB ? 1 : nameB > nameA ? -1 : 0)
  );
}

export function MyColleges({ data: _data }: Props) {
  const [college, setCollege] = useState<CollegeData>(null);
  const [cData, setCollegeData] = useSharedState(colleges);
  const data = useMemo(() => (_data ? _data.slice().sort(defaultSort) : null), [
    _data,
  ]);
  if (!_data) return;

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
            setCollege(null);
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
          colleges{" "}
        </span>
        <span class={css({ fontSize: "1.5rem" })}>({data.length})</span>
      </div>
      <div class={cardWrapper}>
        {data.map((x) => (
          <CollegeCard data={x} setCollege={setCollege} />
        ))}
      </div>
    </section>
  );
}
