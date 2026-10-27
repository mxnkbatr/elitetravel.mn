import fs from "fs";
import path from "path";

function write(rel, content) {
  const full = path.join(process.cwd(), rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, "utf8");
  console.log("ok", rel);
}

write(
  "src/components/EliteLogo.tsx",
  `"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type EliteLogoProps = {
  href?: string;
  size?: "sm" | "md" | "lg" | "hero";
  showWordmark?: boolean;
  light?: boolean;
  className?: string;
};

const sizes = {
  sm: { mark: 34, text: "text-[1.15rem]" },
  md: { mark: 42, text: "text-[1.35rem]" },
  lg: { mark: 56, text: "text-[1.7rem]" },
  hero: { mark: 72, text: "text-[2.2rem]" },
};

export function EliteLogo({
  href = "/",
  size = "md",
  showWordmark = true,
  light = false,
  className = "",
}: EliteLogoProps) {
  const s = sizes[size];
  const ink = light ? "#fffef8" : "#0b6b5c";
  const gold = "#e8a84a";
  const teal = light ? "#9af5db" : "#0b6b5c";

  const mark = (
    <motion.span
      className="relative inline-grid shrink-0 place-items-center"
      style={{ width: s.mark, height: s.mark }}
      whileHover={{ scale: 1.06, rotate: -2 }}
      transition={{ type: "spring", stiffness: 320, damping: 18 }}
    >
      <svg viewBox="0 0 64 64" className="size-full overflow-visible" aria-hidden>
        <defs>
          <radialGradient id="eliteSun" cx="50%" cy="42%" r="55%">
            <stop offset="0%" stopColor="#ffe7a8" />
            <stop offset="55%" stopColor={gold} />
            <stop offset="100%" stopColor="#c97a28" />
          </radialGradient>
          <linearGradient id="eliteWave" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#148f7a" />
            <stop offset="100%" stopColor="#0b6b5c" />
          </linearGradient>
        </defs>

        {/* soft disc */}
        <circle cx="32" cy="32" r="30" fill={light ? "rgba(255,255,255,0.12)" : "#fffdf9"} />
        <circle
          cx="32"
          cy="32"
          r="29"
          fill="none"
          stroke={light ? "rgba(255,255,255,0.25)" : "rgba(11,107,92,0.14)"}
          strokeWidth="1"
        />

        {/* rotating sun rays */}
        <motion.g
          style={{ originX: "32px", originY: "26px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: 10 }).map((_, i) => {
            const a = (i * 36 * Math.PI) / 180;
            const x1 = 32 + Math.cos(a) * 11;
            const y1 = 26 + Math.sin(a) * 11;
            const x2 = 32 + Math.cos(a) * 17.5;
            const y2 = 26 + Math.sin(a) * 17.5;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={gold}
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity={0.85}
              />
            );
          })}
        </motion.g>

        {/* sun core pulse */}
        <motion.circle
          cx="32"
          cy="26"
          r="7.2"
          fill="url(#eliteSun)"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: "32px", originY: "26px" }}
        />

        {/* animated wave */}
        <motion.path
          d="M12 44 C18 38, 24 50, 32 44 C40 38, 46 50, 52 42 L52 52 L12 52 Z"
          fill="url(#eliteWave)"
          animate={{
            d: [
              "M12 44 C18 38, 24 50, 32 44 C40 38, 46 50, 52 42 L52 52 L12 52 Z",
              "M12 43 C19 49, 25 37, 32 45 C39 53, 45 39, 52 44 L52 52 L12 52 Z",
              "M12 44 C18 38, 24 50, 32 44 C40 38, 46 50, 52 42 L52 52 L12 52 Z",
            ],
          }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* E monogram cut */}
        <path
          d="M26 20.5 H38.5 V23.2 H29.1 V28.2 H36.8 V30.8 H29.1 V36.2 H38.8 V38.9 H26 Z"
          fill={light ? "#fffef8" : "#fffdf9"}
          opacity="0.95"
        />
      </svg>

      {/* warm glow ring */}
      <motion.span
        className="pointer-events-none absolute inset-[-18%] rounded-full"
        style={{
          background: \`radial-gradient(circle, \${gold}55 0%, transparent 68%)\`,
        }}
        animate={{ opacity: [0.35, 0.7, 0.35], scale: [0.92, 1.05, 0.92] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.span>
  );

  const word = showWordmark ? (
    <span className="leading-none">
      <span
        className={\`font-display font-semibold lowercase tracking-[-0.04em] \${s.text}\`}
        style={{ color: ink }}
      >
        elite
      </span>
      <span
        className="mt-0.5 block text-[0.58rem] font-semibold uppercase tracking-[0.22em]"
        style={{ color: teal, opacity: light ? 0.9 : 0.85 }}
      >
        travel
      </span>
    </span>
  ) : null;

  const inner = (
    <span className={\`inline-flex items-center gap-2.5 \${className}\`}>
      {mark}
      {word}
    </span>
  );

  if (!href) return inner;
  return (
    <Link href={href} className="inline-flex items-center" aria-label="Elite Travel">
      {inner}
    </Link>
  );
}
`,
);

write(
  "src/components/Hero.tsx",
  `"use client";

import { EliteLogo } from "@/components/EliteLogo";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const floaters = [
  { left: "12%", top: "28%", delay: 0, size: 8 },
  { left: "78%", top: "22%", delay: 0.6, size: 12 },
  { left: "64%", top: "58%", delay: 1.1, size: 7 },
  { left: "22%", top: "62%", delay: 1.7, size: 10 },
  { left: "88%", top: "70%", delay: 0.3, size: 6 },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.18]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section ref={ref} className="relative isolate min-h-[100svh] overflow-hidden">
      <motion.div className="absolute inset-0 -z-20" style={{ y: imgY, scale: imgScale }}>
        <Image
          src="https://elitetravel.mn/__l5e/assets-v1/2e9a9b43-175a-424a-b3b2-c1a5c1e94222/hero-jungle-tall.webp"
          alt="Elite Travel destination"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </motion.div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/60 via-black/35 to-black/10" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_30%_40%,rgba(232,168,74,0.22),transparent_55%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-36 bg-gradient-to-t from-bg via-bg/80 to-transparent" />

      {/* floating light orbs */}
      {floaters.map((f, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute rounded-full"
          style={{
            left: f.left,
            top: f.top,
            width: f.size,
            height: f.size,
            background: "radial-gradient(circle, rgba(255,230,170,0.95), rgba(232,168,74,0))",
            boxShadow: "0 0 18px rgba(232,168,74,0.45)",
          }}
          animate={{ y: [0, -18, 0], opacity: [0.35, 0.95, 0.35] }}
          transition={{
            duration: 4.2 + i * 0.35,
            delay: f.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-16 pt-[calc(7rem+env(safe-area-inset-top))] sm:justify-center sm:px-6 sm:pb-24"
      >
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="mb-7"
          >
            <EliteLogo size="hero" light showWordmark />
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="epic-rule mb-5 origin-left bg-gradient-to-r from-[#e8a84a] to-[#9af5db]"
          />

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-white/75"
          >
            Warm escapes · Mongolia
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3 font-display text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl md:text-[4.25rem]"
          >
            Та манай аяллыг{" "}
            <motion.span
              className="inline-block bg-gradient-to-r from-[#ffe7a8] via-[#9af5db] to-[#ffe7a8] bg-[length:200%_100%] bg-clip-text text-transparent"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            >
              хүртэх эрхтэй
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.65 }}
            className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-white/80 sm:text-lg"
          >
            Сайн аялал төлөвлөгөөнөөс эхэлдэг. Гайхалтай аялал ELITE TRAVEL-с эхэлдэг.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.65 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/tours"
                className="relative inline-flex h-12 items-center overflow-hidden rounded-full bg-accent px-7 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(11,107,92,0.45)]"
              >
                <motion.span
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                  animate={{ x: ["-120%", "120%"] }}
                  transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.6 }}
                />
                Аяллууд үзэх
              </Link>
            </motion.div>
            <motion.a
              href="tel:+97690031771"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex h-12 items-center rounded-full border border-white/40 bg-white/10 px-5 text-sm font-medium text-white backdrop-blur-[2px]"
            >
              +976 9003 1771
            </motion.a>
          </motion.div>
        </div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
        animate={{ y: [0, 8, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="h-8 w-5 rounded-full border border-white/40 p-1">
          <motion.div
            className="mx-auto h-1.5 w-1 rounded-full bg-[#e8a84a]"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
`,
);

write(
  "src/components/Navbar.tsx",
  `"use client";

import { EliteLogo } from "@/components/EliteLogo";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Нүүр" },
  { href: "/destinations", label: "Чиглэл" },
  { href: "/tours", label: "Аяллууд" },
  { href: "/resorts", label: "Амралт" },
  { href: "/about", label: "Бидний тухай" },
  { href: "/contact", label: "Холбоо" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 40], ["rgba(246,243,238,0)", "rgba(246,243,238,0.96)"]);
  const border = useTransform(
    scrollY,
    [0, 40],
    ["rgba(20,40,36,0)", "rgba(20,40,36,0.1)"],
  );
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 24));
    return () => unsub();
  }, [scrollY]);

  const lightLogo = isHome && !scrolled && !open;

  return (
    <>
      <motion.header
        style={{ backgroundColor: bg, borderColor: border }}
        className="fixed inset-x-0 top-0 z-[60] border-b pt-[env(safe-area-inset-top,0px)]"
      >
        <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between px-4 sm:px-6">
          <EliteLogo size="md" light={lightLogo} />

          <nav className="hidden items-center gap-7 md:flex">
            {links.map((l, i) => {
              const active =
                l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i + 0.15 }}
                >
                  <Link
                    href={l.href}
                    className={\`relative text-[0.84rem] tracking-[0.02em] transition \${
                      active
                        ? "font-semibold text-accent"
                        : lightLogo
                          ? "text-white/80 hover:text-white"
                          : "text-foam/70 hover:text-foam"
                    }\`}
                  >
                    {l.label}
                    {active ? (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-1 left-0 h-px w-full bg-gradient-to-r from-[#e8a84a] to-accent"
                      />
                    ) : null}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          <button
            type="button"
            aria-label="Цэс"
            className={\`grid size-10 place-items-center rounded-full border md:hidden \${
              lightLogo
                ? "border-white/30 bg-white/10 text-white"
                : "border-[var(--line)] bg-bg-elevated text-foam"
            }\`}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="flex w-3.5 flex-col gap-[3px]">
              <span
                className={\`h-px transition \${open ? "translate-y-[4px] rotate-45" : ""} \${
                  lightLogo ? "bg-white" : "bg-foam"
                }\`}
              />
              <span
                className={\`h-px transition \${open ? "opacity-0" : ""} \${
                  lightLogo ? "bg-white" : "bg-foam"
                }\`}
              />
              <span
                className={\`h-px transition \${open ? "-translate-y-[4px] -rotate-45" : ""} \${
                  lightLogo ? "bg-white" : "bg-foam"
                }\`}
              />
            </span>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[55] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-ink/25"
              aria-label="Хаах"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              initial={{ y: -16, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="absolute inset-x-4 top-[calc(4.75rem+env(safe-area-inset-top))] overflow-hidden rounded-[1.25rem] border border-[var(--line)] bg-bg-elevated p-2 shadow-[var(--shadow)]"
            >
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3.5 text-[0.95rem] text-foam/90"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <a
                href="tel:+97690031771"
                className="mt-1 flex h-11 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white"
              >
                Холбогдох
              </a>
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
`,
);

write(
  "src/components/Footer.tsx",
  `import { EliteLogo } from "@/components/EliteLogo";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <EliteLogo size="sm" />
          <p className="mt-2 text-sm text-muted">Explore. Dream. Discover.</p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
          <Link href="/tours" className="hover:text-accent">
            Аяллууд
          </Link>
          <Link href="/destinations" className="hover:text-accent">
            Чиглэл
          </Link>
          <Link href="/about" className="hover:text-accent">
            Бидний тухай
          </Link>
          <Link href="/contact" className="hover:text-accent">
            Холбоо
          </Link>
        </div>
        <p className="text-sm text-muted">© {new Date().getFullYear()} Elite Travel Mongolia</p>
      </div>
    </footer>
  );
}
`,
);

write(
  "src/components/Destinations.tsx",
  `"use client";

import { destinations } from "@/data/tours";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function Destinations({ showHeader = true }: { showHeader?: boolean }) {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {showHeader ? (
          <motion.div
            className="mb-8 max-w-xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <div className="epic-rule mb-4" />
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-accent">
              Destinations
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] text-foam sm:text-4xl">
              Аяллын чиглэлүүд
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
              Хайнань, Хонг Конг, Бали — халуун орны elite escape.
            </p>
          </motion.div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((d, i) => (
            <motion.div
              key={d.key}
              initial={{ opacity: 0, y: 40, rotateX: 8 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8 }}
            >
              <Link href="/destinations" className="epic-card group block">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={d.image}
                    alt={d.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                    sizes="(max-width:768px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-[#e8a84a]/20 via-transparent to-transparent opacity-0 transition group-hover:opacity-100"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#ffe7a8]">
                      {d.en}
                    </p>
                    <h3 className="mt-1 font-display text-2xl font-semibold text-white">
                      {d.name}
                    </h3>
                    <p className="mt-1 text-sm text-white/75">{d.blurb}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
);

write(
  "src/components/Tours.tsx",
  `"use client";

import { formatPrice, tours } from "@/data/tours";
import { filterChipClass } from "@/lib/ui";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const filters = [
  { key: "all", label: "Бүгд" },
  { key: "hainan", label: "Хайнань" },
  { key: "hongkong", label: "Хонг Конг" },
  { key: "bali", label: "Бали" },
  { key: "soon", label: "Удахгүй" },
] as const;

type ToursProps = {
  showHeader?: boolean;
  limit?: number;
  initialFilter?: string;
};

export function Tours({
  showHeader = true,
  limit,
  initialFilter = "all",
}: ToursProps) {
  const start = filters.some((f) => f.key === initialFilter) ? initialFilter : "all";
  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>(
    start as (typeof filters)[number]["key"],
  );

  useEffect(() => {
    if (filters.some((f) => f.key === initialFilter)) {
      setFilter(initialFilter as (typeof filters)[number]["key"]);
    }
  }, [initialFilter]);

  const visible = useMemo(() => {
    const list =
      filter === "all" ? tours : tours.filter((t) => t.destinationKey === filter);
    return typeof limit === "number" ? list.slice(0, limit) : list;
  }, [filter, limit]);

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {showHeader ? (
          <motion.div
            className="mb-6 flex items-end justify-between gap-4"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            <div className="max-w-xl">
              <div className="epic-rule mb-4" />
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-accent">
                Tours
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Аяллууд
              </h2>
              <p className="mt-3 text-sm text-muted sm:text-base">
                elitetravel.mn дээрх бодит аяллууд — үнэ, огноо шинэчлэгдсэн.
              </p>
            </div>
            {limit ? (
              <Link href="/tours" className="hidden text-sm font-semibold text-accent sm:inline">
                Бүгдийг үзэх →
              </Link>
            ) : null}
          </motion.div>
        ) : null}

        <div className="hide-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1">
          {filters.map((f) => (
            <motion.button
              key={f.key}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f.key)}
              className={filterChipClass(filter === f.key)}
            >
              {f.label}
            </motion.button>
          ))}
        </div>

        <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((tour, i) => (
              <motion.article
                layout
                key={tour.id}
                initial={{ opacity: 0, y: 28, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ delay: Math.min(i, 5) * 0.05, duration: 0.45 }}
                whileHover={{ y: -6 }}
                className="epic-card"
              >
                <Link href={\`/tours/\${tour.id}\`} className="block">
                  <div className="relative aspect-[16/11] overflow-hidden">
                    <Image
                      src={tour.image}
                      alt={tour.title}
                      fill
                      className="object-cover transition duration-700 hover:scale-105"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                    <div className="absolute left-3 top-3 flex gap-2">
                      <span className="rounded-full bg-white/92 px-2.5 py-1 text-[0.7rem] font-medium text-ink">
                        ★ {tour.rating.toFixed(1)}
                      </span>
                      {tour.discount ? (
                        <span className="rounded-full bg-accent px-2.5 py-1 text-[0.7rem] font-semibold text-white">
                          {tour.discount}
                        </span>
                      ) : null}
                      {tour.tag === "hot" ? (
                        <span className="rounded-full bg-[#e8a84a] px-2.5 py-1 text-[0.7rem] font-semibold text-ink">
                          Эрэлттэй
                        </span>
                      ) : null}
                      {tour.tag === "soon" ? (
                        <span className="rounded-full bg-ink/80 px-2.5 py-1 text-[0.7rem] font-semibold text-white">
                          Удахгүй
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="space-y-3 p-4">
                    <div>
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-accent">
                        {tour.destination}
                      </p>
                      <h3 className="mt-1 font-display text-xl font-semibold leading-snug tracking-[-0.02em]">
                        {tour.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted">{tour.description}</p>
                    </div>
                    <div className="flex items-end justify-between gap-3 border-t border-[var(--line)] pt-3">
                      <div>
                        <p className="text-xs text-muted">{tour.duration}</p>
                        <div className="mt-0.5 flex items-baseline gap-2">
                          <p className="text-base font-semibold text-accent">
                            {formatPrice(tour.price)}
                          </p>
                          {tour.oldPrice ? (
                            <p className="text-xs text-muted line-through">
                              {formatPrice(tour.oldPrice)}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <span className="rounded-full bg-accent-mist px-3.5 py-2 text-sm font-semibold text-accent">
                        Дэлгэрэнгүй
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
`,
);

write(
  "src/app/globals.css",
  `@import "tailwindcss";

:root {
  /* Warm tropical luxury — teal + sunset gold */
  --bg: #f6f3ee;
  --bg-soft: #fffdf9;
  --ink: #142824;
  --ink-soft: #3d524c;
  --muted: #6b7f78;
  --line: rgba(20, 40, 36, 0.1);
  --accent: #0b6b5c;
  --accent-soft: #148f7a;
  --accent-mist: #d8efe9;
  --gold: #e8a84a;
  --gold-soft: #ffe7a8;
  --foam: #142824;
  --shadow: 0 18px 50px rgba(20, 40, 36, 0.08);
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --dock-h: 0px;
  --nav-h: calc(4.5rem + env(safe-area-inset-top, 0px));
}

@theme inline {
  --color-bg: var(--bg);
  --color-bg-elevated: var(--bg-soft);
  --color-surface: var(--bg-soft);
  --color-accent: var(--accent);
  --color-accent-soft: var(--accent-soft);
  --color-accent-deep: var(--accent);
  --color-foam: var(--ink);
  --color-muted: var(--muted);
  --color-mint: var(--accent);
  --color-mint-soft: var(--accent-soft);
  --color-mint-deep: var(--accent);
  --color-forest: var(--ink);
  --color-gold: var(--gold);
  --font-display: var(--font-display);
  --font-sans: var(--font-sans);
}

@utility font-display {
  font-family: var(--font-display), Georgia, "Times New Roman", serif;
  letter-spacing: -0.02em;
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
  background:
    radial-gradient(ellipse 80% 50% at 10% -10%, rgba(232, 168, 74, 0.12), transparent 50%),
    radial-gradient(ellipse 60% 40% at 100% 0%, rgba(11, 107, 92, 0.08), transparent 45%),
    var(--bg);
  color: var(--ink);
  font-family: var(--font-sans), system-ui, sans-serif;
  font-weight: 400;
  letter-spacing: 0.01em;
  line-height: 1.6;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

::selection {
  background: color-mix(in oklab, var(--accent) 35%, white);
  color: var(--ink);
}

.ambient {
  display: none;
}

.app-main {
  position: relative;
  z-index: 10;
  min-height: 100dvh;
}

.page-pad-top {
  padding-top: calc(6.5rem + env(safe-area-inset-top, 0px));
}

.glass,
.glass-strong,
.liquid-sheet,
.ios-surface,
.glass-chip {
  background: var(--bg-soft);
  border: 1px solid var(--line);
  box-shadow: none;
  backdrop-filter: none;
}

.glass::before,
.glass-strong::before {
  display: none;
}

.accent-shimmer {
  background: linear-gradient(120deg, var(--accent), var(--gold), var(--accent));
  background-size: 200% 100%;
  color: white;
  animation: shimmer-slide 3.5s ease infinite;
}

@keyframes shimmer-slide {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.hide-scrollbar {
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.snap-x-mandatory {
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}
.snap-start {
  scroll-snap-align: start;
}

.epic-rule {
  width: 2.5rem;
  height: 2px;
  background: linear-gradient(90deg, var(--gold), var(--accent));
}

.epic-card {
  background: var(--bg-soft);
  border: 1px solid var(--line);
  border-radius: 1.25rem;
  overflow: hidden;
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.45s ease;
  will-change: transform;
}
.epic-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow), 0 0 0 1px rgba(232, 168, 74, 0.12);
}
`,
);

console.log("motion brand done");
