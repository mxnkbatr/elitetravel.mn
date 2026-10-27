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
    <div className="relative overflow-hidden border-y border-[var(--line)] bg-bg-elevated/80 py-4">
      <div className="marquee-rail flex w-max">
        <div className="marquee-track flex gap-10 whitespace-nowrap px-5">
          {row.map((t, i) => (
            <span
              key={`a-${i}`}
              className="inline-flex items-center gap-10 font-display text-xl font-semibold tracking-[-0.03em] text-foam/70 sm:text-2xl"
            >
              {t}
              <span className="inline-block size-1.5 rounded-full bg-gold" />
            </span>
          ))}
        </div>
        <div className="marquee-track flex gap-10 whitespace-nowrap px-5" aria-hidden>
          {row.map((t, i) => (
            <span
              key={`b-${i}`}
              className="inline-flex items-center gap-10 font-display text-xl font-semibold tracking-[-0.03em] text-foam/70 sm:text-2xl"
            >
              {t}
              <span className="inline-block size-1.5 rounded-full bg-gold" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
