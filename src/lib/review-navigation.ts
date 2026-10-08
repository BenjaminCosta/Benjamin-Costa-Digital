/** Keep a complete set of visible cards in view, without an empty final page. */
export function getReviewPosition(index: number, count: number, visible: number) {
  const maximum = Math.max(0, count - Math.max(1, visible));
  return Math.min(maximum, Math.max(0, Number.isFinite(index) ? Math.round(index) : 0));
}
