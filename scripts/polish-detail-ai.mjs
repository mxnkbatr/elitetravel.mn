import fs from "fs";

// Boost liquid glass translucency so backdrop actually shows
let css = fs.readFileSync("src/app/globals.css", "utf8");
css = css
  .replace(
    `--glass-fill: rgba(255, 255, 255, 0.08);`,
    `--glass-fill: rgba(255, 255, 255, 0.1);`,
  )
  .replace(
    `--glass-tint: rgba(18, 42, 38, 0.42);`,
    `--glass-tint: rgba(18, 42, 38, 0.28);`,
  )
  .replace(
    `--glass-blur: 44px;`,
    `--glass-blur: 52px;`,
  );

if (!css.includes(".glass-panel")) {
  css = css.replace(
    `.glass-float {
  box-shadow: var(--shadow-float);
}`,
    `.glass-float {
  box-shadow:
    var(--shadow-float),
    inset 0 0.5px 0 var(--glass-shine),
    inset 0 -0.5px 0 rgba(255, 255, 255, 0.05);
}

.glass-panel {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border-radius: 1.5rem;
  background:
    linear-gradient(
      160deg,
      rgba(255, 255, 255, 0.22) 0%,
      rgba(255, 255, 255, 0.06) 30%,
      rgba(12, 31, 28, 0.35) 100%
    );
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  border: 0.5px solid rgba(255, 255, 255, 0.28);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.28),
    inset 0 0.5px 0 rgba(255, 255, 255, 0.5),
    inset 0 -0.5px 0 rgba(255, 255, 255, 0.06);
}

.glass-panel > * {
  position: relative;
  z-index: 1;
}`,
  );
}
fs.writeFileSync("src/app/globals.css", css, "utf8");

fs.writeFileSync(
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
    { label: "Гарц", value: tour.departure ?? "УБ" },
  ];

  return (
    <div className="relative pb-[calc(10.5rem+env(safe-area-inset-bottom))] sm:pb-14">
      {/* Full-bleed hero */}
      <div className="relative -mt-1">
        <div className="relative h-[min(72svh,560px)] w-full overflow-hidden sm:mx-auto sm:mt-2 sm:h-[440px] sm:max-w-6xl sm:rounded-[2rem] sm:px-0">
          <Image
            src={tour.image}
            alt={tour.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/45 to-bg/10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(94,235,195,0.12),transparent_55%)]" />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4 pt-2 sm:p-6">
            <Link
              href="/tours"
              className="glass-chip inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-foam/85 backdrop-blur-xl"
            >
              ← Буцах
            </Link>
            <div className="flex gap-1.5">
              <span className="glass-chip rounded-full px-2.5 py-2 text-xs font-medium">
                ★ {tour.rating.toFixed(1)}
              </span>
              {tour.tag === "hot" ? (
                <span className="rounded-full bg-accent px-2.5 py-2 text-xs font-semibold text-bg shadow-[0_4px_16px_rgba(94,235,195,0.35)]">
                  Эрэлттэй
                </span>
              ) : null}
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5 pb-6 sm:p-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-accent">
                {tour.destination}
              </p>
              <h1 className="mt-1.5 max-w-2xl font-display text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.035em] text-foam sm:text-5xl">
                {tour.title}
              </h1>
              <p className="mt-2 max-w-lg text-sm text-foam/70 sm:text-base">
                {tour.description}
                {tour.nights != null ? \` · \${tour.nights} шөнө\` : ""}
                {tour.groupSize ? \` · \${tour.groupSize}\` : ""}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto -mt-5 max-w-6xl px-4 sm:-mt-8 sm:px-6">
        {/* Price strip */}
        <div className="glass-panel glass-float mb-4 flex items-center gap-3 rounded-[1.4rem] p-3 pr-3.5">
          <div className="min-w-0 flex-1 pl-2">
            <p className="text-[0.62rem] uppercase tracking-[0.14em] text-foam/45">
              Эхлэх үнэ
            </p>
            <p className="font-display text-2xl font-semibold tracking-[-0.03em] text-accent">
              {formatPrice(tour.price)}
            </p>
          </div>
          <a
            href="tel:+97690031771"
            className="hidden h-11 items-center rounded-full glass px-4 text-sm font-medium sm:inline-flex"
          >
            Залгах
          </a>
          <Link
            href="/contact"
            className="inline-flex h-11 shrink-0 items-center rounded-full bg-accent px-5 text-sm font-semibold text-bg shadow-[0_6px_20px_rgba(94,235,195,0.3)] active:scale-95"
          >
            {tour.tag === "soon" ? "Waitlist" : "Захиалах"}
          </Link>
        </div>

        {/* Facts scroll */}
        <div className="hide-scrollbar mb-5 flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:overflow-visible">
          {facts.map((f) => (
            <div
              key={f.label}
              className="glass min-w-[42%] shrink-0 rounded-[1.2rem] px-3.5 py-3.5 sm:min-w-0"
            >
              <p className="text-[0.62rem] uppercase tracking-[0.14em] text-foam/45">
                {f.label}
              </p>
              <p className="mt-1 line-clamp-2 text-[0.84rem] font-medium leading-snug">
                {f.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr] lg:gap-6">
          <div className="space-y-4">
            <section className="glass-panel p-5 sm:p-6">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-accent">
                Overview
              </p>
              <h2 className="mt-1.5 font-display text-xl font-semibold tracking-[-0.02em]">
                Аяллын тухай
              </h2>
              <p className="mt-3 text-[0.92rem] leading-relaxed text-foam/72">
                {tour.story}
              </p>
            </section>

            <section className="glass-panel p-5 sm:p-6">
              <h2 className="font-display text-xl font-semibold tracking-[-0.02em]">
                Онцлох
              </h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {tour.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 rounded-[1.05rem] bg-white/[0.07] px-3.5 py-3 text-sm ring-1 ring-white/10"
                  >
                    <span className="mt-0.5 text-accent">✦</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="glass-panel p-5 sm:p-6">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-accent">
                Itinerary
              </p>
              <h2 className="mt-1.5 font-display text-xl font-semibold tracking-[-0.02em]">
                Өдөр тутмын хөтөлбөр
              </h2>
              <ol className="mt-4">
                {tour.itinerary.map((step, i) => (
                  <li
                    key={step.day + step.title}
                    className="relative flex gap-3.5 pb-5 last:pb-0"
                  >
                    {i < tour.itinerary.length - 1 ? (
                      <span className="absolute left-[13px] top-8 h-[calc(100%-1.4rem)] w-px bg-gradient-to-b from-accent/40 to-white/5" />
                    ) : null}
                    <span className="relative z-10 mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-accent/18 text-[0.68rem] font-semibold text-accent ring-1 ring-accent/35">
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

            <section className="grid gap-3 sm:grid-cols-2">
              <div className="glass-panel p-5">
                <h2 className="font-display text-lg font-semibold">Багтсан</h2>
                <ul className="mt-3 space-y-2">
                  {tour.includes.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-foam/75">
                      <span className="text-accent">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="glass-panel p-5">
                <h2 className="font-display text-lg font-semibold">Багтаагүй</h2>
                <ul className="mt-3 space-y-2">
                  {tour.excludes.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-foam/50">
                      <span className="text-foam/30">–</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {tour.gallery.length > 0 ? (
              <section>
                <h2 className="mb-3 font-display text-xl font-semibold tracking-[-0.02em]">
                  Зургууд
                </h2>
                <div className="hide-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-3 sm:overflow-visible sm:px-0">
                  {tour.gallery.map((src) => (
                    <div
                      key={src}
                      className="relative h-40 w-[70vw] shrink-0 overflow-hidden rounded-[1.35rem] ring-1 ring-white/12 sm:h-44 sm:w-auto"
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
              <div className="glass-panel p-5">
                <p className="text-xs text-foam/50">Үнэ</p>
                <p className="mt-1 font-display text-3xl font-semibold text-accent">
                  {formatPrice(tour.price)}
                </p>
                <p className="mt-1 text-sm text-foam/55">{tour.duration}</p>
                <Link
                  href="/contact"
                  className="mt-5 flex h-12 items-center justify-center rounded-full bg-accent text-sm font-semibold text-bg"
                >
                  {tour.tag === "soon" ? "Waitlist" : "Захиалга өгөх"}
                </Link>
                <a
                  href="tel:+97690031771"
                  className="mt-2.5 flex h-11 items-center justify-center rounded-full glass text-sm font-medium"
                >
                  +976 9003 1771
                </a>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-8">
          <div className="mb-3 flex items-end justify-between">
            <h2 className="font-display text-xl font-semibold tracking-[-0.02em]">
              Төстэй аяллууд
            </h2>
            <Link href="/tours" className="text-sm font-medium text-accent">
              Бүгд →
            </Link>
          </div>
          <div className="hide-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-3 sm:overflow-visible sm:px-0">
            {related.map((r) => (
              <Link
                key={r.id}
                href={\`/tours/\${r.id}\`}
                className="glass-panel w-[72vw] shrink-0 transition active:scale-[0.98] sm:w-auto"
              >
                <div className="relative h-32 overflow-hidden rounded-t-[1.5rem]">
                  <Image
                    src={r.image}
                    alt={r.title}
                    fill
                    className="object-cover"
                    sizes="(max-width:640px) 72vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent" />
                </div>
                <div className="p-3.5">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-accent">
                    {r.destination}
                  </p>
                  <h3 className="mt-1 line-clamp-2 font-display text-[0.95rem] font-semibold">
                    {r.title}
                  </h3>
                  <p className="mt-1 text-sm text-accent">{formatPrice(r.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Mobile sticky book bar */}
      <div className="fixed inset-x-0 bottom-[calc(5.15rem+env(safe-area-inset-bottom))] z-[55] px-3 sm:hidden">
        <div className="glass-panel glass-float mx-auto flex max-w-md items-center gap-3 rounded-[1.55rem] p-2">
          <div className="min-w-0 flex-1 pl-2.5">
            <p className="text-[0.58rem] uppercase tracking-[0.12em] text-foam/45">
              Үнэ
            </p>
            <p className="truncate font-display text-[1.05rem] font-semibold text-accent">
              {formatPrice(tour.price)}
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex h-11 shrink-0 items-center rounded-full bg-accent px-5 text-sm font-semibold text-bg active:scale-95"
          >
            {tour.tag === "soon" ? "Waitlist" : "Захиалах"}
          </Link>
        </div>
      </div>
    </div>
  );
}
`,
  "utf8",
);

fs.writeFileSync(
  "src/components/AiChatbot.tsx",
  `"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Msg = { id: number; role: "bot" | "user"; text: string };

const starters = ["Хайнань үнэ?", "Хонг Конг", "Бали хэд хоног?"];

const replies: Record<string, string> = {
  default:
    "Би Elite AI зөвлөх (demo). Чиглэл, төсөв эсвэл огноогоо хэлээрэй — тохирох аяллыг санал болгоё.",
  хайнань:
    "Хайнань ₮2'690'000-с · 8 өдөр. Үндсэн болон уян хатан сонголт бий.",
  хонг:
    "Hong Kong / The Weeknd аялал ₮6'590'000 · 5 өдөр. Концерт + хот үзэх.",
  бали:
    "Бали ₮6'290'000 · 9 өдөр. Ubud + далайн эрэг.",
};

function botReply(input: string) {
  const t = input.toLowerCase();
  if (t.includes("хайна") || t.includes("hainan")) return replies["хайнань"];
  if (t.includes("хонг") || t.includes("hong") || t.includes("weeknd"))
    return replies["хонг"];
  if (t.includes("бали") || t.includes("bali")) return replies["бали"];
  return replies.default;
}

export function AiChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: 1,
      role: "bot",
      text: "Сайн уу. Elite AI энд — аяллын зөвлөгөө асуугаарай.",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(2);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open, typing]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    setMsgs((m) => [...m, { id: idRef.current++, role: "user", text: trimmed }]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      setMsgs((m) => [
        ...m,
        { id: idRef.current++, role: "bot", text: botReply(trimmed) },
      ]);
      setTyping(false);
    }, 650);
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex justify-end p-3 pb-[calc(11rem+env(safe-area-inset-bottom))] sm:p-5 sm:pb-7">
      <div className="pointer-events-auto flex max-w-full flex-col items-end gap-3">
        <AnimatePresence>
          {open ? (
            <motion.div
              key="sheet"
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 34 }}
              className="glass-panel flex h-[min(68dvh,480px)] w-[min(calc(100vw-1.25rem),380px)] flex-col overflow-hidden rounded-[1.85rem] shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
            >
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-3.5">
                <div className="relative">
                  <div className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-deep text-bg shadow-[0_0_20px_rgba(94,235,195,0.35)]">
                    <SparkIcon />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-accent ring-2 ring-bg" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.95rem] font-semibold tracking-[-0.01em]">
                    Elite AI
                  </p>
                  <p className="text-[0.68rem] text-accent/90">Online · mock demo</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="grid size-8 place-items-center rounded-full bg-white/10 text-sm text-foam/70 transition active:scale-90"
                  aria-label="Хаах"
                >
                  ✕
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 space-y-3 overflow-y-auto px-3.5 py-4">
                {msgs.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={\`flex \${m.role === "user" ? "justify-end" : "justify-start"}\`}
                  >
                    {m.role === "bot" ? (
                      <div className="mr-2 mt-1 hidden size-6 shrink-0 place-items-center rounded-full bg-accent/20 text-accent sm:grid">
                        <SparkIcon small />
                      </div>
                    ) : null}
                    <div
                      className={\`max-w-[82%] px-3.5 py-2.5 text-[0.86rem] leading-relaxed tracking-[0.01em] \${
                        m.role === "user"
                          ? "rounded-[1.2rem] rounded-br-[0.35rem] bg-accent text-bg"
                          : "rounded-[1.2rem] rounded-bl-[0.35rem] bg-white/[0.11] text-foam ring-1 ring-white/12"
                      }\`}
                    >
                      {m.text}
                    </div>
                  </motion.div>
                ))}
                {typing ? (
                  <div className="flex justify-start">
                    <div className="rounded-[1.2rem] rounded-bl-[0.35rem] bg-white/[0.11] px-4 py-3 ring-1 ring-white/12">
                      <span className="inline-flex items-center gap-1.5">
                        <i className="size-1.5 animate-pulse rounded-full bg-foam/55" />
                        <i className="size-1.5 animate-pulse rounded-full bg-foam/55 [animation-delay:150ms]" />
                        <i className="size-1.5 animate-pulse rounded-full bg-foam/55 [animation-delay:300ms]" />
                      </span>
                    </div>
                  </div>
                ) : null}
                <div ref={endRef} />
              </div>

              {/* Composer */}
              <div className="border-t border-white/10 bg-white/[0.03] px-3 pb-3 pt-2.5">
                <div className="mb-2.5 flex gap-1.5 overflow-x-auto hide-scrollbar">
                  {starters.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="shrink-0 rounded-full bg-white/[0.08] px-3 py-1.5 text-[0.7rem] font-medium text-foam/75 ring-1 ring-white/12 transition active:scale-95"
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <form
                  className="flex items-center gap-2 rounded-full bg-white/[0.1] p-1 pl-4 ring-1 ring-white/16 shadow-[inset_0_0.5px_0_rgba(255,255,255,0.25)]"
                  onSubmit={(e) => {
                    e.preventDefault();
                    send(input);
                  }}
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Мессеж бичих…"
                    className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-foam/35"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() && !typing}
                    className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-bg transition enabled:active:scale-95 disabled:opacity-40"
                    aria-label="Илгээх"
                  >
                    <SendIcon />
                  </button>
                </form>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* FAB — iOS Intelligence orb */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Чат хаах" : "AI зөвлөх"}
          className="group relative"
        >
          <span className="absolute inset-0 rounded-full bg-accent/40 blur-xl transition group-hover:bg-accent/55" />
          <span className="glass-panel relative flex h-[3.35rem] items-center gap-2.5 rounded-full pl-1.5 pr-4 shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
            <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-accent via-accent-soft to-accent-deep text-bg">
              {open ? <CloseIcon /> : <SparkIcon />}
            </span>
            <span className="pr-0.5 text-sm font-semibold tracking-[0.01em]">
              {open ? "Хаах" : "AI зөвлөх"}
            </span>
          </span>
        </motion.button>
      </div>
    </div>
  );
}

function SparkIcon({ small }: { small?: boolean }) {
  const s = small ? 12 : 18;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2.8 13.85 9.1 20 10.5l-6.15 1.4L12 18.2l-1.85-6.3L4 10.5l6.15-1.4L12 2.8Z"
        fill="currentColor"
      />
      <path
        d="M18.8 15 19.5 17.4 22 18.1l-2.5.7-.7 2.4-.7-2.4-2.5-.7 2.5-.7.7-2.4Z"
        fill="currentColor"
        opacity="0.75"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 19V5M12 5l-6 6M12 5l6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 7l10 10M17 7 7 17"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
`,
  "utf8",
);

console.log("detail + ai polished");
