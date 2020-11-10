import { actionButton, bold } from "../../../styles";
import {
  collegeName,
  infoWrap,
  nameLogoWrap,
  uniCard,
  uniName,
  viewMoreWrapper,
} from "./DashboadTabs.style";

import { CollegeData } from "../../../state";
import { NameLogo } from "../../../components/NameLogo";
import { css } from "catom";

function isEd(data: CollegeData) {
  return data.decisionTimeline === "ED" || data.decisionTimeline === "ED2";
}
interface CollegeCardProps {
  data: CollegeData;
  setCollege(c: CollegeData): void;
}
export function CollegeCard({ data, setCollege }: CollegeCardProps) {
  return (
    <div class={uniCard}>
      <div
        class={[
          isEd(data) ? css({ color: "var(--current-fg)" }) : null,
          uniName,
        ]}
      >
        <span class={nameLogoWrap}>
          <NameLogo text={data.collegeName} size="3rem" />
        </span>
        <div class={collegeName}>{data.collegeName}</div>
      </div>
      <div class={infoWrap}>
        <Info
          title="decision timeline"
          data={data.decisionTimeline}
          className={isEd(data) ? css({ color: "var(--current-fg)" }) : bold}
        />
        <Info
          title="decision date"
          data={new Date(data.decisionDate).toLocaleDateString()}
        />
        <div class={viewMoreWrapper}>
          <button class={actionButton} onClick={() => setCollege(data)}>
            view more
          </button>
        </div>
      </div>
    </div>
  );
}

function Info({
  title,
  data,
  className = "",
}: {
  title: string;
  data: string;
  className?: string;
}) {
  return (
    <div>
      {title}
      {" : "}
      <span class={[bold, className]}>{data}</span>
    </div>
  );
}
