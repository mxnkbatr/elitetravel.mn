import fs from "fs";
import path from "path";

function write(rel, content) {
  fs.writeFileSync(path.join(process.cwd(), rel), content, "utf8");
  console.log("ok", rel, content.includes("Улаанбаатар"));
}

write(
  "src/components/DestinationMap.tsx",
  `"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

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

function tourHref(key: string) {
  return \`/tours?dest=\${key === "egypt" ? "soon" : key}\`;
}

export function DestinationMap({ active, onSelect }: DestinationMapProps) {
  const router = useRouter();
  const hub = pins.find((p) => p.hub)!;
  const targets = pins.filter((p) => !p.hub);
  const activePin = pins.find((p) => p.key === active);

  function enterDestination(key: string) {
    onSelect(key);
    router.push(tourHref(key));
  }

  return (
    <div className="epic-card relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_15%,rgba(232,168,74,0.14),transparent_48%),radial-gradient(ellipse_at_85%_80%,rgba(11,107,92,0.12),transparent_42%)]" />

      <div className="relative px-3 pb-3 pt-4 sm:px-5 sm:pb-4 sm:pt-5">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3 px-1">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-accent">
              Live map
            </p>
            <p className="mt-1 font-display text-xl font-semibold tracking-[-0.02em] sm:text-2xl">
              Elite чиглэлүүд
            </p>
          </div>
          <p className="text-xs text-muted">
            Цэг дээр дарж ороорой
            {activePin && !activePin.hub ? (
              <span className="ml-2 font-semibold text-accent">· {activePin.name}</span>
            ) : null}
          </p>
        </div>

        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.1rem] border border-[var(--line)] bg-[#eef6f3]">
          <svg
            viewBox="0 0 1000 560"
            className="size-full"
            role="img"
            aria-label="Аяллын газрын зураг"
          >
            <defs>
              <linearGradient id="ocean" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#d8efe9" />
                <stop offset="50%" stopColor="#cfe9e3" />
                <stop offset="100%" stopColor="#b9ddd5" />
              </linearGradient>
              <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fffdf9" />
                <stop offset="100%" stopColor="#f0e8dc" />
              </linearGradient>
              <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#0b6b5c" floodOpacity="0.1" />
              </filter>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="rgba(11,107,92,0.07)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>

            <rect width="1000" height="560" fill="url(#ocean)" />
            <rect width="1000" height="560" fill="url(#grid)" />

            <g filter="url(#soft)" opacity="0.96">
              <path
                d="M210 240 C240 210, 280 205, 320 230 C350 250, 360 290, 340 330 C320 365, 280 380, 250 360 C220 340, 200 300, 210 240 Z"
                fill="url(#land)"
                stroke="rgba(11,107,92,0.14)"
                strokeWidth="1.5"
              />
              <path
                d="M330 250 C360 235, 400 250, 410 290 C415 320, 390 340, 360 330 C340 320, 325 285, 330 250 Z"
                fill="url(#land)"
                stroke="rgba(11,107,92,0.12)"
                strokeWidth="1.2"
              />
              <path
                d="M560 280 C590 270, 620 300, 615 350 C610 390, 580 410, 555 385 C540 360, 545 300, 560 280 Z"
                fill="url(#land)"
                stroke="rgba(11,107,92,0.12)"
                strokeWidth="1.2"
              />
              <path
                d="M640 140 C700 120, 780 130, 820 180 C850 220, 840 280, 800 310 C760 340, 720 330, 690 300 C660 270, 640 220, 640 140 Z"
                fill="url(#land)"
                stroke="rgba(11,107,92,0.16)"
                strokeWidth="1.5"
              />
              <path
                d="M680 150 C720 145, 760 160, 755 185 C740 200, 700 198, 685 180 C675 165, 675 155, 680 150 Z"
                fill="#f6f3ee"
                stroke="rgba(232,168,74,0.35)"
                strokeWidth="1.2"
              />
              <path
                d="M740 360 C780 350, 830 370, 850 410 C860 440, 830 455, 800 445 C770 435, 745 400, 740 360 Z"
                fill="url(#land)"
                stroke="rgba(11,107,92,0.14)"
                strokeWidth="1.2"
              />
              <path
                d="M860 200 C880 195, 895 215, 888 245 C880 265, 860 260, 855 235 C852 215, 855 205, 860 200 Z"
                fill="url(#land)"
                stroke="rgba(11,107,92,0.12)"
                strokeWidth="1"
              />
            </g>

            {targets.map((p) => {
              const isOn = active === p.key;
              const mx = (hub.x + p.x) / 2;
              const my = Math.min(hub.y, p.y) - (isOn ? 72 : 50);
              const pathD = \`M \${hub.x} \${hub.y} Q \${mx} \${my} \${p.x} \${p.y}\`;
              return (
                <g key={\`route-\${p.key}\`}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isOn ? "#0b6b5c" : "rgba(11,107,92,0.22)"}
                    strokeWidth={isOn ? 2.4 : 1.35}
                    strokeDasharray={isOn ? "8 9" : "4 9"}
                    strokeLinecap="round"
                  >
                    {isOn ? (
                      <animate
                        attributeName="stroke-dashoffset"
                        from="0"
                        to="-68"
                        dur="1.8s"
                        repeatCount="indefinite"
                      />
                    ) : null}
                  </path>
                  {isOn ? (
                    <circle r="4" fill="#e8a84a" stroke="#fffdf9" strokeWidth="1.5">
                      <animateMotion dur="2.6s" repeatCount="indefinite" path={pathD} />
                    </circle>
                  ) : null}
                </g>
              );
            })}

            {pins.map((p) => {
              const selected = active === p.key;
              const clickable = !p.hub;
              const labelW = Math.max(78, p.en.length * 7.4 + 22);

              return (
                <g
                  key={p.key}
                  transform={\`translate(\${p.x} \${p.y})\`}
                  style={{ cursor: clickable ? "pointer" : "default" }}
                  onClick={() => {
                    if (!clickable) return;
                    onSelect(p.key);
                  }}
                  onDoubleClick={() => {
                    if (!clickable) return;
                    enterDestination(p.key);
                  }}
                >
                  {/* big hit area */}
                  {clickable ? (
                    <circle r="28" fill="transparent" className="pointer-events-auto" />
                  ) : null}

                  {(selected || p.hub) && (
                    <motion.circle
                      r={selected ? 26 : 18}
                      fill={p.hub ? "rgba(232,168,74,0.22)" : "rgba(11,107,92,0.18)"}
                      animate={{ scale: [1, 1.22, 1], opacity: [0.45, 0.95, 0.45] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}

                  <motion.circle
                    r={p.hub ? 7.5 : selected ? 9 : 6.5}
                    fill={p.hub ? "#e8a84a" : selected ? "#0b6b5c" : "#148f7a"}
                    stroke="#fffdf9"
                    strokeWidth="2.6"
                    initial={false}
                    animate={{ scale: selected ? 1.08 : 1 }}
                    transition={{ type: "spring", stiffness: 360, damping: 18 }}
                  />

                  <motion.g
                    initial={false}
                    animate={{ y: selected ? -2 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <rect
                      x="14"
                      y="-18"
                      rx="11"
                      ry="11"
                      width={labelW}
                      height="24"
                      fill={selected || p.hub ? "#0b6b5c" : "#fffdf9"}
                      stroke={selected || p.hub ? "transparent" : "rgba(20,40,36,0.1)"}
                    />
                    <text
                      x="24"
                      y="0"
                      fontSize="11.5"
                      fontWeight="650"
                      fill={selected || p.hub ? "#fffef8" : "#142824"}
                    >
                      {p.en}
                    </text>
                  </motion.g>
                </g>
              );
            })}
          </svg>

          {activePin && !activePin.hub ? (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => enterDestination(activePin.key)}
              className="absolute bottom-3 right-3 inline-flex h-10 items-center rounded-full bg-accent px-4 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(11,107,92,0.35)] transition hover:bg-accent-soft sm:bottom-4 sm:right-4"
            >
              {activePin.name} аялал руу →
            </motion.button>
          ) : null}
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
import { useEffect, useRef, useState } from "react";

export function DestinationsPageView() {
  const [active, setActive] = useState(destinationProfiles[0].key);
  const detailRef = useRef(null);
  const selected =
    destinationProfiles.find((d) => d.key === active) ?? destinationProfiles[0];

  useEffect(() => {
    // keep detail in sync when map changes — soft scroll on desktop
  }, [active]);

  function selectDestination(key) {
    setActive(key);
    window.setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 60);
  }

  return (
    <div className="space-y-8">
      <DestinationMap active={active} onSelect={selectDestination} />

      <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
        {destinationProfiles.map((d) => (
          <button
            key={d.key}
            type="button"
            onClick={() => selectDestination(d.key)}
            className={filterChipClass(d.key === active)}
          >
            {d.name}
          </button>
        ))}
      </div>

      <motion.div
        ref={detailRef}
        key={selected.key}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
              <p className="mt-2 text-sm text-muted">Шилдэг улирал: {selected.bestSeason}</p>
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
                className="inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-semibold text-white transition hover:bg-accent-soft"
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

console.log("done");
