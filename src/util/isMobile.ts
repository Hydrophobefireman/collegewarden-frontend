const THRESHOLD = 500;
export function isMobile(width: number): boolean {
  return width <= THRESHOLD;
}
