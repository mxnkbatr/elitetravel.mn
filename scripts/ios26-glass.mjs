import fs from "fs";

fs.writeFileSync(
  "src/app/globals.css",
  `:@import "tailwindcss";

:root {
  /* Forest mint + iOS 26 Liquid Glass */
  --bg: #0c1f1c;
  --bg-elevated: #122a26;
  --surface: #163530;
  --accent: #5eebc3;
  --accent-soft: #9af5db;
  --accent-deep: #2bb896;
  --foam: #f4fffb;
  --muted: rgba(244, 255, 251, 0.68);
  --glass-fill: rgba(255, 255, 255, 0.08);
  --glass-fill-strong: rgba(255, 255, 255, 0.12);
  --glass-tint: rgba(18, 42, 38, 0.42);
  --glass-border: rgba(255, 255, 255, 0.26);
  --glass-border-soft: rgba(255, 255, 255, 0.14);
  --glass-shine: rgba(255, 255, 255, 0.55);
  --glass-blur: 44px;
  --glass-sat: 185%;
  --shadow-float: 0 10px 40px rgba(0, 0, 0, 0.28), 0 2px 8px rgba(0, 0, 0, 0.18);
  --shadow-soft: 0 8px 28px rgba(0, 0, 0, 0.22);
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
  letter-spacing: -0.025em;
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
  letter-spacing: 0.005em;
  line-height: 1.55;
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
  background: color-mix(in oklab, var(--accent) 55%, transparent);
  color: var(--bg);
}

/* ——— iOS 26 Liquid Glass ——— */
.glass,
.glass-strong {
  position: relative;
  isolation: isolate;
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  border: 0.5px solid var(--glass-border);
  box-shadow:
    var(--shadow-soft),
    inset 0 0.5px 0 var(--glass-shine),
    inset 0 -0.5px 0 rgba(255, 255, 255, 0.06);
}

.glass {
  background:
    linear-gradient(
      165deg,
      rgba(255, 255, 255, 0.18) 0%,
      rgba(255, 255, 255, 0.05) 42%,
      rgba(255, 255, 255, 0.03) 100%
    ),
    var(--glass-fill);
}

.glass-strong {
  background:
    linear-gradient(
      160deg,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0.06) 28%,
      rgba(18, 42, 38, 0.38) 72%,
      rgba(12, 31, 28, 0.5) 100%
    ),
    var(--glass-tint);
  box-shadow:
    var(--shadow-float),
    inset 0 0.5px 0 var(--glass-shine),
    inset 0 -0.5px 0 rgba(255, 255, 255, 0.05);
}

/* Specular rim — liquid edge catch-light */
.glass::before,
.glass-strong::before {
  content: "";
  pointer-events: none;
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 0.5px;
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.55) 0%,
    rgba(255, 255, 255, 0.08) 28%,
    rgba(255, 255, 255, 0) 52%,
    rgba(255, 255, 255, 0.12) 100%
  );
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  mask-composite: exclude;
  opacity: 0.9;
}

.glass-float {
  box-shadow: var(--shadow-float);
}

.glass-chip {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border: 0.5px solid rgba(255, 255, 255, 0.22);
  box-shadow: inset 0 0.5px 0 rgba(255, 255, 255, 0.35);
}

.ambient {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(ellipse 90% 55% at 8% -8%, rgba(94, 235, 195, 0.2), transparent 58%),
    radial-gradient(ellipse 70% 45% at 92% 6%, rgba(154, 245, 219, 0.1), transparent 52%),
    radial-gradient(ellipse 55% 40% at 50% 110%, rgba(43, 184, 150, 0.14), transparent 55%),
    radial-gradient(ellipse 40% 30% at 70% 40%, rgba(255, 255, 255, 0.03), transparent 60%),
    var(--bg);
}

.app-main {
  position: relative;
  z-index: 10;
  min-height: 100dvh;
}

.page-pad-top {
  padding-top: calc(6.25rem + env(safe-area-inset-top, 0px));
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
    var(--accent-soft) 40%,
    var(--accent) 80%
  );
  background-size: 200% 100%;
  animation: shimmer 4.5s linear infinite;
  box-shadow:
    0 8px 28px rgba(94, 235, 195, 0.28),
    inset 0 0.5px 0 rgba(255, 255, 255, 0.45);
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  .accent-shimmer {
    animation: none;
  }
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .glass {
    background: rgba(22, 53, 48, 0.88);
  }
  .glass-strong {
    background: rgba(12, 31, 28, 0.94);
  }
}
`.replace(/^:/, ""),
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
  { href: "/resorts", label: "Амралт", icon: ResortIcon },
  { href: "/profile", label: "Профайл", icon: ProfileIcon },
];

export function MobileDock() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2 sm:hidden"
      aria-label="Үндсэн цэс"
    >
      <motion.div
        initial={{ y: 28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass-strong glass-float mx-auto flex max-w-md items-stretch justify-between rounded-[2rem] px-1.5 py-1.5"
      >
        {items.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={\`relative flex min-h-[3.4rem] min-w-[4.35rem] flex-1 flex-col items-center justify-center gap-0.5 rounded-[1.45rem] text-[0.66rem] font-medium tracking-[0.02em] transition active:scale-95 \${
                active ? "text-foam" : "text-foam/48"
              }\`}
            >
              {active && (
                <motion.span
                  layoutId="dock-pill"
                  className="absolute inset-[3px] rounded-[1.3rem] bg-white/[0.14] shadow-[inset_0_0.5px_0_rgba(255,255,255,0.45)] ring-1 ring-white/20"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className={\`relative z-10 \${active ? "text-accent" : ""}\`}>
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
        fillOpacity={active ? 0.2 : 0}
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
        fillOpacity={active ? 0.2 : 0}
      />
      <path d="M9 4v13.5M15 6.5V20" stroke="currentColor" strokeWidth={active ? 1.85 : 1.5} />
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
      <path
        d="M12 8.5v.01"
        stroke="currentColor"
        strokeWidth={active ? 2.1 : 1.75}
        strokeLinecap="round"
      />
    </svg>
  );
}

function ProfileIcon({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle
        cx="12"
        cy="8"
        r="3.25"
        stroke="currentColor"
        strokeWidth={active ? 1.85 : 1.5}
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.2 : 0}
      />
      <path
        d="M5.5 19.2c1.5-3 3.9-4.5 6.5-4.5s5 1.5 6.5 4.5"
        stroke="currentColor"
        strokeWidth={active ? 1.85 : 1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}
`,
  "utf8",
);

fs.writeFileSync(
  "src/components/Navbar.tsx",
  `"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Нүүр" },
  { href: "/destinations", label: "Чиглэл" },
  { href: "/tours", label: "Аяллууд" },
  { href: "/resorts", label: "Амралт" },
  { href: "/about", label: "Бидний тухай" },
  { href: "/profile", label: "Профайл" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 48, 100], [0, 0.55, 1]);
  const blur = useTransform(scrollY, [0, 100], [0, 28]);
  const backdropFilter = useTransform(blur, (v) => \`blur(\${v}px) saturate(180%)\`);

  return (
    <header className="fixed inset-x-0 top-0 z-[60] pt-[env(safe-area-inset-top,0px)]">
      <motion.div
        style={{ opacity }}
        className="pointer-events-none absolute inset-0 border-b border-white/10"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(12,31,28,0.55) 100%)",
          }}
        />
      </motion.div>
      <motion.div
        style={{ backdropFilter, WebkitBackdropFilter: backdropFilter }}
        className="pointer-events-none absolute inset-0"
      />

      <div className="relative mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <Image
            src="/elite-logo.png"
            alt="Elite Travel Mongolia logo"
            width={44}
            height={44}
            className="size-11 rounded-full object-cover ring-1 ring-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.25)]"
            priority
          />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-[0.88rem] font-semibold tracking-[0.04em] text-foam">
              Elite Travel Mongolia
            </span>
            <span className="hidden text-[0.65rem] tracking-[0.02em] text-foam/55 sm:inline">
              Explore. Dream. Discover.
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 rounded-full glass px-1 py-1 lg:flex">
          {links.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={\`rounded-full px-3.5 py-2 text-[0.84rem] tracking-[0.01em] transition \${
                  active
                    ? "bg-white/14 font-medium text-foam shadow-[inset_0_0.5px_0_rgba(255,255,255,0.35)]"
                    : "text-foam/65 hover:bg-white/8 hover:text-foam"
                }\`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/profile"
            className="hidden overflow-hidden rounded-full ring-1 ring-white/25 sm:block"
            aria-label="Профайл"
          >
            <Image
              src="/elite-logo.png"
              alt="Профайл"
              width={36}
              height={36}
              className="size-9 object-cover"
            />
          </Link>
          <a
            href="tel:+97690031771"
            className="hidden rounded-full bg-accent px-4 py-2 text-sm font-semibold tracking-[0.01em] text-bg shadow-[0_6px_20px_rgba(94,235,195,0.28)] transition hover:bg-accent-soft sm:inline-flex"
          >
            +976 9003 1771
          </a>
          <button
            type="button"
            aria-label="Цэс"
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full glass lg:hidden"
          >
            <span className="flex w-4 flex-col gap-1">
              <span
                className={\`h-0.5 rounded-full bg-foam transition \${open ? "translate-y-1.5 rotate-45" : ""}\`}
              />
              <span
                className={\`h-0.5 rounded-full bg-foam transition \${open ? "opacity-0" : ""}\`}
              />
              <span
                className={\`h-0.5 rounded-full bg-foam transition \${open ? "-translate-y-1.5 -rotate-45" : ""}\`}
              />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-3 mt-1 overflow-hidden rounded-[1.65rem] glass-strong p-2 lg:hidden"
        >
          {links.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={\`block rounded-[1.15rem] px-4 py-3.5 text-[0.95rem] tracking-[0.01em] \${
                  active
                    ? "bg-white/12 font-medium text-accent"
                    : "text-foam/90 hover:bg-white/6"
                }\`}
              >
                {link.label}
              </Link>
            );
          })}
          <a
            href="tel:+97690031771"
            className="mt-1 flex items-center justify-center rounded-[1.15rem] bg-accent px-4 py-3.5 text-sm font-semibold text-bg"
          >
            +976 9003 1771
          </a>
        </motion.div>
      )}
    </header>
  );
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
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-[calc(6.5rem+env(safe-area-inset-bottom,0px))] pt-[calc(5.75rem+env(safe-area-inset-top,0px))] sm:pb-24 sm:pt-28">
      <div className="absolute inset-0 -z-20">
        <Image
          src="https://elitetravel.mn/__l5e/assets-v1/2e9a9b43-175a-424a-b3b2-c1a5c1e94222/hero-jungle-tall.webp"
          alt="Tropical destination atmosphere"
          fill
          priority
          className="object-cover object-[center_30%] scale-[1.02]"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-bg/25 via-bg/45 to-bg" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(94,235,195,0.22),transparent_48%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-bg to-transparent" />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 inline-flex items-center rounded-full glass-chip px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-accent"
        >
          Elite Travel Mongolia
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl font-display text-[2.05rem] font-semibold leading-[1.12] tracking-[-0.03em] text-foam sm:text-5xl md:text-[3.25rem]"
        >
          Та манай аяллыг{" "}
          <span className="bg-gradient-to-r from-accent via-accent-soft to-accent bg-clip-text text-transparent">
            хүртэх эрхтэй
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.1 }}
          className="mt-5 max-w-md text-[0.95rem] leading-[1.65] tracking-[0.01em] text-foam/75 sm:text-lg"
        >
          Сайн аялал төлөвлөгөөнөөс эхэлдэг. Гайхалтай аялал ELITE TRAVEL-с эхэлдэг.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <Link
            href="/tours"
            className="accent-shimmer inline-flex h-12 items-center justify-center rounded-full px-7 text-sm font-semibold tracking-[0.01em] text-bg transition active:scale-[0.98] hover:scale-[1.02]"
          >
            Аяллууд үзэх
          </Link>
          <a
            href="tel:+97690031771"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium tracking-[0.01em] text-foam glass transition active:scale-[0.98]"
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

// Soften tour detail sticky CTA shadow to match liquid glass
let detail = fs.readFileSync("src/components/TourDetailView.tsx", "utf8");
detail = detail.replace(
  'className="mx-auto flex max-w-md items-center gap-3 rounded-[1.35rem] glass-strong p-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"',
  'className="glass-strong glass-float mx-auto flex max-w-md items-center gap-3 rounded-[1.55rem] p-2.5"',
);
fs.writeFileSync("src/components/TourDetailView.tsx", detail, "utf8");

// About → liquid glass
let about = fs.readFileSync("src/components/About.tsx", "utf8");
about = about.replace(
  'className="overflow-hidden rounded-[28px] border border-white/12 bg-[#122a26]/92 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:rounded-[32px]"',
  'className="overflow-hidden rounded-[28px] glass-strong sm:rounded-[32px]"',
);
fs.writeFileSync("src/components/About.tsx", about, "utf8");

console.log("ios26 liquid glass applied");
