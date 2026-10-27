"use client";

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
            <Link key={t.id} href={`/tours/${t.id}`} className="epic-card block overflow-hidden">
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
