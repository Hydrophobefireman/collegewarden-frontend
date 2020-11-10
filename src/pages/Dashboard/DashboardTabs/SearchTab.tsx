import { useEffect, useState } from "@hydrophobefireman/ui-lib";
import { css } from "catom";
import { AnimatedInput } from "../../../components/AnimatedInput";
import { ChunkLoading } from "../../../components/ChunkLoadingComponent";
import { center } from "../../../styles";
import { TabProps } from "../types";
import { AddUniversity } from "./AddUniversity";
import { searchResultBox } from "./DashboadTabs.style";
import { SearchResults } from "./SearchResults";
import {
  $req,
  clean,
  SearchCollege,
  sanitizeCollegeData,
  search,
} from "./util";

export function Search({ setMessage }: TabProps) {
  const [colleges, setColleges] = useState<SearchCollege[]>(null);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [results, setResults] = useState<SearchCollege[]>(null);

  const [add, setAdd] = useState(null);

  useEffect(() => {
    setLoading(true);
    import("../../../data/colleges-other-names.json")
      // @ts-ignore
      .then(({ default: data }) => {
        setColleges(sanitizeCollegeData(data));
        setLoading(false);
      })
      .catch(() => setMessage("could not load data set"));
  }, []);

  useEffect(() => {
    if (clean(value)) return $req(() => setResults(search(value, colleges)));
    setResults([]);
  }, [value]);

  const isReady = !loading && !!colleges;
  if (!isReady)
    return (
      <div class={center}>
        <ChunkLoading />
        <div>Fetching...</div>
      </div>
    );
  return (
    <div class={css({ marginTop: "2rem" })}>
      {add && <AddUniversity name={add} close={() => setAdd(null)} />}
      <AnimatedInput
        labelText="Search Colleges"
        onInput={setValue}
        value={value}
      />
      {results && results.length > 0 && (
        <section class={searchResultBox}>
          <SearchResults
            results={results}
            onClick={(e) => setAdd(e.currentTarget.dataset.name)}
          />
        </section>
      )}
    </div>
  );
}
