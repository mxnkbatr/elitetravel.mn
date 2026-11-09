export type HeroRect = { x: number; y: number; width: number; height: number };

let staged: { id: string; rect: HeroRect } | null = null;

/** Remember the card image frame, then let the detail screen fly it into the hero. */
export function stageHeroFlight(id: string, rect: HeroRect) {
  staged = { id, rect };
}

export function peekHeroFlight(id: string) {
  if (!staged || staged.id !== id) return null;
  return staged.rect;
}

export function takeHeroFlight(id: string) {
  const rect = peekHeroFlight(id);
  if (rect) staged = null;
  return rect;
}

export function resetHeroFlightForTests() {
  staged = null;
}
