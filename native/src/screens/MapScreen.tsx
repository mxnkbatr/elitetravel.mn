import { useMemo, useState } from "react";
import { Linking, Platform, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeMap } from "../components/NativeMap";
import { Press, ScreenScrollSpacer, Txt } from "../components/ui";
import { appleMapsDirectionsUrl, pinsForDestinationKeys, PUBLISHED_PINS, type MapPin } from "../lib/map-pins";
import { isBookable } from "../lib/tours";
import { useCatalog } from "../state/catalog";
import { fonts, useTheme } from "../theme";
import { useRouter } from "expo-router";

export function MapScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, fontsReady } = useTheme();
  const catalog = useCatalog();
  const [selected, setSelected] = useState<string | null>(null);
  const keys = useMemo(() => {
    const fromTours = catalog.tours.map((tour) => tour.destinationKey).filter((key): key is string => !!key);
    const known = pinsForDestinationKeys(fromTours.length ? fromTours : PUBLISHED_PINS.map((pin) => pin.key));
    return known;
  }, [catalog.tours]);
  const active = selected ? keys.filter((pin) => pin.key === selected) : keys;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: 8 }}>
        <Text style={{ color: colors.text, fontSize: 28, fontFamily: fontsReady ? fonts.display : undefined }}>Газрын зураг</Text>
        <Txt muted>Цэгүүд вэб газрын зураг дээрх нийтлэгдсэн координат. Сервер байршил илгээдэггүй.</Txt>
      </View>
      {Platform.OS === "web" ? (
        <View style={{ marginHorizontal: 20, marginBottom: 8, borderRadius: 16, backgroundColor: colors.card, padding: 12 }}>
          <Txt>Энэ харагдац дээр интерактив газрын зураг алга. iOS дээр Apple Maps, Android дээр Google Maps (түлхүүргүй бол зураг хоосон байж болно).</Txt>
        </View>
      ) : (
        <View style={{ height: 280, marginHorizontal: 16, borderRadius: 20, overflow: "hidden" }}>
          <NativeMap pins={keys} onSelect={setSelected} />
        </View>
      )}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12 }}>
        {active.length === 0 ? <Txt>Газрын зургийн цэг алга.</Txt> : null}
        {active.map((pin) => (
          <PinRow key={pin.key} pin={pin} colors={colors} fontsReady={fontsReady} onOpen={() => router.push("/")} onDirections={() => void Linking.openURL(appleMapsDirectionsUrl(pin))} tours={catalog.tours.filter((tour) => tour.destinationKey === pin.key && isBookable(tour)).length} />
        ))}
        <ScreenScrollSpacer />
      </ScrollView>
    </View>
  );
}

function PinRow({ pin, tours, onOpen, onDirections, colors, fontsReady }: { pin: MapPin; tours: number; onOpen: () => void; onDirections: () => void; colors: { card: string; text: string; muted: string; accent: string }; fontsReady: boolean }) {
  return (
    <View style={{ backgroundColor: colors.card, borderRadius: 18, padding: 14, marginBottom: 10 }}>
      <Text style={{ color: colors.text, fontSize: 22, fontFamily: fontsReady ? fonts.display : undefined }}>{pin.name}</Text>
      <Text style={{ color: colors.muted, marginTop: 2 }}>{pin.latitude.toFixed(3)}, {pin.longitude.toFixed(3)} · {tours ? `${tours} аялал` : "Удахгүй"}</Text>
      <View style={{ flexDirection: "row", gap: 16, marginTop: 8 }}>
        <Press label={`${pin.name} аялал`} onPress={onOpen}><Text style={{ color: colors.accent, fontWeight: "700" }}>Аялал</Text></Press>
        <Press label={`${pin.name} чиглэл`} onPress={onDirections}><Text style={{ color: colors.accent, fontWeight: "700" }}>Apple Maps</Text></Press>
      </View>
    </View>
  );
}
