import {
  AsyncComponent,
  ComponentType,
  Path,
  Router,
  useEffect,
  useMemo,
} from "@hydrophobefireman/ui-lib";

import { ChunkLoading } from "../ChunkLoadingComponent";
import { NotFound } from "@/pages/404";
import { Object_entries as entries } from "@hydrophobefireman/j-utils";

const getDefault: <T>(mod: { default: T }) => T = (mod) => mod.default;

const dashboardRoute = () => import("@/pages/Dashboard").then(getDefault);
// lazy load routes here
const componentMap = {
  "/": () => import("@/pages/Landing").then(getDefault),
  "/register": () => import("@/pages/Register").then(getDefault),
  "/login": () => import("@/pages/Login").then(getDefault),
  "/dashboard": dashboardRoute,
  "/dashboard/:tab": dashboardRoute,
  "/security": () => import("@/pages/Security").then(getDefault),
  "/import": () => import("@/pages/Import").then(getDefault),
};
const routerFlag = new URLSearchParams(location.search).has(
  "useInMemoryRouter"
);
export function RouteLoader() {
  return (
    <Router fallbackComponent={NotFound} inMemoryRouter={routerFlag}>
      {entries(componentMap).map(([path, comp]) => (
        <Path match={path} component={RouteComponent} render={comp} />
      ))}
    </Router>
  );
}

function RouteComponent({ match, render, params }) {
  const func = useMemo(() => (R: ComponentType) => <R params={params} />, [
    params,
  ]);
  return (
    <section data-app-state={match} class="route-section">
      <AsyncComponent
        componentPromise={() => render().then(func)}
        fallback={ChunkLoading}
      />
    </section>
  );
}
