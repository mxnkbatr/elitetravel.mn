import fs from "fs";
import path from "path";

const root = process.cwd();
function write(rel, content) {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, { encoding: "utf8" });
  console.log("ok", rel);
}

write(
  "src/components/ChatBot.tsx",
  `"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Msg = { id: number; role: "bot" | "user"; text: string };

const starters = [
  "Хайнань хэдэн төгрөг вэ?",
  "Хонг Конг концерт аялал",
  "Бали хэзээ явж болох вэ?",
];

const replies: Record<string, string> = {
  "Хайнань хэдэн төгрөг вэ?":
    "Хайнань үндсэн аялал ₮2'690'000-с эхэлнэ · 8 өдөр / 7 шөнө. Дэлгэрэнгүйг Аяллууд хэсгээс үзээрэй.",
  "Хонг Конг концерт аялал":
    "The Weeknd: Hong Kong аялал ₮6'590'000 · 5 өдөр. Концертын тасалбар + 4 одтой буудал багтсан.",
  "Бали хэзээ явж болох вэ?":
    "Бали аялал уян хатан огноотой — хүссэн үедээ эхлэх боломжтой. ₮6'290'000-с.",
};

const fallback =
  "Одоогоор mock горимд ажиллаж байна 🙂 Бодит зөвлөгөө авахыг хүсвэл +976 9003 1771 руу залгаарай.";

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: 1,
      role: "bot",
      text: "Сайн байна уу! Elite Travel AI mockup. Аяллын талаар асуугаарай.",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(2);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing, open]);

  function push(role: "bot" | "user", text: string) {
    const id = idRef.current++;
    setMsgs((m) => [...m, { id, role, text }]);
  }

  function ask(text: string) {
    const q = text.trim();
    if (!q || typing) return;
    push("user", q);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      push("bot", replies[q] ?? fallback);
      setTyping(false);
    }, 700);
  }

  return (
    <>
      <AnimatePresence>
        {open ? (
          <motion.div
            key="sheet"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[70] mx-auto flex max-h-[min(68vh,560px)] w-auto max-w-md flex-col overflow-hidden rounded-[1.75rem] glass-strong sm:inset-x-auto sm:right-5 sm:bottom-6 sm:w-[380px]"
            role="dialog"
            aria-label="AI чат"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
              <span className="grid size-9 place-items-center rounded-full bg-accent/20 text-sm font-semibold text-accent ring-1 ring-accent/30">
                AI
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold tracking-[0.01em]">Elite Assistant</p>
                <p className="text-[0.68rem] text-foam/50">Mockup · шууд хариулт</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-8 place-items-center rounded-full bg-white/10 text-foam/70"
                aria-label="Хаах"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {msgs.map((m) => (
                <div
                  key={m.id}
                  className={\`flex \${m.role === "user" ? "justify-end" : "justify-start"}\`}
                >
                  <div
                    className={\`max-w-[85%] rounded-[1.15rem] px-3.5 py-2.5 text-[0.875rem] leading-relaxed tracking-[0.01em] \${
                      m.role === "user"
                        ? "rounded-br-md bg-accent text-bg"
                        : "rounded-bl-md bg-white/[0.1] text-foam ring-1 ring-white/12"
                    }\`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {typing ? (
                <div className="flex justify-start">
                  <div className="rounded-[1.15rem] rounded-bl-md bg-white/[0.1] px-3.5 py-2.5 text-sm text-foam/55 ring-1 ring-white/12">
                    бичиж байна…
                  </div>
                </div>
              ) : null}
              <div ref={endRef} />
            </div>

            <div className="hide-scrollbar flex gap-2 overflow-x-auto border-t border-white/10 px-3 pt-3">
              {starters.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => ask(s)}
                  className="shrink-0 rounded-full bg-white/[0.08] px-3 py-1.5 text-[0.72rem] text-foam/75 ring-1 ring-white/12 transition active:scale-95"
                >
                  {s}
                </button>
              ))}
            </div>

            <form
              className="flex items-center gap-2 p-3"
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Асуултаа бич…"
                className="h-11 flex-1 rounded-full bg-white/[0.08] px-4 text-sm text-foam outline-none ring-1 ring-white/12 placeholder:text-foam/35 focus:ring-accent/40"
              />
              <button
                type="submit"
                className="grid h-11 w-11 place-items-center rounded-full bg-accent text-bg transition active:scale-95"
                aria-label="Илгээх"
              >
                ↑
              </button>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        aria-label={open ? "Чат хаах" : "AI чат нээх"}
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.94 }}
        className="glass-strong glass-float fixed bottom-[calc(5.35rem+env(safe-area-inset-bottom))] right-3 z-[70] grid size-14 place-items-center rounded-full text-accent sm:bottom-6 sm:right-5"
      >
        {open ? (
          <span className="text-lg text-foam">✕</span>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6A2.5 2.5 0 0 1 16.5 15H12l-4.2 3.2c-.55.42-1.3.03-1.3-.66V15H7.5A2.5 2.5 0 0 1 5 12.5v-6Z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
            <circle cx="9" cy="9.5" r="0.9" fill="currentColor" />
            <circle cx="12" cy="9.5" r="0.9" fill="currentColor" />
            <circle cx="15" cy="9.5" r="0.9" fill="currentColor" />
          </svg>
        )}
      </motion.button>
    </>
  );
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
  { href: "/resorts", label: "Амралт" },
  { href: "/about", label: "Бидний тухай" },
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

      <div className="relative mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="group flex min-w-0 items-center gap-2.5">
          <Image
            src="/elite-logo.png"
            alt="Elite Travel Mongolia logo"
            width={44}
            height={44}
            className="size-10 shrink-0 rounded-full object-cover ring-1 ring-white/20 sm:size-11"
            priority
          />
          <span className="hidden min-w-0 flex-col leading-tight sm:flex">
            <span className="font-display text-[0.88rem] font-semibold tracking-[0.04em] text-foam">
              Elite Travel Mongolia
            </span>
            <span className="text-[0.65rem] tracking-[0.02em] text-foam/55">
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

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/tours"
            className={\`hidden items-center rounded-full px-3.5 py-2 text-sm font-medium tracking-[0.01em] transition md:inline-flex lg:hidden \${
              pathname.startsWith("/tours")
                ? "bg-accent text-bg"
                : "glass text-foam"
            }\`}
          >
            Аяллууд
          </Link>

          <a
            href="tel:+97690031771"
            className="hidden rounded-full bg-accent px-4 py-2 text-sm font-semibold tracking-[0.01em] text-bg shadow-[0_6px_20px_rgba(94,235,195,0.28)] transition hover:bg-accent-soft xl:inline-flex"
          >
            +976 9003 1771
          </a>

          <Link
            href="/profile"
            className="overflow-hidden rounded-full ring-1 ring-white/25"
            aria-label="Профайл"
          >
            <Image
              src="/elite-logo.png"
              alt="Профайл"
              width={36}
              height={36}
              className="size-9 object-cover sm:size-10"
            />
          </Link>

          <button
            type="button"
            aria-label="Цэс"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full glass sm:h-11 sm:w-11 lg:hidden"
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
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className={\`block rounded-[1.15rem] px-4 py-3.5 text-[0.95rem] tracking-[0.01em] \${
              pathname.startsWith("/profile")
                ? "bg-white/12 font-medium text-accent"
                : "text-foam/90 hover:bg-white/6"
            }\`}
          >
            Профайл
          </Link>
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
);

write(
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

function CompassIcon({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle
        cx="12"
        cy="12"
        r="8.25"
        stroke="currentColor"
        strokeWidth={active ? 1.85 : 1.5}
      />
      <path
        d="m14.8 9.2-1.6 4.6-4.6 1.6 1.6-4.6 4.6-1.6Z"
        stroke="currentColor"
        strokeWidth={active ? 1.85 : 1.5}
        strokeLinejoin="round"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.22 : 0}
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
      <path
        d="M12 8.5v.01"
        stroke="currentColor"
        strokeWidth={active ? 2.1 : 1.75}
        strokeLinecap="round"
      />
    </svg>
  );
}
`,
);

write(
  "src/components/TourDetailView.tsx",
  `"use client";

import { formatPrice, relatedTours, type Tour } from "@/data/tours";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function TourDetailView({ tour }: { tour: Tour }) {
  const related = relatedTours(tour.id, 3);
  const facts = [
    { label: "Хугацаа", value: tour.duration },
    { label: "Огноо", value: tour.dates ?? "Холбогдоно уу" },
    { label: "Байр", value: tour.stay ?? "—" },
    { label: "Гарц", value: tour.departure ?? "Улаанбаатар" },
  ];

  return (
    <div className="relative pb-[calc(7.25rem+env(safe-area-inset-bottom))] sm:pb-12">
      {/* Full-bleed hero — iOS media style */}
      <div className="relative -mx-0">
        <div className="relative h-[52svh] min-h-[300px] max-h-[480px] w-full overflow-hidden sm:mx-auto sm:mt-2 sm:h-[420px] sm:max-w-6xl sm:rounded-[2rem] sm:px-0">
          <Image
            src={tour.image}
            alt={tour.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/50 via-transparent to-transparent" />

          <div className="absolute left-4 top-[calc(0.25rem+env(safe-area-inset-top,0px))] z-10 sm:left-6 sm:top-5">
            <Link
              href="/tours"
              className="inline-flex h-10 items-center gap-1.5 rounded-full glass-chip px-3.5 text-sm font-medium text-foam backdrop-blur-xl"
            >
              ← Буцах
            </Link>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
            <div className="mx-auto max-w-6xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full glass-chip px-2.5 py-1 text-xs font-medium">
                  ★ {tour.rating.toFixed(1)}
                </span>
                {tour.tag === "hot" ? (
                  <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-bg">
                    Эрэлттэй
                  </span>
                ) : null}
                {tour.tag === "soon" ? (
                  <span className="rounded-full glass-chip px-2.5 py-1 text-xs font-semibold">
                    Удахгүй
                  </span>
                ) : null}
              </div>
              <p className="mt-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-accent">
                {tour.destination}
              </p>
              <h1 className="mt-1 max-w-2xl font-display text-[1.9rem] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
                {tour.title}
              </h1>
              <p className="mt-2 max-w-xl text-sm text-foam/75 sm:text-base">
                {tour.description}
                {tour.nights != null ? \` · \${tour.nights} шөнө\` : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* iOS inset grouped facts */}
        <div className="mt-5 overflow-hidden rounded-[1.35rem] glass-strong">
          <div className="grid grid-cols-2 divide-x divide-y divide-white/10 sm:grid-cols-4 sm:divide-y-0">
            {facts.map((f) => (
              <div key={f.label} className="px-4 py-3.5">
                <p className="text-[0.62rem] uppercase tracking-[0.14em] text-foam/40">
                  {f.label}
                </p>
                <p className="mt-1 text-[0.84rem] font-medium leading-snug tracking-[0.01em]">
                  {f.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_0.6fr] lg:gap-6">
          <div className="space-y-5">
            <section className="rounded-[1.35rem] glass-strong p-5">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-accent">
                Overview
              </p>
              <h2 className="mt-1.5 font-display text-xl font-semibold tracking-[-0.02em]">
                Аяллын тухай
              </h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-foam/72">
                {tour.story}
              </p>
            </section>

            <section className="rounded-[1.35rem] glass-strong p-5">
              <h2 className="font-display text-lg font-semibold tracking-[-0.02em]">
                Онцлох зүйлс
              </h2>
              <ul className="mt-3 divide-y divide-white/8">
                {tour.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 py-3 text-sm tracking-[0.01em] first:pt-1 last:pb-0"
                  >
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent/15 text-[0.65rem] text-accent">
                      ✦
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-[1.35rem] glass-strong p-5">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-accent">
                Itinerary
              </p>
              <h2 className="mt-1.5 font-display text-lg font-semibold tracking-[-0.02em]">
                Өдөр тутмын хөтөлбөр
              </h2>
              <ol className="mt-4">
                {tour.itinerary.map((step, i) => (
                  <li
                    key={step.day + step.title}
                    className="relative flex gap-3.5 pb-5 last:pb-0"
                  >
                    {i < tour.itinerary.length - 1 ? (
                      <span className="absolute left-[13px] top-7 h-[calc(100%-1.1rem)] w-px bg-white/10" />
                    ) : null}
                    <span className="relative z-10 mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-white/10 text-[0.7rem] font-semibold text-accent ring-1 ring-white/15">
                      {i + 1}
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-accent">
                        {step.day}
                      </p>
                      <h3 className="mt-0.5 font-display text-[0.98rem] font-semibold tracking-[-0.02em]">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-foam/62">
                        {step.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="overflow-hidden rounded-[1.35rem] glass-strong">
              <div className="border-b border-white/10 p-5">
                <h2 className="font-display text-lg font-semibold tracking-[-0.02em]">
                  Юу багтсан бэ
                </h2>
                <ul className="mt-3 space-y-2.5">
                  {tour.includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-foam/75"
                    >
                      <span className="mt-0.5 text-accent">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-5">
                <h2 className="font-display text-lg font-semibold tracking-[-0.02em]">
                  Багтаагүй
                </h2>
                <ul className="mt-3 space-y-2.5">
                  {tour.excludes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-foam/50"
                    >
                      <span className="mt-0.5 text-foam/30">–</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {tour.gallery.length > 0 ? (
              <section>
                <h2 className="mb-3 px-0.5 font-display text-lg font-semibold tracking-[-0.02em]">
                  Зургууд
                </h2>
                <div className="hide-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-3 sm:overflow-visible sm:px-0">
                  {tour.gallery.map((src) => (
                    <div
                      key={src}
                      className="relative h-40 w-[70vw] shrink-0 overflow-hidden rounded-[1.2rem] sm:h-44 sm:w-auto"
                    >
                      <Image
                        src={src}
                        alt={tour.title}
                        fill
                        className="object-cover"
                        sizes="(max-width:640px) 70vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-3">
              <div className="rounded-[1.5rem] glass-strong p-6">
                <p className="text-xs text-foam/50">Үнэ</p>
                <p className="mt-1 font-display text-3xl font-semibold tracking-[-0.03em] text-accent">
                  {formatPrice(tour.price)}
                </p>
                <p className="mt-2 text-sm text-foam/60">{tour.duration}</p>
                <Link
                  href="/contact"
                  className="mt-5 flex h-12 items-center justify-center rounded-full bg-accent text-sm font-semibold text-bg transition hover:bg-accent-soft active:scale-95"
                >
                  {tour.tag === "soon" ? "Waitlist-д бүртгүүлэх" : "Захиалга өгөх"}
                </Link>
                <a
                  href="tel:+97690031771"
                  className="mt-2.5 flex h-12 items-center justify-center rounded-full text-sm font-medium glass transition active:scale-95"
                >
                  +976 9003 1771
                </a>
              </div>
              <p className="px-2 text-center text-xs leading-relaxed text-foam/45">
                Асуулт байвал AI чат эсвэл 10:00–20:00 цагт залгаарай.
              </p>
            </div>
          </aside>
        </div>

        <section className="mt-9">
          <div className="mb-3 flex items-end justify-between gap-3">
            <h2 className="font-display text-lg font-semibold tracking-[-0.02em]">
              Төстэй аяллууд
            </h2>
            <Link href="/tours" className="text-sm font-medium text-accent">
              Бүгд →
            </Link>
          </div>
          <div className="hide-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
            {related.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={\`/tours/\${r.id}\`}
                  className="block w-[72vw] shrink-0 overflow-hidden rounded-[1.25rem] glass-strong transition active:scale-[0.98] sm:w-auto"
                >
                  <div className="relative h-32">
                    <Image
                      src={r.image}
                      alt={r.title}
                      fill
                      className="object-cover"
                      sizes="(max-width:640px) 72vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg/90 to-transparent" />
                  </div>
                  <div className="p-3.5">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-accent">
                      {r.destination}
                    </p>
                    <h3 className="mt-0.5 line-clamp-2 font-display text-[0.95rem] font-semibold tracking-[-0.02em]">
                      {r.title}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-accent">
                      {formatPrice(r.price)}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* iOS-style bottom buy bar — clears dock + chat FAB */}
      <div className="fixed inset-x-0 bottom-[calc(4.85rem+env(safe-area-inset-bottom))] z-[55] px-3 pr-[4.75rem] sm:hidden">
        <div className="glass-strong glass-float mx-auto flex max-w-md items-center gap-3 rounded-[1.45rem] p-2 pl-3.5">
          <div className="min-w-0 flex-1">
            <p className="text-[0.6rem] uppercase tracking-[0.12em] text-foam/40">Үнэ</p>
            <p className="truncate font-display text-[1.05rem] font-semibold text-accent">
              {formatPrice(tour.price)}
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex h-10 shrink-0 items-center rounded-full bg-accent px-4 text-sm font-semibold text-bg active:scale-95"
          >
            {tour.tag === "soon" ? "Waitlist" : "Захиалах"}
          </Link>
        </div>
      </div>
    </div>
  );
}
`,
);

// Wire chatbot into AppShell
write(
  "src/components/AppShell.tsx",
  `"use client";

import { ChatBot } from "@/components/ChatBot";
import { Footer } from "@/components/Footer";
import { MobileDock } from "@/components/MobileDock";
import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/PageTransition";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <Navbar />
      <main className="app-main flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <div
        className="pointer-events-none h-[var(--dock-h)] shrink-0 sm:hidden"
        aria-hidden
      />
      <MobileDock />
      <ChatBot />
    </div>
  );
}
`,
);

// Fix detail page wrapper — remove extra pad that fights full-bleed hero
write(
  "src/app/tours/[id]/page.tsx",
  `import { TourDetailView } from "@/components/TourDetailView";
import { getTour, tours } from "@/data/tours";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type TourDetailProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return tours.map((tour) => ({ id: tour.id }));
}

export async function generateMetadata({
  params,
}: TourDetailProps): Promise<Metadata> {
  const { id } = await params;
  const tour = getTour(id);
  if (!tour) return { title: "Аялал" };
  return {
    title: tour.title,
    description: tour.story,
  };
}

export default async function TourDetailPage({ params }: TourDetailProps) {
  const { id } = await params;
  const tour = getTour(id);
  if (!tour) notFound();

  return (
    <div className="pt-[calc(4.25rem+env(safe-area-inset-top,0px))] sm:page-pad-top">
      <TourDetailView tour={tour} />
    </div>
  );
}
`,
);

console.log("chat + nav + detail done");
