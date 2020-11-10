import { CollegeData } from "../../../state";
import { clean as _clean } from "../../../util/validate/validators";

export const clean = (x: string) => _clean(x).toLowerCase();
export const $req = window.requestAnimationFrame
  ? (cb: FrameRequestCallback) => window.requestAnimationFrame(cb)
  : setTimeout;

export interface SearchCollege {
  name: string;
  alias?: string[];
  search?: string;
}

export function sanitizeCollegeData(data: SearchCollege[]) {
  return data.map(({ name, alias }) => ({
    name,
    search: clean(name),
    alias: alias && alias.map(clean),
  }));
}

const LIMIT = 100;
export function search(needle: string, haystack: SearchCollege[]) {
  const cleaned = clean(needle);
  return haystack
    .filter((next) => {
      if (
        next.search.includes(cleaned) ||
        (next.alias && next.alias.some((x) => x.includes(cleaned)))
      ) {
        return true;
      }
    })
    .slice(0, LIMIT);
}
