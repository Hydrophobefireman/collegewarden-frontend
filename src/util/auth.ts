import * as requests from "./http/requests";

import {
  UserDataResponse,
  authData,
  colleges,
  didFetch,
  files,
} from "../state";
import { get, set, subscribe } from "statedrive";

import { redirect } from "@hydrophobefireman/ui-lib";
import { userRoutes } from "./http/api_routes";

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
    requests.updateTokens("", "");
    set(didFetch, true);
    set(authData, null);
    set(colleges, null);
    set(files, null);
    redirect("/login");
  },
};

export { auth };
