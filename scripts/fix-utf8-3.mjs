import fs from "fs";
import path from "path";

const root = process.cwd();
function write(rel, content) {
  fs.writeFileSync(path.join(root, rel), content, { encoding: "utf8" });
  console.log("ok", rel);
}

write(
  "src/components/Navbar.tsx",
  `"use client";

import { motion, useScroll, useTransform } from "framer-motion";
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
    ["rgba(10,13,20,0)", "rgba(10,13,20,0.86)"],
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
          <span className="grid h-9 w-9 place-items-center rounded-full bg-accent/15 ring-1 ring-accent/40">
            <span className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_18px_rgba(255,122,89,0.75)]" />
          </span>
          <span className="font-display text-[0.92rem] font-semibold tracking-[0.06em] text-foam">
            ELITE TRAVEL
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
  "src/components/MobileDock.tsx",
  `"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Нүүр", icon: HomeIcon },
  { href: "/destinations", label: "Чиглэл", icon: MapIcon },
  { href: "/tours", label: "Аялал", icon: CompassIcon },
  { href: "/contact", label: "Холбоо", icon: CallIcon },
];

export function MobileDock() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 sm:hidden"
      aria-label="Үндсэн цэс"
    >
      <motion.div
        initial={{ y: 28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex max-w-md items-stretch justify-between rounded-[1.65rem] glass-strong px-1.5 py-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
      >
        {items.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={\`relative flex min-h-[3.35rem] min-w-[4.4rem] flex-1 flex-col items-center justify-center gap-0.5 rounded-[1.25rem] text-[0.68rem] font-medium tracking-[0.02em] transition active:scale-95 \${
                active ? "text-accent" : "text-foam/55"
              }\`}
            >
              {active && (
                <motion.span
                  layoutId="dock-pill"
                  className="absolute inset-0 rounded-[1.25rem] bg-accent/12 ring-1 ring-accent/25"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
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
        strokeWidth={active ? 1.9 : 1.55}
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
        strokeWidth={active ? 1.9 : 1.55}
        strokeLinejoin="round"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.18 : 0}
      />
      <path d="M9 4v13.5M15 6.5V20" stroke="currentColor" strokeWidth={active ? 1.9 : 1.55} />
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
        strokeWidth={active ? 1.9 : 1.55}
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.12 : 0}
      />
      <path
        d="m14.8 9.2-1.6 4.6-4.6 1.6 1.6-4.6 4.6-1.6Z"
        stroke="currentColor"
        strokeWidth={active ? 1.9 : 1.55}
        strokeLinejoin="round"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.35 : 0}
      />
    </svg>
  );
}

function CallIcon({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7.2 3.8h2.4l1.2 4-1.8 1.1a12.4 12.4 0 0 0 5.1 5.1l1.1-1.8 4 1.2v2.4c0 .7-.5 1.3-1.2 1.4A15.2 15.2 0 0 1 5.8 5c.1-.7.7-1.2 1.4-1.2Z"
        stroke="currentColor"
        strokeWidth={active ? 1.9 : 1.55}
        strokeLinejoin="round"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.18 : 0}
      />
    </svg>
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
      <div className="overflow-hidden rounded-[28px] border border-white/12 bg-[#121826]/92 shadow-[0_24px_80px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:rounded-[32px]">
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
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,122,89,0.32),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(88,140,255,0.18),transparent_40%),linear-gradient(160deg,#1a2233,#0a0d14)]" />
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

write(
  "src/components/Contact.tsx",
  `"use client";

import { motion } from "framer-motion";

const channels = [
  {
    label: "Instagram",
    detail: "DM-ээр холбогдох",
    href: "https://instagram.com",
  },
  {
    label: "Facebook",
    detail: "Messenger-ээр чатлах",
    href: "https://facebook.com",
  },
  {
    label: "Утас",
    detail: "+976 9003 1771",
    href: "tel:+97690031771",
  },
];

type ContactProps = {
  showIntro?: boolean;
};

export function Contact({ showIntro = true }: ContactProps) {
  return (
    <section className="relative z-10">
      <div className="relative overflow-hidden rounded-[28px] px-5 py-10 sm:rounded-[32px] sm:px-12 sm:py-14">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(255,122,89,0.2),rgba(10,13,20,0.35)),url('https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 -z-10 bg-bg/78 backdrop-blur-xl" />

        {showIntro ? (
          <div className="max-w-xl">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-accent">
              Contact
            </p>
            <h2 className="mt-3 font-display text-[1.75rem] font-semibold tracking-[-0.03em] sm:text-4xl">
              Захиалга өгөх
            </h2>
            <p className="mt-4 text-[0.95rem] tracking-[0.01em] text-foam/70 sm:text-base">
              Дуртай аялаа сонгоод шууд холбогдоорой. Бид танд хамгийн тохиромжтой
              хувилбарыг санал болгоно.
            </p>
          </div>
        ) : null}

        <div className={\`grid gap-3 sm:grid-cols-3 \${showIntro ? "mt-8" : "mt-0"}\`}>
          {channels.map((channel, i) => (
            <motion.a
              key={channel.label}
              href={channel.href}
              target={channel.href.startsWith("http") ? "_blank" : undefined}
              rel={channel.href.startsWith("http") ? "noreferrer" : undefined}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="rounded-[22px] glass p-5 transition active:scale-[0.98] hover:bg-white/10"
            >
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-accent">
                {channel.label}
              </p>
              <p className="mt-2 font-display text-lg font-semibold tracking-[-0.02em]">
                {channel.detail}
              </p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
);

console.log("batch 3 done");
