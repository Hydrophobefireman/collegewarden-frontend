export function fixAccepted(x: boolean | string) {
  if (typeof x === "boolean") {
    return x ? "Accepted" : "Pending";
  }
  return x;
}
