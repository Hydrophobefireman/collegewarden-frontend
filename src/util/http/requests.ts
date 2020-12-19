import { get as idbGet, set as idbSet } from "../idb";

import { Object_assign } from "@hydrophobefireman/j-utils";
import { userRoutes } from "./api_routes";

interface AuthenticationTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AbortableFetchResponse<T> {
  result: Promise<{ data: T; error?: string }>;
  controller: AbortController;
  headers: Promise<Headers>;
}
const tokens: AuthenticationTokens = { accessToken: null, refreshToken: null };

function _headers(tokens: AuthenticationTokens) {
  return {
    Authorization: `Bearer ${tokens.accessToken}`,
    "x-refresh-token": tokens.refreshToken,
  };
}
const ACCESS_TOKEN = "auth_tokens.access";
const REFRESH_TOKEN = "auth_tokens.refresh";

const getAuthenticationHeaders = async function () {
  if (tokens && tokens.accessToken && tokens.refreshToken)
    return _headers(tokens);

  const access = await idbGet<string>(ACCESS_TOKEN);
  const refresh = await idbGet<string>(REFRESH_TOKEN);
  if (!access && !refresh) return {};
  tokens.accessToken = access;
  tokens.refreshToken = refresh;
  return _headers(tokens);
};

export function updateTokens(access: string, refresh: string) {
  if (access != null) {
    access = access || null;
    idbSet(ACCESS_TOKEN, access);
    tokens.accessToken = access;
  }
  if (refresh != null) {
    refresh = refresh || null;
    idbSet(REFRESH_TOKEN, refresh);
    tokens.refreshToken = refresh;
  }
}
type RType = "json" | "arrayBuffer";
async function _awaitData<T>(url: string, options?: RequestInit, type?: RType) {
  let data: { data: T; error?: string };
  let response: Response;
  try {
    options.headers = Object_assign(
      options.headers,
      await getAuthenticationHeaders()
    );
    response = await fetch(url, options);
    const responseHeaders = response.headers;

    updateTokens(
      responseHeaders.get("x-access-token"),
      responseHeaders.get("x-refresh-token")
    );

    data = await response[type]();
  } catch (e) {
    if (e instanceof DOMException) return { data: {} };
    console.log(e);
    data = { error: "a network error occured", data: null };
  }

  return { data, headers: response && response.headers };
}
function _prepareFetch<T = {}>(
  url: string,
  options?: RequestInit,
  type: RType = "json"
) {
  const controller = new AbortController();
  const signal = controller.signal;
  options.signal = signal;
  const prom = _awaitData(url, options, type);
  const data = prom.then(({ data }) => data);
  const headers = prom.then(({ headers }) => headers);
  return { result: data, controller, headers } as AbortableFetchResponse<T>;
}

const wrap = <T extends Array<any>, U>(fn: (...args: T) => U) => {
  function wrapped(...args: T): U;
  function wrapped(): U {
    const args = [].slice.call(arguments);
    const res: AbortableFetchResponse<unknown> = fn.apply(null, args);
    const resp = ({
      controller: res.controller,
      result: res.result.then((js) => {
        if (js.error == "refresh") {
          return _get(userRoutes.refreshAuthToken).result.then((x) =>
            x.error ? x : fn.apply(null, args).result
          );
        }
        return js;
      }),
      headers: res.headers,
    } as unknown) as U;
    return resp;
  }
  return wrapped;
};

function _get<T = {}>(
  url: string,
  headers?: Record<string, string>,
  options?: RequestInit
) {
  options = Object_assign({}, options || {}, {
    method: "get",
    headers: headers || (options && (options.headers as object)) || {},
  });
  const response = _prepareFetch<T>(url, options);

  return response;
}

function _postJSON<T = {}>(
  url: string,
  body: object,
  headers?: Record<string, string>,
  options?: RequestInit
) {
  options = Object_assign({}, options || {}, {
    body: JSON.stringify(body),
    method: "post",
    headers: Object_assign(
      { "content-type": "application/json" },
      headers || (options && (options.headers as object)) || {}
    ),
  });
  return _prepareFetch<T>(url, options);
}

function _getBinary(
  url: string,
  headers?: Record<string, string>,
  options?: RequestInit
) {
  options = Object_assign({}, options || {}, {
    method: "get",
    headers: headers || (options && (options.headers as object)) || {},
  });
  return _prepareFetch<ArrayBuffer>(url, options, "arrayBuffer") as {
    result: Promise<ArrayBuffer | { error?: string }>;
    controller: AbortController;
    headers: Promise<Headers>;
  };
}
function _postBinary<T>(
  url: string,
  body: ArrayBuffer,
  headers?: Record<string, string>,
  options?: RequestInit
) {
  options = Object_assign({}, options || {}, {
    method: "post",
    body,
    headers: headers || (options && (options.headers as object)) || {},
  });
  return _prepareFetch<T>(url, options);
}

export const get = wrap(_get);

export const postJSON = wrap(_postJSON);

export const getBinary = wrap(_getBinary);

export const postBinary = wrap(_postBinary);
