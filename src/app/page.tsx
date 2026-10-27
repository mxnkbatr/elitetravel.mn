import { Destinations } from "@/components/Destinations";
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
