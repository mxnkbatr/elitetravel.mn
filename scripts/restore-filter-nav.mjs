import fs from "fs";

// --- Destinations filter: back to pill chips ---
let dest = fs.readFileSync("src/components/DestinationsPage.tsx", "utf8");
dest = dest.replace(
  `      <div className="rounded-[12px] bg-white/[0.06] p-1 ring-1 ring-white/[0.08]">
        <div className="hide-scrollbar flex gap-0.5 overflow-x-auto">
          {destinationProfiles.map((d) => {
            const on = d.key === active;
            return (
              <button
                key={d.key}
                type="button"
                onClick={() => setActive(d.key)}
                className={\`shrink-0 rounded-[10px] px-3.5 py-2 text-[0.82rem] font-medium tracking-[0.01em] transition active:scale-[0.98] \${
                  on
                    ? "bg-accent font-semibold text-bg"
                    : "text-foam/55 hover:text-foam"
                }\`}
              >
                {d.name}
              </button>
            );
          })}
        </div>
      </div>`,
  `      <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
        {destinationProfiles.map((d) => {
          const on = d.key === active;
          return (
            <button
              key={d.key}
              type="button"
              onClick={() => setActive(d.key)}
              className={\`shrink-0 rounded-full px-4 py-2.5 text-sm tracking-[0.01em] transition active:scale-95 \${
                on
                  ? "bg-accent font-semibold text-bg shadow-[0_8px_24px_rgba(94,235,195,0.45)]"
                  : "bg-white/[0.07] text-foam/75 ring-1 ring-white/12 hover:text-foam"
              }\`}
            >
              {d.name}
            </button>
          );
        })}
      </div>`,
);
fs.writeFileSync("src/components/DestinationsPage.tsx", dest, "utf8");
console.log("ok destinations filter");

// --- Tours filter: matching pill + stronger active shadow ---
let tours = fs.readFileSync("src/components/Tours.tsx", "utf8");
if (tours.includes('active\n                    ? "bg-accent font-semibold text-bg"')) {
  tours = tours.replace(
    /active\s*\n\s*\? "bg-accent font-semibold text-bg"\s*\n\s*: "glass text-foam\/75 hover:text-foam"/,
    `active
                    ? "bg-accent font-semibold text-bg shadow-[0_8px_24px_rgba(94,235,195,0.45)]"
                    : "bg-white/[0.07] text-foam/75 ring-1 ring-white/12 hover:text-foam"`,
  );
} else {
  tours = tours.replace(
    '? "bg-accent font-semibold text-bg"',
    '? "bg-accent font-semibold text-bg shadow-[0_8px_24px_rgba(94,235,195,0.45)]"',
  );
  tours = tours.replace(
    ': "glass text-foam/75 hover:text-foam"',
    ': "bg-white/[0.07] text-foam/75 ring-1 ring-white/12 hover:text-foam"',
  );
}
fs.writeFileSync("src/components/Tours.tsx", tours, "utf8");
console.log("ok tours filter");

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
  // Less glass — solid-ish bar, soft blur only
  const backgroundColor = useTransform(
    scrollY,
    [0, 70],
    ["rgba(12,31,28,0)", "rgba(12,31,28,0.92)"],
  );
  const backdropFilter = useTransform(scrollY, [0, 70], ["blur(0px)", "blur(10px)"]);
  const borderColor = useTransform(
    scrollY,
    [0, 70],
    ["rgba(255,255,255,0)", "rgba(255,255,255,0.06)"],
  );

  return (
    <motion.header
      style={{ backgroundColor, backdropFilter, borderColor }}
      className="fixed inset-x-0 top-0 z-[60] border-b pt-[env(safe-area-inset-top,0px)]"
    >
      <div className="relative mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <Image
            src="/elite-logo.png"
            alt="Elite Travel Mongolia"
            width={44}
            height={44}
            className="size-10 shrink-0 rounded-full object-cover ring-1 ring-white/15 sm:size-11"
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

        {/* Previous menu design — pill row, lighter fill */}
        <nav className="hidden items-center gap-0.5 rounded-full bg-white/[0.06] px-1 py-1 ring-1 ring-white/10 lg:flex">
          {links.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={\`rounded-full px-3.5 py-2 text-[0.84rem] tracking-[0.01em] transition \${
                  active
                    ? "bg-white/16 font-semibold text-foam shadow-[0_6px_18px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.12)]"
                    : "text-foam/60 hover:bg-white/[0.06] hover:text-foam"
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
                ? "bg-accent font-semibold text-bg shadow-[0_8px_24px_rgba(94,235,195,0.4)]"
                : "bg-white/[0.07] text-foam ring-1 ring-white/12"
            }\`}
          >
            Аяллууд
          </Link>

          <a
            href="tel:+97690031771"
            className="hidden rounded-full bg-accent px-4 py-2 text-sm font-semibold tracking-[0.01em] text-bg shadow-[0_8px_22px_rgba(94,235,195,0.35)] transition hover:bg-accent-soft sm:inline-flex"
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
            className="grid h-11 w-11 place-items-center rounded-full bg-white/[0.07] ring-1 ring-white/12 lg:hidden"
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

      {open ? (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mx-4 mt-2 overflow-hidden rounded-[22px] border border-white/10 bg-[#122a26]/94 p-2 shadow-[0_16px_40px_rgba(0,0,0,0.4)] backdrop-blur-md lg:hidden"
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
                    ? "bg-accent/15 font-medium text-accent shadow-[0_4px_16px_rgba(94,235,195,0.18)]"
                    : "text-foam/90 hover:bg-white/5"
                }\`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className={\`block rounded-2xl px-4 py-3.5 text-[0.95rem] tracking-[0.01em] \${
              pathname.startsWith("/profile")
                ? "bg-accent/15 font-medium text-accent"
                : "text-foam/90 hover:bg-white/5"
            }\`}
          >
            Профайл
          </Link>
          <a
            href="tel:+97690031771"
            className="mt-1 flex items-center justify-center rounded-2xl bg-accent px-4 py-3.5 text-sm font-semibold text-bg shadow-[0_8px_24px_rgba(94,235,195,0.35)]"
          >
            +976 9003 1771
          </a>
        </motion.div>
      ) : null}
    </motion.header>
  );
}
`,
  "utf8",
);
console.log("ok navbar");

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
      className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 sm:hidden"
      aria-label="Үндсэн цэс"
    >
      <motion.div
        initial={{ y: 28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex max-w-md items-stretch justify-between rounded-[1.65rem] border border-white/12 bg-[#122a26]/88 px-1.5 py-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md"
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
                  className="absolute inset-0 rounded-[1.25rem] bg-accent/14 shadow-[0_6px_20px_rgba(94,235,195,0.28),inset_0_0.5px_0_rgba(255,255,255,0.25)] ring-1 ring-accent/30"
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
      />
      <path
        d="m14.8 9.2-1.6 4.6-4.6 1.6 1.6-4.6 4.6-1.6Z"
        stroke="currentColor"
        strokeWidth={active ? 1.9 : 1.55}
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
        strokeWidth={active ? 1.9 : 1.55}
        strokeLinejoin="round"
      />
      <path
        d="M12 8.5v.01"
        stroke="currentColor"
        strokeWidth={active ? 2.2 : 1.8}
        strokeLinecap="round"
      />
    </svg>
  );
}
`,
  "utf8",
);
console.log("ok dock");
console.log("done");
