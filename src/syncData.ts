import * as requests from "./util/http/requests";

import { CollegeData, colleges, didFetch, passwordData } from "./state";
import { get, set, subscribe } from "statedrive";

import { encryptJson } from "./crypto/encrypt";
import { fileRoutes } from "./util/http/api_routes";

export function syncOnStateUpdates() {
  subscribe(colleges, async (oldData, newData) => {
    if (get(didFetch)) {
      set(didFetch, false);
      return;
    }
    uploadData(newData);
  });
}

export async function uploadData(newData: CollegeData[]) {
  const n = newData.map((x) => {
    return {
      ...x,
      data: {
        id: x.data.id,
        __internal: { id: x.data.id, name: x.data.name },
      } as any,
    };
  });

  const data = await encryptJson(n, get(passwordData));

  return requests.postBinary(fileRoutes.uploadInfoDict, data.encryptedBuf, {
    "x-cw-iv": data.meta,
    "x-cw-data-type": "encrypted_json",
  });
}
