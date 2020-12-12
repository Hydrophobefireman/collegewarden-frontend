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
  const func = () => setCollege(data);

  return (
    <div class={uniCard}>
      <div
        class={[
          isEd(data) ? css({ color: "var(--current-fg)" }) : null,
          uniName,
        ]}
      >
        <span class={nameLogoWrap}>
          <NameLogo text={data.data.name} size="3rem" />
        </span>
        <div class={collegeName}>{data.data.name}</div>
      </div>
      <div class={infoWrap}>
        {data.accepted ? (
          <div class={`${bold} ${css({ color: "#00e400" })}`}>
            CONGRATULATIONS!!
          </div>
        ) : (
          <>
            {" "}
            <Info
              title="decision timeline"
              data={
                <>
                  {data.decisionTimeline}{" "}
                  {!data.applied && (
                    <span class={css({ color: "var(--current-fg)" })}>
                      {data.data.fallDeadline || data.data.springDeadline ? (
                        <button class={actionButton} onClick={func}>
                          check deadlines
                        </button>
                      ) : (
                        "(application pending!)"
                      )}
                    </span>
                  )}
                </>
              }
              className={
                isEd(data) ? css({ color: "var(--current-fg)" }) : bold
              }
            />
            <Info
              title="decision date"
              data={new Date(data.decisionDate).toLocaleDateString()}
            />
          </>
        )}
        <div class={viewMoreWrapper}>
          {!!data.portalLink && (
            <a
              target="_blank"
              class={[
                actionButton,
                css({
                  paddingLeft: "5px",
                  paddingRight: "5px",
                  borderRadius: "5px",
                }),
              ]}
              href={data.portalLink}
            >
              visit portal
            </a>
          )}
          <button class={actionButton} onClick={func}>
            edit
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
  data: string | JSX.Element;
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
