import { Router, Path, AsyncComponent } from "@hydrophobefireman/ui-lib";
import { Object_entries as entries } from "@hydrophobefireman/j-utils";
import { NotFound } from "../pages/404/404";
import { ChunkLoading } from "./ChunkLoadingComponent";

const getDefault: <T>(mod: { default: T }) => T = (mod) => mod.default;

// lazy load routes here
const componentMap = {
  "/": () => import("../pages/Landing/Landing").then(getDefault),
};

export function RouteLoader() {
  return (
    <Router fallbackComponent={NotFound}>
      {entries(componentMap).map(([path, comp]) => (
        <Path
          match={path}
          component={
            <section data-app-state={path} class="route-path">
              <AsyncComponent componentPromise={comp} fallback={ChunkLoading} />
            </section>
          }
        />
      ))}
    </Router>
  );
}
