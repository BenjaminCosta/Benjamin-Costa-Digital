export function getProjectIndex(index: number, total: number): number {
  if (total < 1 || !Number.isInteger(total) || !Number.isFinite(index)) return 0;
  return ((Math.trunc(index) % total) + total) % total;
}

type Point = Readonly<{ x: number; y: number }>;

/** Ignore taps and vertical gestures so scrolling the page stays natural. */
export function getSwipeStep(start: Point, end: Point): -1 | 0 | 1 {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.4) return 0;
  return dx < 0 ? 1 : -1;
}
