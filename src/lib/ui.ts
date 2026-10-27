/** Shared pill filter / chip styles — matches destinations screenshot */
export function filterChipClass(active: boolean) {
  return [
    "shrink-0 rounded-full px-4 py-2.5 text-sm tracking-[0.01em] transition active:scale-95",
    active
      ? "bg-accent font-semibold text-bg shadow-[0_10px_28px_rgba(94,235,195,0.5)]"
      : "bg-white/[0.08] font-medium text-foam/75 ring-1 ring-white/12 hover:text-foam",
  ].join(" ");
}
