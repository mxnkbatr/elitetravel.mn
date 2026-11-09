import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Linking, StyleSheet, Text, View, type HostInstance } from "react-native";
import Animated, { cancelAnimation, Easing, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withTiming, type SharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";
import { ItineraryTimeline } from "../components/ItineraryTimeline";
import { Fade, FlyingHero, Rise, SpringPress, useMotionFlag } from "../components/motion";
import { TourSkeleton } from "../components/skeleton";
import { GlassBar, Press, RemoteImage, StateBlock, Txt } from "../components/ui";
import { API_ORIGIN, INSTAGRAM, PHONE_DISPLAY, PHONE_TEL } from "../lib/config";
import { formatPrice } from "../lib/money";
import { isBookable, relatedTours, seatHint } from "../lib/tours";
import { detailEntrance } from "../motion/detail";
import { peekHeroFlight, type HeroRect } from "../motion/heroFlight";
import { useCatalog } from "../state/catalog";
import { useSession } from "../state/session";
import { brand, fonts, radii, shadows, space, typeScale, useTheme, wash } from "../theme";

const HERO = 460;

export function TourScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tourId = typeof id === "string" ? id : "";
  return <TourBody key={tourId} tourId={tourId} />;
}

function TourBody({ tourId }: { tourId: string }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, fontsReady, reduceMotion } = useTheme();
  const catalog = useCatalog();
  const session = useSession();
  const tour = catalog.tourById(tourId);
  const [missing, setMissing] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const heroRef = useRef<HostInstance>(null);
  const flight = useRef<HeroRect | null>(reduceMotion ? null : peekHeroFlight(tourId)).current;
  const [settled, setSettled] = useState(flight == null);
  const scrollY = useSharedValue(0);
  const settle = useSharedValue(1);
  const motionOn = useMotionFlag(reduceMotion);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  const heroMotion = useAnimatedStyle(() => {
    const base = settle.value;
    if (!motionOn.value) return { transform: [{ translateY: 0 }, { scale: base }] };
    const y = scrollY.value;
    const stretch = y < 0 ? 1 + Math.min(-y / 480, 0.32) : 1;
    const translateY = y > 0 ? y * 0.45 : y * 0.2;
    return { transform: [{ translateY }, { scale: stretch * base }] };
  });

  useEffect(() => {
    const plan = detailEntrance(reduceMotion || flight != null);
    if (plan.duration === 0) {
      settle.value = 1;
      return;
    }
    settle.value = plan.fromScale;
    settle.value = withTiming(1, { duration: plan.duration, easing: Easing.out(Easing.cubic) });
    return () => cancelAnimation(settle);
  }, [flight, reduceMotion, settle]);

  useEffect(() => {
    if (!tourId) return;
    void catalog.ensureDetail(tourId).then((loaded) => {
      if (!loaded && !catalog.tourById(tourId)) setMissing(true);
    });
  }, [catalog, tourId]);

  if (!tour && !missing) return <TourSkeleton />;
  if (!tour) return <StateBlock title="Аялал олдсонгүй" action="Буцах" onAction={() => router.back()} />;

  const bookable = isBookable(tour);
  const saved = session.saved.includes(tour.id);
  const seats = seatHint(catalog.seats, tour.id);
  const gallery = tour.gallery ?? [];
  const hero = photo || gallery[0] || tour.image;
  const facts = [tour.duration, tour.dates, tour.departure].filter((fact): fact is string => Boolean(fact));

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
        <View ref={heroRef} collapsable={false} style={{ height: HERO, overflow: "hidden" }}>
          <Animated.View style={[{ position: "absolute", top: -48, left: 0, right: 0, height: 580 }, heroMotion]}>
            <RemoteImage uri={hero} width={1400} height={1600} alt={tour.title} fade={false} style={{ width: "100%", height: "100%" }} />
          </Animated.View>
          <LinearGradient colors={["rgba(5,22,20,0.28)", "rgba(5,22,20,0)", colors.bg]} locations={[0, 0.45, 1]} pointerEvents="none" style={StyleSheet.absoluteFill} />
          {settled && gallery.length > 1 ? (
            <View style={{ position: "absolute", right: 14, top: insets.top + 62, gap: space.sm }}>
              {gallery.slice(0, 4).map((uri) => (
                <Press key={uri} label="Зургийн цомог" onPress={() => setPhoto(uri)} style={{ width: 52, height: 52, borderRadius: radii.sm, overflow: "hidden", borderWidth: hero === uri ? 2 : 0, borderColor: "white" }}>
                  <RemoteImage uri={uri} width={160} height={160} alt="" style={{ width: 52, height: 52 }} />
                </Press>
              ))}
            </View>
          ) : null}
        </View>
        <Rise delay={90} style={{ paddingHorizontal: space.xl, marginTop: -72 }}>
          <Text style={{ color: colors.accent, fontWeight: "700", letterSpacing: 1.6, fontSize: typeScale.caption, fontFamily: fontsReady ? fonts.sansBold : undefined }}>{tour.destination.toUpperCase()}</Text>
          <Text style={{ color: colors.text, fontSize: typeScale.title, lineHeight: 42, marginTop: space.xs, fontFamily: fontsReady ? fonts.display : undefined }}>{tour.title}</Text>
          {facts.length ? (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.sm, marginTop: space.md }}>
              {facts.map((fact) => (
                <FactChip key={fact} label={fact} />
              ))}
            </View>
          ) : null}
          {tour.stay ? <Txt muted style={{ marginTop: space.md }}>{tour.stay}</Txt> : null}
          {seats ? <Text style={{ color: colors.gold, fontWeight: "700", marginTop: space.sm, fontFamily: fontsReady ? fonts.sansBold : undefined }}>{seats}</Text> : null}
          {tour.story ? <Txt style={{ marginTop: space.md }}>{tour.story}</Txt> : null}
          {tour.gallery?.length ? (
            <Animated.ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.sm, paddingTop: space.md }}>
              {tour.gallery.map((uri) => (
                <Press key={uri} label="Зургийн цомог" onPress={() => setPhoto(uri)}>
                  <RemoteImage uri={uri} width={400} height={300} alt="" style={{ width: 112, height: 80, borderRadius: radii.md }} />
                </Press>
              ))}
            </Animated.ScrollView>
          ) : null}
          {tour.highlights?.length ? (
            <View style={{ marginTop: space.lg, flexDirection: "row", flexWrap: "wrap", gap: space.sm }}>
              {tour.highlights.map((item, index) => (
                <View key={item} style={[{ width: "48%", backgroundColor: colors.card, borderRadius: radii.lg, padding: space.md, flexDirection: "row", gap: space.sm, alignItems: "center" }, shadows.soft]}>
                  <Text style={{ width: 28, height: 28, borderRadius: 9, overflow: "hidden", backgroundColor: wash.emerald, color: colors.accent, fontWeight: "800", textAlign: "center", lineHeight: 28 }}>{String(index + 1).padStart(2, "0")}</Text>
                  <Text style={{ color: colors.text, flex: 1, fontWeight: "600", fontFamily: fontsReady ? fonts.sansSemi : undefined }}>{item}</Text>
                </View>
              ))}
            </View>
          ) : null}
          <ItineraryTimeline tour={tour} scrollY={scrollY} />
          {tour.includes?.length ? (
            <View style={{ marginTop: space.xxl, gap: space.sm }}>
              <Text style={{ fontSize: 22, color: colors.text, fontFamily: fontsReady ? fonts.display : undefined }}>Үнэд багтсан</Text>
              {tour.includes.map((item) => <Txt key={item}>• {item}</Txt>)}
              {tour.excludes?.length ? <Text style={{ fontSize: 22, color: colors.text, marginTop: space.sm, fontFamily: fontsReady ? fonts.display : undefined }}>Үнэд ороогүй</Text> : null}
              {tour.excludes?.map((item) => <Txt key={item} muted>• {item}</Txt>)}
            </View>
          ) : null}
          {tour.notes?.map((note) => (
            <View key={note} style={{ marginTop: space.lg, backgroundColor: wash.gold, borderRadius: radii.lg, padding: space.md }}>
              <Txt>{note}</Txt>
            </View>
          ))}
          <View style={{ marginTop: space.lg, gap: space.sm }}>
            {relatedTours(catalog.tours, tour.id).map((item) => (
              <Press key={item.id} label={item.title} onPress={() => router.push({ pathname: "/tour/[id]", params: { id: item.id } })} style={[{ backgroundColor: colors.card, borderRadius: radii.lg, padding: space.md }, shadows.soft]}>
                <Text style={{ color: colors.text, fontWeight: "700", fontFamily: fontsReady ? fonts.sansSemi : undefined }}>{item.title}</Text>
                <Text style={{ color: colors.accent, fontFamily: fontsReady ? fonts.sansBold : undefined }}>{formatPrice(item.price)}</Text>
              </Press>
            ))}
            <Press label="Вэб дээр нээх" onPress={() => void WebBrowser.openBrowserAsync(`${API_ORIGIN}/tours/${tour.id}`)}>
              <Text style={{ color: colors.accent, fontWeight: "700", fontFamily: fontsReady ? fonts.sansSemi : undefined }}>Захиалгын вэб хуудас дээр нээх</Text>
            </Press>
          </View>
        </Rise>
      </Animated.ScrollView>
      <FlyingHero id={tour.id} uri={hero} from={flight} destRef={heroRef} onDone={() => setSettled(true)} />
      <StickyTitle title={tour.title} scrollY={scrollY} top={insets.top} />
      <Fade delay={40} style={{ position: "absolute", top: insets.top + 8, left: space.lg, zIndex: 30 }}>
        <Press label="Буцах" onPress={() => router.back()} style={roundButton}>
          <Ionicons name="chevron-back" size={20} color="white" />
        </Press>
      </Fade>
      <Fade delay={40} style={{ position: "absolute", top: insets.top + 8, right: space.lg, zIndex: 30 }}>
        <Press label={saved ? "Хадгалснаас хасах" : "Хадгалах"} onPress={() => void session.toggleSaved(tour.id)} style={roundButton}>
          <Ionicons name={saved ? "heart" : "heart-outline"} size={20} color="white" />
        </Press>
      </Fade>
      <Fade delay={140} style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 30 }} >
        <GlassBar style={{ marginHorizontal: 14, marginBottom: Math.max(insets.bottom, 12), minHeight: 76, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingLeft: space.lg, paddingRight: space.sm, paddingVertical: space.sm }}>
          <View style={{ flex: 1, paddingRight: space.sm }}>
            <Text style={{ color: colors.muted, fontSize: typeScale.micro, fontFamily: fontsReady ? fonts.sansSemi : undefined }}>Үнэ / хүн</Text>
            <View style={{ flexDirection: "row", alignItems: "baseline", gap: space.sm, flexWrap: "wrap" }}>
              <Text style={{ color: colors.accent, fontSize: 22, fontFamily: fontsReady ? fonts.sansBold : undefined }}>{formatPrice(tour.price)}</Text>
              {tour.oldPrice ? <Text style={{ color: colors.muted, fontSize: typeScale.label, textDecorationLine: "line-through" }}>{formatPrice(tour.oldPrice)}</Text> : null}
            </View>
          </View>
          {bookable ? (
            <SpringPress label="Захиалах" onPress={() => router.push({ pathname: "/book/[id]", params: { id: tour.id } })} style={bookButton}>
              <Text style={{ color: "#ffffff", fontWeight: "700", fontSize: 16, fontFamily: fontsReady ? fonts.sansBold : undefined }}>Захиалах</Text>
            </SpringPress>
          ) : (
            <SpringPress label="Залгах" onPress={() => void Linking.openURL(PHONE_TEL)} style={[bookButton, { backgroundColor: colors.accent }]}>
              <Text style={{ color: colors.onAccent, fontWeight: "700", fontFamily: fontsReady ? fonts.sansBold : undefined }}>{PHONE_DISPLAY}</Text>
            </SpringPress>
          )}
        </GlassBar>
      </Fade>
      {!bookable ? (
        <Press label="Instagram" onPress={() => void Linking.openURL(INSTAGRAM)} style={{ position: "absolute", right: space.xxl, bottom: Math.max(insets.bottom, 12) + 88, zIndex: 30 }}>
          <Text style={{ color: colors.accent, fontSize: typeScale.caption, fontFamily: fontsReady ? fonts.sansSemi : undefined }}>Instagram</Text>
        </Press>
      ) : null}
    </View>
  );
}

function StickyTitle({ title, scrollY, top }: { title: string; scrollY: SharedValue<number>; top: number }) {
  const { colors, fontsReady } = useTheme();
  const style = useAnimatedStyle(() => ({ opacity: interpolate(scrollY.value, [48, 110], [0, 1]) }));
  return (
    <Animated.View pointerEvents="none" style={[{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 25, paddingTop: top + 10, paddingBottom: 12, alignItems: "center", overflow: "hidden" }, style]}>
      <BlurView intensity={48} tint={colors.dark ? "dark" : "light"} style={StyleSheet.absoluteFill} />
      <Text numberOfLines={1} style={{ marginHorizontal: 72, color: colors.text, fontSize: 15, fontFamily: fontsReady ? fonts.sansSemi : undefined }}>{title}</Text>
    </Animated.View>
  );
}

function FactChip({ label }: { label: string }) {
  const { colors, fontsReady } = useTheme();
  return (
    <View style={[{ backgroundColor: colors.card, borderRadius: radii.pill, paddingHorizontal: 14, paddingVertical: 8, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line }, shadows.soft]}>
      <Text style={{ color: colors.text, fontSize: typeScale.label, fontFamily: fontsReady ? fonts.sansSemi : undefined }}>{label}</Text>
    </View>
  );
}

const roundButton = {
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: "rgba(16,36,31,0.28)",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.45)",
  alignItems: "center" as const,
  justifyContent: "center" as const,
};

const bookButton = {
  height: 52,
  paddingHorizontal: 22,
  borderRadius: radii.pill,
  backgroundColor: brand.emerald,
  alignItems: "center" as const,
  justifyContent: "center" as const,
};
