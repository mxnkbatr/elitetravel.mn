import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { AccessibilityInfo, Animated, Linking, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cardShadow, GlassBar, Press, RemoteImage, StateBlock, Txt } from "../components/ui";
import { API_ORIGIN, INSTAGRAM, PHONE_DISPLAY, PHONE_TEL } from "../lib/config";
import { formatPrice } from "../lib/money";
import { isBookable, relatedTours, seatHint } from "../lib/tours";
import { detailEntrance } from "../motion/detail";
import { useCatalog } from "../state/catalog";
import { useSession } from "../state/session";
import { fonts, useTheme } from "../theme";
import * as WebBrowser from "expo-web-browser";

export function TourScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, fontsReady } = useTheme();
  const catalog = useCatalog();
  const session = useSession();
  const tourId = typeof id === "string" ? id : "";
  const tour = catalog.tourById(tourId);
  const [missing, setMissing] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const heroScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let live = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((reduced) => {
        if (!live) return;
        const entrance = detailEntrance(reduced);
        if (entrance.duration === 0) return;
        heroScale.setValue(entrance.fromScale);
        Animated.timing(heroScale, { toValue: 1, duration: entrance.duration, useNativeDriver: true }).start();
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [heroScale, tourId]);

  useEffect(() => {
    if (!tourId) return;
    void catalog.ensureDetail(tourId).then((loaded) => {
      if (!loaded && !catalog.tourById(tourId)) setMissing(true);
    });
  }, [catalog, tourId]);

  if (!tour && !missing) return <StateBlock busy title="Аяллыг нээж байна" />;
  if (!tour) return <StateBlock title="Аялал олдсонгүй" action="Буцах" onAction={() => router.back()} />;

  const bookable = isBookable(tour);
  const saved = session.saved.includes(tour.id);
  const seats = seatHint(catalog.seats, tour.id);
  const gallery = tour.gallery ?? [];
  const hero = photo || gallery[0] || tour.image;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Animated.View style={{ height: 420, transform: [{ scale: heroScale }] }}>
          <RemoteImage uri={hero} width={1400} height={1600} alt={tour.title} style={{ width: "100%", height: "100%" }} />
          <LinearGradient colors={["rgba(5,22,20,0.28)", "rgba(5,22,20,0)", colors.bg]} locations={[0, 0.45, 1]} style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }} />
          {gallery.length > 1 ? (
            <View style={{ position: "absolute", right: 14, top: 72, gap: 8 }}>
              {gallery.slice(0, 4).map((uri) => (
                <Press key={uri} label="Зургийн цомог" onPress={() => setPhoto(uri)} style={{ width: 52, height: 52, borderRadius: 14, overflow: "hidden", borderWidth: hero === uri ? 2 : 0, borderColor: "white" }}>
                  <RemoteImage uri={uri} width={160} height={160} alt="" style={{ width: 52, height: 52 }} />
                </Press>
              ))}
            </View>
          ) : null}
        </Animated.View>
        <View style={{ paddingHorizontal: 20, marginTop: -72 }}>
          <Text style={{ color: colors.accent, fontWeight: "700", letterSpacing: 1.6, fontSize: 12 }}>{tour.destination.toUpperCase()}</Text>
          <Text style={{ color: colors.text, fontSize: 40, lineHeight: 42, marginTop: 4, fontFamily: fontsReady ? fonts.display : undefined }}>{tour.title}</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
            {[tour.duration, tour.dates, tour.departure].filter(Boolean).map((fact) => (
              <Text key={fact} style={[{ backgroundColor: colors.card, color: colors.text, borderRadius: 999, overflow: "hidden", paddingHorizontal: 12, paddingVertical: 7, fontWeight: "600" }, cardShadow]}>{fact}</Text>
            ))}
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 16 }}>
            <View>
              <Text style={{ color: colors.muted, fontSize: 11, fontWeight: "700" }}>ҮНЭ / ХҮН</Text>
              <Text style={{ color: colors.accent, fontSize: 28, fontWeight: "700" }}>{formatPrice(tour.price)}</Text>
              {tour.oldPrice ? <Text style={{ color: colors.muted, textDecorationLine: "line-through" }}>{formatPrice(tour.oldPrice)}</Text> : null}
            </View>
            {tour.stay ? <Text style={{ color: colors.muted, maxWidth: 150, textAlign: "right" }}>{tour.stay}</Text> : null}
          </View>
          {seats ? <Text style={{ color: colors.gold, fontWeight: "700", marginTop: 8 }}>{seats}</Text> : null}
          {tour.story ? <Txt style={{ marginTop: 14 }}>{tour.story}</Txt> : null}
          {tour.gallery?.length ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingTop: 14 }}>
              {tour.gallery.map((uri) => (
                <RemoteImage key={uri} uri={uri} width={400} height={300} alt="" style={{ width: 112, height: 80, borderRadius: 16 }} />
              ))}
            </ScrollView>
          ) : null}
          {tour.highlights?.length ? (
            <View style={{ marginTop: 16, flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {tour.highlights.map((item, index) => (
                <View key={item} style={[{ width: "48%", backgroundColor: colors.card, borderRadius: 18, padding: 12, flexDirection: "row", gap: 8, alignItems: "center" }, cardShadow]}>
                  <Text style={{ width: 28, height: 28, borderRadius: 9, overflow: "hidden", backgroundColor: "rgba(11,125,115,0.1)", color: colors.accent, fontWeight: "800", textAlign: "center", lineHeight: 28 }}>{String(index + 1).padStart(2, "0")}</Text>
                  <Text style={{ color: colors.text, flex: 1, fontWeight: "600" }}>{item}</Text>
                </View>
              ))}
            </View>
          ) : null}
          {tour.itinerary?.length ? (
            <View style={{ marginTop: 22, gap: 14 }}>
              <Text style={{ color: colors.text, fontSize: 28, fontFamily: fontsReady ? fonts.display : undefined }}>Хөтөлбөр</Text>
              {tour.itinerary.map((day, index) => (
                <View key={`${day.day}-${day.title}`} style={{ paddingLeft: 12, borderLeftWidth: 1, borderLeftColor: colors.accent }}>
                  <Text style={{ color: colors.accent, fontWeight: "700" }}>{day.day || `${index + 1}-р өдөр`}</Text>
                  <Text style={{ color: colors.text, fontSize: 18, fontFamily: fontsReady ? fonts.display : undefined }}>{day.title}</Text>
                  <Txt muted>{day.detail}</Txt>
                  {day.flight ? <Txt>Нислэг: {day.flight}</Txt> : null}
                  {day.meals ? <Txt muted>Хоол: {day.meals}</Txt> : null}
                  {day.hotel ? <Txt muted>Буудал: {day.hotel}</Txt> : null}
                </View>
              ))}
            </View>
          ) : null}
          {tour.includes?.length ? (
            <View style={{ marginTop: 22, gap: 8 }}>
              <Text style={{ fontSize: 22, color: colors.text, fontFamily: fontsReady ? fonts.display : undefined }}>Үнэд багтсан</Text>
              {tour.includes.map((item) => <Txt key={item}>• {item}</Txt>)}
              {tour.excludes?.length ? <Text style={{ fontSize: 22, color: colors.text, marginTop: 8, fontFamily: fontsReady ? fonts.display : undefined }}>Үнэд ороогүй</Text> : null}
              {tour.excludes?.map((item) => <Txt key={item} muted>• {item}</Txt>)}
            </View>
          ) : null}
          {tour.notes?.map((note) => (
            <View key={note} style={{ marginTop: 16, backgroundColor: "rgba(232,184,109,0.18)", borderRadius: 18, padding: 14 }}>
              <Txt>{note}</Txt>
            </View>
          ))}
          <View style={{ marginTop: 18, gap: 8 }}>
            {relatedTours(catalog.tours, tour.id).map((item) => (
              <Press key={item.id} label={item.title} onPress={() => router.push({ pathname: "/tour/[id]", params: { id: item.id } })} style={{ backgroundColor: colors.card, borderRadius: 18, padding: 12 }}>
                <Text style={{ color: colors.text, fontWeight: "700" }}>{item.title}</Text>
                <Text style={{ color: colors.accent }}>{formatPrice(item.price)}</Text>
              </Press>
            ))}
            <Press label="Вэб дээр нээх" onPress={() => void WebBrowser.openBrowserAsync(`${API_ORIGIN}/tours/${tour.id}`)}>
              <Text style={{ color: colors.accent, fontWeight: "700" }}>Захиалгын вэб хуудас дээр нээх</Text>
            </Press>
          </View>
        </View>
      </ScrollView>
      <Press label="Буцах" onPress={() => router.back()} style={{ position: "absolute", top: insets.top + 8, left: 16, width: 42, height: 42, borderRadius: 21, backgroundColor: "rgba(255,255,255,0.22)", borderWidth: 1, borderColor: "rgba(255,255,255,0.45)", alignItems: "center", justifyContent: "center" }}>
        <Ionicons name="chevron-back" size={20} color="white" />
      </Press>
      <Press label={saved ? "Хадгалснаас хасах" : "Хадгалах"} onPress={() => void session.toggleSaved(tour.id)} style={{ position: "absolute", top: insets.top + 8, right: 16, width: 42, height: 42, borderRadius: 21, backgroundColor: "rgba(255,255,255,0.22)", borderWidth: 1, borderColor: "rgba(255,255,255,0.45)", alignItems: "center", justifyContent: "center" }}>
        <Ionicons name={saved ? "heart" : "heart-outline"} size={20} color="white" />
      </Press>
      <GlassBar style={{ position: "absolute", left: 14, right: 14, bottom: Math.max(insets.bottom, 12), height: 72, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingLeft: 18, paddingRight: 10 }}>
        <View>
          <Text style={{ color: colors.muted, fontSize: 11 }}>Үнэ / хүн</Text>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: "700" }}>{formatPrice(tour.price)}</Text>
        </View>
        {bookable ? (
          <Press label="Захиалах" onPress={() => router.push({ pathname: "/book/[id]", params: { id: tour.id } })} style={{ height: 52, paddingHorizontal: 22, borderRadius: 26, backgroundColor: "#0a2a26", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "#ffffff", fontWeight: "700", fontSize: 16 }}>Захиалах</Text>
          </Press>
        ) : (
          <Press label="Залгах" onPress={() => void Linking.openURL(PHONE_TEL)} style={{ height: 52, paddingHorizontal: 16, borderRadius: 22, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: colors.onAccent, fontWeight: "700" }}>{PHONE_DISPLAY}</Text>
          </Press>
        )}
      </GlassBar>
      {!bookable ? (
        <Press label="Instagram" onPress={() => void Linking.openURL(INSTAGRAM)} style={{ position: "absolute", right: 28, bottom: Math.max(insets.bottom, 12) + 80 }}>
          <Text style={{ color: colors.accent, fontSize: 12 }}>Instagram</Text>
        </Press>
      ) : null}
    </View>
  );
}
