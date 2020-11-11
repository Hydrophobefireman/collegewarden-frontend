import { render } from "@hydrophobefireman/ui-lib";
import { init } from "@hydrophobefireman/qwc";
import { Init } from "./components/Layout";
import { syncOnStateUpdates } from "./syncData";
import "./App.css";
import "./themes.css";
import { dec } from "./crypto/util";
init({
  "loading-spinner": {
    observedAttributes: [
      {
        prop: "size",
        listener(_: string, nv: string) {
          const h = nv ? `${nv}${nv.includes("px") ? "" : "px"}` : "50px";
          const style = this.shadowRoot.querySelector(".spinner").style;
          style.height = style.width = h;
        },
      },
    ],
  },
});
syncOnStateUpdates();
function App() {
  return <Init />;
}
console.log(dec);

render(<App />, document.getElementById("app-mount"));
