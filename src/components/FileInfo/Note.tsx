import { fileCard } from "../../pages/Dashboard/DashboardTabs/DashboadTabs.style";
import { bold } from "../../styles";
import { FileEntryProps, getDecryptedFileProp } from "./FileUtil";
export function Note({ data, password, open }: FileEntryProps) {
  const title = data && getDecryptedFileProp(data, password, "title");
  return (
    <button class={fileCard} onClick={() => open()}>
      <div class={bold}>{title}</div>
    </button>
  );
}
