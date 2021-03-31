import { useEffect, useState } from "@hydrophobefireman/ui-lib";
import { ImportFile } from "./types";

const objPattern = new RegExp(
  '(\\,|\\r?\\n|\\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^\\,\\r\\n]*))',
  "gi"
);
const quotesRegex = new RegExp('""', "g");
function csvToArray(csvString: string): Array<any> {
  let arrMatches = null,
    arrData = [[]];
  while ((arrMatches = objPattern.exec(csvString))) {
    if (arrMatches[1].length && arrMatches[1] !== ",") arrData.push([]);
    arrData[arrData.length - 1].push(
      arrMatches[2] ? arrMatches[2].replace(quotesRegex, '"') : arrMatches[3]
    );
  }
  return arrData;
}

export function useValidInput(file: ImportFile) {
  const [error, setError] = useState("");
  const [arrData, setData] = useState<Array<any[]>>(null);
  useEffect(() => {
    const { buf, name, type } = file;
    let arr: Array<any>;
    try {
      if (type.includes("csv")) {
        arr = csvToArray(buf); //.map((x) => x.filter(Boolean));
      } else if (type.includes("json")) {
        arr = JSON.parse(buf);
      } else {
        try {
          arr = JSON.parse(buf);
        } catch (e) {
          arr = csvToArray(buf);
          if (!arr.length || arr[0].length <= 1) {
            throw new Error("Unsupported file type");
          }
        }
      }
      setData(arr);
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  }, [file]);

  return { data: arrData, error: error || null };
}
