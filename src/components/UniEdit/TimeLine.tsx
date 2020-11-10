import { CollegeData } from "../../state";
import { actionButton } from "../../styles";
import { activeAction, inlineContainer } from "./UniEdit.styles";

interface TimeLineProps {
  timeline: string;
  setTimeline(tl: CollegeData["decisionTimeline"]): void;
  disabled: boolean;
}
export function TimeLine({ timeline, setTimeline, disabled }: TimeLineProps) {
  return (
    <div class={inlineContainer}>
      <div>your decision timeline?</div>
      <div>
        {["RD", "ED", "EA", "ED2"].map((x) => (
          <button
            disabled={disabled}
            type="button"
            style={x === timeline ? activeAction : ""}
            onClick={(e) =>
              setTimeline(
                e.currentTarget.dataset
                  .timeline as CollegeData["decisionTimeline"]
              )
            }
            class={actionButton}
            data-timeline={x}
          >
            {x}
          </button>
        ))}
      </div>
    </div>
  );
}
