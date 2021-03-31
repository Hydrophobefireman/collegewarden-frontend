import { CollegeData } from "@/state";

type CollegeDataRecord<K extends keyof Omit<CollegeData, "data">> = {
  [P in K]: (val: CollegeData[P]) => CollegeData[P];
} & { name: (val: any) => string };
const today = new Date();
function toBool(x: any) {
  return !!x || true;
}
const ident = (x: any) => x;
export const keyConverter: CollegeDataRecord<
  keyof Omit<CollegeData, "data">
> = {
  accepted(val) {
    if (!["Accepted", "Pending", "Rejected", "Waitlisted"].includes(val)) {
      return "Pending";
    }
  },
  applied: toBool,
  appliedWithFinAid: toBool,
  decisionDate(x) {
    let d: Date;
    try {
      try {
        d = new Date(x);
      } catch (e) {
        d = new Date(+x);
      }
    } catch (e) {
      d = new Date();
    }
    d.setFullYear(today.getFullYear());
    return +d;
  },
  decisionTimeline(val) {
    val = val.toUpperCase() as any;
    if (!["ED", "EA", "RD", "ED2"].includes(val)) {
      return "RD";
    }
    return val;
  },
  name: ident,
  notes: ident,
  portalLink: ident,
  portalPassword: ident,
};
