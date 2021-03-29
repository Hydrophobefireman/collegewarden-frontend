import { activeAction, appStatusBox, inlineContainer } from "./UniEdit.styles";

import { CollegeData } from "../../state";
import { actionButton } from "../../styles";

interface AppStatus {
  status: string;
  setStatus(tl: CollegeData["accepted"]): void;
}
const statusToColor = {
  Accepted: "var(--current-fg)",
  Rejected: "red",
  Waitlisted: "yellow",
  Pending: "white",
};
export function AppStatus({ status, setStatus }: AppStatus) {
  return (
    <div class={inlineContainer}>
      <div>your application status?</div>
      <div class={appStatusBox}>
        {["Accepted", "Rejected", "Waitlisted", "Pending"].map((x) => (
          <button
            type="button"
            style={{
              ...(x === status ? activeAction : { color: statusToColor[x] }),
              display: "inline-block",
            }}
            onClick={(e) =>
              setStatus(
                e.currentTarget.dataset.status as CollegeData["accepted"]
              )
            }
            class={actionButton}
            data-status={x}
          >
            {x}
          </button>
        ))}
      </div>
    </div>
  );
}
