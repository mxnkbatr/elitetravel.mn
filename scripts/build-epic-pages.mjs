import fs from "fs";
import path from "path";

function write(rel, content) {
  const full = path.join(process.cwd(), rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, "utf8");
  console.log("ok", rel);
}

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
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
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

write(
  "src/app/destinations/page.tsx",
  `import { DestinationsPageView } from "@/components/DestinationsPage";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Чиглэлүүд",
  description: "Хайнань, Хонг Конг, Бали болон бусад чиглэлүүд.",
};

export default function DestinationsPage() {
  return (
    <Section className="page-pad-top space-y-8 pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <PageHeader
          eyebrow="Destinations"
          title="Аяллын чиглэлүүд"
          description="elitetravel.mn дээрх бодит чиглэлүүд — далай, хот, концерт."
        />
        <div className="mt-8">
          <DestinationsPageView />
        </div>
      </div>
    </Section>
  );
}
`,
);

write(
  "src/app/about/page.tsx",
  `import { About } from "@/components/About";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Бидний тухай",
  description: "Elite Travel Mongolia — Explore. Dream. Discover.",
};

export default function AboutPage() {
  return (
    <Section className="page-pad-top space-y-8 pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <PageHeader
          eyebrow="About"
          title="Бидний тухай"
          description="Сайн аялал төлөвлөгөөнөөс эхэлдэг. Гайхалтай аялал ELITE TRAVEL-с эхэлдэг."
        />
        <div className="mt-8">
          <About />
        </div>
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
  description: "Elite Travel Mongolia-тай холбогдох.",
};

export default function ContactPage() {
  return (
    <Section className="page-pad-top space-y-8 pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <PageHeader
          eyebrow="Contact"
          title="Холбоо барих"
          description="Instagram, Messenger эсвэл утсаар шууд холбогдоорой."
        />
        <div className="mt-8">
          <Contact />
        </div>
      </div>
    </Section>
  );
}
`,
);

write(
  "src/app/resorts/page.tsx",
  `import { PageHeader } from "@/components/PageHeader";
import { ResortsPage } from "@/components/ResortsPage";
import { Section } from "@/components/Section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Амралт",
  description: "Далайн амралт, зочид буудлууд.",
};

export default function ResortsRoute() {
  return (
    <Section className="page-pad-top space-y-8 pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <PageHeader
          eyebrow="Resorts"
          title="Амралтын газрууд"
          description="Далай, нар, тайван байршил — аяллынхаа дараа амраарай."
        />
        <div className="mt-8">
          <ResortsPage />
        </div>
      </div>
    </Section>
  );
}
`,
);

write(
  "src/app/profile/page.tsx",
  `import { PageHeader } from "@/components/PageHeader";
import { ProfilePage } from "@/components/ProfilePage";
import { Section } from "@/components/Section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Профайл",
  description: "Таны Elite Travel профайл.",
};

export default function ProfileRoute() {
  return (
    <Section className="page-pad-top space-y-8 pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <PageHeader
          eyebrow="Profile"
          title="Профайл"
          description="Хадгалсан аялал, холбоо барих мэдээлэл."
        />
        <div className="mt-8">
          <ProfilePage />
        </div>
      </div>
    </Section>
  );
}
`,
);

write(
  "src/app/tours/[id]/page.tsx",
  `import { TourDetailView } from "@/components/TourDetailView";
import { getTour, tours } from "@/data/tours";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return tours.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const tour = getTour(id);
  if (!tour) return { title: "Аялал" };
  return {
    title: tour.title,
    description: tour.description,
  };
}

export default async function TourDetailPage({ params }: Props) {
  const { id } = await params;
  const tour = getTour(id);
  if (!tour) notFound();
  return <TourDetailView tour={tour} />;
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
    { label: "Үргэлжлэх", value: tour.duration },
    { label: "Огноо", value: tour.dates ?? "Холбогдоно уу" },
    { label: "Байр", value: tour.stay ?? "—" },
    { label: "Гарц", value: tour.departure ?? "Улаанбаатар" },
  ];

  return (
    <div className="relative w-full max-w-[100vw] overflow-x-hidden pb-16 sm:pb-20">
      <div className="mx-auto w-full max-w-6xl px-4 pt-[calc(5.5rem+env(safe-area-inset-top))] sm:px-6">
        <Link
          href="/tours"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-accent"
        >
          <span aria-hidden>←</span>
          Аяллууд руу буцах
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="epic-card overflow-hidden"
        >
          <div className="relative aspect-[4/5] w-full max-h-[56svh] min-h-[240px] sm:aspect-[21/9] sm:max-h-none">
            <Image
              src={tour.image}
              alt={tour.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width:640px) 100vw, 1152px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-8">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white/92 px-2.5 py-1 text-xs font-medium text-ink">
                  ★ {tour.rating.toFixed(1)}
                </span>
                {tour.tag === "hot" ? (
                  <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-white">
                    Эрэлттэй
                  </span>
                ) : null}
                {tour.tag === "soon" ? (
                  <span className="rounded-full bg-ink/80 px-2.5 py-1 text-xs font-semibold text-white">
                    Удахгүй
                  </span>
                ) : null}
                {tour.discount ? (
                  <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-white">
                    {tour.discount}
                  </span>
                ) : null}
              </div>
              <p className="mt-3 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#9af5db]">
                {tour.destination}
              </p>
              <h1 className="mt-1 max-w-3xl font-display text-3xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-5xl">
                {tour.title}
              </h1>
              <p className="mt-2 max-w-xl text-sm text-white/80 sm:text-base">{tour.description}</p>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <section>
              <div className="epic-rule mb-4" />
              <h2 className="font-display text-2xl font-semibold tracking-[-0.02em]">Танилцуулга</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{tour.story}</p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold tracking-[-0.02em]">Онцлох</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {tour.highlights.map((h) => (
                  <li
                    key={h}
                    className="rounded-2xl border border-[var(--line)] bg-bg-elevated px-4 py-3 text-sm text-foam"
                  >
                    {h}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-semibold tracking-[-0.02em]">Хөтөлбөр</h2>
              <div className="mt-4 space-y-3">
                {tour.itinerary.map((day) => (
                  <div
                    key={day.day + day.title}
                    className="rounded-2xl border border-[var(--line)] bg-bg-elevated px-4 py-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                      {day.day}
                    </p>
                    <p className="mt-1 font-medium text-foam">{day.title}</p>
                    <p className="mt-1 text-sm text-muted">{day.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="font-display text-xl font-semibold">Орсон</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  {tour.includes.map((x) => (
                    <li key={x}>· {x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold">Ороогүй</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  {tour.excludes.map((x) => (
                    <li key={x}>· {x}</li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[1.5rem] border border-[var(--line)] bg-bg-elevated p-5 shadow-[var(--shadow)]">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs text-muted">Үнэ / хүн</p>
                  <p className="mt-1 font-display text-3xl font-semibold text-accent">
                    {formatPrice(tour.price)}
                  </p>
                  {tour.oldPrice ? (
                    <p className="text-sm text-muted line-through">{formatPrice(tour.oldPrice)}</p>
                  ) : null}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {facts.map((f) => (
                  <div key={f.label} className="rounded-xl bg-accent-mist/60 px-3 py-2.5">
                    <p className="text-[0.65rem] uppercase tracking-[0.12em] text-muted">{f.label}</p>
                    <p className="mt-0.5 text-sm font-medium text-foam">{f.value}</p>
                  </div>
                ))}
              </div>

              <a
                href="tel:+97690031771"
                className="mt-5 flex h-12 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white transition hover:bg-accent-soft"
              >
                Захиалах · +976 9003 1771
              </a>
              <a
                href="https://www.instagram.com/elitetravel.mn/"
                target="_blank"
                rel="noreferrer"
                className="mt-2 flex h-11 items-center justify-center rounded-full border border-[var(--line)] text-sm font-medium text-foam"
              >
                Instagram-аар асуух
              </a>
            </div>
          </aside>
        </div>

        {related.length ? (
          <section className="mt-14">
            <div className="epic-rule mb-4" />
            <h2 className="font-display text-2xl font-semibold tracking-[-0.02em]">Төстэй аяллууд</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {related.map((t) => (
                <Link key={t.id} href={\`/tours/\${t.id}\`} className="epic-card group block">
                  <div className="relative aspect-[16/11]">
                    <Image
                      src={t.image}
                      alt={t.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="33vw"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-accent">
                      {t.destination}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-semibold leading-snug">{t.title}</h3>
                    <p className="mt-2 text-sm font-semibold text-accent">{formatPrice(t.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
`,
);

write(
  "src/components/DestinationsPage.tsx",
  `"use client";

import { destinationProfiles, formatFromPrice } from "@/data/places";
import { filterChipClass } from "@/lib/ui";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function DestinationsPageView() {
  const [active, setActive] = useState(destinationProfiles[0].key);
  const selected =
    destinationProfiles.find((d) => d.key === active) ?? destinationProfiles[0];

  return (
    <div className="space-y-8">
      <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
        {destinationProfiles.map((d) => (
          <button
            key={d.key}
            type="button"
            onClick={() => setActive(d.key)}
            className={filterChipClass(d.key === active)}
          >
            {d.name}
          </button>
        ))}
      </div>

      <motion.div
        key={selected.key}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="epic-card overflow-hidden"
      >
        <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative min-h-[280px] aspect-[4/3] lg:aspect-auto lg:min-h-[420px]">
            <Image
              src={selected.image}
              alt={selected.name}
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 55vw"
              priority
            />
          </div>
          <div className="flex flex-col justify-center space-y-5 p-6 sm:p-8">
            <div>
              <div className="epic-rule mb-4" />
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-accent">
                {selected.en}
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                {selected.name}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                {selected.blurb}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {selected.highlights.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-accent-mist px-3 py-1.5 text-xs font-medium text-accent"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-end justify-between gap-4 border-t border-[var(--line)] pt-5">
              <div>
                <p className="text-xs text-muted">Эхлэх үнэ</p>
                <p className="mt-1 text-lg font-semibold text-accent">
                  {formatFromPrice(selected.fromPrice)}
                </p>
              </div>
              <Link
                href={\`/tours?dest=\${selected.key === "egypt" ? "soon" : selected.key}\`}
                className="inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-semibold text-white"
              >
                Аяллууд үзэх
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
`,
);

write(
  "src/components/About.tsx",
  `const points = [
  {
    title: "Explore",
    body: "Хайнань, Хонг Конг, Бали — бодит чиглэл, бодит огноо.",
  },
  {
    title: "Dream",
    body: "Концерт аялал, далайн амралт — таны vibe-д тааруулна.",
  },
  {
    title: "Discover",
    body: "Монгол хөтөч, ил тод үнэ, найдвартай зохион байгуулалт.",
  },
];

export function About() {
  return (
    <div className="space-y-10">
      <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
        Elite Travel Mongolia нь залууст зориулсан аяллын бренд. Бид elitetravel.mn дээрх
        аяллуудыг цэвэр, орчин үеийн туршлагаар танд хүргэнэ.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        {points.map((p) => (
          <div
            key={p.title}
            className="rounded-[1.25rem] border border-[var(--line)] bg-bg-elevated p-5"
          >
            <div className="epic-rule mb-4" />
            <h3 className="font-display text-2xl font-semibold text-accent">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
`,
);

write(
  "src/components/Contact.tsx",
  `const channels = [
  {
    label: "Утас",
    value: "+976 9003 1771",
    href: "tel:+97690031771",
  },
  {
    label: "Instagram",
    value: "@elitetravel.mn",
    href: "https://www.instagram.com/elitetravel.mn/",
  },
  {
    label: "Вэб",
    value: "elitetravel.mn",
    href: "https://elitetravel.mn",
  },
];

export function Contact() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {channels.map((c) => (
        <a
          key={c.label}
          href={c.href}
          target={c.href.startsWith("http") ? "_blank" : undefined}
          rel={c.href.startsWith("http") ? "noreferrer" : undefined}
          className="rounded-[1.25rem] border border-[var(--line)] bg-bg-elevated p-5 transition hover:border-accent/30"
        >
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-accent">
            {c.label}
          </p>
          <p className="mt-2 font-display text-xl font-semibold tracking-[-0.02em]">{c.value}</p>
        </a>
      ))}
    </div>
  );
}
`,
);

write(
  "src/components/ResortsPage.tsx",
  `"use client";

import { destinationProfiles } from "@/data/places";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function ResortsPage() {
  const resorts = destinationProfiles.filter((d) =>
    ["hainan", "bali"].includes(d.key),
  );

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {resorts.map((r, i) => (
        <motion.article
          key={r.key}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
          className="epic-card overflow-hidden"
        >
          <div className="relative aspect-[16/11]">
            <Image
              src={r.image}
              alt={r.name}
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 50vw"
            />
          </div>
          <div className="space-y-3 p-5">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-accent">
                {r.en}
              </p>
              <h3 className="mt-1 font-display text-2xl font-semibold tracking-[-0.02em]">
                {r.name}
              </h3>
              <p className="mt-2 text-sm text-muted">{r.blurb}</p>
            </div>
            <Link
              href={\`/tours?dest=\${r.key}\`}
              className="inline-flex h-10 items-center rounded-full bg-accent px-4 text-sm font-semibold text-white"
            >
              Аялал үзэх
            </Link>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
`,
);

write(
  "src/components/ProfilePage.tsx",
  `"use client";

import { tours } from "@/data/tours";
import Image from "next/image";
import Link from "next/link";

export function ProfilePage() {
  const saved = tours.slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="rounded-[1.5rem] border border-[var(--line)] bg-bg-elevated p-6 sm:p-8">
        <div className="epic-rule mb-4" />
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-accent">
          Guest
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em]">
          Сайн уу
        </h2>
        <p className="mt-2 max-w-md text-sm text-muted">
          Хадгалсан аяллууд болон холбоо барих мэдээлэл энд харагдана.
        </p>
        <a
          href="tel:+97690031771"
          className="mt-5 inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-semibold text-white"
        >
          Зөвлөхтэй холбогдох
        </a>
      </div>

      <div>
        <h3 className="font-display text-2xl font-semibold tracking-[-0.02em]">Санал болгох</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {saved.map((t) => (
            <Link key={t.id} href={\`/tours/\${t.id}\`} className="epic-card block overflow-hidden">
              <div className="relative aspect-[16/11]">
                <Image src={t.image} alt={t.title} fill className="object-cover" sizes="33vw" />
              </div>
              <div className="p-4">
                <p className="text-xs text-accent">{t.destination}</p>
                <p className="mt-1 font-display text-lg font-semibold leading-snug">{t.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
`,
);

console.log("epic pages done");
