import fs from "fs";
import path from "path";

function write(rel, content) {
  const full = path.join(process.cwd(), rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, "utf8");
  console.log("ok", rel);
}

const HERO =
  "https://elitetravel.mn/__l5e/assets-v1/2e9a9b43-175a-424a-b3b2-c1a5c1e94222/hero-jungle-tall.webp";
const LOGO =
  "https://elitetravel.mn/__l5e/assets-v1/82ebf29a-63bf-4858-a2e3-dda997244111/elite-logo.png";

write(
  "src/app/layout.tsx",
  `import { AppShell } from "@/components/AppShell";
import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
});

const body = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Elite Travel Mongolia | Explore. Dream. Discover.",
    template: "%s · Elite Travel",
  },
  description:
    "Хонг Конг, Хайнань, Бали болон концерт аяллууд — Elite Travel Mongolia.",
  metadataBase: new URL("https://elitetravel.mn"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f6f3ee",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="mn" className={\`\${display.variable} \${body.variable} h-full\`}>
      <body className="min-h-full bg-bg font-sans text-foam antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
`,
);

write(
  "src/components/AppShell.tsx",
  `"use client";

import { Footer } from "@/components/Footer";
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
    </div>
  );
}
`,
);

write(
  "src/components/Navbar.tsx",
  `"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
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

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <motion.header
        style={{ backgroundColor: bg, borderColor: border }}
        className="fixed inset-x-0 top-0 z-[60] border-b pt-[env(safe-area-inset-top,0px)]"
      >
        <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="${LOGO}"
              alt="Elite Travel"
              width={40}
              height={40}
              className="size-9 rounded-full object-cover sm:size-10"
              priority
            />
            <span className="font-display text-[1.35rem] font-semibold lowercase tracking-[-0.03em] text-accent">
              elite
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {links.map((l) => {
              const active =
                l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={\`relative text-[0.84rem] tracking-[0.02em] transition \${
                    active ? "font-semibold text-accent" : "text-foam/70 hover:text-foam"
                  }\`}
                >
                  {l.label}
                  {active ? (
                    <span className="absolute -bottom-1 left-0 h-px w-full bg-accent" />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            aria-label="Цэс"
            className="grid size-10 place-items-center rounded-full border border-[var(--line)] bg-bg-elevated md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="flex w-3.5 flex-col gap-[3px]">
              <span className={\`h-px bg-foam transition \${open ? "translate-y-[4px] rotate-45" : ""}\`} />
              <span className={\`h-px bg-foam transition \${open ? "opacity-0" : ""}\`} />
              <span className={\`h-px bg-foam transition \${open ? "-translate-y-[4px] -rotate-45" : ""}\`} />
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
              className="absolute inset-0 bg-ink/20"
              aria-label="Хаах"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              className="absolute inset-x-4 top-[calc(4.75rem+env(safe-area-inset-top))] overflow-hidden rounded-[1.25rem] border border-[var(--line)] bg-bg-elevated p-2 shadow-[var(--shadow)]"
            >
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3.5 text-[0.95rem] text-foam/90"
                >
                  {l.label}
                </Link>
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
  "src/components/Hero.tsx",
  `"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0 -z-20">
        <Image
          src="${HERO}"
          alt="Elite Travel destination"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/55 via-black/35 to-black/15" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-28 bg-gradient-to-t from-bg to-transparent" />

      <div className="mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-16 pt-[calc(7rem+env(safe-area-inset-top))] sm:justify-center sm:px-6 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-xl"
        >
          <div className="epic-rule mb-5 bg-white/90" />
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-white/80">
            Elite Travel Mongolia
          </p>
          <h1 className="mt-3 font-display text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl md:text-[4.25rem]">
            Та манай аяллыг{" "}
            <span className="text-[#9af5db]">хүртэх эрхтэй</span>
          </h1>
          <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-white/80 sm:text-lg">
            Сайн аялал төлөвлөгөөнөөс эхэлдэг. Гайхалтай аялал ELITE TRAVEL-с эхэлдэг.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/tours"
              className="inline-flex h-12 items-center rounded-full bg-accent px-6 text-sm font-semibold text-white transition hover:bg-accent-soft"
            >
              Аяллууд үзэх
            </Link>
            <a
              href="tel:+97690031771"
              className="inline-flex h-12 items-center rounded-full border border-white/35 bg-white/10 px-5 text-sm font-medium text-white backdrop-blur-sm"
            >
              +976 9003 1771
            </a>
          </div>
        </motion.div>
      </div>
    </section>
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
          <div className="mb-8 max-w-xl">
            <div className="epic-rule mb-4" />
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-accent">
              Destinations
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] text-foam sm:text-4xl">
              Аяллын чиглэлүүд
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
              Хайнань, Хонг Конг, Бали — elitetravel.mn дээрх бодит чиглэлүүд.
            </p>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((d, i) => (
            <motion.div
              key={d.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href="/destinations" className="epic-card group block">
                <div className="relative aspect-[4/5]">
                  <Image
                    src={d.image}
                    alt={d.name}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width:768px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#9af5db]">
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
  "src/lib/ui.ts",
  `export function filterChipClass(active: boolean) {
  return [
    "shrink-0 rounded-full px-4 py-2.5 text-sm tracking-[0.01em] transition active:scale-95",
    active
      ? "bg-accent font-semibold text-white"
      : "bg-bg-elevated font-medium text-foam/70 ring-1 ring-[var(--line)] hover:text-foam",
  ].join(" ");
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
          <div className="mb-6 flex items-end justify-between gap-4">
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
          </div>
        ) : null}

        <div className="hide-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={filterChipClass(filter === f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((tour) => (
              <motion.article
                layout
                key={tour.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="epic-card"
              >
                <Link href={\`/tours/\${tour.id}\`} className="block">
                  <div className="relative aspect-[16/11]">
                    <Image
                      src={tour.image}
                      alt={tour.title}
                      fill
                      className="object-cover"
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
                        <span className="rounded-full bg-accent px-2.5 py-1 text-[0.7rem] font-semibold text-white">
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
  "src/components/Footer.tsx",
  `import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-xl font-semibold lowercase text-accent">elite</p>
          <p className="mt-1 text-sm text-muted">Explore. Dream. Discover.</p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
          <Link href="/tours" className="hover:text-accent">Аяллууд</Link>
          <Link href="/destinations" className="hover:text-accent">Чиглэл</Link>
          <Link href="/about" className="hover:text-accent">Бидний тухай</Link>
          <Link href="/contact" className="hover:text-accent">Холбоо</Link>
        </div>
        <p className="text-sm text-muted">© {new Date().getFullYear()} Elite Travel Mongolia</p>
      </div>
    </footer>
  );
}
`,
);

write(
  "src/app/page.tsx",
  `import { Destinations } from "@/components/Destinations";
import { Hero } from "@/components/Hero";
import { Section } from "@/components/Section";
import { Tours } from "@/components/Tours";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Section className="space-y-16 py-14 sm:space-y-20 sm:py-20">
        <Destinations />
        <Tours limit={6} />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-[1.5rem] bg-accent px-6 py-10 text-white sm:px-10 sm:py-12">
            <div className="epic-rule mb-5 bg-white/70" />
            <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Аяллаа захиалах уу?
            </h2>
            <p className="mt-3 max-w-lg text-white/80">
              Instagram, Messenger эсвэл утсаар шууд холбогдоорой — Elite Travel зөвлөхүүд тусална.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-accent"
              >
                Холбоо барих
              </Link>
              <a
                href="tel:+97690031771"
                className="inline-flex h-11 items-center rounded-full border border-white/40 px-5 text-sm font-medium text-white"
              >
                +976 9003 1771
              </a>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
`,
);

write(
  "src/components/PageHeader.tsx",
  `type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div className="max-w-2xl">
      <div className="epic-rule mb-4" />
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-accent">
        {eyebrow}
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{description}</p>
      ) : null}
    </div>
  );
}
`,
);

write(
  "src/components/Section.tsx",
  `import type { ReactNode } from "react";

export function Section({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={\`relative z-10 \${className}\`}>{children}</section>;
}
`,
);

write(
  "src/components/PageTransition.tsx",
  `"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
`,
);

console.log("epic ui shell done");
