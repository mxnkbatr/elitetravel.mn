import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cardShadow, Press, RemoteImage, ScreenScrollSpacer, StateBlock, Txt } from "../components/ui";
import { STATUS_LABEL } from "../lib/labels";
import { formatPrice } from "../lib/money";
import { isBookable } from "../lib/tours";
import { useCatalog } from "../state/catalog";
import { useDeviceBookings } from "../state/device-bookings";
import { useSession } from "../state/session";
import { fonts, useTheme } from "../theme";

type Tab = "requests" | "saved";

export function TripsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, fontsReady } = useTheme();
  const catalog = useCatalog();
  const device = useDeviceBookings();
  const session = useSession();
  const [tab, setTab] = useState<Tab>("requests");
  const [refreshError, setRefreshError] = useState<string | null>(null);

  const tokenKey = device.bookings.map((item) => item.token ?? "").join(",");
  useEffect(() => {
    if (session.status === "loading") return;
    void device.refresh().then(() => setRefreshError(null)).catch((error: unknown) => {
      setRefreshError(error instanceof Error ? error.message : "Хүсэлтүүдийг шалгаж чадсангүй.");
    });
  }, [tokenKey, device.refresh, session.status]);

  const savedTours = session.saved.map((id) => catalog.tourById(id)).filter((tour) => tour != null);
  const unresolvedSaved = Math.max(0, session.saved.length - savedTours.length);
  const ideas = catalog.tours.filter((tour) => isBookable(tour) && !session.saved.includes(tour.id)).slice(0, 4);
  const loading = session.status === "loading" || !device.ready;
  const requestsUnknown = !loading && device.bookings.length === 0 && (session.status === "offline" || refreshError != null);

  if (loading) return <StateBlock busy title="Хүсэлтийг шалгаж байна" />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingTop: insets.top + 12, paddingHorizontal: 18 }}>
      <Text style={{ color: colors.text, fontSize: 34, lineHeight: 36, fontFamily: fontsReady ? fonts.display : undefined }}>Миний аялал</Text>
      <Text style={{ color: colors.muted, marginTop: 4 }}>Хүсэлт болон хадгалсан аяллууд</Text>
      <View style={{ flexDirection: "row", backgroundColor: "rgba(10,42,38,0.06)", borderRadius: 16, padding: 4, marginTop: 16 }}>
        {(
          [
            ["requests", "Хүсэлтүүд", device.bookings.length],
            ["saved", "Хадгалсан", savedTours.length],
          ] as const
        ).map(([key, label, count]) => {
          const on = tab === key;
          return (
            <Press key={key} label={`${label} ${count}`} onPress={() => setTab(key)} style={{ flex: 1, minHeight: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: on ? colors.card : "transparent" }}>
              <Text style={{ color: on ? colors.text : colors.muted, fontWeight: "700" }}>{label} {count}</Text>
            </Press>
          );
        })}
      </View>

      {tab === "requests" ? (
        <View style={{ marginTop: 16 }}>
          {requestsUnknown ? (
            <View style={[{ backgroundColor: colors.card, borderRadius: 24, padding: 18 }, cardShadow]}>
              <Text style={{ color: colors.text, fontSize: 22, fontFamily: fontsReady ? fonts.display : undefined }}>Хүсэлтийг шалгаж чадсангүй</Text>
              <Txt muted style={{ marginTop: 8 }}>{refreshError ?? "Сүлжээгүй тул хоосон жагсаалт гэж харуулахгүй."}</Txt>
              {session.status === "guest" ? <Txt muted style={{ marginTop: 8 }}>Нэвтрээгүй үед зөвхөн энэ төхөөрөмжийн хүсэлт харагдана.</Txt> : null}
              <Press label="Дахин шалгах" onPress={() => { setRefreshError(null); void device.refresh().catch((error: unknown) => setRefreshError(error instanceof Error ? error.message : "Хүсэлтийг шалгаж чадсангүй.")); }} style={{ marginTop: 14, alignSelf: "flex-start" }}>
                <Text style={{ color: colors.accent, fontWeight: "700" }}>Дахин шалгах</Text>
              </Press>
            </View>
          ) : device.bookings.length === 0 ? (
            <View style={[{ alignItems: "center", backgroundColor: colors.card, borderRadius: 28, paddingHorizontal: 22, paddingVertical: 28 }, cardShadow]}>
              <View style={{ width: 64, height: 64, borderRadius: 18, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="ticket-outline" size={28} color="#ffffff" />
              </View>
              <Text style={{ color: colors.text, fontSize: 22, textAlign: "center", marginTop: 16, fontFamily: fontsReady ? fonts.display : undefined }}>Анхны аяллаа сонгох уу?</Text>
              <Txt muted style={{ textAlign: "center", marginTop: 8 }}>Таалагдсан аялал дээрээ «Захиалах» дараад хэдхэн алхмаар хүсэлтээ илгээгээрэй.</Txt>
              {session.status === "guest" ? <Txt muted style={{ textAlign: "center", marginTop: 8 }}>Энэ хоосон жагсаалт бүртгэлийн бүх захиалга биш. Нэвтрэхэд бүртгэлийн хүсэлт нэмэгдэнэ.</Txt> : null}
              <Press label="Аялал сонгох" onPress={() => router.push("/")} style={{ marginTop: 16, height: 48, paddingHorizontal: 22, borderRadius: 24, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: colors.onAccent, fontWeight: "700" }}>Аялал сонгох →</Text>
              </Press>
            </View>
          ) : (
            device.bookings.map((item) => {
              const tour = catalog.tourById(item.tourId);
              return (
                <Press key={item.id} label={item.id} disabled={!item.token} onPress={() => item.token && router.push({ pathname: "/trip/[id]", params: { id: item.id } })} style={[{ backgroundColor: colors.card, borderRadius: 22, marginBottom: 12, overflow: "hidden" }, cardShadow]}>
                  {tour?.image ? <RemoteImage uri={tour.image} width={800} height={360} alt="" style={{ width: "100%", height: 110 }} /> : null}
                  <View style={{ padding: 14 }}>
                    <Text style={{ color: colors.text, fontSize: 20, fontFamily: fontsReady ? fonts.display : undefined }}>{tour?.title ?? item.tourTitle}</Text>
                    <Text style={{ color: colors.muted, marginTop: 4 }}>{item.id}{item.date ? ` · ${item.date}` : ""}</Text>
                    <Text style={{ color: colors.accent, fontWeight: "700", marginTop: 6 }}>{formatPrice(item.total)} · {item.status ? STATUS_LABEL[item.status] : "Нээх"}</Text>
                  </View>
                </Press>
              );
            })
          )}
        </View>
      ) : (
        <View style={{ marginTop: 16 }}>
          <Txt muted>{session.status === "user" ? "Нэвтэрсэн үед хадгалсан жагсаалт бүртгэл рүү хуулагдана." : "Одоогоор зөвхөн энэ төхөөрөмж дээр. Нэвтэрвэл бүртгэл рүү хуулна."}</Txt>
          {unresolvedSaved > 0 ? <Txt muted style={{ marginTop: 6 }}>{unresolvedSaved} хадгалсан аяллыг энэ жагсаалтаас олсонгүй.</Txt> : null}
          {savedTours.length === 0 ? (
            <View style={[{ marginTop: 12, backgroundColor: colors.card, borderRadius: 24, padding: 18 }, cardShadow]}>
              <Text style={{ color: colors.text, fontSize: 22, fontFamily: fontsReady ? fonts.display : undefined }}>Хадгалсан аялал алга</Text>
              <Txt muted style={{ marginTop: 8 }}>Аяллын дэлгэрэнгүй дээрх зүрх хадгална. Энэ тоо серверийн захиалга биш.</Txt>
            </View>
          ) : (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
              {savedTours.map((tour) => (
                <Press key={tour.id} label={tour.title} onPress={() => router.push({ pathname: "/tour/[id]", params: { id: tour.id } })} style={{ width: "48%", height: 210, borderRadius: 18, overflow: "hidden" }}>
                  <RemoteImage uri={tour.image} width={500} height={700} alt={tour.title} style={{ width: "100%", height: "100%" }} />
                  <View style={{ position: "absolute", left: 8, right: 8, bottom: 8 }}>
                    <Text style={{ color: "white", fontWeight: "700" }} numberOfLines={2}>{tour.title}</Text>
                    <Text style={{ color: "#f3d199", marginTop: 2 }}>{formatPrice(tour.price)}</Text>
                  </View>
                </Press>
              ))}
            </View>
          )}
        </View>
      )}

      {ideas.length ? (
        <View style={{ marginTop: 28 }}>
          <Text style={{ color: colors.text, fontSize: 26, fontFamily: fontsReady ? fonts.display : undefined }}>Танд таалагдаж магадгүй</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingTop: 12 }}>
            {ideas.map((tour) => (
              <Press key={tour.id} label={tour.title} onPress={() => router.push({ pathname: "/tour/[id]", params: { id: tour.id } })} style={{ width: 200 }}>
                <RemoteImage uri={tour.image} width={600} height={450} alt={tour.title} style={{ width: 200, height: 140, borderRadius: 18 }} />
                <Text style={{ color: colors.text, fontWeight: "700", marginTop: 8 }} numberOfLines={1}>{tour.title}</Text>
                <Text style={{ color: colors.accent, fontWeight: "700" }}>{formatPrice(tour.price)}</Text>
              </Press>
            ))}
          </ScrollView>
        </View>
      ) : null}
      <ScreenScrollSpacer />
    </ScrollView>
  );
}
