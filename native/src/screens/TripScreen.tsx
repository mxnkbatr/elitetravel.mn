import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useState } from "react";
import { Alert, Image, Linking, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Field, Press, StateBlock, Txt } from "../components/ui";
import { previewMode } from "../lib/config";
import { apiRequest, ApiError } from "../lib/api";
import { DOC_LABEL, DOC_STATUS, STATUS_LABEL } from "../lib/labels";
import { formatPrice } from "../lib/money";
import { payNotice, payNoticeText, paymentLinkKind, QPAY_PATH } from "../lib/payments";
import type { PayKind, Trip } from "../lib/types";
import { useDeviceBookings } from "../state/device-bookings";
import { fonts, useTheme } from "../theme";

function isTrip(value: unknown): value is Trip {
  return !!value && typeof value === "object" && "id" in value && "status" in value && "messages" in value;
}

export function TripScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, fontsReady } = useTheme();
  const device = useDeviceBookings();
  const booking = device.bookings.find((item) => item.id === id);
  const token = booking?.token;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [passengers, setPassengers] = useState("");
  const [consent, setConsent] = useState(false);
  const [careName, setCareName] = useState("");
  const [carePhone, setCarePhone] = useState("");

  const load = useCallback(async () => {
    if (!token || previewMode) return;
    const res = await apiRequest({ path: "/api/trip", method: "GET", headers: { "x-trip-token": token } });
    if (!isTrip(res.body)) throw new Error("Захиалга уншигдсангүй.");
    setTrip(res.body);
    setError(null);
  }, [token]);

  useEffect(() => {
    void load().catch((e: unknown) => setError(e instanceof Error ? e.message : "Нээгдсэнгүй."));
  }, [load]);

  async function act(body: Record<string, unknown>) {
    if (!token) return;
    setBusy(true);
    try {
      const res = await apiRequest({ path: "/api/trip", json: body, headers: { "x-trip-token": token } });
      if (!isTrip(res.body)) throw new Error("Хариу буруу байна.");
      setTrip(res.body);
      setError(null);
    } catch (e) {
      setError(e instanceof ApiError || e instanceof Error ? e.message : "Болсонгүй.");
    } finally {
      setBusy(false);
    }
  }

  async function refreshStatus() {
    if (!token || !trip) return;
    const before = trip.paidAmount;
    setBusy(true);
    try {
      const next = await apiRequest({ path: QPAY_PATH.status, headers: { "x-trip-token": token } });
      if (!isTrip(next.body)) throw new Error("Төлөв уншигдсангүй.");
      setTrip(next.body);
      setNotice(payNoticeText(payNotice({ qpay: next.body.qpay, invoiceMock: next.body.invoice?.mock, status: next.body.status, paidAmount: next.body.paidAmount, previousPaid: before })));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Шалгаж чадсангүй.");
    } finally {
      setBusy(false);
    }
  }

  async function pay(kind: PayKind) {
    if (!token || !trip) return;
    const before = trip.paidAmount;
    setBusy(true);
    try {
      const res = await apiRequest({ path: QPAY_PATH.create, json: { kind }, headers: { "x-trip-token": token } });
      const invoice = res.body as { mock?: boolean };
      const next = await apiRequest({ path: QPAY_PATH.status, headers: { "x-trip-token": token } });
      if (!isTrip(next.body)) throw new Error("Төлөв уншигдсангүй.");
      setTrip(next.body);
      setNotice(payNoticeText(payNotice({ qpay: next.body.qpay, invoiceMock: invoice.mock === true || next.body.invoice?.mock === true, status: next.body.status, paidAmount: next.body.paidAmount, previousPaid: before })));
    } catch (e) {
      setError(e instanceof ApiError || e instanceof Error ? e.message : "Нэхэмжлэх нээгдсэнгүй.");
    } finally {
      setBusy(false);
    }
  }

  async function upload(type: string, slot: number) {
    if (!token) return;
    const picked = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.8 });
    if (picked.canceled || !picked.assets[0]) return;
    const asset = picked.assets[0];
    if (asset.fileSize && asset.fileSize > 4 * 1024 * 1024) {
      setError("Файл 4MB-аас их байна.");
      return;
    }
    const form = new FormData();
    form.append("type", type);
    form.append("slot", String(slot));
    form.append("file", { uri: asset.uri, name: asset.fileName ?? "photo.jpg", type: asset.mimeType ?? "image/jpeg" } as unknown as Blob);
    setBusy(true);
    try {
      const res = await apiRequest({ path: "/api/trip/documents", form, headers: { "x-trip-token": token } });
      if (isTrip(res.body)) setTrip(res.body);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Хуулж чадсангүй.");
    } finally {
      setBusy(false);
    }
  }

  if (previewMode) return <StateBlock title="Урьдчилсан харагдац" body="Жинхэнэ захиалга энэ горимд нээгдэхгүй." action="Буцах" onAction={() => router.back()} />;
  if (!token) return <StateBlock title="Нээх түлхүүр алга" body="Энэ захиалгын access token энэ төхөөрөмж дээр хадгалагдаагүй." action="Буцах" onAction={() => router.back()} />;
  if (!trip && !error) return <StateBlock busy title="Захиалгыг нээж байна" />;
  if (!trip) return <StateBlock title="Нээгдсэнгүй" body={error ?? undefined} action="Дахин" onAction={() => void load().catch((e: unknown) => setError(e instanceof Error ? e.message : "Нээгдсэнгүй."))} />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 18, paddingTop: insets.top + 12, paddingBottom: 40, gap: 14 }}>
      <Press label="Буцах" onPress={() => router.back()}><Text style={{ color: colors.accent }}>← Буцах</Text></Press>
      <Text style={{ color: colors.text, fontSize: 32, fontFamily: fontsReady ? fonts.display : undefined }}>{trip.tourTitle}</Text>
      <Txt>{trip.id} · {STATUS_LABEL[trip.status]}{trip.travelDate ? ` · ${trip.travelDate}` : ""}</Txt>
      <Txt>Төлсөн {formatPrice(trip.paidAmount)} / {formatPrice(trip.total)}</Txt>
      {notice ? <Text style={{ color: colors.text }}>{notice}</Text> : null}
      {error ? <Text style={{ color: colors.danger }}>{error}</Text> : null}

      <View style={{ backgroundColor: colors.card, borderRadius: 20, padding: 14, gap: 8 }}>
        <Text style={{ color: colors.text, fontSize: 22, fontFamily: fontsReady ? fonts.display : undefined }}>Төлбөр</Text>
        {trip.qpay === "off" ? <Txt>{payNoticeText("off")}</Txt> : null}
        {trip.payOptions.map((option) => (
          <Press key={option.kind} label={option.label} disabled={busy} onPress={() => Alert.alert(option.label, `${formatPrice(option.amount)} QPay нэхэмжлэх нээх үү? Төлбөр дууссан эсэхийг сервер баталгаажуулна.`, [{ text: "Болих", style: "cancel" }, { text: "Нээх", onPress: () => void pay(option.kind) }])} style={{ minHeight: 48, borderRadius: 16, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: colors.onAccent, fontWeight: "700" }}>{option.label} · {formatPrice(option.amount)}</Text>
          </Press>
        ))}
        {trip.invoice?.qrImage ? <Image source={{ uri: trip.invoice.qrImage }} style={{ width: 220, height: 220, alignSelf: "center" }} accessibilityLabel="QPay QR" /> : null}
        {trip.invoice?.mock ? <Txt>{payNoticeText("mock")}</Txt> : null}
        {trip.invoice?.urls.map((url) => {
          const kind = paymentLinkKind(url.link);
          if (kind === "reject") return <Txt key={url.link}>{url.name}: холбоос нээгдэхгүй.</Txt>;
          return (
            <Press key={url.link} label={url.name} onPress={() => void (kind === "browser" ? WebBrowser.openBrowserAsync(url.link) : Linking.openURL(url.link))}>
              <Text style={{ color: colors.accent, fontWeight: "700" }}>{url.name}</Text>
            </Press>
          );
        })}
        <Press label="Төлбөр шалгах" onPress={() => void refreshStatus()} disabled={busy}>
          <Text style={{ color: colors.accent }}>Серверээс төлөв шалгах</Text>
        </Press>
        {trip.installments.map((provider) => (
          <Press key={provider.id} label={provider.name} onPress={() => Alert.alert(provider.name, "Хуваан төлөх хүсэлт илгээх үү? Төлбөр шууд хийгдэхгүй.", [{ text: "Болих", style: "cancel" }, { text: "Илгээх", onPress: () => void act({ action: "installment", provider: provider.id, kind: trip.payOptions[0]?.kind ?? "full", phone: trip ? undefined : undefined }) }])}>
            <Text style={{ color: colors.text }}>{provider.name}-ээр хүсэлт</Text>
          </Press>
        ))}
        {trip.installment ? <Txt>Хүсэлт: {trip.installment.provider} · {formatPrice(trip.installment.amount)} · {trip.installment.sent ? "нэхэмжлэх илгээгдсэн" : "хүлээгдэж байна"}</Txt> : null}
      </View>

      <View style={{ backgroundColor: colors.card, borderRadius: 20, padding: 14, gap: 8 }}>
        <Text style={{ color: colors.text, fontSize: 22, fontFamily: fontsReady ? fonts.display : undefined }}>Мессеж</Text>
        {trip.messages.map((item) => (
          <View key={item.id}>
            <Text style={{ color: colors.muted, fontSize: 12 }}>{item.sender === "traveller" ? "Та" : item.sender === "staff" ? "Elite Travel" : "Мэдэгдэл"}</Text>
            <Txt>{item.body}</Txt>
          </View>
        ))}
        <TextInput value={message} onChangeText={setMessage} placeholder="Асуух зүйлээ бичнэ үү" placeholderTextColor={colors.muted} style={{ minHeight: 48, color: colors.text }} accessibilityLabel="Мессеж" />
        <Press label="Илгээх" disabled={busy} onPress={() => { const text = message.trim(); if (!text) return; setMessage(""); void act({ action: "message", body: text }); }} style={{ height: 44, borderRadius: 16, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: colors.onAccent, fontWeight: "700" }}>Илгээх</Text>
        </Press>
      </View>

      <View style={{ backgroundColor: colors.card, borderRadius: 20, padding: 14, gap: 8 }}>
        <Text style={{ color: colors.text, fontSize: 22, fontFamily: fontsReady ? fonts.display : undefined }}>Зорчигч</Text>
        {!trip.passportStorage ? <Txt>Паспортын мэдээлэл хадгалах тохиргоо сервер дээр хийгдээгүй байна.</Txt> : null}
        {trip.passengers.map((person, index) => <Txt key={`${person.passport ?? index}`}>{person.name || "Нэргүй"} · {person.passport ?? ""}</Txt>)}
        {trip.passportStorage ? (
          <>
            <Field label="Нэр, латин" value={passengers} onChangeText={setPassengers} placeholder="SURNAME GIVEN" />
            <Press label="Зөвшөөрөл" onPress={() => setConsent(!consent)} style={{ minHeight: 44, justifyContent: "center" }}>
              <Text style={{ color: colors.text }}>{consent ? "☑" : "☐"} Паспортын мэдээллээ ашиглуулахыг зөвшөөрч байна</Text>
            </Press>
            <Press label="Хадгалах" disabled={busy} onPress={() => void act({ action: "passengers", consent, passengers: [{ name: passengers }] })} style={{ height: 44, borderRadius: 16, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: colors.text, fontWeight: "700" }}>Хадгалах</Text>
            </Press>
          </>
        ) : null}
      </View>

      {trip.documents.length ? (
        <View style={{ backgroundColor: colors.card, borderRadius: 20, padding: 14, gap: 8 }}>
          <Text style={{ color: colors.text, fontSize: 22, fontFamily: fontsReady ? fonts.display : undefined }}>Баримт</Text>
          {trip.documents.map((doc) => (
            <View key={`${doc.type}-${doc.slot}`}>
              <Txt>{DOC_LABEL[doc.type] ?? doc.type} {doc.label} · {doc.status ? DOC_STATUS[doc.status] ?? doc.status : "Оруулаагүй"}</Txt>
              {doc.note ? <Txt muted>{doc.note}</Txt> : null}
              {trip.passportStorage ? <Press label="Зураг сонгох" onPress={() => void upload(doc.type, doc.slot)}><Text style={{ color: colors.accent }}>Зураг сонгох</Text></Press> : null}
            </View>
          ))}
          <Txt muted>PDF энэ хувилбарт сонгогдохгүй. JPG, PNG илгээнэ.</Txt>
        </View>
      ) : null}

      <View style={{ backgroundColor: colors.card, borderRadius: 20, padding: 14, gap: 8 }}>
        <Text style={{ color: colors.text, fontSize: 22, fontFamily: fontsReady ? fonts.display : undefined }}>Яаралтай холбоо</Text>
        {trip.passportStorage ? (
          <>
            <Field label="Нэр" value={careName} onChangeText={setCareName} />
            <Field label="Утас" value={carePhone} onChangeText={setCarePhone} keyboard="phone-pad" />
            <Press label="Хадгалах" onPress={() => void act({ action: "care", care: { emergencyName: careName, emergencyPhone: carePhone } })}><Text style={{ color: colors.accent, fontWeight: "700" }}>Хадгалах</Text></Press>
          </>
        ) : <Txt muted>Хадгалах тохиргоо хийгдээгүй.</Txt>}
      </View>

      <View style={{ backgroundColor: colors.card, borderRadius: 20, padding: 14, gap: 8 }}>
        <Text style={{ color: colors.text, fontSize: 22, fontFamily: fontsReady ? fonts.display : undefined }}>Гэрээ</Text>
        {trip.contract.state === "unavailable" ? <Txt>Гэрээ хараахан бэлэн биш.</Txt> : null}
        {trip.contract.state === "signed" ? <Txt>Гарын үсэг зурсан: {trip.contract.name}</Txt> : null}
        {trip.contract.state !== "unavailable" ? <Txt>{trip.contract.body.slice(0, 1200)}</Txt> : null}
        {trip.contract.state === "unsigned" ? <Txt muted>Гарын үсгийг апп дотор зурах боломж энэ хувилбарт алга. Гэрээний текст серверээс харагдана. Хуурамч гарын үсэг илгээхгүй.</Txt> : null}
      </View>
    </ScrollView>
  );
}
