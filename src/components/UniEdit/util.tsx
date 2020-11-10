import { CollegeData } from "../../state";

export interface StageProps {
  data?: CollegeData[];
  currentCollegeData?: CollegeData;
  close(e: MouseEvent): void;
  next(data?: CollegeData): unknown;
  name: string;
  allowReadonlyMode?: boolean;
}
