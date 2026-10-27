"use client";

const items = [
  "Hainan",
  "Hong Kong",
  "Bali",
  "Warm escapes",
  "Elite Travel",
  "Explore",
  "Dream",
  "Discover",
];

export function Marquee() {
  const row = [...items, ...items];

  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-[#0a2a26] py-5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(46,196,182,0.18),transparent_60%)]" />
      <div className="marquee-rail relative z-[1] flex w-max">
        <div className="marquee-track flex gap-10 whitespace-nowrap px-5">
          {row.map((t, i) => (
            <span
              key={`a-${i}`}
              className="inline-flex items-center gap-10 font-display text-xl font-semibold tracking-[-0.03em] text-white/75 sm:text-2xl"
            >
              {t}
              <span className="inline-block size-1.5 rounded-full bg-[#e8b86d]" />
            </span>
          ))}
        </div>
        <div className="marquee-track flex gap-10 whitespace-nowrap px-5" aria-hidden>
          {row.map((t, i) => (
            <span
              key={`b-${i}`}
              className="inline-flex items-center gap-10 font-display text-xl font-semibold tracking-[-0.03em] text-white/75 sm:text-2xl"
            >
              {t}
              <span className="inline-block size-1.5 rounded-full bg-[#e8b86d]" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
