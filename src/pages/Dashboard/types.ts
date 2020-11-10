import { CollegeData } from "../../state";

export interface TabProps {
  setMessage(message?: unknown): void;
  collegeData?: CollegeData[];
}
