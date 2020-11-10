import { redirect } from "@hydrophobefireman/ui-lib";
import { get, set } from "statedrive";
import { authData, UserDataResponse } from "../state";
import { userRoutes } from "./http/api_routes";
import * as requests from "./http/requests";

const auth = {
  isLoggedIn(): boolean {
    const resp = get(authData);
    return resp && resp.user != null;
  },
  login(
    user: string,
    password: string
  ): requests.AbortableFetchResponse<UserDataResponse> {
    const response = requests.postJSON<UserDataResponse>(userRoutes.login, {
      user,
      password,
    });
    return {
      controller: response.controller,
      result: response.result.then((resp) => {
        const js = resp.data;
        const data = js && js.user_data;
        if (data) set(authData, data);
        return resp;
      }),
    };
  },
  logout() {
    set(authData, null);
    requests.updateTokens("", "");
    redirect("/login");
  },
};
export { auth };
