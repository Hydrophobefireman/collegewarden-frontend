import { AddIcon } from "../../../components/Icons/Add";
import { NameLogo } from "../../../components/NameLogo";
import {
  addButton,
  searchResultButton,
  searchResultTitle,
} from "./DashboadTabs.style";
import { SearchCollege } from "./util";

export function SearchResults({
  results,
  onClick,
}: {
  results: SearchCollege[];
  onClick: JSX.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <>
      {results.map((x) => (
        <button onClick={onClick} data-name={x.name} class={searchResultButton}>
          <NameLogo text={x.name} size="3rem" />
          <span class={searchResultTitle}>{x.name}</span>
          <button tabIndex={-1} class={addButton}>
            <AddIcon size="2rem" />
          </button>
        </button>
      ))}
    </>
  );
}
