import { EditStage } from "@/components/UniEdit/EditStage";
import { CollegeData, colleges, didFetch } from "@/state";
import { actionButton } from "@/styles";
import { uploadData } from "@/syncData";
import { Object_assign } from "@hydrophobefireman/j-utils";
import { loadURL, useEffect, useState } from "@hydrophobefireman/ui-lib";
import { css } from "catom";
import { useSetSharedState, useSharedState } from "statedrive";
import { CollegeCard } from "../Dashboard/DashboardTabs/CollegeCard";
import { keyConverter } from "./keyConverter";
import { Select } from "./Select";
import { ImportFile } from "./types";
import { useValidInput } from "./useValidInput";

export function Importer({ file, reset }: { file: ImportFile; reset(): void }) {
  const { data, error } = useValidInput(file);
  const [arrayFormat, setArrayFormat] = useState<
    Array<keyof typeof keyConverter>
  >(null);

  if (error) {
    return (
      <div>
        <div>Could not import data due to the following error:</div>
        <div class={css({ color: "red" })}>{error}</div>
        <div>
          <button class={actionButton} onClick={reset}>
            Go back
          </button>
        </div>
      </div>
    );
  }
  return (
    data && (
      <div>
        {!arrayFormat ? (
          <FormatSetter update={setArrayFormat} data={data} />
        ) : (
          <Preview format={arrayFormat} data={data} reset={reset} />
        )}
      </div>
    )
  );
}

function FormatSetter({
  update,
  data,
}: {
  update(data: any): void;
  data: Array<any[]>;
}) {
  const [format, setFormat] = useState<Array<keyof typeof keyConverter>>([]);

  return (
    <div>
      <div class={css({ fontSize: "1.2rem", marginBottom: "1.5rem" })}>
        Since we don't know what your CSV is like, we'll need your help to set
        it up for us (you'll only have to do this once)
      </div>
      <div>
        {data[0].map(
          (x, keyIndex) =>
            x.trim() && (
              <div class={css({ display: "flex", flexDirection: "column" })}>
                <span>
                  <b class={css({ color: "var(--current-fg)" })}>{x}</b> is
                </span>
                <div>
                  <Select
                    setFormat={setFormat}
                    keyIndex={keyIndex}
                    format={format}
                  />
                </div>
              </div>
            )
        )}
      </div>
      <div class={css({ marginTop: "1rem" })}>
        <button class={actionButton} onClick={() => update(format)}>
          Submit
        </button>
      </div>
    </div>
  );
}

function Preview({
  data,
  format,
  reset,
}: {
  data: Array<any[]>;
  format: Array<keyof typeof keyConverter>;
  reset(): void;
}) {
  const [collegeData, setCollegeData] = useSharedState(colleges);
  const [editCollege, setEditCollege] = useState<CollegeData>(null);
  const [cData, setCData] = useCdata(data, format);
  const setDidFetch = useSetSharedState(didFetch);
  if (cData == null) {
    return (
      <div>
        <div>One or more colleges don't have a name, please fix your data</div>
        <div class={css({ marginTop: "2rem" })}>
          <button class={actionButton} onClick={reset}>
            Go back
          </button>
        </div>
      </div>
    );
  }
  const close = () => setEditCollege(null);
  return (
    <>
      {editCollege && (
        <EditStage
          glCollegeData={{
            ...editCollege.data,
            __internal: editCollege.data,
          }}
          close={close}
          next={(d) => {
            const draft = cData.map((x) => {
              if (x.data.name === editCollege.data.name) {
                d.data = x.data;
                return d;
              }
              return x;
            });
            setCData(draft);
            close();
          }}
          currentCollegeData={editCollege}
        />
      )}
      <div>Review and update (you can always edit them later)</div>
      <div
        class={css({
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
        })}
      >
        {cData.map((x) => (
          <CollegeCard setCollege={setEditCollege} data={x} />
        ))}
      </div>
      <div>
        <button
          class={actionButton}
          onClick={() => {
            const x = (collegeData || []).concat(cData);
            uploadData(x).then(() => {
              setDidFetch(true);
              setCollegeData(x);
              loadURL("/");
            });
          }}
        >
          Update
        </button>
      </div>
    </>
  );
}

function useCdata(data: any[], format: any[]) {
  const [cData, setCData] = useState([]);
  useEffect(() => {
    const tmp = [];
    for (const x of data) {
      const obj: CollegeData = {
        data: { id: -new Date() + Math.random() },
      } as any;
      x.forEach((value: any, index: any) => {
        const key = format[index];

        const func = keyConverter[key];
        if (func) {
          const val = (func as any)(value);
          if (key === "name") {
            obj.data.name = val;
          } else (obj as any)[key] = val;
        }
      });
      if (!obj.data.name) {
        return setCData(null);
      }

      tmp.push(
        Object_assign(
          {
            applied: true,
            decisionTimeline: "RD",
            accepted: "Pending",
            appliedWithFinAid: false,
          } as Partial<CollegeData>,
          obj
        )
      );
    }
    setCData(tmp);
  }, [data, format]);
  return [cData, setCData] as [CollegeData[], (d: CollegeData[]) => void];
}
