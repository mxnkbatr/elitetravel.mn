"use client";

import { gsap, registerGsap, useGSAP } from "@/lib/gsap";
import { useRef } from "react";

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
  registerGsap();
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = root.current?.querySelector<HTMLElement>(".marquee-track");
      if (!track) return;

      gsap.to(track, {
        xPercent: -50,
        duration: 22,
        ease: "none",
        repeat: -1,
      });
    },
    { scope: root },
  );

  const row = [...items, ...items];

  return (
    <div
      ref={root}
      className="relative overflow-hidden border-y border-white/10 bg-[#0a2a26] py-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(46,196,182,0.18),transparent_60%)]" />
      <div className="marquee-track relative z-[1] flex w-max gap-10 whitespace-nowrap px-4 will-change-transform">
        {row.map((t, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-10 font-display text-xl font-semibold tracking-[-0.03em] text-white/75 sm:text-2xl"
          >
            {t}
            <span className="inline-block size-1.5 rounded-full bg-[#e8b86d]" />
          </span>
        ))}
      </div>
    </div>
  );
}
