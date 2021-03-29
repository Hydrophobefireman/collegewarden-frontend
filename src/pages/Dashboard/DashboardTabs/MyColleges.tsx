import { $req, clean } from "./util";
import { CollegeData, colleges } from "../../../state";
import {
  acceptedCss,
  appliedCss,
  cardWrapper,
  clgHeading,
  rejectedCss,
  waitlistCss,
} from "./DashboadTabs.style";
import { useEffect, useMemo, useState } from "@hydrophobefireman/ui-lib";

import { AnimatedInput } from "../../../components/AnimatedInput";
import { CollegeCard } from "./CollegeCard";
import { EditStage } from "../../../components/UniEdit/EditStage";
import { css } from "catom";
import { actionButton, heading } from "../../../styles";
import { useSharedState } from "statedrive";
import { fixAccepted } from "@/util/fixAccepted";

interface Props {
  data: CollegeData[];
}
const activeActionButton = {
  color: "var(--current-bg)",
  background: "var(--current-fg)",
};

function decisionDateSort(a: CollegeData, b: CollegeData): number {
  const timelineA = a.decisionTimeline;
  const timelineB = b.decisionTimeline;
  if (timelineA === "ED" && timelineB !== "ED") return -1;
  if (timelineB === "ED") return 1;
  if (timelineA === "ED2" && timelineB !== "ED2") {
    return -1;
  }
  if (timelineB === "ED2") return 1;
  if (timelineA === "EA" && timelineB !== "EA") return -1;
  if (timelineA !== "EA" && timelineB === "EA") return 1;

  const nameA = a.data.name;
  const nameB = b.data.name;
  return (
    a.decisionDate - b.decisionDate ||
    (nameA > nameB ? 1 : nameB > nameA ? -1 : 0)
  );
}
function nameSort(a: CollegeData, b: CollegeData): number {
  const nameA = a.data.name;
  const nameB = b.data.name;
  return nameA > nameB ? 1 : nameB > nameA ? -1 : 0;
}

export function MyColleges({ data: _data }: Props) {
  const [college, setCollege] = useState<CollegeData>(null);
  const [cData, setCollegeData] = useSharedState(colleges);
  const [filtered, setFiltered] = useState(_data);
  const [sort, setSort] = useState<"decision-date" | "name">("decision-date");

  const sortFn = sort === "decision-date" ? decisionDateSort : nameSort;
  const [search, setSearch] = useState("");
  const data = useMemo(
    () => (filtered ? filtered.slice().sort(sortFn) : null),
    [filtered, sortFn]
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
  const accepted = [];
  const waitlisted = [];
  const rejected = [];
  const notApplied = [];
  const alreadyApplied = [];
  const map: Record<CollegeData["accepted"], Array<CollegeData>> = {
    Accepted: accepted,
    Waitlisted: waitlisted,
    Rejected: rejected,
    Pending: alreadyApplied,
  };
  data.forEach((x) => {
    if (!x.applied) {
      notApplied.push(x);
      return;
    }

    map[fixAccepted(x.accepted) as CollegeData["accepted"]].push(x);
  });
  function handleSortClick(e: JSX.TargetedMouseEvent<HTMLButtonElement>) {
    setSort(e.currentTarget.dataset.sort as any);
  }
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
          colleges
        </span>
        <span class={css({ fontSize: "1.5rem" })}>({data.length})</span>
      </div>
      <div>
        <AnimatedInput
          value={search}
          onInput={onInput}
          labelText="Search college"
        />
      </div>
      <div
        class={css({
          marginLeft: "1.2rem",
          marginTop: "1.2rem",
          position: "sticky",
          top: 0,
          zIndex: 2,
          background: "var(--current-bg)",
        })}
      >
        <span class={css({ fontWeight: "bold", fontSize: "1.2rem" })}>
          Sort Colleges by:
        </span>
        <div>
          <button
            onClick={handleSortClick}
            data-sort="decision-date"
            class={actionButton}
            style={sort === "decision-date" ? activeActionButton : null}
          >
            Decision Date
          </button>
          <button
            onClick={handleSortClick}
            data-sort="name"
            class={actionButton}
            style={sort === "name" ? activeActionButton : null}
          >
            Name
          </button>
        </div>
      </div>
      <section>
        <CollegeSortType
          arr={accepted}
          cls={acceptedCss}
          setCollege={setCollege}
          text="Accepted"
          infoCls={css({ color: "#00e400" })}
        />
        <CollegeSortType
          arr={notApplied}
          cls={clgHeading}
          setCollege={setCollege}
          text="Pending"
          infoCls=""
        />
        <CollegeSortType
          arr={alreadyApplied}
          cls={appliedCss}
          setCollege={setCollege}
          text="Applied"
          infoCls={css({ color: "var(--current-fg)" })}
        />
        <CollegeSortType
          arr={waitlisted}
          cls={waitlistCss}
          setCollege={setCollege}
          text="Waitlisted"
          infoCls={css({ color: "yellow" })}
        />
        <CollegeSortType
          arr={rejected}
          cls={rejectedCss}
          setCollege={setCollege}
          text="Rejected"
          infoCls={css({ color: "red" })}
        />
      </section>
    </section>
  );
}
interface CollegeSortType {
  cls: string | string[];
  text: string;
  arr: CollegeData[];
  infoCls: string | string[];
  setCollege(c: CollegeData): void;
}
export function CollegeSortType({
  cls,
  text,
  arr,
  infoCls,
  setCollege,
}: CollegeSortType) {
  return (
    arr &&
    arr.length > 0 && (
      <div>
        <span class={cls}>{text}</span>{" "}
        <span class={[css({ fontSize: "1.5rem" })].concat(infoCls)}>
          ({arr.length})
        </span>
        <div class={cardWrapper}>
          {arr.map((x) => (
            <CollegeCard data={x} setCollege={setCollege} />
          ))}
        </div>
      </div>
    )
  );
}
