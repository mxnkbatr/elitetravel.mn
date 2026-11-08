import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Banner, cardShadow, Display, GlassBar, Press, RemoteImage, Reveal, ScreenScrollSpacer, StateBlock } from "../components/ui";
import { COAST_PLATE } from "../lib/config";
import { formatPrice } from "../lib/money";
import { isBookable, listedTours, searchTours } from "../lib/tours";
import { useCatalog } from "../state/catalog";
import { fonts, useTheme } from "../theme";

export function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, fontsReady } = useTheme();
  const catalog = useCatalog();
  const [query, setQuery] = useState("");
  const open = listedTours(catalog.tours).filter(isBookable);
  const results = useMemo(() => (query.trim() ? searchTours(catalog.tours, query) : open), [catalog.tours, open, query]);

  if (catalog.status === "loading") return <StateBlock busy title="Аяллыг ачаалж байна" />;
  if (catalog.status === "error") return <StateBlock title="Жагсаалт нээгдсэнгүй" body={catalog.error} action="Дахин" onAction={catalog.refresh} />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: 8 }}>
      <View style={{ height: 468 }}>
        <RemoteImage uri={COAST_PLATE} width={1400} height={1800} alt="Хайнангийн далайн эрэг" style={{ width: "100%", height: "100%" }} />
        <LinearGradient
          colors={["rgba(5,22,20,0.5)", "rgba(5,22,20,0.05)", "rgba(5,22,20,0.18)", "rgba(6,24,22,0.78)", colors.bg]}
          locations={[0, 0.28, 0.5, 0.82, 1]}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />
        <View style={{ position: "absolute", left: 22, right: 22, top: insets.top + 8 }}>
          <Text style={{ color: "white", letterSpacing: 5, fontSize: 15, fontFamily: fontsReady ? fonts.sansBold : undefined }}>ELITE</Text>
          <Text style={{ color: "rgba(255,255,255,0.78)", letterSpacing: 4, fontSize: 10, marginTop: 2, fontFamily: fontsReady ? fonts.sansSemi : undefined }}>TRAVEL</Text>
        </View>
        <View style={{ position: "absolute", left: 22, right: 22, top: insets.top + 86 }}>
          <Text style={{ color: "#b7efe6", letterSpacing: 2.4, fontSize: 11, fontWeight: "700" }}>ELITE TRAVEL MONGOLIA</Text>
          <Display style={{ color: "white", fontSize: 54, lineHeight: 50, marginTop: 10 }}>Халуун орны</Display>
          <Display italic style={{ color: "#e8b86d", fontSize: 54, lineHeight: 52 }}>мөрөөдлөө</Display>
          <Display style={{ color: "white", fontSize: 54, lineHeight: 50 }}>бодит болго.</Display>
          <Text style={{ color: "rgba(255,255,255,0.86)", marginTop: 14, maxWidth: 280, fontSize: 15, lineHeight: 22, fontFamily: fontsReady ? fonts.sans : undefined }}>
            Хайнань, Хонг Конг, Бали болон концерт аяллууд.
          </Text>
        </View>
      </View>
      <Reveal delay={40} style={{ marginTop: -36, paddingHorizontal: 18 }}>
        <GlassBar style={{ height: 56, borderRadius: 28, flexDirection: "row", alignItems: "center", paddingLeft: 16, paddingRight: 6, ...cardShadow }}>
          <Ionicons name="search" size={18} color={colors.dark ? colors.text : "#12312d"} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Аялал, чиглэл хайх"
            placeholderTextColor={colors.muted}
            accessibilityLabel="Хайлт"
            style={{ flex: 1, marginLeft: 10, color: colors.text, fontSize: 15, paddingVertical: 8 }}
          />
        </GlassBar>
      </Reveal>
      {catalog.preview ? <Banner text="Урьдчилсан харагдац · доорх аяллууд серверийн шууд өгөгдөл биш." /> : null}
      {catalog.offline ? <Banner text="Интернэт алга. Сүүлд уншсан жагсаалтыг харуулж байна." /> : null}
      <Reveal delay={120} style={{ marginTop: 26, paddingHorizontal: 22, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
        <Display style={{ fontSize: 32, lineHeight: 34, color: colors.text }}>Эрэлттэй аяллууд</Display>
        <Text style={{ color: colors.muted, fontSize: 13 }}>{results.length}</Text>
      </Reveal>
      <Reveal delay={200}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 22, gap: 14, paddingTop: 14, paddingBottom: 8 }}>
        {results.map((tour) => (
          <Press scaleTo={0.97} key={tour.id} label={tour.title} onPress={() => router.push({ pathname: "/tour/[id]", params: { id: tour.id } })} style={[{ width: 220, backgroundColor: colors.card, borderRadius: 28, overflow: "hidden" }, cardShadow]}>
            <View>
              <RemoteImage uri={tour.image} width={800} height={640} alt={tour.title} style={{ width: 220, height: 148 }} />
              <Text style={{ position: "absolute", top: 12, left: 12, backgroundColor: "rgba(255,255,255,0.94)", color: "#0a2a26", borderRadius: 999, overflow: "hidden", paddingHorizontal: 10, paddingVertical: 5, fontSize: 11, fontWeight: "700" }}>{tour.destination}</Text>
              {tour.discount ? <Text style={{ position: "absolute", top: 12, right: 12, backgroundColor: colors.accent, color: "white", borderRadius: 999, overflow: "hidden", paddingHorizontal: 8, paddingVertical: 5, fontSize: 11, fontWeight: "700" }}>{tour.discount}</Text> : null}
            </View>
            <View style={{ paddingHorizontal: 14, paddingTop: 12, paddingBottom: 14, minHeight: 108 }}>
              <Text style={{ color: colors.text, fontSize: 22, lineHeight: 24, fontFamily: fontsReady ? fonts.display : undefined }} numberOfLines={2}>{tour.title}</Text>
              <Text style={{ color: colors.muted, fontSize: 12, marginTop: 6, lineHeight: 16 }}>{[tour.duration, tour.dates].filter(Boolean).join(" · ")}</Text>
              <View style={{ marginTop: 8 }}>
                {tour.oldPrice ? <Text style={{ color: "#7d948d", textDecorationLine: "line-through", fontSize: 12, marginBottom: 2 }}>{formatPrice(tour.oldPrice)}</Text> : null}
                <Text style={{ color: colors.accent, fontWeight: "700", fontSize: 17 }}>{formatPrice(tour.price)}</Text>
              </View>
            </View>
          </Press>
        ))}
      </ScrollView>
      </Reveal>
      {catalog.news[0] ? (
        <Press label={catalog.news[0].title} onPress={() => router.push({ pathname: "/news/[id]", params: { id: catalog.news[0].id } })} style={[{ marginHorizontal: 22, marginTop: 18, borderRadius: 28, overflow: "hidden", height: 168 }, cardShadow]}>
          <RemoteImage uri={catalog.news[0].image} width={1000} height={600} alt="" style={{ width: "100%", height: "100%" }} />
          <LinearGradient colors={["rgba(5,22,20,0.05)", "rgba(5,22,20,0.72)"]} style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }} />
          <View style={{ position: "absolute", left: 16, right: 16, bottom: 16 }}>
            <Text style={{ color: "#b7efe6", fontSize: 11, fontWeight: "700", letterSpacing: 1 }}>{catalog.news[0].category}</Text>
            <Text style={{ color: "white", fontSize: 24, lineHeight: 26, marginTop: 4, fontFamily: fontsReady ? fonts.display : undefined }}>{catalog.news[0].title}</Text>
          </View>
        </Press>
      ) : null}
      <ScreenScrollSpacer />
    </ScrollView>
  );
}
