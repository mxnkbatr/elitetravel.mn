import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { ScrollView, Text, TextInput, View, type HostInstance } from "react-native";
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CinematicLine, Fade, Stagger, useKenBurns, useMotionFlag } from "../components/motion";
import { HomeSkeleton } from "../components/skeleton";
import { Banner, cardShadow, Display, Press, RemoteImage, ScreenScrollSpacer, StateBlock } from "../components/ui";
import { COAST_PLATE } from "../lib/config";
import { formatPrice } from "../lib/money";
import { isBookable, listedTours, searchTours } from "../lib/tours";
import type { Tour } from "../lib/types";
import { stageHeroFlight } from "../motion/heroFlight";
import { useCatalog } from "../state/catalog";
import { brand, fonts, radii, space, typeScale, useTheme, wash } from "../theme";

const HERO = 508;

export function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, fontsReady, reduceMotion } = useTheme();
  const catalog = useCatalog();
  const [query, setQuery] = useState("");
  const [chip, setChip] = useState("all");
  const scrollY = useSharedValue(0);
  const ken = useKenBurns(reduceMotion);
  const motionOn = useMotionFlag(reduceMotion);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  const heroStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: motionOn.value ? scrollY.value * 0.38 : 0 }, { scale: ken.value }],
  }));
  const open = listedTours(catalog.tours).filter(isBookable);
  const chips = useMemo(() => {
    const names = new Map<string, string>();
    for (const tour of open) if (tour.destinationKey) names.set(tour.destinationKey, tour.destination);
    return [...names.entries()];
  }, [open]);
  const results = useMemo(() => {
    const found = query.trim() ? searchTours(catalog.tours, query) : open;
    return chip === "all" ? found : found.filter((tour) => tour.destinationKey === chip);
  }, [catalog.tours, chip, open, query]);

  if (catalog.status === "loading") return <HomeSkeleton />;
  if (catalog.status === "error") return <StateBlock title="Жагсаалт нээгдсэнгүй" body={catalog.error} action="Дахин" onAction={catalog.refresh} />;

  return (
    <Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: 8 }}>
      <View style={{ height: HERO, overflow: "hidden" }}>
        <Animated.View style={[{ position: "absolute", top: -70, bottom: -120, left: -28, right: -28 }, heroStyle]}>
          <RemoteImage uri={COAST_PLATE} width={1400} height={1800} alt="Хайнангийн далайн эрэг" fade={false} style={{ width: "100%", height: "100%" }} />
        </Animated.View>
        <LinearGradient
          colors={["rgba(6,18,16,0.55)", "rgba(6,18,16,0.08)", "rgba(6,18,16,0.22)", "rgba(6,18,16,0.78)", colors.bg]}
          locations={[0, 0.28, 0.5, 0.84, 1]}
          pointerEvents="none"
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />
        <Fade delay={40} style={{ position: "absolute", left: space.xl, right: space.xl, top: insets.top + 8 }}>
          <Text style={{ color: "white", letterSpacing: 5, fontSize: 15, fontFamily: fontsReady ? fonts.sansBold : undefined }}>ELITE</Text>
          <Text style={{ color: "rgba(255,255,255,0.78)", letterSpacing: 4, fontSize: 10, marginTop: 2, fontFamily: fontsReady ? fonts.sansSemi : undefined }}>TRAVEL</Text>
        </Fade>
        <View accessibilityRole="header" accessibilityLabel="Халуун орны мөрөөдлөө бодит болго." style={{ position: "absolute", left: space.xl, right: space.xl, top: insets.top + 78 }}>
          <Fade delay={80}>
            <Text style={{ color: brand.mist, letterSpacing: 2.4, fontSize: typeScale.micro, fontWeight: "700", fontFamily: fontsReady ? fonts.sansBold : undefined }}>ELITE TRAVEL MONGOLIA</Text>
          </Fade>
          <CinematicLine text="Халуун орны" color="#ffffff" delay={140} size={typeScale.hero} />
          <CinematicLine text="мөрөөдлөө" italic color={brand.gold} delay={280} size={typeScale.hero} />
          <CinematicLine text="бодит болго." color="#ffffff" delay={400} size={typeScale.hero} />
          <Fade delay={620} style={{ marginTop: space.md, maxWidth: 280 }}>
            <Text style={{ color: "rgba(255,255,255,0.88)", fontSize: typeScale.body, lineHeight: 22, fontFamily: fontsReady ? fonts.sans : undefined }}>
              Хайнань, Хонг Конг, Бали болон концерт аяллууд.
            </Text>
          </Fade>
        </View>
      </View>
      <Fade delay={80} style={{ marginTop: -32, paddingHorizontal: space.lg }}>
        <View
          style={{
            height: 58,
            borderRadius: radii.pill,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.line,
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 8,
            paddingRight: space.lg,
            ...cardShadow,
          }}
        >
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: wash.emerald, alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="search" size={18} color={colors.accent} />
          </View>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Аялал, чиглэл хайх"
            placeholderTextColor={colors.placeholder}
            accessibilityLabel="Хайлт"
            selectionColor={colors.accent}
            style={{ flex: 1, marginLeft: space.md, color: colors.text, fontSize: 16, paddingVertical: 8, fontFamily: fontsReady ? fonts.sansMedium : undefined }}
          />
        </View>
      </Fade>
      {catalog.preview ? <Banner text="Урьдчилсан харагдац · доорх аяллууд серверийн шууд өгөгдөл биш." /> : null}
      {catalog.offline ? <Banner text="Интернэт алга. Сүүлд уншсан жагсаалтыг харуулж байна." /> : null}
      <Fade delay={140} style={{ marginTop: space.xxl, paddingHorizontal: space.xl, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
        <Display style={{ fontSize: typeScale.display, lineHeight: 36, color: colors.text }}>Эрэлттэй аяллууд</Display>
        <Text style={{ color: colors.muted, fontSize: typeScale.label, fontFamily: fontsReady ? fonts.sansSemi : undefined }}>{results.length}</Text>
      </Fade>
      <Fade delay={180}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: space.xl, gap: space.sm, paddingTop: space.sm }}>
          {[["all", "Бүгд"], ...chips].map(([key, label]) => {
            const on = chip === key;
            return (
              <Press key={key} label={label} onPress={() => setChip(key)} style={{ minHeight: 36, paddingHorizontal: 14, borderRadius: radii.pill, alignItems: "center", justifyContent: "center", backgroundColor: on ? brand.emerald : colors.card, borderWidth: on ? 0 : 1, borderColor: colors.line }}>
                <Text style={{ color: on ? "#ffffff" : colors.text, fontWeight: "700", fontSize: typeScale.label, fontFamily: fontsReady ? fonts.sansSemi : undefined }}>{label}</Text>
              </Press>
            );
          })}
        </ScrollView>
      </Fade>
      <View style={{ paddingHorizontal: space.xl, paddingTop: space.md, gap: space.lg }}>
        {results.map((tour, index) => (
          <TourCard key={tour.id} tour={tour} index={index} onOpen={(id) => router.push({ pathname: "/tour/[id]", params: { id } })} />
        ))}
      </View>
      {catalog.news[0] ? (
        <Stagger index={Math.min(results.length, 6)}>
          <Press label={catalog.news[0].title} onPress={() => router.push({ pathname: "/news/[id]", params: { id: catalog.news[0].id } })} style={[{ marginHorizontal: space.xl, marginTop: space.lg, borderRadius: radii.xxl, overflow: "hidden", height: 168 }, cardShadow]}>
            <RemoteImage uri={catalog.news[0].image} width={1000} height={600} alt="" style={{ width: "100%", height: "100%" }} />
            <LinearGradient colors={["rgba(5,22,20,0.05)", "rgba(5,22,20,0.72)"]} style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }} />
            <View style={{ position: "absolute", left: space.lg, right: space.lg, bottom: space.lg }}>
              <Text style={{ color: brand.mist, fontSize: typeScale.micro, fontWeight: "700", letterSpacing: 1 }}>{catalog.news[0].category}</Text>
              <Text style={{ color: "white", fontSize: typeScale.card, lineHeight: 26, marginTop: 4, fontFamily: fontsReady ? fonts.display : undefined }}>{catalog.news[0].title}</Text>
            </View>
          </Press>
        </Stagger>
      ) : null}
      <ScreenScrollSpacer />
    </Animated.ScrollView>
  );
}

function TourCard({ tour, index, onOpen }: { tour: Tour; index: number; onOpen: (id: string) => void }) {
  const { colors, fontsReady, reduceMotion } = useTheme();
  const imageRef = useRef<HostInstance>(null);
  function open() {
    const go = () => onOpen(tour.id);
    const node = imageRef.current;
    if (reduceMotion || !node) {
      go();
      return;
    }
    let left = false;
    const finish = () => {
      if (left) return;
      left = true;
      go();
    };
    const timer = setTimeout(finish, 320);
    node.measureInWindow((x, y, width, height) => {
      clearTimeout(timer);
      if (left) return;
      if (width > 1 && height > 1) stageHeroFlight(tour.id, { x, y, width, height });
      finish();
    });
  }
  return (
    <Stagger index={index}>
      <Press scaleTo={0.98} label={tour.title} onPress={open} style={[{ height: 280, borderRadius: radii.xxl, overflow: "hidden", backgroundColor: colors.card }, cardShadow]}>
        <View ref={imageRef} collapsable={false} style={{ flex: 1 }}>
          <RemoteImage uri={tour.image} width={1000} height={800} alt={tour.title} fade={false} style={{ width: "100%", height: "100%" }} />
        </View>
        <View pointerEvents="none" style={{ position: "absolute", left: space.md, right: space.md, bottom: space.md, backgroundColor: "rgba(255,252,247,0.94)", borderRadius: radii.lg, paddingHorizontal: 14, paddingVertical: space.md }}>
          <Text style={{ color: colors.muted, fontSize: typeScale.caption, fontWeight: "700", fontFamily: fontsReady ? fonts.sansSemi : undefined }}>{tour.destination}</Text>
          <Text style={{ color: colors.text, fontSize: typeScale.card, lineHeight: 26, fontFamily: fontsReady ? fonts.display : undefined }} numberOfLines={2}>{tour.title}</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 6 }}>
            <Text style={{ color: colors.muted, fontSize: typeScale.caption, flex: 1 }} numberOfLines={1}>{[tour.duration, tour.dates].filter(Boolean).join(" · ")}</Text>
            <Text style={{ color: colors.accent, fontWeight: "700", fontSize: 16, fontFamily: fontsReady ? fonts.sansBold : undefined }}>{formatPrice(tour.price)}</Text>
          </View>
        </View>
      </Press>
    </Stagger>
  );
}
