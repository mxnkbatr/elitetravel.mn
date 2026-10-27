import fs from "fs";

// Append / patch iOS surface utilities into globals
let css = fs.readFileSync("src/app/globals.css", "utf8");
if (!css.includes(".ios-surface")) {
  css = css.replace(
    ".glass-chip {",
    `.ios-surface {
  background: rgba(255, 255, 255, 0.055);
  border: 0.5px solid rgba(255, 255, 255, 0.09);
}

.ios-grouped {
  background: rgba(255, 255, 255, 0.06);
  border: 0.5px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  overflow: hidden;
}

.ios-row + .ios-row {
  border-top: 0.5px solid rgba(255, 255, 255, 0.08);
}

.ios-hairline {
  height: 0.5px;
  background: rgba(255, 255, 255, 0.1);
}

.glass-chip {`,
  );
  fs.writeFileSync("src/app/globals.css", css, "utf8");
  console.log("ok globals ios surfaces");
}

fs.writeFileSync(
  "src/components/TourDetailView.tsx",
  `"use client";

import { formatPrice, relatedTours, type Tour } from "@/data/tours";
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
    <div className="relative pb-[calc(7rem+env(safe-area-inset-bottom))] sm:pb-14">
      {/* Full-bleed media — App Store / Travel app */}
      <section className="relative h-[46svh] min-h-[280px] max-h-[420px] w-full overflow-hidden sm:mx-auto sm:mt-3 sm:h-[400px] sm:max-w-6xl sm:rounded-[1.75rem]">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-bg/20" />

        <Link
          href="/tours"
          className="absolute left-4 top-4 z-10 inline-flex h-9 items-center gap-1 rounded-full bg-black/35 px-3 text-sm font-medium text-foam backdrop-blur-md sm:left-5 sm:top-5"
        >
          ← Буцах
        </Link>

        <div className="absolute inset-x-0 bottom-0 px-5 pb-5 sm:px-8 sm:pb-7">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-black/35 px-2.5 py-1 text-xs font-medium backdrop-blur-md">
                ★ {tour.rating.toFixed(1)}
              </span>
              {tour.tag === "hot" ? (
                <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-bg">
                  Эрэлттэй
                </span>
              ) : null}
              {tour.tag === "soon" ? (
                <span className="rounded-full bg-black/35 px-2.5 py-1 text-xs font-semibold backdrop-blur-md">
                  Удахгүй
                </span>
              ) : null}
            </div>
            <p className="mt-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-accent">
              {tour.destination}
            </p>
            <h1 className="mt-1 max-w-2xl font-display text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-[2.75rem]">
              {tour.title}
            </h1>
            <p className="mt-2 max-w-xl text-[0.92rem] text-foam/70">
              {tour.description}
              {tour.nights != null ? \` · \${tour.nights} шөнө\` : ""}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Fact strip — single grouped surface, no stacked glass */}
        <div className="ios-grouped mt-5">
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {facts.map((f, i) => (
              <div
                key={f.label}
                className={\`px-4 py-3.5 \${
                  i % 2 === 1 ? "border-l border-white/[0.08]" : ""
                } \${i > 1 ? "border-t border-white/[0.08] sm:border-t-0" : ""} \${
                  i > 0 ? "sm:border-l sm:border-white/[0.08]" : ""
                }\`}
              >
                <p className="text-[0.62rem] font-medium uppercase tracking-[0.12em] text-foam/40">
                  {f.label}
                </p>
                <p className="mt-1 text-[0.84rem] font-medium leading-snug text-foam">
                  {f.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.45fr_0.55fr] lg:gap-10">
          <div className="space-y-8">
            <section>
              <h2 className="font-display text-[1.15rem] font-semibold tracking-[-0.02em]">
                Аяллын тухай
              </h2>
              <p className="mt-2.5 text-[0.95rem] leading-[1.65] text-foam/68">
                {tour.story}
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-display text-[1.15rem] font-semibold tracking-[-0.02em]">
                Онцлох зүйлс
              </h2>
              <div className="ios-grouped">
                {tour.highlights.map((item) => (
                  <div key={item} className="ios-row flex items-center gap-3 px-4 py-3.5">
                    <span className="text-accent">✦</span>
                    <span className="text-[0.92rem] tracking-[0.01em]">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-2 font-display text-[1.15rem] font-semibold tracking-[-0.02em]">
                Өдөр тутмын хөтөлбөр
              </h2>
              <div className="ios-grouped">
                {tour.itinerary.map((step, i) => (
                  <div key={step.day + step.title} className="ios-row flex gap-3.5 px-4 py-4">
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-accent/12 text-[0.72rem] font-semibold text-accent">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-accent">
                        {step.day}
                      </p>
                      <h3 className="mt-0.5 text-[0.95rem] font-semibold tracking-[-0.01em]">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-foam/58">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
              <div>
                <h2 className="mb-2 font-display text-[1.05rem] font-semibold tracking-[-0.02em]">
                  Юу багтсан бэ
                </h2>
                <div className="ios-grouped">
                  {tour.includes.map((item) => (
                    <div key={item} className="ios-row flex gap-2.5 px-4 py-3 text-sm text-foam/75">
                      <span className="text-accent">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="mb-2 font-display text-[1.05rem] font-semibold tracking-[-0.02em]">
                  Багтаагүй
                </h2>
                <div className="ios-grouped">
                  {tour.excludes.map((item) => (
                    <div key={item} className="ios-row flex gap-2.5 px-4 py-3 text-sm text-foam/48">
                      <span className="text-foam/30">–</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {tour.gallery.length > 0 ? (
              <section>
                <h2 className="mb-2.5 font-display text-[1.15rem] font-semibold tracking-[-0.02em]">
                  Зургууд
                </h2>
                <div className="hide-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-2.5 sm:overflow-visible sm:px-0">
                  {tour.gallery.map((src) => (
                    <div
                      key={src}
                      className="relative h-36 w-[68vw] shrink-0 overflow-hidden rounded-[12px] sm:h-40 sm:w-auto"
                    >
                      <Image
                        src={src}
                        alt={tour.title}
                        fill
                        className="object-cover"
                        sizes="(max-width:640px) 68vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <section>
              <div className="mb-2.5 flex items-end justify-between">
                <h2 className="font-display text-[1.15rem] font-semibold tracking-[-0.02em]">
                  Төстэй аяллууд
                </h2>
                <Link href="/tours" className="text-sm font-medium text-accent">
                  Бүгд
                </Link>
              </div>
              <div className="hide-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={\`/tours/\${r.id}\`}
                    className="w-[70vw] shrink-0 overflow-hidden rounded-[14px] ios-surface transition active:opacity-80 sm:w-auto"
                  >
                    <div className="relative h-28">
                      <Image
                        src={r.image}
                        alt={r.title}
                        fill
                        className="object-cover"
                        sizes="(max-width:640px) 70vw, 33vw"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-accent">
                        {r.destination}
                      </p>
                      <h3 className="mt-0.5 line-clamp-2 text-[0.9rem] font-semibold tracking-[-0.01em]">
                        {r.title}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-accent">
                        {formatPrice(r.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Desktop buy card — flat iOS, not liquid glass stack */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 overflow-hidden rounded-[16px] ios-surface">
              <div className="p-5">
                <p className="text-xs text-foam/45">Үнэ</p>
                <p className="mt-1 font-display text-[1.85rem] font-semibold tracking-[-0.03em] text-accent">
                  {formatPrice(tour.price)}
                </p>
                <p className="mt-1 text-sm text-foam/55">{tour.duration}</p>
              </div>
              <div className="ios-hairline" />
              <div className="space-y-2 p-4">
                <Link
                  href="/contact"
                  className="flex h-11 items-center justify-center rounded-full bg-accent text-sm font-semibold text-bg transition hover:bg-accent-soft active:scale-[0.98]"
                >
                  {tour.tag === "soon" ? "Waitlist-д бүртгүүлэх" : "Захиалга өгөх"}
                </Link>
                <a
                  href="tel:+97690031771"
                  className="flex h-11 items-center justify-center rounded-full bg-white/[0.06] text-sm font-medium text-foam ring-1 ring-white/10 transition active:scale-[0.98]"
                >
                  +976 9003 1771
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* iOS bottom bar */}
      <div className="fixed inset-x-0 bottom-[calc(4.85rem+env(safe-area-inset-bottom))] z-[55] px-3 pr-[4.6rem] sm:hidden">
        <div className="mx-auto flex max-w-md items-center gap-3 rounded-[14px] border border-white/10 bg-[#122a26]/92 px-3 py-2.5 backdrop-blur-xl">
          <div className="min-w-0 flex-1">
            <p className="text-[0.58rem] uppercase tracking-[0.1em] text-foam/40">Үнэ</p>
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
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const barOpacity = useTransform(scrollY, [0, 40, 90], [0, 0.65, 1]);
  const blur = useTransform(scrollY, [0, 90], [0, 24]);
  const backdropFilter = useTransform(blur, (v) => \`blur(\${v}px) saturate(160%)\`);

  return (
    <header className="fixed inset-x-0 top-0 z-[60] pt-[env(safe-area-inset-top,0px)]">
      <motion.div
        style={{ opacity: barOpacity, backdropFilter, WebkitBackdropFilter: backdropFilter }}
        className="pointer-events-none absolute inset-0 border-b border-white/[0.06] bg-[#0c1f1c]/72"
      />

      <div className="relative mx-auto flex h-[3.75rem] max-w-6xl items-center justify-between gap-4 px-4 sm:h-[4.25rem] sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <Image
            src="/elite-logo.png"
            alt="Elite Travel Mongolia"
            width={40}
            height={40}
            className="size-9 shrink-0 rounded-full object-cover ring-1 ring-white/15 sm:size-10"
            priority
          />
          <span className="hidden truncate font-display text-[0.92rem] font-semibold tracking-[-0.01em] text-foam lg:inline">
            Elite Travel
          </span>
        </Link>

        {/* Desktop — clean Apple-style text nav */}
        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 lg:flex">
          {links.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={\`relative rounded-lg px-3.5 py-2 text-[0.84rem] tracking-[0.01em] transition \${
                  active
                    ? "font-semibold text-foam"
                    : "font-medium text-foam/55 hover:text-foam"
                }\`}
              >
                {link.label}
                {active ? (
                  <span className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-accent" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Link
            href="/tours"
            className={\`hidden items-center rounded-full px-3.5 py-1.5 text-[0.82rem] font-semibold transition md:inline-flex lg:hidden \${
              pathname.startsWith("/tours")
                ? "bg-accent text-bg"
                : "bg-white/[0.08] text-foam"
            }\`}
          >
            Аяллууд
          </Link>

          <a
            href="tel:+97690031771"
            className="hidden h-9 items-center rounded-full bg-accent px-4 text-[0.82rem] font-semibold text-bg transition hover:bg-accent-soft lg:inline-flex"
          >
            Холбогдох
          </a>

          <Link
            href="/profile"
            className="overflow-hidden rounded-full ring-1 ring-white/20"
            aria-label="Профайл"
          >
            <Image
              src="/elite-logo.png"
              alt="Профайл"
              width={34}
              height={34}
              className="size-[34px] object-cover sm:size-9"
            />
          </Link>

          <button
            type="button"
            aria-label="Цэс"
            onClick={() => setOpen((v) => !v)}
            className="grid size-9 place-items-center rounded-full bg-white/[0.08] ring-1 ring-white/12 lg:hidden"
          >
            <span className="flex w-3.5 flex-col gap-[3px]">
              <span
                className={\`h-[1.5px] rounded-full bg-foam transition \${open ? "translate-y-[4.5px] rotate-45" : ""}\`}
              />
              <span
                className={\`h-[1.5px] rounded-full bg-foam transition \${open ? "opacity-0" : ""}\`}
              />
              <span
                className={\`h-[1.5px] rounded-full bg-foam transition \${open ? "-translate-y-[4.5px] -rotate-45" : ""}\`}
              />
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="relative mx-3 overflow-hidden rounded-[14px] border border-white/10 bg-[#122a26]/95 p-1.5 backdrop-blur-xl lg:hidden"
        >
          {links.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={\`flex items-center justify-between rounded-[10px] px-3.5 py-3 text-[0.95rem] \${
                  active ? "bg-white/[0.08] font-semibold text-accent" : "text-foam/85"
                }\`}
              >
                {link.label}
                {active ? <span className="text-accent">●</span> : null}
              </Link>
            );
          })}
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className={\`flex items-center justify-between rounded-[10px] px-3.5 py-3 text-[0.95rem] \${
              pathname.startsWith("/profile")
                ? "bg-white/[0.08] font-semibold text-accent"
                : "text-foam/85"
            }\`}
          >
            Профайл
          </Link>
          <a
            href="tel:+97690031771"
            className="mt-1 flex items-center justify-center rounded-[10px] bg-accent px-3.5 py-3 text-sm font-semibold text-bg"
          >
            +976 9003 1771
          </a>
        </motion.div>
      ) : null}
    </header>
  );
}
`,
  "utf8",
);

console.log("ios app polish done");
