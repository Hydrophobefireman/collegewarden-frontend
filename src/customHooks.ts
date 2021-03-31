import {
  Router,
  RouterSubscription,
  redirect,
  useEffect,
  useRef,
  useState,
} from "@hydrophobefireman/ui-lib";

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
const preventDefault = (e: Event) => e.preventDefault();
export function useFileDrop(el?: HTMLElement): [File[] | null, () => void] {
  el = el || document.documentElement;
  const [files, setFiles] = useState(null);
  useEffect(() => {
    const onDrop = (e: DragEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (e.dataTransfer.items) {
        const tf = Array.from(e.dataTransfer.items);
        setFiles(
          tf
            .map((i) => (i.kind === "file" ? i.getAsFile() : null))
            .filter(Boolean)
        );
      } else {
        setFiles(Array.from(e.dataTransfer.files));
      }
    };
    el.addEventListener("drop", onDrop);
    el.addEventListener("dragover", preventDefault);
    return () => {
      el.removeEventListener("drop", onDrop);
      el.removeEventListener("dragover", preventDefault);
    };
  }, []);
  return [files && files.length ? files : null, () => setFiles(null)];
}
