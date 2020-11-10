import { AsyncComponent } from "@hydrophobefireman/ui-lib";
import { set } from "statedrive";
import { authData, UserDataResponse } from "../../state";
import { userRoutes } from "../../util/http/api_routes";
import { RouteLoader } from "../RouteLoader";
import * as requests from "../../util/http/requests";
import { center } from "../../styles";
import { ChunkLoading } from "../ChunkLoadingComponent";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { Header } from "./Header";

function Layout() {
  return (
    <>
      <Header />
      <main>
        <RouteLoader />
      </main>
    </>
  );
}
const SUPPORTS_CRYPTO = !!(
  window.crypto &&
  window.crypto.subtle &&
  window.crypto.subtle.generateKey
);
export function Init() {
  if (!SUPPORTS_CRYPTO) return <div>your browser is not supported</div>;
  return (
    <>
      <AsyncComponent
        componentPromise={initPromise}
        fallback={
          <div class={center}>
            <ChunkLoading />
            <div>checking credentials</div>
          </div>
        }
      />
      <ThemeSwitcher />
    </>
  );
}

function initPromise() {
  return requests
    .get<UserDataResponse>(userRoutes.checkAuth)
    .result.then((resp) => {
      const { data } = resp;

      if (data && data.user_data) {
        set(authData, data.user_data);
      }
      return <Layout />;
    });
}
