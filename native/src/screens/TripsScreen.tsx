import { useRouter } from "expo-router";
import { useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cardShadow, Press, RemoteImage, ScreenScrollSpacer, StateBlock } from "../components/ui";
import { COAST_PLATE } from "../lib/config";
import { STATUS_LABEL } from "../lib/labels";
import { formatPrice } from "../lib/money";
import { useCatalog } from "../state/catalog";
import { useDeviceBookings } from "../state/device-bookings";
import { fonts, useTheme } from "../theme";

export function TripsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, fontsReady } = useTheme();
  const catalog = useCatalog();
  const device = useDeviceBookings();

  const tokenKey = device.bookings.map((item) => item.token ?? "").join(",");
  useEffect(() => {
    void device.refresh().catch(() => {});
  }, [tokenKey, device.refresh]);

  if (!device.ready) return <StateBlock busy title="Захиалгыг шалгаж байна" />;

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingHorizontal: 18 }}
      data={device.bookings}
      keyExtractor={(item) => item.id}
      onRefresh={() => void device.refresh().catch(() => {})}
      refreshing={false}
      ListHeaderComponent={
        <View style={{ marginBottom: 8 }}>
          <Text style={{ color: colors.muted, letterSpacing: 2, fontSize: 11, fontWeight: "700" }}>TRIPS</Text>
          <Text style={{ color: colors.text, fontSize: 44, lineHeight: 46, fontFamily: fontsReady ? fonts.display : undefined }}>Захиалга</Text>
        </View>
      }
      ListEmptyComponent={
        <View style={[{ marginTop: 12, borderRadius: 28, overflow: "hidden", backgroundColor: colors.card }, cardShadow]}>
          <RemoteImage uri={catalog.tours[0]?.image || COAST_PLATE} width={900} height={600} alt="" style={{ width: "100%", height: 180 }} />
          <View style={{ padding: 18 }}>
            <Text style={{ color: colors.text, fontSize: 26, fontFamily: fontsReady ? fonts.display : undefined }}>Одоогоор хоосон</Text>
            <Text style={{ color: colors.muted, marginTop: 8, lineHeight: 22 }}>Энэ төхөөрөмж дээр захиалга алга. Аяллаа сонгоод хүсэлт илгээнэ үү.</Text>
          </View>
        </View>
      }
      renderItem={({ item }) => {
        const tour = catalog.tourById(item.tourId);
        return (
          <Press label={item.id} disabled={!item.token} onPress={() => item.token && router.push({ pathname: "/trip/[id]", params: { id: item.id } })} style={[{ backgroundColor: colors.card, borderRadius: 24, marginBottom: 12, overflow: "hidden" }, cardShadow]}>
            {tour?.image ? <RemoteImage uri={tour.image} width={800} height={400} alt="" style={{ width: "100%", height: 120 }} /> : null}
            <View style={{ padding: 16 }}>
            <Text style={{ color: colors.text, fontSize: 22, fontFamily: fontsReady ? fonts.display : undefined }}>{tour?.title ?? item.tourTitle}</Text>
            <Text style={{ color: colors.muted, marginTop: 4 }}>{item.id}{item.date ? ` · ${item.date}` : ""}</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
              <Text style={{ color: colors.accent, fontWeight: "700" }}>{formatPrice(item.total)}</Text>
              <Text style={{ color: colors.text }}>{item.status ? STATUS_LABEL[item.status] : "Нээх түлхүүртэй"}{item.unread ? ` · ${item.unread} шинэ` : ""}</Text>
            </View>
            {!item.token ? <Text style={{ color: colors.muted, marginTop: 6 }}>Нээх түлхүүр алга.</Text> : null}
            </View>
          </Press>
        );
      }}
      ListFooterComponent={
        <View>
          <Press label="Аялал үзэх" onPress={() => router.push("/tours")} style={{ marginTop: 8 }}>
            <Text style={{ color: colors.accent, fontWeight: "700" }}>Аялал үзэх</Text>
          </Press>
          <ScreenScrollSpacer />
        </View>
      }
    />
  );
}
