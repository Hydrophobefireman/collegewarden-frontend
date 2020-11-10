import { useRef, useState } from "@hydrophobefireman/ui-lib";
import { css } from "catom";
import { useInterval } from "../../customHooks";

export function IntdeterminateLoader() {
  const [width, setWidth] = useState(0);
  const percentRef = useRef(0);
  useInterval(
    () => {
      percentRef.current = Math.floor((percentRef.current || 100) / 2);
      setWidth((p) => Math.min((p as number) + percentRef.current, 100));
    },
    width >= 100 ? null : 1000
  );

  return <Loader width={width} />;
}

export function Loader({ width }: { width: number }) {
  return (
    <div
      style={{ transform: `scaleX(${width / 100})` }}
      class={css({
        width: "100%",
        position: "fixed",
        top: "0",
        left: "0",
        transition: "0.4s linear",
        height: "5px",
        backgroundColor: "var(--current-fg)",
        transformOrigin: "0% 0%",
      })}
    ></div>
  );
}
