import { get } from "statedrive";
import { authData } from "../../state";
import { host } from "../constants";
const absoluteURL = (str: string): string => {
  return new URL(str, host).href;
};

export const userRoutes = {
  register: absoluteURL("/accounts/register"),
  login: absoluteURL("/accounts/login"),
  refreshAuthToken: absoluteURL("/accounts/token/refresh/"),
  checkAuth: absoluteURL("/accounts/whoami"),
  getFiles: () => absoluteURL(`/accounts/${get(authData).user}/files`),
};

export const fileRoutes = {
  download: (id: string) => absoluteURL(`/files/${id}`),
  delete: absoluteURL(`/files/_/delete`),
  upload: absoluteURL("/files/upload/"),
  getInfoDict: absoluteURL("/info/"),
  uploadInfoDict: absoluteURL("/info/upload"),
};
