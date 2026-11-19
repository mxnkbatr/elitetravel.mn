"use client";

import { deleteItem, saveTour } from "@/app/admin/(panel)/actions";
import { AdminTitle } from "@/app/admin/(panel)/AdminTitle";
import { confirmDelete } from "@/app/admin/(panel)/ContentList";
import { toast } from "@/app/admin/(panel)/feedback";
import { Field, GalleryField, ImageField, inputClass, LinesField, Section } from "@/app/admin/(panel)/fields";
import { SaveBar } from "@/app/admin/(panel)/SaveBar";
import { TourDatesEditor } from "@/components/TourDatesEditor";
import { DESTINATION_PRESETS, formatPrice, slugDestinationKey, tourDates, type DatePrice, type ItineraryDay, type Tour, type TourCalculatorConfig } from "@/data/tours";
import { DOC_TYPES } from "@/lib/documents";
import { blockingIssues, discountLabel, slugFromTitle, tourForEditing, tourState, validateTour, type TourIssue, type TourSection, type TourState } from "@/lib/tour-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition, type ReactNode } from "react";

const CUSTOM = "__custom__";
const isPresetKey = (key: string) => DESTINATION_PRESETS.some((d) => d.key === key);

const HOTEL_SUGGESTIONS = ["Timton Fuhe Hotel, Саняа", "Bing Tang Bali Resort", "Harbour Plaza & Degrees"] as const;

const SECTIONS: { key: TourSection; label: string }[] = [
  { key: "basic", label: "Үндсэн" },
  { key: "status", label: "Төлөв" },
  { key: "price", label: "Үнэ" },
  { key: "dates", label: "Огноо" },
  { key: "images", label: "Зураг" },
  { key: "text", label: "Тайлбар" },
  { key: "itinerary", label: "Хөтөлбөр" },
];

const numOrNull = (v: string) => {
  const digits = v.replace(/[^\d]/g, "");
  return digits === "" ? null : Number(digits);
};
/** 1250000 → "1'250'000" so staff can read big amounts while typing */
const money = (n: number | null | undefined) => (n == null ? "" : String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "'"));

/** datetime-local value from an ISO string (empty if unparsable). */
function toLocalInput(iso: string) {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "";
  const d = new Date(t);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function MoneyInput({ value, onChange, placeholder, id }: { value: number | null | undefined; onChange: (v: number | null) => void; placeholder?: string; id?: string }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted">₮</span>
      <input id={id} inputMode="numeric" value={money(value)} placeholder={placeholder} onChange={(e) => onChange(numOrNull(e.target.value))} className={`${inputClass} pl-7`} />
    </div>
  );
}

function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition sm:col-span-2 ${checked ? "border-accent bg-accent/[0.05]" : "border-[var(--line)]"}`}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-[#0d8f84]" />
      <span>
        <span className="block font-semibold">{label}</span>
        {hint ? <span className="mt-0.5 block text-xs text-muted">{hint}</span> : null}
      </span>
    </label>
  );
}

function Note({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "ok" | "warn" }) {
  const cls = tone === "ok" ? "bg-emerald-50 text-emerald-800" : tone === "warn" ? "bg-amber-50 text-amber-800" : "bg-[#f1f6f5] text-ink/80";
  return <p className={`rounded-xl px-3 py-2.5 text-xs leading-relaxed sm:col-span-2 ${cls}`}>{children}</p>;
}

export function TourEditor({ initial: raw, originalId }: { initial: Tour; originalId: string | null }) {
  const [initial] = useState(() => tourForEditing(raw));
  const router = useRouter();
  const [tour, setTour] = useState<Tour>(initial);
  // What was last saved; anything different is an unsaved edit
  const [saved, setSaved] = useState(() => JSON.stringify(initial));
  const [customDest, setCustomDest] = useState(() => Boolean(initial.destinationKey) && !isPresetKey(initial.destinationKey));
  // New tours: the link follows the title until staff type their own
  const [idTouched, setIdTouched] = useState(originalId !== null);
  const [showErrors, setShowErrors] = useState(false);
  const [saleOn, setSaleOn] = useState(() => initial.oldPrice != null || Boolean(initial.pricing?.saleEndsAt));
  const [advancedChild, setAdvancedChild] = useState(() => initial.calculator?.childBasePrice != null);
  const [deleting, startDelete] = useTransition();

  const set = <K extends keyof Tour>(key: K, value: Tour[K]) => setTour((t) => ({ ...t, [key]: value }));
  const setPricing = (key: keyof NonNullable<Tour["pricing"]>, value: unknown) => setTour((t) => ({ ...t, pricing: { ...t.pricing, [key]: value ?? undefined } }));
  const setCalc = (key: keyof TourCalculatorConfig, value: unknown) =>
    setTour((t) => ({ ...t, calculator: { ...t.calculator, [key]: value ?? undefined } as TourCalculatorConfig }));

  const departureLabels = tourDates(tour);
  const issues = useMemo(() => validateTour(tour), [tour]);
  const errors = blockingIssues(issues);
  const warnings = issues.filter((i) => i.warning);
  const errorFor = (field: string) => (showErrors ? errors.find((i) => i.field === field)?.message : undefined);
  const state = tourState(tour);

  function setTitle(title: string) {
    setTour((t) => ({ ...t, title, id: idTouched ? t.id : slugFromTitle(title) }));
  }

  function setState(next: TourState) {
    setTour((t) => ({
      ...t,
      status: next === "ended" ? "ended" : undefined,
      tag: next === "soon" ? "soon" : t.tag === "soon" ? undefined : t.tag,
    }));
  }

  function toggleSale(on: boolean) {
    setSaleOn(on);
    if (!on)
      setTour((t) => ({
        ...t,
        oldPrice: null,
        discount: undefined,
        tag: t.tag === "sale" ? undefined : t.tag,
        pricing: { ...t.pricing, saleEndsAt: undefined },
        datePrices: t.datePrices ? Object.fromEntries(Object.entries(t.datePrices).map(([k, d]) => [k, { price: d.price, childSharedBed: d.childSharedBed }])) : undefined,
      }));
  }

  function setDates(nextDates: string) {
    const labels = new Set(tourDates({ dates: nextDates }));
    setTour((t) => {
      const pruned: Record<string, DatePrice> = {};
      for (const [label, price] of Object.entries(t.datePrices ?? {})) if (labels.has(label)) pruned[label] = price;
      return { ...t, dates: nextDates || undefined, datePrices: Object.keys(pruned).length ? pruned : undefined };
    });
  }

  function setDatePrice(label: string, field: keyof DatePrice, value: number | null) {
    setTour((t) => {
      const cur = { ...(t.datePrices ?? {}) };
      const prev = cur[label];
      if (value == null) {
        if (!prev) return t;
        if (field === "price") delete cur[label];
        else {
          const next = { ...prev };
          delete next[field];
          cur[label] = next;
        }
      } else {
        // A child / old price alone keeps the tour's adult price for that date
        const base: DatePrice = prev ?? { price: t.price ?? value };
        cur[label] = { ...base, [field]: value };
      }
      return { ...t, datePrices: Object.keys(cur).length ? cur : undefined };
    });
  }

  const pickDestination = (value: string) => {
    if (value === CUSTOM) {
      setCustomDest(true);
      if (isPresetKey(tour.destinationKey)) set("destinationKey", "");
      return;
    }
    setCustomDest(false);
    const preset = DESTINATION_PRESETS.find((d) => d.key === value);
    setTour((t) => ({ ...t, destinationKey: value, destination: t.destination.trim() ? t.destination : (preset?.label ?? t.destination) }));
  };

  async function save() {
    if (errors.length) {
      setShowErrors(true);
      document.getElementById("tour-issues")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return { ok: false as const, error: `Хадгалахын өмнө ${errors.length} алдааг засна уу.` };
    }
    const res = await saveTour(tour, originalId);
    if (res.ok) {
      setSaved(JSON.stringify(tour));
      setShowErrors(false);
    } else setShowErrors(true);
    return res;
  }

  async function remove() {
    if (!originalId) return;
    // Ask first, outside the transition, so the button only says "deleting" once confirmed
    if (!(await confirmDelete("tours", originalId, tour.title))) return;
    startDelete(async () => {
      const res = await deleteItem("tours", originalId);
      if (!res.ok) {
        toast(res.error, "error");
        return;
      }
      toast(`«${tour.title}» устгагдлаа`);
      setSaved(JSON.stringify(tour)); // no "unsaved" prompt on the way out
      router.push("/admin/tours");
    });
  }

  const sectionIssues = (key: TourSection) => (showErrors ? errors.filter((i) => i.section === key).length : 0);
  const salePreview = discountLabel(tour.price, tour.oldPrice);
  const childPrice = tour.pricing?.childSharedBed;

  return (
    <div className="mx-auto max-w-4xl space-y-5 pb-32">
      <Link href="/admin/tours" className="inline-flex text-sm font-semibold text-accent">
        ‹ Бүх аялал
      </Link>
      <AdminTitle
        title={originalId ? tour.title || "Аялал засах" : "Шинэ аялал нэмэх"}
        sub={originalId ? "Өөрчлөөд доорх «Хадгалах» товч дарна. * тэмдэгтэй талбар заавал." : "Хэсэг бүрийг дарааллаар бөглөөд «Хадгалах» дарна. * тэмдэгтэй талбар заавал."}
        action={
          originalId ? (
            <Link href={`/admin/departures/${originalId}`} className="inline-flex h-11 items-center gap-1.5 rounded-full border border-[var(--line)] bg-white px-4 text-sm font-semibold text-accent">
              Аялагчид ›
            </Link>
          ) : null
        }
      />

      {/* Jump between sections; red count = problems to fix */}
      <nav className="sticky top-0 z-20 -mx-4 flex gap-1.5 overflow-x-auto bg-[var(--bg-soft)]/95 px-4 py-2 backdrop-blur sm:mx-0 sm:rounded-full sm:px-2">
        {SECTIONS.map((s) => {
          const n = sectionIssues(s.key);
          return (
            <a key={s.key} href={`#sec-${s.key}`} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${n ? "bg-red-50 text-red-700" : "bg-white text-muted hover:text-ink"}`}>
              {s.label}
              {n ? ` · ${n}` : ""}
            </a>
          );
        })}
      </nav>

      {showErrors && (errors.length > 0 || warnings.length > 0) ? (
        <div id="tour-issues" className="scroll-mt-16 space-y-3">
          {errors.length ? <IssueList tone="error" title={`Хадгалахын өмнө засах ${errors.length} зүйл`} items={errors} /> : null}
          {warnings.length ? <IssueList tone="warn" title="Анхааруулга (хадгалж болно)" items={warnings} /> : null}
        </div>
      ) : (
        <div id="tour-issues" />
      )}

      <Section id="sec-basic" title="1. Үндсэн мэдээлэл" hint="Аяллын нэр, хаашаа, хэдэн хоног.">
        <Field label="Аяллын нэр" required wide error={errorFor("title")}>
          <input value={tour.title} onChange={(e) => setTitle(e.target.value)} placeholder="Жишээ: Хайнань 8 хоног" className={inputClass} />
        </Field>
        <Field
          label="Холбоос (ID)"
          required
          wide
          error={errorFor("id")}
          hint={originalId ? "Хадгалсан аяллын холбоосыг өөрчлөх боломжгүй (захиалгууд үүнтэй холбоотой)." : `Нэрээс автоматаар үүснэ. Сайт дээрх хаяг: elitetravel.mn/tours/${tour.id || "…"}`}
        >
          <input
            value={tour.id}
            readOnly={originalId !== null}
            onChange={(e) => {
              setIdTouched(true);
              set("id", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
            }}
            className={`${inputClass} ${originalId ? "bg-[#f3f6f5] text-muted" : ""}`}
          />
        </Field>
        <Field label="Чиглэлийн бүс" required error={errorFor("destinationKey")} hint="Сайтын шүүлтүүрт ашиглана.">
          <select value={customDest ? CUSTOM : tour.destinationKey} onChange={(e) => pickDestination(e.target.value)} className={inputClass}>
            {DESTINATION_PRESETS.map((d) => (
              <option key={d.key} value={d.key}>
                {d.label}
              </option>
            ))}
            <option value={CUSTOM}>Шинэ бүс нэмэх…</option>
          </select>
          {customDest ? (
            <input
              value={tour.destinationKey}
              onChange={(e) => set("destinationKey", slugDestinationKey(e.target.value))}
              placeholder="латинаар: dubai, tokyo, phuket"
              className={`${inputClass} mt-2`}
              autoComplete="off"
            />
          ) : null}
        </Field>
        <Field label="Чиглэл (харагдах нэр)" required error={errorFor("destination")}>
          <input value={tour.destination} onChange={(e) => set("destination", e.target.value)} placeholder="Хайнань, Хятад" className={inputClass} />
        </Field>
        <Field label="Хугацаа" required error={errorFor("duration")}>
          <input value={tour.duration} onChange={(e) => set("duration", e.target.value)} placeholder="8 өдөр 7 шөнө" className={inputClass} />
        </Field>
        <Field label="Шөнийн тоо" error={errorFor("nights")}>
          <input inputMode="numeric" value={tour.nights ?? ""} onChange={(e) => set("nights", numOrNull(e.target.value))} placeholder="7" className={inputClass} />
        </Field>
        <Field label="Нислэг / хаанаас хөдлөх" hint="Жишээ: Улаанбаатар — Саняа шууд нислэг">
          <input value={tour.departure ?? ""} onChange={(e) => set("departure", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Буудал" hint="Жагсаалтаас сонгох эсвэл өөрөө бичнэ.">
          <input list="hotel-suggestions" value={tour.stay ?? ""} onChange={(e) => set("stay", e.target.value)} placeholder="Жишээ: Atlantis Sanya" className={inputClass} autoComplete="off" />
          <datalist id="hotel-suggestions">
            {HOTEL_SUGGESTIONS.map((h) => (
              <option key={h} value={h} />
            ))}
          </datalist>
        </Field>
      </Section>

      <Section id="sec-status" title="2. Төлөв — захиалга авах уу?" hint="Сайт дээр аялагч захиалж чадах эсэхийг энд сонгоно.">
        <div className="grid gap-2 sm:col-span-2 sm:grid-cols-3">
          {(
            [
              ["open", "Захиалга авч байна", "Сайт дээр харагдаж, үнэ тооцоолж захиална."],
              ["soon", "Удахгүй", "Харагдана, гэхдээ захиалга хаалттай."],
              ["ended", "Дууссан", "Жагсаалтаас нуугдана, захиалахгүй."],
            ] as const
          ).map(([key, label, hint]) => (
            <label key={key} className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 text-sm transition ${state === key ? "border-accent bg-accent/[0.06]" : "border-[var(--line)]"}`}>
              <input type="radio" name="tour-state" checked={state === key} onChange={() => setState(key)} className="mt-0.5 size-4 accent-[#0d8f84]" />
              <span>
                <span className="block font-semibold">{label}</span>
                <span className="block text-xs text-muted">{hint}</span>
              </span>
            </label>
          ))}
        </div>
        {state === "open" ? (
          <Field label="Картан дээрх тэмдэг" hint="«Хямдрал» нь доор хямдрал асаасан үед л утгатай.">
            <select value={tour.tag ?? ""} onChange={(e) => set("tag", (e.target.value || undefined) as Tour["tag"])} className={inputClass}>
              <option value="">Тэмдэггүй</option>
              <option value="hot">Эрэлттэй</option>
              <option value="sale">Хямдрал</option>
            </select>
          </Field>
        ) : null}
        <Toggle
          checked={tour.unlisted === true}
          onChange={(v) => set("unlisted", v ? true : undefined)}
          label="Нууц аялал (туршилт)"
          hint="Жагсаалт, хайлтад гарахгүй. Зөвхөн холбоосоор нь орж харна."
        />
      </Section>

      <Section id="sec-price" title="3. Үнэ ба үнийн тооцоолуур" hint="Аяллын хуудсан дээрх тооцоолуур эдгээр тоог ашиглана.">
        <Field label="Том хүний үнэ (1 хүн)" required={state === "open"} error={errorFor("price")} hint="Хоосон бол «Удахгүй» гэж харагдана. Огноо бүрт өөр үнэ байвал «4. Огноо» хэсэгт.">
          <MoneyInput value={tour.price} onChange={(v) => set("price", v)} placeholder="4 990 000" />
        </Field>
        <Field label="Урьдчилгаа (%)" error={errorFor("depositPercent")} hint="Захиалахад эхэлж төлөх хувь. Хоосон бол 30%.">
          <input inputMode="numeric" value={tour.pricing?.depositPercent ?? ""} onChange={(e) => setPricing("depositPercent", numOrNull(e.target.value))} placeholder="30" className={inputClass} />
        </Field>

        <Toggle checked={saleOn} onChange={toggleSale} label="Хямдралтай" hint="Хуучин үнийг зурааслаж, хямдралын хувийг автоматаар харуулна." />
        {saleOn ? (
          <>
            <Field label="Хямдралын өмнөх үнэ" required error={errorFor("oldPrice")} hint={salePreview ? `Сайт дээр «${salePreview}» гэж харагдана.` : "Дээрх үнээс их байх ёстой."}>
              <MoneyInput value={tour.oldPrice} onChange={(v) => set("oldPrice", v)} />
            </Field>
            <Field label="Хямдрал дуусах өдөр, цаг" error={errorFor("saleEndsAt")} hint="Энэ цагаас хойш автоматаар хуучин үнээр бодно. Хоосон бол дуусахгүй.">
              <input
                type="datetime-local"
                value={tour.pricing?.saleEndsAt ? toLocalInput(tour.pricing.saleEndsAt) : ""}
                onChange={(e) => setPricing("saleEndsAt", e.target.value ? new Date(e.target.value).toISOString() : undefined)}
                className={inputClass}
              />
            </Field>
          </>
        ) : null}

        <div className="sm:col-span-2 border-t border-[var(--line)] pt-4">
          <p className="text-sm font-semibold">Хүүхэд ба өрөө</p>
          <p className="text-xs text-muted">2–12 настай хүүхэд эцэг эхтэйгээ нэг оронд унтвал хямд үнэ.</p>
        </div>
        <Field label="Хүүхдийн үнэ (эцэг эхтэй нэг оронд)" error={errorFor("childSharedBed")} hint={childPrice == null ? "Хоосон бол хүүхэд том хүний үнээр." : tour.price != null ? `Том хүнээс ${formatPrice(Math.max(0, tour.price - childPrice))} хямд.` : undefined}>
          <MoneyInput value={childPrice} onChange={(v) => setPricing("childSharedBed", v)} />
        </Field>
        <Field label="Ганц өрөөний нэмэгдэл" error={errorFor("singleSupplement")} hint="Нэг хүн өрөөнд ганцаараа байвал нэмж төлөх дүн. Хоосон бол 0.">
          <MoneyInput value={tour.pricing?.singleSupplement} onChange={(v) => setPricing("singleSupplement", v)} />
        </Field>
        <Toggle
          checked={tour.pricing?.childOwnBed !== false}
          onChange={(v) => setPricing("childOwnBed", v ? undefined : false)}
          label="Хүүхэд тусдаа ортой байж болно"
          hint="Тусдаа ортой хүүхэд том хүний үнээр тооцогдоно."
        />
        <Toggle
          checked={advancedChild}
          onChange={(v) => {
            setAdvancedChild(v);
            if (!v) setTour((t) => ({ ...t, calculator: { ...t.calculator, childBasePrice: undefined, childSalePrice: undefined } }));
          }}
          label="Хүүхдэд тогтмол үнэ (заавал биш)"
          hint="Жишээ нь Бали шиг хүүхдийн үнэ огнооноос үл хамааран нэг байх үед. Дээрх хүүхдийн үнийг орлоно."
        />
        {advancedChild ? (
          <>
            <Field label="Хүүхдийн тогтмол үнэ" error={errorFor("childBasePrice")}>
              <MoneyInput value={tour.calculator?.childBasePrice} onChange={(v) => setCalc("childBasePrice", v)} />
            </Field>
            <Field label="Хямдралын үеийн хүүхдийн үнэ" error={errorFor("childSalePrice")} hint="Хямдрал дуусахад дээрх үнэ рүү шилжинэ.">
              <MoneyInput value={tour.calculator?.childSalePrice} onChange={(v) => setCalc("childSalePrice", v)} />
            </Field>
          </>
        ) : null}
        <Field label="Хүүхдийн үнийн нэмэлт тайлбар" wide hint="Сайт дээр бичвэрээр харагдана. Жишээ: 2 хүртэлх насны хүүхэд үнэгүй.">
          <input value={tour.pricing?.child ?? ""} onChange={(e) => setPricing("child", e.target.value || undefined)} className={inputClass} />
        </Field>
        <Toggle
          checked={tour.calculator?.enabled !== false}
          onChange={(v) => setCalc("enabled", v)}
          label="Аяллын хуудсанд үнийн тооцоолуур харуулах"
          hint="Аялагч хүний тоо, өрөөгөө сонгоод нийт үнэ, урьдчилгаагаа харна. Үнэтэй үед л ажиллана."
        />
        {state !== "open" ? <Note tone="warn">Төлөв «{state === "soon" ? "Удахгүй" : "Дууссан"}» тул тооцоолуур, захиалга сайт дээр харагдахгүй.</Note> : null}
      </Section>

      <Section id="sec-dates" title="4. Хөдлөх огноо ба огноо бүрийн үнэ" hint="Аялагч захиалахдаа эдгээр огнооноос сонгоно.">
        <TourDatesEditor value={tour.dates ?? ""} onChange={setDates} />
        {errorFor("dates") ? <p className="text-sm font-medium text-red-600 sm:col-span-2">{errorFor("dates")}</p> : null}
        {departureLabels.length > 0 ? (
          <div className="space-y-3 sm:col-span-2">
            <Note>
              Хоосон үлдээвэл үндсэн үнэ ({formatPrice(tour.price)}){childPrice != null ? `, хүүхэд ${formatPrice(childPrice)}` : ""} ашиглагдана. Тухайн огноо өөр үнэтэй бол л бөглөнө.
            </Note>
            {departureLabels.map((label, i) => {
              const row = tour.datePrices?.[label];
              const err = showErrors ? errors.find((e) => e.field === `date:${label}`)?.message : undefined;
              return (
                <div key={label} className={`grid gap-2 rounded-xl border bg-white p-3 sm:grid-cols-[minmax(0,1.1fr)_repeat(3,minmax(0,1fr))] sm:items-end ${err ? "border-red-300" : "border-[var(--line)]"}`}>
                  <div className="min-w-0">
                    <p className="text-[0.7rem] font-semibold text-muted">{i + 1}-р хөдлөх</p>
                    <p className="truncate text-sm font-semibold text-ink">{label}</p>
                  </div>
                  <label className="block">
                    <span className="mb-1 block text-[0.7rem] font-semibold text-muted">Том хүн</span>
                    <MoneyInput value={row?.price} onChange={(v) => setDatePrice(label, "price", v)} placeholder={money(tour.price)} />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[0.7rem] font-semibold text-muted">Хүүхэд (хамт)</span>
                    <MoneyInput value={row?.childSharedBed} onChange={(v) => setDatePrice(label, "childSharedBed", v)} placeholder={money(childPrice)} />
                  </label>
                  {saleOn ? (
                    <label className="block">
                      <span className="mb-1 block text-[0.7rem] font-semibold text-muted">Хямдралын өмнөх</span>
                      <MoneyInput value={row?.oldPrice} onChange={(v) => setDatePrice(label, "oldPrice", v)} placeholder={money(tour.oldPrice)} />
                    </label>
                  ) : (
                    <span className="hidden sm:block" />
                  )}
                  {err ? <p className="text-xs font-medium text-red-600 sm:col-span-4">{err}</p> : null}
                </div>
              );
            })}
          </div>
        ) : null}
      </Section>

      <Section id="sec-images" title="5. Зураг" hint="Нүүр зураг жагсаалт, аяллын хуудасны дээд хэсэгт том харагдана.">
        <ImageField label="Нүүр зураг" value={tour.image} onChange={(v) => set("image", v)} error={errorFor("image")} hint="«Зураг оруулах» дарж утаснаасаа сонгоно эсвэл https:// холбоос буулгана." />
        <GalleryField value={tour.gallery} onChange={(v) => set("gallery", v)} />
      </Section>

      <Section id="sec-text" title="6. Тайлбар, үнэд юу багтсан" hint="Товч тайлбар картан дээр, бусад нь аяллын хуудсанд.">
        <Field label="Товч тайлбар" required wide error={errorFor("description")} hint={`1–2 өгүүлбэр. ${tour.description.length}/600`}>
          <textarea rows={2} value={tour.description} onChange={(e) => set("description", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Дэлгэрэнгүй тайлбар" required wide error={errorFor("story")}>
          <textarea rows={5} value={tour.story} onChange={(e) => set("story", e.target.value)} className={inputClass} />
        </Field>
        <LinesField label="Онцлох зүйлс" value={tour.highlights} onChange={(v) => set("highlights", v)} placeholder={"Далайн эргийн 5* буудал\nШууд нислэг"} />
        <LinesField label="Үнэд багтсан" value={tour.includes} onChange={(v) => set("includes", v)} placeholder={"Онгоцны тийз\nБуудал, өглөөний цай\nМонгол хөтөч"} />
        <LinesField label="Үнэд багтаагүй" value={tour.excludes} onChange={(v) => set("excludes", v)} placeholder={"Виз\nХувийн зардал"} />
        <LinesField label="Санамж" value={tour.notes ?? []} onChange={(v) => set("notes", v)} rows={3} />
      </Section>

      <div id="sec-itinerary" className="scroll-mt-24">
        <ItineraryEditor days={tour.itinerary} onChange={(v) => set("itinerary", v)} errorAt={(i) => (showErrors ? errors.some((e) => e.field === `day:${i}`) : false)} />
      </div>

      <Section title="8. Баримт бичиг" hint="Аялагч аппаараа хуулж өгөх ёстой баримтуудыг сонгоно.">
        {DOC_TYPES.map((d) => {
          const on = tour.documents?.includes(d.type) ?? false;
          return (
            <label key={d.type} className={`flex items-start gap-3 rounded-xl border p-3 text-sm transition ${on ? "border-accent bg-accent/[0.05]" : "border-[var(--line)]"}`}>
              <input
                type="checkbox"
                checked={on}
                onChange={(e) => set("documents", e.target.checked ? [...(tour.documents ?? []), d.type] : (tour.documents ?? []).filter((x) => x !== d.type))}
                className="mt-0.5 size-4 accent-[#0d8f84]"
              />
              <span>
                <span className="block font-semibold">{d.label}</span>
                <span className="block text-xs text-muted">{d.hint}</span>
              </span>
            </label>
          );
        })}
      </Section>

      {originalId ? (
        <section className="rounded-[1.5rem] border border-red-200 bg-red-50/50 p-4 sm:p-6">
          <h2 className="font-semibold text-red-800">Аялал устгах</h2>
          <p className="mt-1 text-xs text-red-800/80">Сайтаас бүрмөсөн алга болно. Зөвхөн дуусгах бол дээр төлөвийг «Дууссан» болгоход хангалттай.</p>
          <button type="button" onClick={remove} disabled={deleting} className="mt-3 h-11 rounded-full border border-red-300 bg-white px-5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60">
            {deleting ? "Устгаж байна…" : "Энэ аяллыг устгах"}
          </button>
        </section>
      ) : null}

      <SaveBar kind="tours" id={tour.id} originalId={originalId} dirty={JSON.stringify(tour) !== saved} onSave={save} />
    </div>
  );
}

function IssueList({ tone, title, items }: { tone: "error" | "warn"; title: string; items: TourIssue[] }) {
  const cls = tone === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-800";
  return (
    <div role={tone === "error" ? "alert" : undefined} className={`rounded-2xl border p-4 ${cls}`}>
      <p className="text-sm font-semibold">{title}</p>
      <ul className="mt-2 space-y-1 text-sm">
        {items.map((i, n) => (
          <li key={n}>
            <a href={`#sec-${i.section}`} className="underline-offset-2 hover:underline">
              • {i.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ItineraryEditor({ days, onChange, errorAt }: { days: ItineraryDay[]; onChange: (d: ItineraryDay[]) => void; errorAt: (i: number) => boolean }) {
  const update = (i: number, patch: Partial<ItineraryDay>) => onChange(days.map((d, j) => (j === i ? { ...d, ...patch } : d)));
  const move = (i: number, to: number) => {
    if (to < 0 || to >= days.length) return;
    const next = [...days];
    const [d] = next.splice(i, 1);
    next.splice(to, 0, d);
    onChange(next);
  };

  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-[var(--line)] bg-white shadow-[0_8px_24px_rgba(6,42,42,0.04)]">
      <header className="border-b border-[var(--line)] bg-[#f7faf9] px-4 py-4 sm:px-6">
        <h2 className="font-display text-[1.35rem] font-semibold leading-tight">7. Өдөр тутмын хөтөлбөр</h2>
        <p className="mt-1 text-xs text-muted">Заавал биш. Өдөр бүрт гарчиг, тайлбар бичнэ. Доор «Өдөр нэмэх» дар.</p>
      </header>
      <div className="p-4 sm:p-6">
        <div className="space-y-3">
          {days.map((d, i) => (
            <div key={i} className={`rounded-xl border bg-[#f8faf9] p-4 ${errorAt(i) ? "border-red-300" : "border-[var(--line)]"}`}>
              <div className="mb-3 flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-full bg-accent text-xs font-bold text-white">{i + 1}</span>
                {errorAt(i) ? <span className="text-xs font-medium text-red-600">Өдөр, гарчиг, тайлбар бөглөнө үү</span> : null}
                <div className="ml-auto flex gap-1">
                  <button type="button" aria-label="Дээш" onClick={() => move(i, i - 1)} disabled={i === 0} className="rounded-lg px-2.5 py-1.5 text-xs text-muted hover:bg-white disabled:opacity-25">▲</button>
                  <button type="button" aria-label="Доош" onClick={() => move(i, i + 1)} disabled={i === days.length - 1} className="rounded-lg px-2.5 py-1.5 text-xs text-muted hover:bg-white disabled:opacity-25">▼</button>
                  <button type="button" onClick={() => onChange(days.filter((_, j) => j !== i))} className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">Устгах</button>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-[8rem_1fr]">
                <input value={d.day} onChange={(e) => update(i, { day: e.target.value })} placeholder="1-р өдөр" className={inputClass} />
                <input value={d.title} onChange={(e) => update(i, { title: e.target.value })} placeholder="Гарчиг" className={inputClass} />
                <textarea rows={3} value={d.detail} onChange={(e) => update(i, { detail: e.target.value })} placeholder="Тайлбар" className={`${inputClass} sm:col-span-2`} />
                <div className="grid gap-3 sm:col-span-2 sm:grid-cols-2">
                  <input value={d.flight ?? ""} onChange={(e) => update(i, { flight: e.target.value })} placeholder="Нислэг (заавал биш)" className={inputClass} />
                  <input value={d.meals ?? ""} onChange={(e) => update(i, { meals: e.target.value })} placeholder="Хоол (заавал биш)" className={inputClass} />
                  <input value={d.hotel ?? ""} onChange={(e) => update(i, { hotel: e.target.value })} placeholder="Буудал (заавал биш)" className={inputClass} />
                  <input value={d.host ?? ""} onChange={(e) => update(i, { host: e.target.value })} placeholder="Хөтөч (заавал биш)" className={inputClass} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onChange([...days, { day: `${days.length + 1}-р өдөр`, title: "", detail: "" }])}
          className="mt-3 w-full rounded-xl border-2 border-dashed border-[var(--line)] py-3 text-sm font-semibold text-accent hover:border-accent"
        >
          + Өдөр нэмэх
        </button>
      </div>
    </section>
  );
}
