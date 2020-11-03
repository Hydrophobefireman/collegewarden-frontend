import { render ,VNode} from "@hydrophobefireman/ui-lib";
import { RouteLoader } from "./components/RouteLoader";
import "./App.css";

function App() {
  return (
    <main>
      <RouteLoader />
    </main>
  );
}

render(<App />, document.getElementById("app-mount"));
