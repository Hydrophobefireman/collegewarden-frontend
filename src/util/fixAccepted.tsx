export function fixAccepted(x: boolean | string) {
  if (typeof x === "boolean" || typeof x === "undefined") {
    return x ? "Accepted" : "Pending";
  }
  return x;
}
