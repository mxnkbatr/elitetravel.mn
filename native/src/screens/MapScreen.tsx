import { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { NativeMap } from "../components/NativeMap";
import { Press, Txt } from "../components/ui";
import { MAP_DESTINATIONS, stepDestination } from "../lib/map-pins";
import { formatPrice } from "../lib/money";
import { isBookable } from "../lib/tours";
import { useCatalog } from "../state/catalog";
import { fonts, useTheme } from "../theme";

export function MapScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, fontsReady } = useTheme();
  const catalog = useCatalog();
  const [index, setIndex] = useState(0);
  const [cardOpen, setCardOpen] = useState(true);
  const [listOpen, setListOpen] = useState(false);
  const [mapFailed, setMapFailed] = useState(false);
  const dest = MAP_DESTINATIONS[index];
  const tours = useMemo(
    () => catalog.tours.filter((tour) => tour.destinationKey === dest.key && isBookable(tour)),
    [catalog.tours, dest.key],
  );
  const from = tours.reduce<number | null>((lowest, tour) => (tour.price != null && (lowest == null || tour.price < lowest) ? tour.price : lowest), null);
  const openCount = catalog.tours.filter(isBookable).length;

  function go(step: number) {
    setIndex((current) => stepDestination(current, step));
    setCardOpen(true);
  }

  function select(key: string) {
    const next = MAP_DESTINATIONS.findIndex((item) => item.key === key);
    if (next < 0) return;
    setIndex(next);
    setCardOpen(true);
  }

  function openTours() {
    if (tours.length === 1) router.push({ pathname: "/tour/[id]", params: { id: tours[0].id } });
    else if (tours.length > 1) setListOpen(true);
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#dfeee9" }}>
      {mapFailed ? <FallbackList /> : <NativeMap active={dest.key} onSelect={select} onUnavailable={() => setMapFailed(true)} />}

      <View pointerEvents="box-none" style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}>
        <View pointerEvents="box-none" style={{ paddingTop: insets.top + 8, paddingHorizontal: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={{ backgroundColor: colors.card, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 }}>
            <Text style={{ color: colors.text, fontFamily: fontsReady ? fonts.sansSemi : undefined }}>{openCount} аялал нээлттэй</Text>
          </View>
          <Press label="Жагсаалт" onPress={() => setListOpen(true)} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.card, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: colors.text, fontSize: 18 }}>☰</Text>
          </Press>
        </View>

        <View pointerEvents="box-none" style={{ position: "absolute", left: 12, right: 12, bottom: Math.max(insets.bottom, 10) + 76, alignItems: "center" }}>
          {cardOpen ? (
            <View style={{ width: "100%", maxWidth: 440, backgroundColor: colors.card, borderRadius: 28, padding: 16 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Press label="Өмнөх" onPress={() => go(-1)} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 22, color: colors.text }}>‹</Text>
                </Press>
                <View style={{ flex: 1, alignItems: "center" }}>
                  <Text style={{ color: colors.accent, fontSize: 12, fontFamily: fontsReady ? fonts.sansSemi : undefined }}>{index + 1}/{MAP_DESTINATIONS.length} · {dest.en}</Text>
                  <Text accessibilityRole="header" style={{ color: colors.text, fontSize: 28, fontFamily: fontsReady ? fonts.display : undefined }}>{dest.name}</Text>
                </View>
                <Press label="Дараах" onPress={() => go(1)} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 22, color: colors.text }}>›</Text>
                </Press>
              </View>
              <Text style={{ color: colors.muted, textAlign: "center", marginTop: 6 }}>{dest.blurb}</Text>
              <View style={{ flexDirection: "row", backgroundColor: colors.bg, borderRadius: 16, marginTop: 12, paddingVertical: 10 }}>
                <Stat value={dest.flightTime} label={dest.flightLabel} />
                <Stat value={tours.length ? String(tours.length) : "—"} label="Аялал" />
                <Stat value={from != null ? formatPrice(from) : "Удахгүй"} label="Эхлэх үнэ" />
              </View>
              <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
                <Press label="Жагсаалт нээх" onPress={() => setListOpen(true)} style={{ height: 48, paddingHorizontal: 14, borderRadius: 16, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ color: colors.text, fontFamily: fontsReady ? fonts.sansSemi : undefined }}>Жагсаалт</Text>
                </Press>
                <Press label={tours.length ? "Аялал үзэх" : "Удахгүй"} disabled={!tours.length} onPress={openTours} style={{ flex: 1, height: 48, borderRadius: 16, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ color: colors.onAccent, fontFamily: fontsReady ? fonts.sansSemi : undefined }}>{tours.length ? "Аялал үзэх" : "Удахгүй"}</Text>
                </Press>
              </View>
              <Press label="Хаах" onPress={() => setCardOpen(false)} style={{ alignSelf: "center", marginTop: 8, padding: 6 }}>
                <Text style={{ color: colors.muted }}>Хаах</Text>
              </Press>
            </View>
          ) : (
            <Press label={`${dest.name} карт нээх`} onPress={() => setCardOpen(true)} style={{ height: 48, paddingHorizontal: 18, borderRadius: 24, backgroundColor: colors.card, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: colors.text, fontFamily: fontsReady ? fonts.sansSemi : undefined }}>{dest.name} · {tours.length} аялал ▴</Text>
            </Press>
          )}
        </View>
      </View>

      {listOpen ? (
        <View style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, justifyContent: "flex-end", backgroundColor: "rgba(10,42,38,0.4)" }}>
          <Press label="Жагсаалт хаах" onPress={() => setListOpen(false)} style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}><View /></Press>
          <View style={{ maxHeight: "78%", backgroundColor: colors.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 18, paddingBottom: Math.max(insets.bottom, 16) }}>
            <Text style={{ fontSize: 26, color: colors.text, fontFamily: fontsReady ? fonts.display : undefined }}>Чиглэл</Text>
            <ScrollView>
              {MAP_DESTINATIONS.map((item) => (
                <Press key={item.key} label={item.name} onPress={() => { select(item.key); setListOpen(false); }} style={{ paddingVertical: 12 }}>
                  <Text style={{ color: item.key === dest.key ? colors.accent : colors.text, fontSize: 18, fontFamily: fontsReady ? fonts.sansSemi : undefined }}>{item.name}</Text>
                  <Txt muted>{item.blurb}</Txt>
                </Press>
              ))}
              <Text style={{ marginTop: 8, fontSize: 20, color: colors.text, fontFamily: fontsReady ? fonts.display : undefined }}>{dest.name} аяллууд</Text>
              {tours.length === 0 ? <Txt muted>Энэ чиглэлд нээлттэй аялал алга.</Txt> : null}
              {tours.map((tour) => (
                <Press key={tour.id} label={tour.title} onPress={() => router.push({ pathname: "/tour/[id]", params: { id: tour.id } })} style={{ paddingVertical: 10 }}>
                  <Text style={{ color: colors.text, fontFamily: fontsReady ? fonts.sansSemi : undefined }}>{tour.title}</Text>
                  <Txt muted>{formatPrice(tour.price)}</Txt>
                </Press>
              ))}
            </ScrollView>
          </View>
        </View>
      ) : null}
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  const { colors, fontsReady } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text style={{ color: colors.text, fontSize: 16, fontFamily: fontsReady ? fonts.sansSemi : undefined }}>{value}</Text>
      <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

function FallbackList() {
  const { colors, fontsReady } = useTheme();
  return (
    <ScrollView contentContainerStyle={{ paddingTop: 120, paddingHorizontal: 20, paddingBottom: 360 }}>
      <Text style={{ color: colors.text, fontSize: 22, marginBottom: 8, fontFamily: fontsReady ? fonts.display : undefined }}>Газрын зураг ачаалсангүй</Text>
      <Txt muted>Интерактив зураг энэ удаад гараагүй. Доорх жагсаалт вэб дээрх нийтлэгдсэн цэгүүд. Байршил асуугаагүй.</Txt>
      {MAP_DESTINATIONS.map((pin) => (
        <View key={pin.key} style={{ marginTop: 12, backgroundColor: colors.card, borderRadius: 16, padding: 12 }}>
          <Text style={{ color: colors.text, fontSize: 18 }}>{pin.name}</Text>
          <Text style={{ color: colors.muted }}>{pin.latitude}, {pin.longitude}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
