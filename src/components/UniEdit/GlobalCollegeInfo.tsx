import { GlCollegeData } from "../../pages/Dashboard/DashboardTabs/util";
import { bold } from "../../styles";
import { css } from "catom";
import { prop2text } from "../../util/prop2text";

const deadlines = [
  "summerDeadline",
  "springDeadline",
  "fallDeadline",
  "deadlineRDRolling",
];
export function GlobalCollegeInfo({ college }: { college: GlCollegeData }) {
  const isApiV1Data = !("id" in college);
  if (isApiV1Data)
    return (
      <div class={css({ fontSize: "0.8rem" })}>
        No data for this college.
        <span class={css({ color: "var(--current-fg)" })}>
          {" college warden's "}
        </span>
        database has updated, this college could not be migrated automatically.
      </div>
    );
  return (
    <section>
      <div class={css({ maxWidth: "350px", margin: "auto" })}>
        {[
          "type",
          "summerDeadline",
          "springDeadline",
          "fallDeadline",
          // "deadlineRDRolling",
          "hasFeeUS",
          "hasFeeIntl",
          "caEssayReqd",
          "hasSupl",
        ].map((x) => (
          <div
            class={[
              css({
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "5px",
              }),
              bold,
            ]}
          >
            <div>{prop2text[x] || x}</div>
            <div class={css({ color: "var(--current-fg)" })}>
              {parse(x, college[x]) || "N/A"}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
function parse(key: string, x: any) {
  if (typeof x === "boolean") return x ? "yes" : "no";
  if (x && deadlines.indexOf(key) > -1) return new Date(x).toDateString();
  return x;
}
