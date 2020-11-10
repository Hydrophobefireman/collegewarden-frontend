import { Introduction } from "./Introduction";
import { Questions } from "./Questions";

/** Exported routes need to be default exports */
export default function Landing() {
  return (
    <div>
      <Introduction />
      <Questions />
    </div>
  );
}
