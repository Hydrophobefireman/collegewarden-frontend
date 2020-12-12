import { CollegeData } from "src/state";
import { GlCollegeData } from "./DashboardTabs/util";
import { clean } from "../../util/validate/validators";

export function validateCollegeDataWithNewApi(colleges: CollegeData[]) {
  return (
    import("../../data/data.json")
      // @ts-ignore
      .then(({ default: c }: { default: GlCollegeData[] }) => {
        const normalized = c.reduce((prev, current) => {
          prev[current.id] = current;
          return prev;
        }, {});
        return colleges.map((college) => {
          const data = college.data;
          // if (data && data.id && data.name) return college;
          if (data.id) {
            if (data.id < 0) {
              college.data = data.__internal;
            } else {
              college.data = normalized[data.id] || data.__internal;
            }
            return college;
          }
          college.data = {} as any;
          const name = (college as any).collegeName;
          college.data.name = name;
          c.some((x) => {
            if (x.$search.some((y) => y === clean(name))) {
              console.log("Found match..creating migration for", name);
              college.data = x;
              return true;
            }
          });
          return college;
        });
      })
    // .catch(console.log)
  );
}
