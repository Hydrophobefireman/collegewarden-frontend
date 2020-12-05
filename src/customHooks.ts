import {
  Router,
  RouterSubscription,
  redirect,
  useEffect,
  useRef,
  useState,
} from "@hydrophobefireman/ui-lib";

import { auth } from "./util/auth";
import { authData } from "./state";
import { useSharedStateValue } from "statedrive";

function useMount(fn: () => unknown | (() => void)) {
  return useEffect(fn, []);
}

const getPath = () => Router.path + Router.qs;
export const useLocation = (): string => {
  const [loc, setLoc] = useState(getPath);
  useMount(() => {
    const current = () => setLoc(getPath);
    RouterSubscription.subscribe(current);
    return () => RouterSubscription.unsubscribe(current);
  });
  return loc;
};

const getDimensions = (): [number, number] => [
  window.innerHeight,
  window.innerWidth,
];
export function useViewportSize(): [number, number] {
  const [dimensions, setDimensions] = useState(getDimensions);
  useMount(() => {
    const callback = () => setDimensions(getDimensions);
    addEventListener("resize", callback);
    return () => removeEventListener("resize", callback);
  });

  return dimensions;
}
interface CB {
  (...args: any): void;
}
export function useInterval(callback: CB, delay?: number) {
  const savedCallback = useRef<CB>();
  savedCallback.current = callback;
  useEffect(() => {
    const tick = () => savedCallback.current();
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export function useRequiredAuthentication(path: string): boolean {
  const data = useSharedStateValue(authData);
  const isLoggedIn = !!(data && data.user);
  useEffect(() => {
    if (!isLoggedIn) {
      return redirect(`/login?next=${path}`);
    }
  }, [isLoggedIn]);
  return isLoggedIn;
}
