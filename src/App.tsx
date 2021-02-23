import "./App.css";
import "./themes.css";
import "./crypto/re-encrypt";

import { Init } from "./components/Layout";
import { init } from "@hydrophobefireman/qwc";
import { render } from "@hydrophobefireman/ui-lib";
import { syncOnStateUpdates } from "./syncData";
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

render(<App />, document.getElementById("app-mount"));
