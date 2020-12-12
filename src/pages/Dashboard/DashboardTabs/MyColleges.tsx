import { $req, clean } from "./util";
import { CollegeData, colleges } from "../../../state";
import { useEffect, useMemo, useState } from "@hydrophobefireman/ui-lib";

import { AnimatedInput } from "../../../components/AnimatedInput";
import { CollegeCard } from "./CollegeCard";
import { EditStage } from "../../../components/UniEdit/EditStage";
import { cardWrapper } from "./DashboadTabs.style";
import { css } from "catom";
import { heading } from "../../../styles";
import { useSharedState } from "statedrive";

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
  const nameA = a.data.name;
  const nameB = b.data.name;
  return (
    a.decisionDate - b.decisionDate ||
    (nameA > nameB ? 1 : nameB > nameA ? -1 : 0)
  );
}

export function MyColleges({ data: _data }: Props) {
  const [college, setCollege] = useState<CollegeData>(null);
  const [cData, setCollegeData] = useSharedState(colleges);
  const [filtered, setFiltered] = useState(_data);

  const [search, setSearch] = useState("");
  const data = useMemo(
    () => (filtered ? filtered.slice().sort(defaultSort) : null),
    [filtered]
  );
  useEffect(() => {
    setFiltered(_data);
    setSearch("");
  }, [_data]);

  function onInput(value: string) {
    setSearch(value);
    $filter(value);
  }

  function $filter(value: string) {
    if (!value || !_data) return setFiltered(_data || []);
    $req(() => {
      const cleaned = clean(value);
      setFiltered(
        _data.filter((x) =>
          x.data.$search
            ? x.data.$search.some((a) => a.includes(cleaned))
            : clean(x.data.name).includes(cleaned)
        )
      );
    });
  }
  if (!data) return;

  return (
    <section>
      {college && (
        <EditStage
          close={() => setCollege(null)}
          currentCollegeData={college}
          glCollegeData={college.data}
          next={(d: CollegeData) => {
            const draft = cData.map((x) =>
              x.data.name === college.data.name ? d : x
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
      <section>
        <AnimatedInput
          value={search}
          onInput={onInput}
          labelText="Search college"
        />
        <div class={cardWrapper}>
          {data.map((x) => (
            <CollegeCard data={x} setCollege={setCollege} />
          ))}
        </div>
      </section>
    </section>
  );
}
