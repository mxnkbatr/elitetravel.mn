import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Field, Press, StateBlock, Stepper, Txt } from "../components/ui";
import { previewMode } from "../lib/config";
import { apiRequest, ApiError } from "../lib/api";
import { bookingCreated, bookingError, bookingPayload, type BookingDraft } from "../lib/booking-rules";
import { formatPrice } from "../lib/money";
import { quote } from "../lib/quote";
import { isBookable, tourDates } from "../lib/tours";
import type { TripStatus } from "../lib/types";
import { useCatalog } from "../state/catalog";
import { useDeviceBookings } from "../state/device-bookings";
import { useSession } from "../state/session";
import { fonts, useTheme } from "../theme";

type Created = { id: string; total: number; deposit: number; status?: string; token?: string };

export function BookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, fontsReady } = useTheme();
  const catalog = useCatalog();
  const session = useSession();
  const device = useDeviceBookings();
  const tour = catalog.tourById(typeof id === "string" ? id : "");
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<BookingDraft>({ adults: 2, kidsOwnBed: 0, kidsSharedBed: 0, singleRooms: 0, name: session.profile?.name ?? "", phone: session.profile?.phone ?? "", date: "", note: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<Created | null>(null);
  const dates = tour ? tourDates(tour) : [];
  const estimate = useMemo(() => (tour ? quote(tour, draft) : null), [tour, draft]);

  if (!tour) return <StateBlock title="Аялал олдсонгүй" action="Буцах" onAction={() => router.back()} />;
  if (!isBookable(tour)) return <StateBlock title="Энэ аялал захиалгад нээлттэй биш" action="Буцах" onAction={() => router.back()} />;

  async function submit() {
    if (!tour || !estimate) return;
    const problem = bookingError(tour, { ...draft, date: draft.date || dates[0] || "" });
    if (problem) {
      setError(problem);
      return;
    }
    if (previewMode) {
      setError("Урьдчилсан харагдац тул захиалгын хүсэлт илгээгдэхгүй.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await apiRequest({ path: "/api/bookings", json: bookingPayload(tour.id, { ...draft, date: draft.date || dates[0] || "" }) });
      const createdBooking = bookingCreated(res.body);
      if (!createdBooking) throw new Error("Сервер хүсэлтийн дугаар буцаасангүй.");
      setCreated(createdBooking);
      if (createdBooking.token) {
        await device.remember({ id: createdBooking.id, tourId: tour.id, tourTitle: tour.title, token: createdBooking.token, createdAt: new Date().toISOString(), total: createdBooking.total, deposit: createdBooking.deposit, date: draft.date || undefined, status: createdBooking.status as TripStatus | undefined });
        await session.claimTokens([createdBooking.token]).catch(() => {});
      }
    } catch (e) {
      setError(e instanceof ApiError || e instanceof Error ? e.message : "Илгээгдсэнгүй.");
    } finally {
      setBusy(false);
    }
  }

  if (created) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, padding: 22, paddingTop: insets.top + 24, gap: 12 }}>
        <Text style={{ color: colors.text, fontSize: 34, fontFamily: fontsReady ? fonts.display : undefined }}>Хүсэлт бүртгэгдлээ</Text>
        <Txt>Энэ бол төлбөр биш. Серверийн бүртгэсэн дүн:</Txt>
        <Text style={{ color: colors.accent, fontSize: 28, fontWeight: "700" }}>{formatPrice(created.total)}</Text>
        <Txt>Дугаар: {created.id}</Txt>
        {created.deposit ? <Txt>Урьдчилгаа: {formatPrice(created.deposit)}</Txt> : null}
        <Txt>Төлөв: {created.status === "waitlist" ? "Хүлээлэг" : "Шинэ хүсэлт"}</Txt>
        <Txt muted>Төлбөр хийгдээгүй. QPay нэхэмжлэхийг захиалга дотроос нээнэ.</Txt>
        {created.token ? (
          <Press label="Захиалга нээх" onPress={() => router.replace({ pathname: "/trip/[id]", params: { id: created.id } })} style={{ height: 52, borderRadius: 26, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: colors.onAccent, fontWeight: "700" }}>Захиалга нээх</Text>
          </Press>
        ) : (
          <Txt>Сервер нээх түлхүүр буцаасангүй. {created.id} дугаараар утсаар холбогдоно уу.</Txt>
        )}
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 20, paddingTop: insets.top + 16, gap: 12, paddingBottom: 40 }}>
      <Press label="Буцах" onPress={() => router.back()}><Text style={{ color: colors.accent }}>← Буцах</Text></Press>
      <Text style={{ color: colors.text, fontSize: 32, fontFamily: fontsReady ? fonts.display : undefined }}>{tour.title}</Text>
      <Txt muted>Урьдчилсан тооцоо. Эцсийн дүнг сервер баталгаажуулна. Илгээх нь төлбөр биш.</Txt>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {["Аялагчид", "Холбоо", "Баталгаа"].map((label, index) => (
          <Text key={label} style={{ color: index === step ? colors.accent : colors.muted, fontWeight: "700" }}>{index + 1}. {label}</Text>
        ))}
      </View>
      {step === 0 ? (
        <View>
          {dates.length ? (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
              {dates.map((date) => {
                const closed = catalog.seats[tour.id]?.[date]?.closed;
                const on = (draft.date || dates[0]) === date;
                return (
                  <Press key={date} label={date} disabled={closed} onPress={() => setDraft({ ...draft, date })} style={{ paddingHorizontal: 12, minHeight: 40, borderRadius: 16, justifyContent: "center", backgroundColor: on ? colors.accent : colors.card }}>
                    <Text style={{ color: on ? colors.onAccent : colors.text }}>{closed ? `${date} хаагдсан` : date}</Text>
                  </Press>
                );
              })}
            </View>
          ) : null}
          <Stepper label="Том хүн" value={draft.adults} min={1} onChange={(adults) => setDraft({ ...draft, adults })} />
          {tour.pricing?.childOwnBed !== false ? <Stepper label="Хүүхэд, тусдаа ор" hint="Насанд хүрэгчийн үнэ" value={draft.kidsOwnBed} onChange={(kidsOwnBed) => setDraft({ ...draft, kidsOwnBed })} /> : null}
          {tour.pricing?.childSharedBed ? <Stepper label="Хүүхэд, хамт унтах" hint={tour.pricing.child} value={draft.kidsSharedBed} onChange={(kidsSharedBed) => setDraft({ ...draft, kidsSharedBed })} /> : null}
          {tour.pricing?.singleSupplement ? <Stepper label="Ганцаараа өрөө" value={draft.singleRooms} max={draft.adults} onChange={(singleRooms) => setDraft({ ...draft, singleRooms })} /> : null}
        </View>
      ) : null}
      {step === 1 ? (
        <View style={{ gap: 12 }}>
          <Field label="Нэр" value={draft.name} onChangeText={(name) => setDraft({ ...draft, name })} />
          <Field label="Утас" value={draft.phone} onChangeText={(phone) => setDraft({ ...draft, phone })} keyboard="phone-pad" />
          <Field label="Тэмдэглэл" value={draft.note} onChangeText={(note) => setDraft({ ...draft, note })} multiline />
        </View>
      ) : null}
      {step === 2 && estimate ? (
        <View style={{ backgroundColor: colors.card, borderRadius: 20, padding: 16, gap: 6 }}>
          {estimate.lines.map((line) => (
            <Text key={line.label} style={{ color: colors.text }}>{line.label}</Text>
          ))}
          <Text style={{ color: colors.accent, fontSize: 24, fontWeight: "700", marginTop: 8 }}>Урьдчилсан {formatPrice(estimate.total)}</Text>
          {estimate.deposit ? <Txt>Урьдчилгаа ойролцоогоор {formatPrice(estimate.deposit)}</Txt> : null}
          <Txt muted>Сервер үнийг дахин бодно. Төлбөр энэ алхам дээр хийгдэхгүй.</Txt>
        </View>
      ) : null}
      {error ? <Text style={{ color: colors.danger }}>{error}</Text> : null}
      <View style={{ flexDirection: "row", gap: 10 }}>
        {step > 0 ? (
          <Press label="Өмнөх" onPress={() => setStep(step - 1)} style={{ flex: 1, height: 52, borderRadius: 26, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: colors.text }}>Өмнөх</Text>
          </Press>
        ) : null}
        <Press label={step === 2 ? "Хүсэлт илгээх" : "Үргэлжлүүлэх"} disabled={busy} onPress={() => (step < 2 ? setStep(step + 1) : void submit())} style={{ flex: 1, height: 52, borderRadius: 26, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: colors.onAccent, fontWeight: "700" }}>{busy ? "Илгээж байна…" : step === 2 ? "Хүсэлт илгээх" : "Үргэлжлүүлэх"}</Text>
        </Press>
      </View>
    </ScrollView>
  );
}
