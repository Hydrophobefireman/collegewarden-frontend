import {
  useState,
  Router,
  useEffect,
  RouterSubscription,
} from "@hydrophobefireman/ui-lib";

function useMount(fn: () => unknown | (() => void)) {
  return useEffect(fn, []);
}

const getPath = () => Router.path;
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
