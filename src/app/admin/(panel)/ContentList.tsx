"use client";

import { deleteItem, reorder } from "@/app/admin/(panel)/actions";
import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";

export type ListItem = { id: string; title: string; sub: string; image: string; badge?: string; muted?: boolean };

/** Tours / news overview: reorder with arrows (order shown on the site), edit, delete. */
export function ContentList({ table, items: initial }: { table: "tours" | "news"; items: ListItem[] }) {
  const [items, setItems] = useState(initial);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function move(from: number, to: number) {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    const before = items;
    setItems(next);
    setError(null);
    start(async () => {
      const res = await reorder(table, next.map((i) => i.id));
      if (!res.ok) {
        setItems(before);
        setError(res.error);
      }
    });
  }

  function remove(item: ListItem) {
    if (!window.confirm(`«${item.title}» устгах уу? Буцаах боломжгүй.`)) return;
    const before = items;
    setItems(items.filter((i) => i.id !== item.id));
    start(async () => {
      const res = await deleteItem(table, item.id);
      if (!res.ok) {
        setItems(before);
        setError(res.error);
      }
    });
  }

  return (
    <div className="mt-6 space-y-2">
      {error ? <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {items.map((item, i) => (
        <div key={item.id} className={`flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-white p-2.5 pr-3 ${item.muted ? "opacity-60" : ""}`}>
          <div className="flex flex-col">
            <button type="button" aria-label="Дээш" disabled={pending || i === 0} onClick={() => move(i, i - 1)} className="grid size-7 place-items-center rounded-lg text-muted hover:bg-[#f3f6f5] disabled:opacity-25">
              ▲
            </button>
            <button type="button" aria-label="Доош" disabled={pending || i === items.length - 1} onClick={() => move(i, i + 1)} className="grid size-7 place-items-center rounded-lg text-muted hover:bg-[#f3f6f5] disabled:opacity-25">
              ▼
            </button>
          </div>
          <div className="relative aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-xl bg-[#e7eeec]">
            {item.image ? <Image src={item.image} alt="" fill sizes="80px" className="object-cover" /> : null}
          </div>
          <Link href={`/admin/${table}/${item.id}`} className="min-w-0 flex-1">
            <p className="truncate font-semibold hover:text-accent">{item.title}</p>
            <p className="truncate text-xs text-muted">{item.sub}</p>
          </Link>
          {item.badge ? <span className="hidden rounded-full bg-[#f3f6f5] px-2.5 py-1 text-[0.7rem] font-semibold text-muted sm:inline">{item.badge}</span> : null}
          <Link href={`/admin/${table}/${item.id}`} className="rounded-lg px-3 py-2 text-xs font-semibold text-accent hover:bg-accent/10">
            Засах
          </Link>
          <button type="button" onClick={() => remove(item)} disabled={pending} className="rounded-lg px-2 py-2 text-xs font-semibold text-red-600 hover:bg-red-50">
            Устгах
          </button>
        </div>
      ))}
    </div>
  );
}
