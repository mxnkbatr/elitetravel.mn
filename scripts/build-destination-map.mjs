import fs from "fs";
import path from "path";

function write(rel, content) {
  fs.mkdirSync(path.dirname(path.join(process.cwd(), rel)), { recursive: true });
  fs.writeFileSync(path.join(process.cwd(), rel), content, "utf8");
  console.log("ok", rel);
}

write(
  "src/components/DestinationMap.tsx",
  `"use client";

import { motion } from "framer-motion";

export type MapPin = {
  key: string;
  name: string;
  en: string;
  x: number;
  y: number;
  hub?: boolean;
};

const pins: MapPin[] = [
  { key: "ub", name: "Улаанбаатар", en: "Ulaanbaatar", x: 718, y: 168, hub: true },
  { key: "hongkong", name: "Хонг Конг", en: "Hong Kong", x: 782, y: 292 },
  { key: "hainan", name: "Хайнань", en: "Hainan", x: 752, y: 332 },
  { key: "bali", name: "Бали", en: "Bali", x: 812, y: 438 },
  { key: "egypt", name: "Египет", en: "Egypt", x: 292, y: 318 },
];

type DestinationMapProps = {
  active: string;
  onSelect: (key: string) => void;
};

export function DestinationMap({ active, onSelect }: DestinationMapProps) {
  const hub = pins.find((p) => p.hub)!;
  const targets = pins.filter((p) => !p.hub);

  return (
    <div className="epic-card relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(232,168,74,0.12),transparent_50%),radial-gradient(ellipse_at_80%_70%,rgba(11,107,92,0.14),transparent_45%)]" />
      <div className="relative px-3 pb-3 pt-4 sm:px-5 sm:pb-4 sm:pt-5">
        <div className="mb-3 flex items-end justify-between gap-3 px-1">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-accent">
              Live map
            </p>
            <p className="mt-1 font-display text-xl font-semibold tracking-[-0.02em] sm:text-2xl">
              Elite чиглэлүүд
            </p>
          </div>
          <p className="hidden text-xs text-muted sm:block">Цэг дээр дарж сонгоно уу</p>
        </div>

        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.1rem] border border-[var(--line)] bg-[#e7f3ef]">
          <svg
            viewBox="0 0 1000 560"
            className="size-full"
            role="img"
            aria-label="Аяллын газрын зураг"
          >
            <defs>
              <linearGradient id="ocean" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#d8efe9" />
                <stop offset="45%" stopColor="#c5e8e0" />
                <stop offset="100%" stopColor="#b7ddd8" />
              </linearGradient>
              <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f7f3ec" />
                <stop offset="100%" stopColor="#e8e0d4" />
              </linearGradient>
              <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#0b6b5c" floodOpacity="0.08" />
              </filter>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(11,107,92,0.06)" strokeWidth="1" />
              </pattern>
            </defs>

            <rect width="1000" height="560" fill="url(#ocean)" />
            <rect width="1000" height="560" fill="url(#grid)" />

            {/* soft landmasses — modern flat silhouette */}
            <g filter="url(#soft)" opacity="0.95">
              {/* Africa / MENA */}
              <path
                d="M210 240 C240 210, 280 205, 320 230 C350 250, 360 290, 340 330 C320 365, 280 380, 250 360 C220 340, 200 300, 210 240 Z"
                fill="url(#land)"
                stroke="rgba(11,107,92,0.12)"
                strokeWidth="1.5"
              />
              {/* Arabia */}
              <path
                d="M330 250 C360 235, 400 250, 410 290 C415 320, 390 340, 360 330 C340 320, 325 285, 330 250 Z"
                fill="url(#land)"
                stroke="rgba(11,107,92,0.1)"
                strokeWidth="1.2"
              />
              {/* India */}
              <path
                d="M560 280 C590 270, 620 300, 615 350 C610 390, 580 410, 555 385 C540 360, 545 300, 560 280 Z"
                fill="url(#land)"
                stroke="rgba(11,107,92,0.1)"
                strokeWidth="1.2"
              />
              {/* China + East Asia */}
              <path
                d="M640 140 C700 120, 780 130, 820 180 C850 220, 840 280, 800 310 C760 340, 720 330, 690 300 C660 270, 640 220, 640 140 Z"
                fill="url(#land)"
                stroke="rgba(11,107,92,0.14)"
                strokeWidth="1.5"
              />
              {/* Mongolia plateau hint */}
              <path
                d="M680 150 C720 145, 760 160, 755 185 C740 200, 700 198, 685 180 C675 165, 675 155, 680 150 Z"
                fill="#efe8dc"
                stroke="rgba(11,107,92,0.1)"
                strokeWidth="1"
              />
              {/* SE Asia / Indonesia arc */}
              <path
                d="M740 360 C780 350, 830 370, 850 410 C860 440, 830 455, 800 445 C770 435, 745 400, 740 360 Z"
                fill="url(#land)"
                stroke="rgba(11,107,92,0.12)"
                strokeWidth="1.2"
              />
              {/* Japan hint */}
              <path
                d="M860 200 C880 195, 895 215, 888 245 C880 265, 860 260, 855 235 C852 215, 855 205, 860 200 Z"
                fill="url(#land)"
                stroke="rgba(11,107,92,0.1)"
                strokeWidth="1"
              />
            </g>

            {/* flight arcs from UB */}
            {targets.map((p) => {
              const isOn = active === p.key;
              const mx = (hub.x + p.x) / 2;
              const my = Math.min(hub.y, p.y) - (isOn ? 70 : 48);
              return (
                <g key={\`route-\${p.key}\`}>
                  <path
                    d={\`M \${hub.x} \${hub.y} Q \${mx} \${my} \${p.x} \${p.y}\`}
                    fill="none"
                    stroke={isOn ? "#0b6b5c" : "rgba(11,107,92,0.28)"}
                    strokeWidth={isOn ? 2.2 : 1.4}
                    strokeDasharray={isOn ? "7 8" : "4 8"}
                    strokeLinecap="round"
                  />
                  {isOn ? (
                    <motion.circle
                      r="3.5"
                      fill="#e8a84a"
                      initial={false}
                      animate={{
                        offsetDistance: ["0%", "100%"],
                      }}
                    >
                      <animateMotion
                        dur="2.8s"
                        repeatCount="indefinite"
                        path={\`M \${hub.x} \${hub.y} Q \${mx} \${my} \${p.x} \${p.y}\`}
                      />
                    </motion.circle>
                  ) : null}
                </g>
              );
            })}

            {/* pins */}
            {pins.map((p) => {
              const isActive = active === p.key || (p.hub && !targets.some((t) => t.key === active));
              const selected = active === p.key;
              const clickable = !p.hub;
              return (
                <g
                  key={p.key}
                  transform={\`translate(\${p.x} \${p.y})\`}
                  className={clickable ? "cursor-pointer" : undefined}
                  onClick={() => {
                    if (clickable) onSelect(p.key);
                  }}
                >
                  {selected || (p.hub && selected === false && active === p.key) ? null : null}
                  {(selected || p.hub) && (
                    <motion.circle
                      r={selected ? 22 : 16}
                      fill={p.hub ? "rgba(232,168,74,0.18)" : "rgba(11,107,92,0.16)"}
                      animate={{ scale: [1, 1.15, 1], opacity: [0.55, 0.9, 0.55] }}
                      transition={{ duration: 2.4, repeat: Infinity }}
                    />
                  )}
                  <circle
                    r={p.hub ? 7 : selected ? 8 : 6}
                    fill={p.hub ? "#e8a84a" : selected ? "#0b6b5c" : "#148f7a"}
                    stroke="#fffdf9"
                    strokeWidth="2.5"
                  />
                  <foreignObject x={14} y={-18} width="130" height="40">
                    <div
                      className={\`pointer-events-none rounded-full px-2.5 py-1 text-[11px] font-semibold leading-tight shadow-sm \${
                        selected || p.hub
                          ? "bg-accent text-white"
                          : "bg-white/95 text-[var(--ink)]"
                      }\`}
                    >
                      <span className="block tracking-wide">{p.en}</span>
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
`,
);

write(
  "src/components/DestinationsPage.tsx",
  `"use client";

import { DestinationMap } from "@/components/DestinationMap";
import { destinationProfiles, formatFromPrice } from "@/data/places";
import { filterChipClass } from "@/lib/ui";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function DestinationsPageView() {
  const [active, setActive] = useState(destinationProfiles[0].key);
  const selected =
    destinationProfiles.find((d) => d.key === active) ?? destinationProfiles[0];

  return (
    <div className="space-y-8">
      <DestinationMap
        active={active}
        onSelect={(key) => {
          if (destinationProfiles.some((d) => d.key === key)) setActive(key);
        }}
      />

      <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
        {destinationProfiles.map((d) => (
          <button
            key={d.key}
            type="button"
            onClick={() => setActive(d.key)}
            className={filterChipClass(d.key === active)}
          >
            {d.name}
          </button>
        ))}
      </div>

      <motion.div
        key={selected.key}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="epic-card overflow-hidden"
      >
        <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative min-h-[280px] aspect-[4/3] lg:aspect-auto lg:min-h-[420px]">
            <Image
              src={selected.image}
              alt={selected.name}
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 55vw"
              priority
            />
          </div>
          <div className="flex flex-col justify-center space-y-5 p-6 sm:p-8">
            <div>
              <div className="epic-rule mb-4" />
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-accent">
                {selected.en}
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                {selected.name}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                {selected.blurb}
              </p>
              <p className="mt-2 text-sm text-muted">
                Шилдэг улирал: {selected.bestSeason}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {selected.highlights.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-accent-mist px-3 py-1.5 text-xs font-medium text-accent"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-end justify-between gap-4 border-t border-[var(--line)] pt-5">
              <div>
                <p className="text-xs text-muted">Эхлэх үнэ</p>
                <p className="mt-1 text-lg font-semibold text-accent">
                  {formatFromPrice(selected.fromPrice)}
                </p>
              </div>
              <Link
                href={\`/tours?dest=\${selected.key === "egypt" ? "soon" : selected.key}\`}
                className="inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-semibold text-white"
              >
                Аяллууд үзэх
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
`,
);

console.log("map done");
