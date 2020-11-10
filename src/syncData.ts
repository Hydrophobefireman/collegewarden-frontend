import { colleges, didFetch, passwordData } from "./state";
import { get, set, subscribe } from "statedrive";
import * as requests from "./util/http/requests";
import { fileRoutes } from "./util/http/api_routes";
import { encryptJson } from "./crypto/encrypt";

export function syncOnStateUpdates() {
  subscribe(colleges, async (oldData, newData) => {
    if (get(didFetch)) {
      set(didFetch, false);
      return;
    }
    const data = await encryptJson(newData, get(passwordData));
    requests.postBinary(fileRoutes.uploadInfoDict, data.encryptedBuf, {
      "x-cw-iv": data.meta,
      "x-cw-data-type": "encrypted_json",
    });
  });
}
