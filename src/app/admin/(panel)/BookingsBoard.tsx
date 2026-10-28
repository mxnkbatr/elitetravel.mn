"use client";

import { updateBooking } from "@/app/admin/(panel)/actions";
import { formatPrice } from "@/data/tours";
import { useMemo, useState, useTransition } from "react";

export type AdminBooking = {
  id: string;
  created_at: string;
  tour_id: string;
  tour_title: string;
  travel_date: string | null;
  name: string;
  phone: string;
  adults: number;
  kids_own_bed: number;
  kids_shared_bed: number;
  single_rooms: number;
  total: number;
  deposit: number;
  note: string | null;
  status: Status;
  staff_note: string | null;
  source: string;
};

type Status = "new" | "contacted" | "confirmed" | "paid" | "cancelled";

const STATUSES: { key: Status; label: string; tone: string }[] = [
  { key: "new", label: "Шинэ", tone: "bg-sky-100 text-sky-800" },
  { key: "contacted", label: "Холбогдсон", tone: "bg-amber-100 text-amber-800" },
  { key: "confirmed", label: "Баталгаажсан", tone: "bg-emerald-100 text-emerald-800" },
  { key: "paid", label: "Төлсөн", tone: "bg-teal-600 text-white" },
  { key: "cancelled", label: "Цуцалсан", tone: "bg-zinc-200 text-zinc-600" },
];

const when = (iso: string) =>
  new Intl.DateTimeFormat("mn-MN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

export function BookingsBoard({ bookings }: { bookings: AdminBooking[] }) {
  const [rows, setRows] = useState(bookings);
  const [filter, setFilter] = useState<Status | "all">("all");
  const [q, setQ] = useState("");

  const counts = useMemo(() => Object.fromEntries(STATUSES.map((s) => [s.key, rows.filter((r) => r.status === s.key).length])), [rows]);
  const shown = useMemo(() => {
    const query = q.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (filter === "all" || r.status === filter) &&
        (!query || `${r.id} ${r.name} ${r.phone} ${r.tour_title}`.toLowerCase().includes(query)),
    );
  }, [rows, filter, q]);

  const patch = (id: string, change: Partial<AdminBooking>) => setRows((all) => all.map((r) => (r.id === id ? { ...r, ...change } : r)));

  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {STATUSES.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setFilter(filter === s.key ? "all" : s.key)}
            className={`rounded-2xl border bg-white p-4 text-left transition ${filter === s.key ? "border-accent ring-2 ring-accent/20" : "border-[var(--line)] hover:border-accent/40"}`}
          >
            <p className="font-num text-3xl leading-none">{counts[s.key]}</p>
            <p className="mt-1.5 text-xs font-semibold text-muted">{s.label}</p>
          </button>
        ))}
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Нэр, утас, код, аяллаар хайх…"
        className="mt-5 h-11 w-full rounded-xl border border-[var(--line)] bg-white px-4 text-sm outline-none focus:border-accent sm:max-w-sm"
      />

      <div className="mt-4 space-y-3">
        {shown.length === 0 ? <p className="rounded-2xl bg-white p-8 text-center text-sm text-muted">Хүсэлт алга.</p> : null}
        {shown.map((b) => (
          <BookingRow key={b.id} b={b} onChange={(c) => patch(b.id, c)} />
        ))}
      </div>
    </div>
  );
}

function BookingRow({ b, onChange }: { b: AdminBooking; onChange: (c: Partial<AdminBooking>) => void }) {
  const [pending, start] = useTransition();
  const [note, setNote] = useState(b.staff_note ?? "");
  const [error, setError] = useState<string | null>(null);
  const status = STATUSES.find((s) => s.key === b.status) ?? STATUSES[0];
  const kids = b.kids_own_bed + b.kids_shared_bed;

  function save(change: { status?: Status; staffNote?: string }) {
    setError(null);
    const before = { status: b.status, staff_note: b.staff_note };
    if (change.status) onChange({ status: change.status });
    if (change.staffNote !== undefined) onChange({ staff_note: change.staffNote });
    start(async () => {
      const res = await updateBooking(b.id, change);
      if (!res.ok) {
        onChange(before);
        setError(res.error);
      }
    });
  }

  return (
    <article className={`rounded-2xl border border-[var(--line)] bg-white p-4 transition sm:p-5 ${b.status === "cancelled" ? "opacity-60" : ""}`}>
      <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-[0.7rem] font-bold ${status.tone}`}>{status.label}</span>
            <span className="font-mono text-xs text-muted">{b.id}</span>
            <span className="text-xs text-muted">· {when(b.created_at)}</span>
            {b.source !== "web" ? <span className="text-xs text-muted">· {b.source}</span> : null}
          </div>
          <p className="mt-2 font-semibold">{b.tour_title}</p>
          <p className="text-sm text-muted">
            {b.travel_date ?? "Огноо сонгоогүй"} · {b.adults} том хүн{kids ? `, ${kids} хүүхэд` : ""}
            {b.single_rooms ? ` · ${b.single_rooms} ганц өрөө` : ""}
          </p>
        </div>
        <div>
          <p className="font-semibold">{b.name}</p>
          <a href={`tel:${b.phone.replace(/\s/g, "")}`} className="text-sm font-semibold text-accent">
            {b.phone}
          </a>
        </div>
        <div className="text-right">
          <p className="font-num text-lg">{formatPrice(b.total)}</p>
          {b.deposit ? <p className="text-xs text-muted">Урьдчилгаа {formatPrice(b.deposit)}</p> : null}
        </div>
      </div>

      {b.note ? <p className="mt-3 rounded-xl bg-[#f3f6f5] px-3 py-2 text-sm">💬 {b.note}</p> : null}

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--line)] pt-4">
        {STATUSES.map((s) => (
          <button
            key={s.key}
            type="button"
            disabled={pending || s.key === b.status}
            onClick={() => save({ status: s.key })}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              s.key === b.status ? s.tone : "bg-[#f3f6f5] text-muted hover:bg-accent/10 hover:text-accent"
            }`}
          >
            {s.label}
          </button>
        ))}
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={() => note !== (b.staff_note ?? "") && save({ staffNote: note })}
          placeholder="Ажилтны тэмдэглэл…"
          maxLength={1000}
          className="h-9 min-w-[12rem] flex-1 rounded-full border border-[var(--line)] px-3.5 text-sm outline-none focus:border-accent"
        />
        {pending ? <span className="text-xs text-muted">Хадгалж байна…</span> : null}
        {error ? <span className="text-xs text-red-600">{error}</span> : null}
      </div>
    </article>
  );
}
