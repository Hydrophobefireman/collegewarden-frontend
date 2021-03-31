import { css } from "catom";
import { keyConverter } from "./keyConverter";

export function Select({
  keyIndex,
  format,
  setFormat,
}: {
  keyIndex: number;
  format: Array<any>;
  setFormat(a: any): void;
}) {
  function setIndex(e: JSX.TargetedEvent<HTMLSelectElement>) {
    const { name, index } = JSON.parse(e.currentTarget.value);
    const f = format.slice();
    f[index] = name;
    setFormat(f);
  }
  const keys = Object.keys(keyConverter);
  const NA = { index: keyIndex, name: "N/A" };
  return (
    <select
      onInput={setIndex}
      class={css({
        width: "500px",
        maxWidth: "80vw",
        outline: "none",
        padding: ".5rem",
      })}
    >
      <option value="" selected={format[keyIndex] == null} disabled></option>
      {keys.map(
        (name, i) =>
          (!format.includes(name as any) || format[keyIndex] === name) && (
            <option
              value={JSON.stringify({ name, index: keyIndex })}
              data-index={keyIndex}
              data-name={name}
              selected={format[keyIndex] === name}
              data-selected={`${format[keyIndex] === name}`}
            >
              {humanReadable[name]}
            </option>
          )
      )}
      <option
        data-index={keyIndex}
        value={JSON.stringify(NA)}
        selected={format[keyIndex] === NA.name}
        data-selected={`${format[keyIndex] === NA.name}`}
      >
        Other (will be ignored)
      </option>
    </select>
  );
}

const humanReadable: Record<keyof typeof keyConverter, string> = {
  accepted: "Acceptance status (string)",
  applied: "Application (applied or not) (boolean)",
  appliedWithFinAid: "Applied for fin-aid? (boolean)",
  decisionDate: "Decision Date (timestamp)",
  decisionTimeline: "Decision Time line (EA | ED | RD | ED2)",
  name: "College name",
  notes: "Extra notes for the college",
  portalLink: "Portal URL",
  portalPassword: "Password of the portal",
};
