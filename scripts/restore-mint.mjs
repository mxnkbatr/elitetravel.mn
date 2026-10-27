import fs from "fs";
import path from "path";

const root = process.cwd();
function write(rel, content) {
  fs.writeFileSync(path.join(root, rel), content, { encoding: "utf8" });
  console.log("ok", rel);
}

write(
  "src/app/globals.css",
  `@import "tailwindcss";

:root {
  /* Forest mint — original Elite Travel palette */
  --bg: #0c1f1c;
  --bg-elevated: #122a26;
  --surface: #163530;
  --accent: #5eebc3;
  --accent-soft: #9af5db;
  --accent-deep: #2bb896;
  --foam: #f4fffb;
  --muted: rgba(244, 255, 251, 0.68);
  --glass: rgba(18, 42, 38, 0.5);
  --glass-strong: rgba(12, 31, 28, 0.72);
  --glass-border: rgba(255, 255, 255, 0.14);
  --glass-highlight: rgba(94, 235, 195, 0.22);
  --shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
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

.glass {
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.03)
  );
  backdrop-filter: blur(22px) saturate(140%);
  -webkit-backdrop-filter: blur(22px) saturate(140%);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow), inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.glass-strong {
  background: linear-gradient(
    160deg,
    rgba(18, 42, 38, 0.9),
    rgba(12, 31, 28, 0.8)
  );
  backdrop-filter: blur(28px) saturate(150%);
  -webkit-backdrop-filter: blur(28px) saturate(150%);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  isolation: isolate;
}

.ambient {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(ellipse 80% 50% at 10% -10%, rgba(94, 235, 195, 0.16), transparent 55%),
    radial-gradient(ellipse 60% 40% at 90% 10%, rgba(43, 184, 150, 0.12), transparent 50%),
    radial-gradient(ellipse 50% 45% at 50% 100%, rgba(22, 53, 48, 0.9), transparent 60%),
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
);

write(
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
  { href: "/about", label: "Бидний тухай" },
  { href: "/contact", label: "Холбоо барих" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 80],
    ["rgba(12,31,28,0)", "rgba(12,31,28,0.86)"],
  );
  const backdropFilter = useTransform(scrollY, [0, 80], ["blur(0px)", "blur(18px)"]);
  const borderColor = useTransform(
    scrollY,
    [0, 80],
    ["rgba(255,255,255,0)", "rgba(255,255,255,0.08)"],
  );

  return (
    <motion.header
      style={{ backgroundColor, backdropFilter, borderColor }}
      className="fixed inset-x-0 top-0 z-[60] border-b pt-[env(safe-area-inset-top,0px)]"
    >
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <Image
            src="/elite-logo.png"
            alt="Elite Travel Mongolia logo"
            width={44}
            height={44}
            className="size-11 rounded-full object-cover ring-1 ring-white/15"
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

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={\`rounded-full px-3.5 py-2 text-[0.875rem] tracking-[0.01em] transition \${
                  active
                    ? "bg-white/8 font-medium text-foam"
                    : "text-foam/70 hover:bg-white/5 hover:text-foam"
                }\`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="tel:+97690031771"
            className="hidden rounded-full bg-accent px-4 py-2 text-sm font-semibold tracking-[0.01em] text-bg transition hover:bg-accent-soft sm:inline-flex"
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
              <span className={\`h-0.5 rounded-full bg-foam transition \${open ? "translate-y-1.5 rotate-45" : ""}\`} />
              <span className={\`h-0.5 rounded-full bg-foam transition \${open ? "opacity-0" : ""}\`} />
              <span className={\`h-0.5 rounded-full bg-foam transition \${open ? "-translate-y-1.5 -rotate-45" : ""}\`} />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mt-2 overflow-hidden rounded-[22px] glass-strong p-2 lg:hidden"
        >
          {links.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={\`block rounded-2xl px-4 py-3.5 text-[0.95rem] tracking-[0.01em] \${
                  active
                    ? "bg-accent/15 font-medium text-accent"
                    : "text-foam/90 hover:bg-white/5"
                }\`}
              >
                {link.label}
              </Link>
            );
          })}
          <a
            href="tel:+97690031771"
            className="mt-1 flex items-center justify-center rounded-2xl bg-accent px-4 py-3.5 text-sm font-semibold text-bg"
          >
            +976 9003 1771
          </a>
        </motion.div>
      )}
    </motion.header>
  );
}
`,
);

write(
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
          className="object-cover object-[center_30%]"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-bg/40 via-bg/50 to-bg" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(94,235,195,0.18),transparent_45%)]" />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
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
          Сайн аялал төлөвлөгөөнөөс эхэлдэг. Гайхалтай аялал ELITE TRAVEL-с
          эхэлдэг.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <Link
            href="/tours"
            className="accent-shimmer inline-flex h-12 items-center justify-center rounded-full px-7 text-sm font-semibold tracking-[0.01em] text-bg shadow-[0_12px_40px_rgba(94,235,195,0.35)] transition active:scale-[0.98] hover:scale-[1.02]"
          >
            Аяллууд үзэх
          </Link>
          <a
            href="tel:+97690031771"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium tracking-[0.01em] text-foam glass transition active:scale-[0.98] hover:bg-white/10"
          >
            +976 9003 1771
          </a>
        </motion.div>
      </div>
    </section>
  );
}
`,
);

write(
  "src/components/About.tsx",
  `"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const points = [
  {
    title: "Залууст зориулсан",
    text: "18–35 насны vibe — концерт, далай, хотын аялал.",
  },
  {
    title: "Цэвэр туршлага",
    text: "Тодорхой үнэ, тодорхой хөтөлбөр, шууд холбоо.",
  },
  {
    title: "Premium мэдрэмж",
    text: "Аяллын өмнө, дунд, дараа — бүгд нэг стандартаар.",
  },
];

type AboutProps = {
  showCta?: boolean;
};

export function About({ showCta = false }: AboutProps) {
  return (
    <section className="relative z-10">
      <div className="overflow-hidden rounded-[28px] border border-white/12 bg-[#122a26]/92 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:rounded-[32px]">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
          <div className="p-6 sm:p-10">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-accent">
              About
            </p>
            <h1 className="mt-3 max-w-md font-display text-[1.7rem] font-semibold tracking-[-0.03em] sm:text-4xl">
              Бидний тухай
            </h1>
            <p className="mt-3 max-w-lg font-display text-lg font-medium tracking-[-0.02em] text-foam/90 sm:text-xl">
              Сайн аялал төлөвлөгөөнөөс эхэлдэг
            </p>
            <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed tracking-[0.01em] text-foam/68 sm:text-base">
              Гайхалтай аялал Elite Travel-с эхэлдэг. Бид Монголын залууст
              зориулж Хонг Конг, Хайнань, Бали болон дэлхийн концерт аяллуудыг
              цэвэрхэн, ойлгомжтойгоор хүргэдэг.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {points.map((point, i) => (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10"
                >
                  <h2 className="font-display text-[1rem] font-semibold tracking-[-0.02em]">
                    {point.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed tracking-[0.01em] text-foam/60">
                    {point.text}
                  </p>
                </motion.div>
              ))}
            </div>

            {showCta ? (
              <Link
                href="/contact"
                className="mt-8 inline-flex h-12 items-center rounded-full bg-accent px-6 text-sm font-semibold text-bg transition active:scale-95 hover:bg-accent-soft"
              >
                Холбоо барих
              </Link>
            ) : null}
          </div>

          <div className="relative min-h-[220px] overflow-hidden border-t border-white/10 lg:min-h-full lg:border-l lg:border-t-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(94,235,195,0.3),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(43,184,150,0.18),transparent_40%),linear-gradient(160deg,#163530,#0c1f1c)]" />
            <div className="relative flex h-full min-h-[220px] flex-col justify-end p-6 sm:p-10">
              <p className="font-display text-5xl font-semibold tracking-[-0.04em] text-accent sm:text-6xl">
                4.9
              </p>
              <p className="mt-2 text-sm tracking-[0.01em] text-foam/70">
                Дундаж үнэлгээ · Explore. Dream. Discover.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
`,
);

console.log("mint palette + logo restored");
