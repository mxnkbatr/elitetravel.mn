/** In-memory only. A new JS runtime may show the intro again. Tabs and foregrounding do not. */
let played = false;

export const INTRO_CINEMATIC_MS = 2300;
export const INTRO_REDUCED_MS = 650;
export const INTRO_SKIP_MS = 220;

export type IntroPlan = {
  mode: "cinematic" | "fade";
  duration: number;
  zoom: boolean;
};

export function introAlreadyPlayed() {
  return played;
}

export function markIntroPlayed() {
  played = true;
}

export function resetIntroForTests() {
  played = false;
}

/** Does not consult the network. Reduced motion is a short fade, not a zoom. */
export function introPlan(reducedMotion: boolean): IntroPlan {
  if (reducedMotion) return { mode: "fade", duration: INTRO_REDUCED_MS, zoom: false };
  return { mode: "cinematic", duration: INTRO_CINEMATIC_MS, zoom: true };
}

export function shouldShowIntro() {
  return !played;
}
