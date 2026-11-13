"use client";

import { AnimatedNumber } from "@/components/AnimatedNumber";
import { Icon } from "@/components/Icon";
import { formatPrice, type TourSummary } from "@/data/tours";
import { useLiveRates } from "@/hooks/use-sale";
import { haptic } from "@/lib/native";
import {
  calculateTourPrice,
  initialCalculatorState,
  kidFits,
  MAX_ADULTS,
  MAX_CHILDREN,
  otherRoomsAdults,
  resolveCalculator,
  ROOM_ADULTS,
  roomCountRange,
  roomName,
  roomTakesKids,
  setAdults,
  setChildren,
  setKid,
  setRoomCount,
  setRoomType,
  suggestedRoomCount,
  type CalculatorQuote,
  type CalculatorState,
  type ChildBed,
  type Rates,
  type RoomType,
} from "@/lib/tour-calculator";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const glass = "rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-md";

function Counter({
  label,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  const step = (n: number) => {
    haptic("tap");
    onChange(n);
  };
  return (
    <div className={`${glass} flex items-center justify-between gap-3 px-4 py-3`}>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white">{label}</p>
        {hint ? <p className="mt-0.5 text-[0.72rem] leading-snug text-white/55">{hint}</p> : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          aria-label={`${label} хасах`}
          disabled={value <= min}
          onClick={() => step(value - 1)}
          className="tap grid size-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition enabled:hover:border-white/40 disabled:opacity-30"
        >
          <Icon name="minus" size={16} />
        </button>
        <motion.span
          key={value}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-7 text-center font-num text-lg font-semibold tabular-nums text-white"
        >
          {value}
        </motion.span>
        <button
          type="button"
          aria-label={`${label} нэмэх`}
          disabled={value >= max}
          onClick={() => step(value + 1)}
          className="tap grid size-10 place-items-center rounded-full border border-white/25 bg-white/15 text-white transition enabled:hover:bg-white/25 disabled:opacity-30"
        >
          <Icon name="plus" size={16} />
        </button>
      </div>
    </div>
  );
}

function SaleCountdown({ endsAt }: { endsAt: string }) {
  const ends = useMemo(() => Date.parse(endsAt), [endsAt]);
  const [left, setLeft] = useState(() => Math.max(0, ends - Date.now()));
  useEffect(() => {
    const id = window.setInterval(() => setLeft(Math.max(0, ends - Date.now())), 1000);
    return () => window.clearInterval(id);
  }, [ends]);
  if (left <= 0) return null;
  const s = Math.floor(left / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  const d = Math.floor(s / 86400);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-400/15 px-2.5 py-1 font-num text-[0.72rem] text-amber-100">
      <Icon name="clock" size={12} />
      {d > 0 ? `${d} өдөр ` : ""}
      {pad(Math.floor((s % 86400) / 3600))}:{pad(Math.floor((s % 3600) / 60))}:{pad(s % 60)}
    </span>
  );
}

const ROOM_OPTIONS: { id: RoomType; hint: (fee: string) => string }[] = [
  { id: "double", hint: () => "2 том хүн · нэг том ор" },
  { id: "twin", hint: () => "2 том хүн · тусдаа 2 ор" },
  { id: "single", hint: (fee) => `1 том хүн · +${fee}` },
  { id: "shared", hint: () => "1 том хүн · сондгой аялагчтай · нэмэлтгүй" },
];

function Row({ label, value, tone = "muted" }: { label: string; value: string; tone?: "muted" | "save" }) {
  return (
    <div className={`flex justify-between gap-3 ${tone === "save" ? "text-emerald-300" : "text-white/70"}`}>
      <span>{label}</span>
      <span className="font-num tabular-nums">{value}</span>
    </div>
  );
}

/**
 * Hotel room price calculator: party size → rooms → where each child sleeps.
 * The total only appears once every traveller has a room.
 */
export function TourPriceCalculator({
  tour,
  state,
  onChange,
  quote,
  rates,
}: {
  tour: TourSummary;
  state: CalculatorState;
  onChange: (s: CalculatorState) => void;
  quote: CalculatorQuote;
  rates: Rates;
}) {
  const settings = resolveCalculator(tour, rates);
  const allowExtra = settings.allowChildExtraBed;
  const range = roomCountRange(state.adults);
  const suggested = suggestedRoomCount(state.adults);
  const kidRooms = state.rooms.map((r, i) => ({ i, type: r.type })).filter((r) => roomTakesKids(r.type));
  const salePercent = quote.originalPrice ? Math.round((1 - quote.adultPrice / quote.originalPrice) * 100) : 0;

  return (
    <section className="relative mt-5 overflow-hidden rounded-3xl border border-white/10 bg-[#0a1114]/85 p-4 text-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-5">
      <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-teal-400/15 blur-3xl" aria-hidden />

      <div className="relative flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-full border border-white/15 bg-white/10">
            <Icon name="calculator" size={18} />
          </span>
          <div>
            <h3 className="text-base font-semibold tracking-tight">Үнийн тооцоолол</h3>
            <p className="text-[0.72rem] text-white/55">Хүн, өрөө, хүүхдийн байрлалаа сонгоорой</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[0.68rem] text-white/50">Том хүн / 1 хүн</p>
          {quote.originalPrice ? (
            <p className="font-num text-xs text-white/45 line-through">{formatPrice(quote.originalPrice)}</p>
          ) : null}
          <p className="font-num text-2xl font-bold tabular-nums">{formatPrice(quote.adultPrice)}</p>
          {quote.originalPrice && rates.saleEndsAt ? (
            <div className="mt-1">
              <SaleCountdown endsAt={rates.saleEndsAt} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="relative mt-4 grid gap-2">
        <Counter label="Том хүн" hint="12-оос дээш нас" value={state.adults} min={1} max={MAX_ADULTS} onChange={(n) => onChange(setAdults(state, n, allowExtra))} />
        <Counter
          label="Хүүхэд"
          hint={
            state.adults === 1 && state.children === 1
              ? "2–12 нас · 1 том хүн + 1 хүүхэд бол хүүхэд том хүний үнээр"
              : `2–12 нас · хамт унтвал ${formatPrice(Math.max(0, quote.adultPrice - settings.childDiscount))}${allowExtra ? " · нэмэлт ортой бол том хүний үнэ" : ""}`
          }
          value={state.children}
          min={0}
          max={MAX_CHILDREN}
          onChange={(n) => onChange(setChildren(state, n, allowExtra))}
        />
        <Counter
          label="Өрөөний тоо"
          hint={state.rooms.length === suggested ? `Санал болгосон: ${suggested}` : `Санал болгосон: ${suggested} · та ${state.rooms.length} сонгосон`}
          value={state.rooms.length}
          min={range.min}
          max={range.max}
          onChange={(n) => onChange(setRoomCount(state, n, allowExtra))}
        />
      </div>

      <div className="relative mt-4 space-y-3">
        {state.rooms.map((room, i) => {
          const others = otherRoomsAdults(state, i);
          const kidsHere = state.kids.filter((k) => k.room === i);
          const withParents = kidsHere.filter((k) => k.bed === "withParents").length;
          const extraBed = kidsHere.length - withParents;
          return (
            <div key={i} className={`${glass} p-3.5`}>
              <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-white/70">
                  <Icon name="bed" size={14} /> Өрөө {i + 1}
                </p>
                <p className="text-[0.7rem] text-white/50">
                  {room.type ? `${ROOM_ADULTS[room.type]} том хүн` : "Төрөл сонгоогүй"}
                  {withParents ? ` · ${withParents} хүүхэд хамт` : ""}
                  {extraBed ? ` · ${extraBed} нэмэлт ор` : ""}
                </p>
              </div>
              <div className="mt-2.5 grid gap-1.5 sm:grid-cols-2">
                {ROOM_OPTIONS.map((opt) => {
                  const active = room.type === opt.id;
                  const disabled = !active && others + ROOM_ADULTS[opt.id] > state.adults;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={disabled}
                      onClick={() => {
                        haptic("tap");
                        onChange(setRoomType(state, i, opt.id, allowExtra));
                      }}
                      className={`flex items-start gap-2.5 rounded-xl border px-3 py-2.5 text-left transition disabled:cursor-not-allowed disabled:opacity-35 ${
                        active ? "border-teal-300/60 bg-teal-300/15" : "border-white/10 bg-black/20 enabled:hover:border-white/30"
                      }`}
                    >
                      <span className={`mt-0.5 size-3.5 shrink-0 rounded-full border-2 ${active ? "border-teal-300 bg-teal-300" : "border-white/35"}`} />
                      <span className="min-w-0">
                        <span className="block text-[0.8rem] font-semibold leading-snug">{roomName(opt.id)}</span>
                        <span className="mt-0.5 block text-[0.68rem] text-white/55">{opt.hint(formatPrice(settings.singleSupplement))}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {state.children > 0 ? (
        <div className={`${glass} relative mt-3 p-3.5`}>
          <p className="flex items-center gap-1.5 text-xs font-semibold text-white/70">
            <Icon name="baby" size={14} /> Хүүхдийн байрлал
          </p>
          <p className="mt-1 text-[0.68rem] leading-relaxed text-white/50">
            Нэг өрөөнд эцэг эхтэй хамт 2 хүртэл{allowExtra ? ", нэмэлт ортой 1" : ""} хүүхэд. Хуваалцах өрөөнд хүүхэд байрлахгүй.
          </p>
          <div className="mt-2.5 space-y-2">
            {state.kids.map((kid, k) => (
              <div key={k} className="grid gap-2 rounded-xl border border-white/10 bg-black/20 p-2.5 sm:grid-cols-[auto_minmax(0,1fr)_minmax(0,1.4fr)] sm:items-center">
                <span className="text-xs font-semibold text-white/80">Хүүхэд {k + 1}</span>
                <select
                  aria-label={`Хүүхэд ${k + 1}-ийн өрөө`}
                  value={kid.room ?? ""}
                  onChange={(e) => onChange(setKid(state, k, Number(e.target.value), kid.bed, allowExtra))}
                  className="h-10 rounded-lg border border-white/15 bg-[#0a1114] px-2.5 text-sm text-white outline-none focus:border-teal-300/60"
                >
                  {kid.room == null ? <option value="">Өрөө сонгох</option> : null}
                  {kidRooms.map((r) => (
                    <option key={r.i} value={r.i} disabled={kid.room !== r.i && !kidFits(state, k, r.i, kid.bed, allowExtra)}>
                      Өрөө {r.i + 1}
                    </option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-1.5">
                  {(["withParents", "extraBed"] as ChildBed[]).map((bed) => {
                    if (bed === "extraBed" && !allowExtra) return null;
                    const active = kid.bed === bed && kid.room != null;
                    const ok = kid.room != null && (kid.bed === bed || kidFits(state, k, kid.room, bed, allowExtra));
                    return (
                      <button
                        key={bed}
                        type="button"
                        disabled={!ok}
                        onClick={() => {
                          haptic("tap");
                          if (kid.room != null) onChange(setKid(state, k, kid.room, bed, allowExtra));
                        }}
                        className={`rounded-lg border px-2 py-2 text-[0.72rem] font-semibold leading-tight transition disabled:opacity-35 ${
                          active ? "border-teal-300/60 bg-teal-300/15" : "border-white/10 enabled:hover:border-white/30"
                        } ${!allowExtra ? "col-span-2" : ""}`}
                      >
                        {bed === "withParents" ? "Эцэг эхтэй хамт · оргүй" : "Нэмэлт ортой"}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="relative mt-4">
        <AnimatePresence mode="wait" initial={false}>
          {!quote.ready ? (
            <motion.div
              key="pending"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              role="status"
              className="rounded-2xl border border-amber-300/30 bg-amber-400/10 p-3.5 backdrop-blur-md"
            >
              <p className="flex items-center gap-1.5 text-sm font-semibold text-amber-100">
                <Icon name="alert" size={15} /> Тооцоолол бэлэн биш
              </p>
              <ul className="mt-1.5 space-y-0.5 text-xs leading-relaxed text-amber-100/80">
                {quote.warnings.map((w) => (
                  <li key={w}>• {w}</li>
                ))}
              </ul>
            </motion.div>
          ) : (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className={`${glass} space-y-1.5 p-4 text-sm`}
            >
              <p className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2.5 py-1 text-[0.7rem] font-semibold text-emerald-200">
                <Icon name="check" size={12} strokeWidth={2.6} /> Тооцоолол бэлэн
              </p>
              <div className="space-y-1.5 pt-1">
                {quote.lines.map((l) => (
                  <Row key={l.label} label={l.label} value={formatPrice(l.amount)} />
                ))}
              </div>
              {quote.savings > 0 ? (
                <div className="space-y-1 border-t border-white/10 pt-2">
                  {quote.saleSavings > 0 ? <Row tone="save" label={`Хямдрал${salePercent ? ` (−${salePercent}%)` : ""}`} value={`−${formatPrice(quote.saleSavings)}`} /> : null}
                  {quote.childSavings > 0 ? <Row tone="save" label="Хүүхдийн хөнгөлөлт" value={`−${formatPrice(quote.childSavings)}`} /> : null}
                  <Row tone="save" label="Нийт хэмнэлт" value={formatPrice(quote.savings)} />
                </div>
              ) : null}
              <div className="flex items-baseline justify-between gap-3 border-t border-white/10 pt-2.5">
                <span className="font-semibold">Нийт дүн</span>
                <AnimatedNumber value={quote.total} format={formatPrice} className="font-num text-2xl font-bold tabular-nums" />
              </div>
              {settings.depositPercent > 0 ? (
                <>
                  <div className="flex justify-between gap-3 text-white/80">
                    <span>Урьдчилгаа ({settings.depositPercent}%)</span>
                    <AnimatedNumber value={quote.deposit} format={formatPrice} className="font-num font-semibold tabular-nums text-teal-200" />
                  </div>
                  <div className="flex justify-between gap-3 text-white/70">
                    <span>Үлдэгдэл төлбөр</span>
                    <AnimatedNumber value={quote.balance} format={formatPrice} className="font-num tabular-nums" />
                  </div>
                </>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/** Calculator quote for the chosen departure, using the same live prices the page shows. */
export function useTourCalculator(tour: TourSummary, state: CalculatorState, date?: string | null) {
  const rates = useLiveRates(tour, date);
  const quote = useMemo(() => calculateTourPrice(tour, state, rates), [tour, state, rates]);
  return { quote, rates };
}

export { initialCalculatorState };
