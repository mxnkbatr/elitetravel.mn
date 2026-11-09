import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { RefreshControl, Text, TextInput, View, useWindowDimensions, type HostInstance } from "react-native";
import Animated, { LinearTransition, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CinematicLine, Fade, Stagger, useKenBurns, useMotionFlag } from "../components/motion";
import { SaveHeart } from "../components/SaveHeart";
import { HomeSkeleton } from "../components/skeleton";
import { StoriesRow, StoryViewer } from "../components/Stories";
import { Banner, cardShadow, Display, Press, RemoteImage, ScreenScrollSpacer, StateBlock } from "../components/ui";
import { COAST_PLATE } from "../lib/config";
import { DURATION_CHIPS, PRICE_CHIPS, applyTourFilter, type TourFilter } from "../lib/filters";
import { formatPrice } from "../lib/money";
import { storyGroups } from "../lib/stories";
import { isBookable, listedTours, searchTours } from "../lib/tours";
import type { Tour } from "../lib/types";
import { homeLayout } from "../motion/homeLayout";
import { stageHeroFlight } from "../motion/heroFlight";
import { useCatalog } from "../state/catalog";
import { useSession } from "../state/session";
import { brand, fonts, radii, space, useTheme, wash } from "../theme";

export function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const layout = homeLayout(height);
  const { colors, fontsReady, reduceMotion } = useTheme();
  const catalog = useCatalog();
  const session = useSession();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<TourFilter>({ type: "all" });
  const [story, setStory] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useSharedValue(0);
  const ken = useKenBurns(reduceMotion);
  const motionOn = useMotionFlag(reduceMotion);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  const heroStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: motionOn.value ? scrollY.value * 0.28 : 0 }, { scale: ken.value }],
  }));
  const open = listedTours(catalog.tours).filter(isBookable);
  const groups = useMemo(() => storyGroups(open), [open]);
  const chips = useMemo(() => {
    const names = new Map<string, string>();
    for (const tour of open) if (tour.destinationKey) names.set(tour.destinationKey, tour.destination);
    return [...names.entries()];
  }, [open]);
  const results = useMemo(() => {
    const found = query.trim() ? searchTours(catalog.tours, query) : open;
    return applyTourFilter(found, filter);
  }, [catalog.tours, filter, open, query]);

  if (catalog.status === "loading") return <HomeSkeleton />;
  if (catalog.status === "error") return <StateBlock title="Жагсаалт нээгдсэнгүй" body={catalog.error} action="Дахин" onAction={catalog.refresh} />;

  const selected = colors.dark ? colors.accent : brand.emerald;
  const onSelected = colors.dark ? colors.onAccent : "#ffffff";
  const filterId = filter.type === "all" ? "all" : filter.type === "destination" ? filter.key : `${filter.type}:${filter.band}`;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, backgroundColor: colors.bg }}
        refreshControl={<RefreshControl refreshing={refreshing} tintColor={colors.accent} colors={[colors.accent]} onRefresh={() => { setRefreshing(true); catalog.refresh(); setTimeout(() => setRefreshing(false), 700); }} />}
      >
        <View style={{ height: layout.hero, overflow: "hidden" }}>
          <Animated.View style={[{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }, heroStyle]}>
            <RemoteImage uri={COAST_PLATE} width={1400} height={1800} alt="Хайнангийн далайн эрэг" fade={false} style={{ width: "100%", height: "100%" }} />
          </Animated.View>
          <LinearGradient
            colors={["rgba(6,18,16,0.55)", "rgba(6,18,16,0.08)", "rgba(6,18,16,0.22)", "rgba(6,18,16,0.78)", colors.bg]}
            locations={[0, 0.28, 0.5, 0.84, 1]}
            pointerEvents="none"
            style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
          />
          <View style={{ position: "absolute", left: space.xl, right: space.xl, top: insets.top + 8 }}>
            <Text style={{ color: "white", letterSpacing: 5, fontSize: 15, fontFamily: fontsReady ? fonts.sansBold : undefined }}>ELITE</Text>
            <Text style={{ color: "rgba(255,255,255,0.78)", letterSpacing: 4, fontSize: 10, marginTop: 2, fontFamily: fontsReady ? fonts.sansSemi : undefined }}>TRAVEL</Text>
          </View>
          <View accessibilityRole="header" accessibilityLabel="Халуун орны мөрөөдлөө бодит болго." style={{ position: "absolute", left: space.xl, right: space.lg, top: insets.top + 46 }}>
            <CinematicLine text="Халуун орны" color="#ffffff" delay={80} size={layout.titleSize} />
            <CinematicLine text="мөрөөдлөө" italic color={brand.gold} delay={180} size={layout.titleSize} />
            <CinematicLine text="бодит болго." color="#ffffff" delay={280} size={layout.titleSize} />
          </View>
        </View>
        <View style={{ marginTop: -layout.searchOverlap, paddingHorizontal: space.lg, height: layout.searchHeight }}>
          <View style={{ height: layout.searchHeight, borderRadius: radii.pill, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, flexDirection: "row", alignItems: "center", paddingLeft: 6, paddingRight: space.md, ...cardShadow }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: wash.emerald, alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="search" size={16} color={colors.accent} />
            </View>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Аялал, чиглэл хайх"
              placeholderTextColor={colors.placeholder}
              accessibilityLabel="Хайлт"
              selectionColor={colors.accent}
              style={{ flex: 1, marginLeft: 10, color: colors.text, fontSize: 15, paddingVertical: 0, fontFamily: fontsReady ? fonts.sansMedium : undefined }}
            />
          </View>
        </View>
        <View style={{ marginTop: layout.afterSearch, height: layout.storiesHeight }}>
          <StoriesRow groups={groups} height={layout.storiesHeight} onOpen={setStory} />
        </View>
        <Animated.ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: layout.blockGap, height: layout.chipsHeight }} contentContainerStyle={{ paddingHorizontal: space.xl, gap: 8, alignItems: "center" }}>
          <FilterChip label="Бүгд" on={filterId === "all"} onPress={() => setFilter({ type: "all" })} selected={selected} onSelected={onSelected} />
          {chips.map(([key, label]) => (
            <FilterChip key={key} label={label} on={filterId === key} onPress={() => setFilter({ type: "destination", key })} selected={selected} onSelected={onSelected} />
          ))}
          {PRICE_CHIPS.map((chip) => (
            <FilterChip key={chip.band} label={chip.label} on={filterId === `price:${chip.band}`} onPress={() => setFilter({ type: "price", band: chip.band })} selected={selected} onSelected={onSelected} />
          ))}
          {DURATION_CHIPS.map((chip) => (
            <FilterChip key={chip.band} label={chip.label} on={filterId === `duration:${chip.band}`} onPress={() => setFilter({ type: "duration", band: chip.band })} selected={selected} onSelected={onSelected} />
          ))}
        </Animated.ScrollView>
        <View style={{ marginTop: layout.blockGap, height: layout.sectionBlock, paddingHorizontal: space.xl, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
          <Display style={{ fontSize: layout.compact ? 26 : 32, lineHeight: layout.compact ? 28 : 34, color: colors.text }}>Эрэлттэй аяллууд</Display>
          <Text style={{ color: colors.muted, fontSize: 13, fontFamily: fontsReady ? fonts.sansSemi : undefined }}>{results.length}</Text>
        </View>
        <View style={{ paddingHorizontal: space.xl, marginTop: layout.cardGap, gap: space.md }}>
          {results.length === 0 ? (
            <View style={{ backgroundColor: colors.card, borderRadius: radii.xl, padding: space.lg }}>
              <Text style={{ color: colors.text, fontSize: 22, fontFamily: fontsReady ? fonts.display : undefined }}>Тохирох аялал алга</Text>
              <Text style={{ color: colors.muted, marginTop: 6 }}>Өөр чиглэл, үнэ эсвэл хугацаа сонгоно уу.</Text>
            </View>
          ) : null}
          {results.map((tour, index) => (
            <Animated.View key={tour.id} layout={reduceMotion ? undefined : LinearTransition.duration(280)}>
              <TourCard tour={tour} index={index} height={layout.cardHeight} plateInset={layout.plateInset} compact={layout.compact} saved={session.saved.includes(tour.id)} onToggle={() => void session.toggleSaved(tour.id)} onOpen={(id) => router.push({ pathname: "/tour/[id]", params: { id } })} />
            </Animated.View>
          ))}
        </View>
        {catalog.preview ? <Banner text="Урьдчилсан харагдац · эдгээр аяллууд серверийн шууд өгөгдөл биш." /> : null}
        {catalog.offline ? <Banner text="Интернэт алга. Сүүлд уншсан жагсаалтыг харуулж байна." /> : null}
        {catalog.news[0] ? (
          <Stagger index={Math.min(results.length, 6)}>
            <Press label={catalog.news[0].title} onPress={() => router.push({ pathname: "/news/[id]", params: { id: catalog.news[0].id } })} style={[{ marginHorizontal: space.xl, marginTop: space.lg, borderRadius: radii.xxl, overflow: "hidden", height: 150 }, cardShadow]}>
              <RemoteImage uri={catalog.news[0].image} width={1000} height={600} alt="" style={{ width: "100%", height: "100%" }} />
              <LinearGradient colors={["rgba(5,22,20,0.05)", "rgba(5,22,20,0.72)"]} style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }} />
              <View style={{ position: "absolute", left: space.lg, right: space.lg, bottom: space.lg }}>
                <Text style={{ color: brand.mist, fontSize: 11, fontWeight: "700", letterSpacing: 1 }}>{catalog.news[0].category}</Text>
                <Text style={{ color: "white", fontSize: 22, lineHeight: 26, marginTop: 4, fontFamily: fontsReady ? fonts.display : undefined }}>{catalog.news[0].title}</Text>
              </View>
            </Press>
          </Stagger>
        ) : null}
        <ScreenScrollSpacer />
      </Animated.ScrollView>
      {story != null && groups[story] ? <StoryViewer groups={groups} start={story} onClose={() => setStory(null)} /> : null}
    </View>
  );
}

function FilterChip({ label, on, onPress, selected, onSelected }: { label: string; on: boolean; onPress: () => void; selected: string; onSelected: string }) {
  const { colors, fontsReady } = useTheme();
  return (
    <Press label={label} onPress={onPress} style={{ height: 32, paddingHorizontal: 12, borderRadius: radii.pill, alignItems: "center", justifyContent: "center", backgroundColor: on ? selected : colors.card, borderWidth: on ? 0 : 1, borderColor: colors.line }}>
      <Text style={{ color: on ? onSelected : colors.text, fontSize: 13, fontFamily: fontsReady ? fonts.sansSemi : undefined }}>{label}</Text>
    </Press>
  );
}

function TourCard({ tour, index, height, plateInset, compact, saved, onToggle, onOpen }: { tour: Tour; index: number; height: number; plateInset: number; compact: boolean; saved: boolean; onToggle: () => void; onOpen: (id: string) => void }) {
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
    node.measureInWindow((x, y, width, cardHeight) => {
      clearTimeout(timer);
      if (left) return;
      if (width > 1 && cardHeight > 1) stageHeroFlight(tour.id, { x, y, width, height: cardHeight });
      finish();
    });
  }
  const plate = colors.dark ? "rgba(18,40,36,0.94)" : "rgba(255,252,247,0.94)";
  return (
    <Stagger index={index}>
      <View style={[{ height, borderRadius: radii.xxl, backgroundColor: colors.card }, cardShadow]}>
      <Press scaleTo={0.98} label={tour.title} onPress={open} style={{ flex: 1, borderRadius: radii.xxl, overflow: "hidden" }}>
        <View ref={imageRef} collapsable={false} style={{ flex: 1 }}>
          <RemoteImage uri={tour.image} width={1000} height={800} alt={tour.title} fade={false} style={{ width: "100%", height: "100%" }} />
        </View>
        <View pointerEvents="none" style={{ position: "absolute", left: plateInset, right: plateInset, bottom: plateInset, backgroundColor: plate, borderRadius: radii.lg, paddingHorizontal: 12, paddingVertical: compact ? 8 : 10 }}>
          <Text style={{ color: colors.muted, fontSize: 11, fontFamily: fontsReady ? fonts.sansSemi : undefined }}>{tour.destination}</Text>
          <Text style={{ color: colors.text, fontSize: compact ? 18 : 22, lineHeight: compact ? 20 : 24, fontFamily: fontsReady ? fonts.display : undefined }} numberOfLines={1}>{tour.title}</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
            <Text style={{ color: colors.muted, fontSize: 11, flex: 1 }} numberOfLines={1}>{[tour.duration, tour.dates].filter(Boolean).join(" · ")}</Text>
            <Text style={{ color: colors.accent, fontSize: 14, fontFamily: fontsReady ? fonts.sansBold : undefined }}>{formatPrice(tour.price)}</Text>
          </View>
        </View>
      </Press>
      <SaveHeart saved={saved} onToggle={onToggle} style={{ position: "absolute", top: 8, right: 8, zIndex: 3 }} />
      </View>
    </Stagger>
  );
}
