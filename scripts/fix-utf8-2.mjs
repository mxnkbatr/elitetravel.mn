import fs from "fs";
import path from "path";

const root = process.cwd();
function write(rel, content) {
  fs.writeFileSync(path.join(root, rel), content, { encoding: "utf8" });
  console.log("ok", rel);
}

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
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-bg/45 via-bg/55 to-bg" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(255,122,89,0.2),transparent_45%),radial-gradient(ellipse_at_bottom_left,rgba(88,140,255,0.12),transparent_40%)]" />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[2.1rem] font-semibold tracking-[0.06em] text-foam sm:text-5xl md:text-6xl"
        >
          ELITE TRAVEL
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 max-w-2xl font-display text-[1.95rem] font-semibold leading-[1.14] tracking-[-0.03em] text-foam sm:mt-5 sm:text-5xl md:text-[3.15rem]"
        >
          Та манай аяллыг{" "}
          <span className="bg-gradient-to-r from-accent via-accent-soft to-accent bg-clip-text text-transparent">
            хүртэх эрхтэй
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.16 }}
          className="mt-4 max-w-md text-[0.95rem] leading-[1.65] tracking-[0.01em] text-foam/75 sm:mt-5 sm:text-lg"
        >
          Explore. Dream. Discover. — залууст зориулсан цэвэр, шинэлэг аяллын
          туршлага.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24 }}
          className="mt-7 flex flex-wrap items-center gap-3 sm:mt-8"
        >
          <Link
            href="/tours"
            className="accent-shimmer inline-flex h-12 items-center justify-center rounded-full px-7 text-sm font-semibold tracking-[0.01em] text-bg shadow-[0_12px_40px_rgba(255,122,89,0.35)] transition active:scale-[0.98] hover:scale-[1.02]"
          >
            Аяллууд үзэх
          </Link>
          <Link
            href="/destinations"
            className="inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-medium tracking-[0.01em] text-foam glass transition active:scale-[0.98] hover:bg-white/10"
          >
            Чиглэлүүд
          </Link>
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
    <footer className="relative z-10 border-t border-white/8 px-4 pb-6 pt-8 sm:px-6 sm:pb-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-sm font-semibold tracking-[0.08em]">
            ELITE TRAVEL MONGOLIA
          </p>
          <p className="mt-1 text-xs tracking-[0.02em] text-foam/50">
            Explore. Dream. Discover.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs tracking-[0.02em] text-foam/50">
          <Link href="/about" className="hover:text-foam">
            Бидний тухай
          </Link>
          <Link href="/tours" className="hover:text-foam">
            Аяллууд
          </Link>
          <Link href="/contact" className="hover:text-foam">
            Холбоо барих
          </Link>
        </div>
        <p className="text-xs tracking-[0.02em] text-foam/45">
          © {new Date().getFullYear()} Elite Travel Mongolia
        </p>
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
      <Section className="space-y-14 pb-6 pt-2 sm:space-y-20 sm:pb-10 sm:pt-4">
        <Destinations />
        <Tours limit={3} />
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-5 rounded-[28px] glass-strong p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-accent">
              Next step
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em]">
              Аяллаа захиалах уу?
            </h2>
            <p className="mt-2 text-sm tracking-[0.01em] text-foam/65">
              Instagram, Messenger эсвэл утсаар шууд холбогдоорой.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex h-12 shrink-0 items-center rounded-full bg-accent px-6 text-sm font-semibold text-bg transition active:scale-95 hover:bg-accent-soft"
          >
            Холбоо барих
          </Link>
        </div>
      </Section>
    </>
  );
}
`,
);

write(
  "src/app/about/page.tsx",
  `import { About } from "@/components/About";
import { Section } from "@/components/Section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Бидний тухай",
  description: "Elite Travel Mongolia — залууст зориулсан premium аялал.",
};

export default function AboutPage() {
  return (
    <Section className="page-pad-top pb-10">
      <div className="mx-auto max-w-6xl">
        <About showCta />
      </div>
    </Section>
  );
}
`,
);

write(
  "src/app/contact/page.tsx",
  `import { Contact } from "@/components/Contact";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Холбоо барих",
  description: "Elite Travel-тай Instagram, Messenger эсвэл утсаар холбогдоорой.",
};

export default function ContactPage() {
  return (
    <Section className="page-pad-top pb-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <PageHeader
          eyebrow="Contact"
          title="Холбоо барих"
          description="Дуртай аялаа сонгоод шууд холбогдоорой. Бид хурдан хариулъя."
        />
        <Contact showIntro={false} />
      </div>
    </Section>
  );
}
`,
);

write(
  "src/app/destinations/page.tsx",
  `import { Destinations } from "@/components/Destinations";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Чиглэлүүд",
  description: "Хайнань, Хонг Конг, Бали болон удахгүй нээгдэх чиглэлүүд.",
};

export default function DestinationsPage() {
  return (
    <Section className="page-pad-top space-y-6 pb-10">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          eyebrow="Destinations"
          title="Аяллын чиглэлүүд"
          description="Хүссэн чиглэлээ сонгоод дараагийн адал явдал руугаа ороорой."
        />
      </div>
      <Destinations showHeader={false} />
    </Section>
  );
}
`,
);

write(
  "src/app/tours/page.tsx",
  `import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { Tours } from "@/components/Tours";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Аяллууд",
  description: "Elite Travel-ийн эрэлттэй болон удахгүй гарах аяллууд.",
};

type ToursPageProps = {
  searchParams: Promise<{ dest?: string }>;
};

export default async function ToursPage({ searchParams }: ToursPageProps) {
  const params = await searchParams;

  return (
    <Section className="page-pad-top space-y-6 pb-10">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          eyebrow="Tours"
          title="Эрэлттэй аяллууд"
          description="Концерт, далай, хот — таны vibe-д таарсан аяллыг сонгоорой."
        />
      </div>
      <Tours showHeader={false} initialFilter={params.dest ?? "all"} />
    </Section>
  );
}
`,
);

console.log("batch 2 done");
