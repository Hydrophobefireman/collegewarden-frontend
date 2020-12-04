import { CollegeData } from "../../state";
import { GlCollegeData } from "src/pages/Dashboard/DashboardTabs/util";

export interface StageProps {
  data?: CollegeData[];
  currentCollegeData?: CollegeData;
  close(e: MouseEvent): void;
  next(data?: CollegeData): unknown;
  glCollegeData: GlCollegeData;
  allowReadonlyMode?: boolean;
}
