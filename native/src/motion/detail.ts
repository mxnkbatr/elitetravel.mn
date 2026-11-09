/**
 * Scale used when the measured card flight does not run (web fallback and a missed measure).
 * Reduced motion stays still. The iOS flight itself is the spring in FlyingHero.
 */
export function detailEntrance(reducedMotion: boolean) {
  if (reducedMotion) return { fromScale: 1, duration: 0 };
  return { fromScale: 1.06, duration: 720 };
}
