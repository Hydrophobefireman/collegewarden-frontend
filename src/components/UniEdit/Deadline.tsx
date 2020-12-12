import { inlineContainer } from "./UniEdit.styles";
import { useRef } from "@hydrophobefireman/ui-lib";

export function Deadline({
  setDeadline,
  deadline,
}: {
  setDeadline(n: number): void;
  deadline: number;
}) {
  const input = useRef<HTMLInputElement>();

  function choseDecision() {
    const { current } = input;
    current && setDeadline(+new Date(current.value));
  }

  return (
    <div class={inlineContainer}>
      <div>Results</div>
      <input
        ref={input}
        min={dateTimeLocalCompat(new Date())}
        type="datetime-local"
        onInput={choseDecision}
        value={dateTimeLocalCompat(new Date(deadline))}
      />
    </div>
  );
}
export function dateTimeLocalCompat(d: Date): string {
  return d.toISOString().split(":").slice(0, -1).join(":");
}
