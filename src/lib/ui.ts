/** iOS-style pill filters — solid, clean */
export function filterChipClass(active: boolean) {
  return [
    "shrink-0 rounded-full px-4 py-2.5 text-sm tracking-[0.01em] transition active:scale-95",
    active
      ? "bg-accent font-semibold text-bg shadow-[0_8px_24px_rgba(94,235,195,0.35)]"
      : "bg-[#14302a] font-medium text-foam/70 ring-1 ring-white/10 hover:text-foam",
  ].join(" ");
}
