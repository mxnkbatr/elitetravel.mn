/** In-memory guard for this runtime. The seen flag in storage skips later launches. */
let played = false;

export const INTRO_SEEN_KEY = "elite.intro.seen";
/** Hold, photo reveal, and settle into the home hero. Never above two seconds. */
export const INTRO_CINEMATIC_MS = 1900;
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

/** First launch plays. A stored flag, or an intro already finished this runtime, skips. */
export function resolveIntroGate(stored: string | null): "play" | "skip" {
  if (played || stored === "1") return "skip";
  return "play";
}
