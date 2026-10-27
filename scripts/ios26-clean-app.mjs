import fs from "fs";

fs.writeFileSync(
  "src/app/globals.css",
  `@import "tailwindcss";

:root {
  /* Clean iOS 26 app — solid surfaces, cool mint */
  --bg: #0a1916;
  --bg-elevated: #10241f;
  --surface: #14302a;
  --surface-2: #1a3a33;
  --accent: #5eebc3;
  --accent-soft: #9af5db;
  --accent-deep: #2bb896;
  --foam: #f2fffb;
  --muted: rgba(242, 255, 251, 0.62);
  --line: rgba(255, 255, 255, 0.08);
  --line-strong: rgba(255, 255, 255, 0.12);
  --shadow-float: 0 12px 36px rgba(0, 0, 0, 0.4);
  --shadow-soft: 0 4px 16px rgba(0, 0, 0, 0.28);
  --radius-card: 1.25rem;
  --radius-ctl: 999px;
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --dock-h: calc(5.75rem + env(safe-area-inset-bottom, 0px));
  --nav-h: calc(4.25rem + env(safe-area-inset-top, 0px));
}

@theme inline {
  --color-bg: var(--bg);
  --color-bg-elevated: var(--bg-elevated);
  --color-surface: var(--surface);
  --color-accent: var(--accent);
  --color-accent-soft: var(--accent-soft);
  --color-accent-deep: var(--accent-deep);
  --color-foam: var(--foam);
  --color-muted: var(--muted);
  --color-mint: var(--accent);
  --color-mint-soft: var(--accent-soft);
  --color-mint-deep: var(--accent-deep);
  --color-forest: var(--surface);
  --font-display: var(--font-geologica);
  --font-sans: var(--font-golos);
}

@utility font-display {
  font-family: var(--font-geologica), "Golos Text", system-ui, sans-serif;
  letter-spacing: -0.03em;
  font-feature-settings: "kern" 1, "liga" 1;
}

* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

html {
  scroll-behavior: smooth;
  height: 100%;
}

body {
  margin: 0;
  min-height: 100%;
  min-height: 100dvh;
  background: var(--bg);
  color: var(--foam);
  font-family: var(--font-golos), system-ui, sans-serif;
  font-weight: 400;
  letter-spacing: 0.01em;
  line-height: 1.5;
  overflow-x: hidden;
  overscroll-behavior-y: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

h1,
h2,
h3,
h4 {
  text-wrap: balance;
}

p {
  text-wrap: pretty;
}

::selection {
  background: color-mix(in oklab, var(--accent) 50%, transparent);
  color: var(--bg);
}

/* Solid app surfaces — keep class names for compatibility */
.glass,
.glass-strong,
.liquid-sheet,
.ios-surface {
  background: var(--surface);
  border: 1px solid var(--line);
  box-shadow: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.glass-strong,
.liquid-sheet {
  background: var(--bg-elevated);
  border-color: var(--line-strong);
  box-shadow: var(--shadow-soft);
}

.glass::before,
.glass-strong::before {
  display: none;
}

.glass-float {
  box-shadow: var(--shadow-float);
}

.ios-grouped {
  background: var(--bg-elevated);
  border: 1px solid var(--line);
  border-radius: 14px;
  overflow: hidden;
}

.ios-row + .ios-row {
  border-top: 1px solid var(--line);
}

.ios-hairline {
  height: 1px;
  background: var(--line);
}

.glass-chip {
  background: var(--surface-2);
  border: 1px solid var(--line);
}

.ambient {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(ellipse 70% 40% at 50% -5%, rgba(94, 235, 195, 0.1), transparent 55%),
    radial-gradient(ellipse 50% 35% at 100% 20%, rgba(43, 184, 150, 0.06), transparent 50%),
    var(--bg);
}

.app-main {
  position: relative;
  z-index: 10;
  min-height: 100dvh;
}

.page-pad-top {
  padding-top: calc(6rem + env(safe-area-inset-top, 0px));
}

.snap-x-mandatory {
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.snap-start {
  scroll-snap-align: start;
}

.hide-scrollbar {
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.accent-shimmer {
  background: linear-gradient(
    110deg,
    var(--accent) 0%,
    var(--accent-soft) 45%,
    var(--accent) 90%
  );
  background-size: 200% 100%;
  animation: shimmer 5s linear infinite;
  box-shadow: 0 8px 24px rgba(94, 235, 195, 0.28);
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  .accent-shimmer {
    animation: none;
  }
}
`,
  "utf8",
);

fs.writeFileSync(
  "src/lib/ui.ts",
  `/** iOS-style pill filters — solid, clean */
export function filterChipClass(active: boolean) {
  return [
    "shrink-0 rounded-full px-4 py-2.5 text-sm tracking-[0.01em] transition active:scale-95",
    active
      ? "bg-accent font-semibold text-bg shadow-[0_8px_24px_rgba(94,235,195,0.35)]"
      : "bg-[#14302a] font-medium text-foam/70 ring-1 ring-white/10 hover:text-foam",
  ].join(" ");
}
`,
  "utf8",
);

fs.writeFileSync(
  "src/components/Hero.tsx",
  `"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-[calc(7rem+env(safe-area-inset-bottom,0px))] pt-[calc(5.5rem+env(safe-area-inset-top,0px))] sm:items-center sm:pb-24 sm:pt-28">
      <div className="absolute inset-0 -z-20">
        <Image
          src="https://elitetravel.mn/__l5e/assets-v1/2e9a9b43-175a-424a-b3b2-c1a5c1e94222/hero-jungle-tall.webp"
          alt="Tropical destination atmosphere"
          fill
          priority
          className="object-cover object-[center_28%]"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-bg via-bg/70 to-bg/25" />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-accent"
        >
          Elite Travel Mongolia
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl font-display text-[2.15rem] font-semibold leading-[1.1] tracking-[-0.035em] text-foam sm:text-5xl md:text-[3.35rem]"
        >
          Та манай аяллыг{" "}
          <span className="text-accent">хүртэх эрхтэй</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08 }}
          className="mt-4 max-w-md text-[0.95rem] leading-[1.6] text-foam/70 sm:text-lg"
        >
          Сайн аялал төлөвлөгөөнөөс эхэлдэг. Гайхалтай аялал ELITE TRAVEL-с эхэлдэг.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="mt-7 flex flex-wrap items-center gap-2.5"
        >
          <Link
            href="/tours"
            className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-bg shadow-[0_8px_24px_rgba(94,235,195,0.32)] transition active:scale-[0.98]"
          >
            Аяллууд үзэх
          </Link>
          <a
            href="tel:+97690031771"
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/12 bg-[#14302a] px-5 text-sm font-medium text-foam transition active:scale-[0.98]"
          >
            +976 9003 1771
          </a>
        </motion.div>
      </div>
    </section>
  );
}
`,
  "utf8",
);

fs.writeFileSync(
  "src/components/MobileDock.tsx",
  `"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Нүүр", icon: HomeIcon },
  { href: "/destinations", label: "Чиглэл", icon: MapIcon },
  { href: "/tours", label: "Аялал", icon: CompassIcon },
  { href: "/resorts", label: "Амралт", icon: ResortIcon },
];

export function MobileDock() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2 sm:hidden"
      aria-label="Үндсэн цэс"
    >
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex max-w-md items-stretch justify-between rounded-[1.5rem] border border-white/10 bg-[#10241f] px-1.5 py-1.5 shadow-[0_12px_36px_rgba(0,0,0,0.45)]"
      >
        {items.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={\`relative flex min-h-[3.25rem] min-w-[4.25rem] flex-1 flex-col items-center justify-center gap-0.5 rounded-[1.15rem] text-[0.66rem] font-medium tracking-[0.02em] transition active:scale-95 \${
                active ? "text-accent" : "text-foam/45"
              }\`}
            >
              {active ? (
                <motion.span
                  layoutId="dock-pill"
                  className="absolute inset-[3px] rounded-[1.05rem] bg-accent/12 ring-1 ring-accent/30"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              ) : null}
              <span className="relative z-10">
                <item.icon active={active} />
              </span>
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </motion.div>
    </nav>
  );
}

function HomeIcon({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth={active ? 1.85 : 1.5}
        strokeLinejoin="round"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.18 : 0}
      />
    </svg>
  );
}

function MapIcon({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 4 3 6.5V20l6-2.5 6 2.5 6-2.5V4l-6 2.5L9 4Z"
        stroke="currentColor"
        strokeWidth={active ? 1.85 : 1.5}
        strokeLinejoin="round"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.18 : 0}
      />
      <path d="M9 4v13.5M15 6.5V20" stroke="currentColor" strokeWidth={active ? 1.85 : 1.5} />
    </svg>
  );
}

function CompassIcon({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth={active ? 1.85 : 1.5} />
      <path
        d="m14.8 9.2-1.6 4.6-4.6 1.6 1.6-4.6 4.6-1.6Z"
        stroke="currentColor"
        strokeWidth={active ? 1.85 : 1.5}
        strokeLinejoin="round"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.2 : 0}
      />
    </svg>
  );
}

function ResortIcon({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 20h16M6 20V10l6-4 6 4v10M10 20v-5h4v5"
        stroke="currentColor"
        strokeWidth={active ? 1.85 : 1.5}
        strokeLinejoin="round"
      />
      <path d="M12 8.5v.01" stroke="currentColor" strokeWidth={active ? 2.1 : 1.75} strokeLinecap="round" />
    </svg>
  );
}
`,
  "utf8",
);

// Tour detail sticky bar + fact cards → solid
let detail = fs.readFileSync("src/components/TourDetailView.tsx", "utf8");
detail = detail
  .replace(
    /className="min-w-0 rounded-\[14px\] border border-white\/10 bg-\[#122a26\] px-2\.5 py-2\.5 sm:rounded-2xl sm:px-3\.5 sm:py-3"/g,
    'className="min-w-0 rounded-[14px] border border-white/10 bg-[#10241f] px-2.5 py-2.5 sm:rounded-2xl sm:px-3.5 sm:py-3"',
  )
  .replace(
    /className="mx-auto flex max-w-md items-center gap-2\.5 rounded-\[1\.35rem\] border border-white\/10 bg-\[#0f2420\]\/96 p-2 shadow-\[0_12px_40px_rgba\(0,0,0,0\.5\)\]"/g,
    'className="mx-auto flex max-w-md items-center gap-2.5 rounded-[1.35rem] border border-white/10 bg-[#10241f] p-2 shadow-[0_12px_36px_rgba(0,0,0,0.45)]"',
  );
fs.writeFileSync("src/components/TourDetailView.tsx", detail, "utf8");

// Home CTA block cleaner
let page = fs.readFileSync("src/app/page.tsx", "utf8");
page = page.replace(
  'rounded-[28px] glass-strong p-6 sm:flex-row sm:items-center sm:p-8',
  'rounded-[1.35rem] border border-white/10 bg-[#10241f] p-5 sm:flex-row sm:items-center sm:p-8',
);
fs.writeFileSync("src/app/page.tsx", page, "utf8");

// Destinations overlay card — solid
let dest = fs.readFileSync("src/components/Destinations.tsx", "utf8");
dest = dest.replace(
  "rounded-2xl glass-strong p-4",
  "rounded-2xl border border-white/10 bg-[#10241f]/95 p-4",
);
fs.writeFileSync("src/components/Destinations.tsx", dest, "utf8");

console.log("ios26 clean app vibe applied");
