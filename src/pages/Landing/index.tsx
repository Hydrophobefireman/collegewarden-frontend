import { Introduction } from "./Introduction";
import { Questions } from "./Questions";
import { Footer } from "./Footer";
/** Exported routes need to be default exports */
export default function Landing() {
  return (
    <div>
      <Introduction />
      <Questions />
      <Footer />
    </div>
  );
}
