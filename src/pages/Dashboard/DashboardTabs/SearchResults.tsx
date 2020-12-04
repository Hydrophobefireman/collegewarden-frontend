import {
  addButton,
  searchResultButton,
  searchResultTitle,
} from "./DashboadTabs.style";

import { AddIcon } from "../../../components/Icons/Add";
import { GlCollegeData } from "./util";
import { NameLogo } from "../../../components/NameLogo";

export function SearchResults({
  results,
  onClick,
}: {
  results: GlCollegeData[];
  onClick: JSX.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <>
      {results.map((x) => (
        <button
          onClick={onClick}
          data-js={JSON.stringify(x)}
          class={searchResultButton}
        >
          <NameLogo text={x.name} size="3rem" />
          <span class={searchResultTitle}>{x.name}</span>
          <button
            tabIndex={-1}
            class={addButton}
            title={`Add ${x.name} to my colleges`}
          >
            <AddIcon size="2rem" />
          </button>
        </button>
      ))}
    </>
  );
}
