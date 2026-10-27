import fs from "fs";
import path from "path";

const root = process.cwd();
function write(rel, content) {
  fs.writeFileSync(path.join(root, rel), content, { encoding: "utf8" });
  console.log("ok", rel);
}

write(
  "src/app/destinations/page.tsx",
  `import { DestinationsPageView } from "@/components/DestinationsPage";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Чиглэлүүд",
  description: "Хайнань, Хонг Конг, Бали болон удахгүй нээгдэх чиглэлүүдийн profile.",
};

export default function DestinationsPage() {
  return (
    <Section className="page-pad-top space-y-6 pb-10">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          eyebrow="Destinations"
          title="Аяллын чиглэлүүд"
          description="Чиглэл бүрийн profile-ийг харж, vibe болон үнээсээ сонгоорой."
        />
      </div>
      <DestinationsPageView />
    </Section>
  );
}
`,
);

write(
  "src/app/resorts/page.tsx",
  `import { PageHeader } from "@/components/PageHeader";
import { ResortsPageView } from "@/components/ResortsPage";
import { Section } from "@/components/Section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Амралтын газрууд",
  description: "Хайнань, Бали, Хонг Конгын амралтын газрууд — Elite Travel.",
};

export default function ResortsPage() {
  return (
    <Section className="page-pad-top space-y-6 pb-10">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          eyebrow="Resorts"
          title="Амралтын газрууд"
          description="Далай, арал, хот — амрах газруудын цуглуулга. Дуртайгаа сонгоод холбогдоорой."
        />
      </div>
      <ResortsPageView />
    </Section>
  );
}
`,
);

write(
  "src/app/profile/page.tsx",
  `import { ProfilePageView } from "@/components/ProfilePage";
import { Section } from "@/components/Section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Профайл",
  description: "Таны хадгалсан аялал, сонирхол — Elite Travel profile.",
};

export default function ProfilePage() {
  return (
    <Section className="page-pad-top pb-10">
      <ProfilePageView />
    </Section>
  );
}
`,
);

// Patch MobileDock items - rewrite full file by reading icons from existing pattern
write(
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

function ProfileIcon({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle
        cx="12"
        cy="8"
        r="3.25"
        stroke="currentColor"
        strokeWidth={active ? 1.9 : 1.55}
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? 0.18 : 0}
      />
      <path
        d="M5.5 19.2c1.5-3 3.9-4.5 6.5-4.5s5 1.5 6.5 4.5"
        stroke="currentColor"
        strokeWidth={active ? 1.9 : 1.55}
        strokeLinecap="round"
      />
    </svg>
  );
}
`,
);

// Update Navbar links
let nav = fs.readFileSync(path.join(root, "src/components/Navbar.tsx"), "utf8");
nav = nav.replace(
  `const links = [
  { href: "/", label: "Нүүр" },
  { href: "/destinations", label: "Чиглэл" },
  { href: "/tours", label: "Аяллууд" },
  { href: "/about", label: "Бидний тухай" },
  { href: "/contact", label: "Холбоо барих" },
];`,
  `const links = [
  { href: "/", label: "Нүүр" },
  { href: "/destinations", label: "Чиглэл" },
  { href: "/tours", label: "Аяллууд" },
  { href: "/resorts", label: "Амралт" },
  { href: "/about", label: "Бидний тухай" },
  { href: "/profile", label: "Профайл" },
];`,
);

// Add profile avatar button before hamburger if not present
if (!nav.includes('href="/profile"') || !nav.includes("size-10 rounded-full")) {
  nav = nav.replace(
    `<div className="flex items-center gap-2">
          <a
            href="tel:+97690031771"`,
    `<div className="flex items-center gap-2">
          <Link
            href="/profile"
            className="hidden overflow-hidden rounded-full ring-1 ring-white/20 sm:block"
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
            href="tel:+97690031771"`,
  );
}

fs.writeFileSync(path.join(root, "src/components/Navbar.tsx"), nav, "utf8");
console.log("ok Navbar patched");

// Fix destinations export used on home - keep Destinations.tsx working with places data
write(
  "src/components/Destinations.tsx",
  `"use client";

import { destinationProfiles } from "@/data/places";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type DestinationsProps = {
  showHeader?: boolean;
};

export function Destinations({ showHeader = true }: DestinationsProps) {
  return (
    <section className="relative z-10">
      <div className="mx-auto max-w-6xl">
        {showHeader ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55 }}
            className="mb-6 flex items-end justify-between gap-4"
          >
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-accent">
                Destinations
              </p>
              <h2 className="mt-2 font-display text-[1.7rem] font-semibold tracking-[-0.03em] sm:text-4xl">
                Аяллын чиглэлүүд
              </h2>
            </div>
            <Link
              href="/destinations"
              className="hidden shrink-0 text-sm font-medium text-accent sm:inline"
            >
              Бүгдийг үзэх →
            </Link>
          </motion.div>
        ) : null}

        <div className="hide-scrollbar -mx-4 flex snap-x-mandatory gap-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {destinationProfiles.map((dest, i) => (
            <motion.div
              key={dest.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="snap-start w-[78vw] shrink-0 sm:w-auto"
            >
              <Link
                href="/destinations"
                className="relative block h-[21rem] overflow-hidden rounded-[26px] sm:h-[23rem]"
              >
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover transition duration-700 hover:scale-105"
                  sizes="(max-width:640px) 78vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <div className="rounded-2xl glass-strong p-4">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-accent">
                      {dest.en}
                    </p>
                    <h3 className="mt-1 font-display text-[1.35rem] font-semibold tracking-[-0.02em]">
                      {dest.name}
                    </h3>
                    <p className="mt-1 text-sm tracking-[0.01em] text-foam/70">
                      {dest.blurb}
                    </p>
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

console.log("pages + nav done");
