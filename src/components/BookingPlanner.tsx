"use client";

import { formatPrice, type Tour } from "@/data/tours";
import { addBooking, type BookingRequest } from "@/lib/traveller-store";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";

const PHONE = "+97690031771";
const INSTAGRAM_DM = "https://ig.me/m/elitetravelmn";

export function bookingMessage(tour: Tour, b: Omit<BookingRequest, "id" | "createdAt"> & { id?: string }) {
  const party = [
    `${b.adults} том хүн`,
    b.kidsOwnBed ? `${b.kidsOwnBed} хүүхэд (тусдаа ор)` : "",
    b.kidsSharedBed ? `${b.kidsSharedBed} хүүхэд (хамт унтах)` : "",
  ]
    .filter(Boolean)
    .join(", ");
  return [
    `Сайн байна уу! ${tour.title} аялалд захиалга өгөх хүсэлтэй байна.`,
    b.id ? `Хүсэлтийн дугаар: ${b.id}` : "",
    b.date ? `Огноо: ${b.date}` : "",
    `Хүн: ${party}`,
    b.singleRooms ? `Ганцаараа өрөө: ${b.singleRooms}` : "",
    `Урьдчилсан дүн: ${formatPrice(b.total)}`,
    `Нэр: ${b.name}, утас: ${b.phone}`,
    b.note ? `Тэмдэглэл: ${b.note}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function Stepper({
  label,
  hint,
  value,
  min = 0,
  max = 12,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foam">{label}</p>
        {hint ? <p className="text-[0.7rem] text-muted">{hint}</p> : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          aria-label={`${label} хасах`}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
          className="grid size-8 place-items-center rounded-full border border-[var(--line)] text-lg leading-none transition enabled:hover:border-accent enabled:hover:text-accent disabled:opacity-30"
        >
          −
        </button>
        <motion.span key={value} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-5 text-center font-semibold tabular-nums">
          {value}
        </motion.span>
        <button
          type="button"
          aria-label={`${label} нэмэх`}
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
          className="grid size-8 place-items-center rounded-full border border-[var(--line)] text-lg leading-none transition enabled:hover:border-accent enabled:hover:text-accent disabled:opacity-30"
        >
          +
        </button>
      </div>
    </div>
  );
}

/**
 * Live price estimate + booking request, using the operator's published rules.
 * "card" shows everything at once (desktop sidebar); "sheet" splits it into two
 * steps — party & date, then contact — for the phone bottom sheet.
 */
export function BookingPlanner({ tour, variant = "card" }: { tour: Tour; variant?: "card" | "sheet" }) {
  const stepped = variant === "sheet";
  const [step, setStep] = useState(0);
  const p = tour.pricing ?? {};
  const dateOptions = (tour.dates ?? "").split("·").map((d) => d.trim()).filter(Boolean);
  const [adults, setAdults] = useState(2);
  const [kidsOwnBed, setKidsOwnBed] = useState(0);
  const [kidsSharedBed, setKidsSharedBed] = useState(0);
  const [singleRooms, setSingleRooms] = useState(0);
  const [date, setDate] = useState(dateOptions[0] ?? "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState<BookingRequest | null>(null);
  const [copied, setCopied] = useState(false);

  const price = tour.price ?? 0;
  const ownBedAllowed = p.childOwnBed !== false;
  const lines = useMemo(() => {
    const out: { label: string; amount: number }[] = [{ label: `${adults} том хүн × ${formatPrice(price)}`, amount: adults * price }];
    if (kidsOwnBed) out.push({ label: `${kidsOwnBed} хүүхэд, тусдаа ор × ${formatPrice(price)}`, amount: kidsOwnBed * price });
    if (kidsSharedBed && p.childSharedBed)
      out.push({ label: `${kidsSharedBed} хүүхэд, хамт × ${formatPrice(p.childSharedBed)}`, amount: kidsSharedBed * p.childSharedBed });
    if (singleRooms && p.singleSupplement)
      out.push({ label: `Ганцаараа өрөө × ${singleRooms}`, amount: singleRooms * p.singleSupplement });
    return out;
  }, [adults, kidsOwnBed, kidsSharedBed, singleRooms, price, p.childSharedBed, p.singleSupplement]);

  const total = lines.reduce((s, l) => s + l.amount, 0);
  const deposit = p.depositPercent ? Math.round((total * p.depositPercent) / 100) : 0;

  if (!tour.price) return null;

  function submit(e: FormEvent) {
    e.preventDefault();
    const b = addBooking({ tourId: tour.id, name, phone, date, adults, kidsOwnBed, kidsSharedBed, singleRooms, total, deposit, note: note || undefined });
    setDone(b);
  }

  async function copyMessage(b: BookingRequest) {
    try {
      await navigator.clipboard.writeText(bookingMessage(tour, b));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div
      id={stepped ? undefined : "book"}
      className={stepped ? "" : "scroll-mt-28 rounded-[1.5rem] border border-[var(--line)] bg-bg-elevated p-5 shadow-[var(--shadow)]"}
    >
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 16 }}
              className="mx-auto grid size-14 place-items-center rounded-full bg-accent text-2xl text-white"
            >
              ✓
            </motion.div>
            <h3 className="mt-4 font-display text-2xl font-semibold">Хүсэлт бэлэн боллоо</h3>
            <p className="mt-1 text-xs text-muted">Дугаар: {done.id}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Захиалга баталгаажихын тулд манай багт илгээнэ үү. Мессежийг хуулаад Instagram-аар явуулах эсвэл шууд залгаарай.
            </p>
            <div className="mt-5 grid gap-2">
              <a
                href={INSTAGRAM_DM}
                target="_blank"
                rel="noreferrer"
                onClick={() => copyMessage(done)}
                className="btn-shine flex h-12 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white"
              >
                Мессеж хуулаад Instagram нээх
              </a>
              <a href={`tel:${PHONE}`} className="flex h-11 items-center justify-center rounded-full border border-[var(--line)] text-sm font-medium">
                Залгах · +976 9003 1771
              </a>
              {copied ? <p className="text-xs text-accent">Мессеж хуулагдлаа — Instagram дээр paste хийгээрэй.</p> : null}
              <Link href="/bookings" className="mt-1 text-sm font-semibold text-accent">
                Миний захиалгууд →
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {stepped ? (
              <div className="mb-4 flex items-center gap-2">
                {["Хүн ба огноо", "Холбоо барих"].map((label, i) => (
                  <div key={label} className="flex-1">
                    <div className="h-1 overflow-hidden rounded-full bg-[var(--line)]">
                      <motion.div className="h-full bg-accent" initial={false} animate={{ width: step >= i ? "100%" : "0%" }} transition={{ duration: 0.4 }} />
                    </div>
                    <p className={`mt-1.5 text-[0.65rem] font-semibold ${step >= i ? "text-accent" : "text-muted"}`}>
                      {i + 1}. {label}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}

            <AnimatePresence initial={false}>
            {!stepped || step === 0 ? (
            <motion.div key="people" initial={stepped ? { opacity: 0, x: -24 } : false} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, transition: { duration: 0 } }} transition={{ duration: 0.25 }}>
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xs text-muted">Үнэ / хүн</p>
                <p className="mt-1 font-num text-3xl font-semibold text-accent">{formatPrice(tour.price)}</p>
                {tour.oldPrice ? <p className="text-sm text-muted line-through">{formatPrice(tour.oldPrice)}</p> : null}
              </div>
              {tour.discount ? (
                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">{tour.discount}</span>
              ) : null}
            </div>

            {dateOptions.length > 1 ? (
              <div className="mt-5">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted">Огноо сонгох</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {dateOptions.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDate(d)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        date === d ? "border-accent bg-accent text-white" : "border-[var(--line)] hover:border-accent"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            ) : dateOptions[0] ? (
              <p className="mt-4 rounded-xl bg-accent-mist/60 px-3 py-2.5 text-sm">
                <span className="text-muted">Огноо:</span> <span className="font-medium">{dateOptions[0]}</span>
              </p>
            ) : null}

            <div className="mt-3 divide-y divide-[var(--line)]">
              <Stepper label="Том хүн" hint="12-оос дээш нас" value={adults} min={1} onChange={setAdults} />
              {ownBedAllowed ? (
                <Stepper label="Хүүхэд, тусдаа ор" hint="2–12 нас · том хүний үнээр" value={kidsOwnBed} onChange={setKidsOwnBed} />
              ) : null}
              {p.childSharedBed ? (
                <Stepper
                  label="Хүүхэд, хамт унтах"
                  hint={`2–12 нас · ${formatPrice(p.childSharedBed)}`}
                  value={kidsSharedBed}
                  onChange={setKidsSharedBed}
                />
              ) : null}
              {p.singleSupplement ? (
                <Stepper
                  label="Ганцаараа өрөө"
                  hint={`+${formatPrice(p.singleSupplement)} / хүн`}
                  value={singleRooms}
                  max={adults}
                  onChange={setSingleRooms}
                />
              ) : null}
            </div>

            <div className="mt-3 space-y-1.5 rounded-xl bg-bg p-3.5 text-sm">
              {lines.map((l) => (
                <div key={l.label} className="flex justify-between gap-3 text-muted">
                  <span>{l.label}</span>
                  <span className="tabular-nums text-foam">{formatPrice(l.amount)}</span>
                </div>
              ))}
              <div className="flex items-baseline justify-between gap-3 border-t border-[var(--line)] pt-2">
                <span className="font-semibold">Нийт</span>
                <motion.span key={total} initial={{ scale: 1.15, color: "#0e8f84" }} animate={{ scale: 1 }} className="font-num text-2xl font-semibold text-accent tabular-nums">
                  {formatPrice(total)}
                </motion.span>
              </div>
              {deposit ? (
                <div className="flex justify-between gap-3 text-muted">
                  <span>Урьдчилгаа ({p.depositPercent}%)</span>
                  <span className="tabular-nums text-foam">{formatPrice(deposit)}</span>
                </div>
              ) : null}
            </div>
            </motion.div>
            ) : null}

            {stepped && step === 0 ? (
              <motion.button
                key="next"
                type="button"
                onClick={() => setStep(1)}
                className="btn-shine mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent text-sm font-semibold text-white"
              >
                Үргэлжлүүлэх · {formatPrice(total)} <span aria-hidden>→</span>
              </motion.button>
            ) : null}

            {!stepped || step === 1 ? (
            <motion.div key="contact" initial={stepped ? { opacity: 0, x: 24 } : false} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, transition: { duration: 0 } }} transition={{ duration: 0.25 }}>
            {stepped ? (
              <button type="button" onClick={() => setStep(0)} className="flex w-full items-center justify-between rounded-2xl bg-bg p-3.5 text-left">
                <span>
                  <span className="block text-xs text-muted">{[date, `${adults + kidsOwnBed + kidsSharedBed} хүн`].filter(Boolean).join(" · ")}</span>
                  <span className="font-num text-xl text-accent">{formatPrice(total)}</span>
                </span>
                <span className="text-sm font-semibold text-accent">Засах</span>
              </button>
            ) : null}
            <div className="mt-4 grid gap-2">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Таны нэр"
                autoComplete="name"
                className="h-11 rounded-xl border border-[var(--line)] bg-bg px-3.5 text-sm outline-none transition focus:border-accent"
              />
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Утасны дугаар"
                inputMode="tel"
                autoComplete="tel"
                pattern="[0-9+ ]{8,}"
                className="h-11 rounded-xl border border-[var(--line)] bg-bg px-3.5 text-sm outline-none transition focus:border-accent"
              />
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Нэмэлт хүсэлт (заавал биш)"
                rows={2}
                className="resize-none rounded-xl border border-[var(--line)] bg-bg px-3.5 py-2.5 text-sm outline-none transition focus:border-accent"
              />
            </div>

            <button type="submit" className="btn-shine mt-4 flex h-12 w-full items-center justify-center rounded-full bg-accent text-sm font-semibold text-white transition hover:bg-accent-soft">
              Захиалгын хүсэлт үүсгэх
            </button>
            </motion.div>
            ) : null}
            </AnimatePresence>
            <p className="mt-3 text-center text-[0.7rem] leading-relaxed text-muted">
              Урьдчилсан тооцоо. Эцсийн дүнг манай баг баталгаажуулна. Pocket, Toki, Simple, Dari-аар хуваан төлөх боломжтой.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
