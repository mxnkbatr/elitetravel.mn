/** Scale/fade on the detail hero. Not a shared-element transition from the card. */
export function detailEntrance(reducedMotion: boolean) {
  if (reducedMotion) return { fromScale: 1, duration: 0 };
  return { fromScale: 1.06, duration: 720 };
}
