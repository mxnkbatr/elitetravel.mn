/** Floating dock in app/(tabs)/_layout.tsx. The fold math uses the same numbers. */
export const DOCK_HEIGHT = 68;
export const DOCK_BOTTOM_MIN = 10;

export function dockTop(windowHeight: number, bottomInset: number) {
  return windowHeight - Math.max(bottomInset, DOCK_BOTTOM_MIN) - DOCK_HEIGHT;
}

export type HomeMetrics = {
  compact: boolean;
  hero: number;
  titleSize: number;
  searchOverlap: number;
  searchHeight: number;
  searchTop: number;
  afterSearch: number;
  storiesHeight: number;
  blockGap: number;
  chipsHeight: number;
  sectionBlock: number;
  cardGap: number;
  cardHeight: number;
  plateInset: number;
  cardTop: number;
  plateBottom: number;
};

/**
 * Vertical rhythm for the home screen.
 * Compact is the iPhone SE class (height under 740). The first card's price
 * sits above the dock on both that phone and an iPhone 15 Pro.
 */
export function homeLayout(windowHeight: number): HomeMetrics {
  const compact = windowHeight < 740;
  const hero = compact ? 232 : 348;
  const searchOverlap = compact ? 20 : 26;
  const searchHeight = compact ? 48 : 54;
  const afterSearch = compact ? 10 : 16;
  const storiesHeight = compact ? 52 : 58;
  const blockGap = compact ? 8 : 12;
  const chipsHeight = compact ? 34 : 36;
  const sectionBlock = compact ? 32 : 40;
  const cardGap = compact ? 6 : 8;
  const cardHeight = compact ? 172 : 180;
  const plateInset = 8;
  const searchTop = hero - searchOverlap;
  const searchBottom = searchTop + searchHeight;
  const storiesBottom = searchBottom + afterSearch + storiesHeight;
  const chipsBottom = storiesBottom + blockGap + chipsHeight;
  const sectionBottom = chipsBottom + blockGap + sectionBlock;
  const cardTop = sectionBottom + cardGap;
  const plateBottom = cardTop + cardHeight - plateInset;
  return {
    compact,
    hero,
    titleSize: compact ? 32 : 46,
    searchOverlap,
    searchHeight,
    searchTop,
    afterSearch,
    storiesHeight,
    blockGap,
    chipsHeight,
    sectionBlock,
    cardGap,
    cardHeight,
    plateInset,
    cardTop,
    plateBottom,
  };
}

/** Headline block fits between the wordmark and the search field. */
export function heroCopyFits(windowHeight: number, topInset: number) {
  const layout = homeLayout(windowHeight);
  const wordmarkBottom = topInset + 8 + 34;
  const available = layout.searchTop - 12 - wordmarkBottom;
  const line = layout.titleSize + 2;
  const block = line * 3 + 6 + 18;
  return available >= block;
}
