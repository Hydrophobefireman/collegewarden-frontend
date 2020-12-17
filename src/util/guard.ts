export function guard<T extends Function>(
    t: T,
    val: any
  ): val is T["prototype"] {
    return val instanceof t;
  }