import { CollegeIcon } from "../../components/Icons/College";
import { FilesIcon } from "../../components/Icons/Files";
import { SearchIcon } from "../../components/Icons/Search";
import { dashboardLink, dashboardNav } from "./Dashboard.styles";
import { DashboardLink } from "./DashboardLink";

export function DashboardNav({ location }: { location: string }) {
  return (
    <nav class={dashboardNav}>
      <DashboardLink
        class={dashboardLink}
        href="/dashboard/colleges"
        location={location}
        icon={CollegeIcon}
        text="my colleges"
      ></DashboardLink>
      <DashboardLink
        class={dashboardLink}
        href="/dashboard/files"
        location={location}
        icon={FilesIcon}
        text="my files"
      ></DashboardLink>
      <DashboardLink
        class={dashboardLink}
        href="/dashboard/search"
        location={location}
        icon={SearchIcon}
        text="college search"
      ></DashboardLink>
    </nav>
  );
}
