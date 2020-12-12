import { GlCollegeData } from "./pages/Dashboard/DashboardTabs/util";
import { createState } from "statedrive";
export interface UserData {
  name: string;
  user: string;
  created_at: number;
}
export interface FileData {
  owner: string;
  file_id: string;
  file_enc_meta: string;
}
export interface FileDataResponse {
  files: FileData[];
}

export interface CollegeData {
  decisionTimeline: "ED" | "EA" | "RD" | "ED2";
  decisionDate?: number;
  portalLink?: string;
  portalPassword?: string;
  applied?: boolean;
  appliedWithFinAid?: boolean;
  notes?: string;
  data: GlCollegeData;
  accepted?: boolean;
}

export interface UserDataResponse {
  user_data: UserData;
}

export const authData = createState<UserData>({
  initialValue: { name: null, user: null, created_at: null },
});

export const colleges = createState<CollegeData[]>({ initialValue: null });

export const files = createState<FileData[]>({ initialValue: null });

export const passwordData = createState<string>({ initialValue: null });

export const didFetch = createState({ initialValue: true });
