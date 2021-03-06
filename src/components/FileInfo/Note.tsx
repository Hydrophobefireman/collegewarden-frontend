import {
  FileEntryProps,
  getDecryptedFileProp,
  getFileName,
} from "../../util/fileUtil";

import { bold } from "../../styles";
import { fileCard } from "../../pages/Dashboard/DashboardTabs/DashboadTabs.style";
export function Note({ data, password, open }: FileEntryProps) {
  const title = data && getFileName(data, password);
  return (
    <button class={fileCard} onClick={() => open()}>
      <div class={bold}>{title}</div>
    </button>
  );
}
