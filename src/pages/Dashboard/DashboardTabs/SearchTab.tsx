import { $req, GlCollegeData, clean, searchItems } from "./util";
import { actionButton, bold, center } from "../../../styles";
import { useEffect, useState } from "@hydrophobefireman/ui-lib";

import { AddUniversity } from "./AddUniversity";
import { AnimatedInput } from "../../../components/AnimatedInput";
import { ChunkLoading } from "../../../components/ChunkLoadingComponent";
import { Filter } from "../../../components/Icons/Filter";
import { ModalLayout } from "../../../components/Layout/ModalLayout";
import { SearchResults } from "./SearchResults";
import { TabProps } from "../types";
import { css } from "catom";
import { prop2text } from "../../../util/prop2text";
import { searchResultBox } from "./DashboadTabs.style";

export function Search({ setMessage }: TabProps) {
  const [colleges, setColleges] = useState<GlCollegeData[]>(null);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [results, setResults] = useState<GlCollegeData[]>(null);
  const [editFilter, setEditFilters] = useState(false);
  const [add, setAdd] = useState<GlCollegeData>(null);
  const [filters, setFilters] = useState(null);
  useEffect(() => {
    setLoading(true);
    import("../../../data/data.json")
      // @ts-ignore
      .then(({ default: data }) => {
        setColleges(data);
        setLoading(false);
      })
      .catch(() => setMessage("could not load data set"));
  }, []);

  useEffect(() => {
    const keys = filters ? Object.keys(filters) : [];
    const cleaned = clean(value);
    if (cleaned || keys.length)
      return $req(() => {
        if (!keys.length) return setResults(searchItems(value, colleges));
        const clg = colleges.filter((x) =>
          keys.every((a) => filters[a] === x[a])
        );
        return setResults(cleaned ? searchItems(cleaned, clg) : clg);
      });
    setResults([]);
  }, [value, filters]);
  function setFilterVal(e: JSX.TargetedMouseEvent<HTMLButtonElement>) {
    const c = e.currentTarget;
    const prop = c.dataset.prop;
    const value = c.dataset.value === "true";
    const f = filters || {};
    if ((f[prop] && value) || (prop in f && !f[prop] && !value)) {
      delete f[prop];
      return setFilters({ ...f });
    }
    f[prop] = value;
    setFilters({ ...f });
  }
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
      {editFilter && (
        <ModalLayout close={() => setEditFilters(false)}>
          {["caEssayReqd", "hasSupl", "hasFeeUS", "hasFeeIntl"].map((x) => (
            <div class={css({ marginTop: "5px" })}>
              <div class={bold}>{prop2text[x]}?</div>
              <div>
                <button
                  data-prop={x}
                  data-value={"true"}
                  onClick={setFilterVal}
                  class={actionButton}
                  style={{
                    background:
                      filters && filters[x] ? "var(--current-text-color)" : "",
                  }}
                >
                  yes
                </button>
                <button
                  data-prop={x}
                  data-value={"false"}
                  onClick={setFilterVal}
                  class={actionButton}
                  style={{
                    background:
                      filters && x in filters && !filters[x]
                        ? "var(--current-text-color)"
                        : "",
                  }}
                >
                  no
                </button>
              </div>
            </div>
          ))}
        </ModalLayout>
      )}
      {add && <AddUniversity college={add} close={() => setAdd(null)} />}
      <div class={css({ display: "flex", alignItems: "flex-end" })}>
        <AnimatedInput
          labelText="Search Colleges"
          onInput={setValue}
          value={value}
          wrapperClass={css({ flex: 1 })}
        />
        <button
          onClick={() => setEditFilters(true)}
          class={css({
            background: "none",
            border: "none",
            display: "inline-flex",
            cursor: "pointer",
          })}
        >
          <Filter />
        </button>
      </div>
      {results && results.length > 0 && (
        <>
          <div>
            Found <b>{results.length}</b>{" "}
            {results.length === 1 ? "college" : "colleges"}
          </div>
          <section class={searchResultBox}>
            <SearchResults
              results={results}
              onClick={(e) => setAdd(JSON.parse(e.currentTarget.dataset.js))}
            />
          </section>
        </>
      )}
    </div>
  );
}
