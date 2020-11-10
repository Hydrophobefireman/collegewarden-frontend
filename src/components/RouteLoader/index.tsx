import {
  Router,
  Path,
  AsyncComponent,
  ComponentType,
} from "@hydrophobefireman/ui-lib";
import { Object_entries as entries } from "@hydrophobefireman/j-utils";
import { NotFound } from "../../pages/404";
import { ChunkLoading } from "../ChunkLoadingComponent";
import { css } from "catom";

const getDefault: <T>(mod: { default: T }) => T = (mod) => mod.default;

const dashboardRoute = () => import("../../pages/Dashboard").then(getDefault);
// lazy load routes here
const componentMap = {
  "/": () => import("../../pages/Landing").then(getDefault),
  "/register": () => import("../../pages/Register").then(getDefault),
  "/login": () => import("../../pages/Login").then(getDefault),
  "/dashboard": dashboardRoute,
  "/dashboard/:tab": dashboardRoute,
};

export function RouteLoader() {
  return (
    <Router fallbackComponent={NotFound}>
      {entries(componentMap).map(([path, comp]) => (
        <Path match={path} component={RouteComponent} render={comp} />
      ))}
    </Router>
  );
  
}

function RouteComponent({ match, render, params }) {
  return (
    <section data-app-state={match} class={css({ padding: "1rem" })}>
      <AsyncComponent
        componentPromise={() =>
          render().then((R: ComponentType) => <R params={params} />)
        }
        fallback={ChunkLoading}
      />
    </section>
  );
}
