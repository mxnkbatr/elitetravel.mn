import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Banner, Display, GlassBar, Press, RemoteImage, ScreenScrollSpacer, StateBlock, Txt } from "../components/ui";
import { HERO_STILL } from "../lib/config";
import { formatPrice } from "../lib/money";
import { isBookable, listedTours } from "../lib/tours";
import { useCatalog } from "../state/catalog";
import { fonts, useTheme } from "../theme";

export function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, fontsReady } = useTheme();
  const catalog = useCatalog();
  const open = listedTours(catalog.tours).filter(isBookable);
  const hero = open[0]?.image || catalog.tours[0]?.image || HERO_STILL;

  if (catalog.status === "loading") return <StateBlock busy title="Аяллыг ачаалж байна" />;
  if (catalog.status === "error") return <StateBlock title="Жагсаалт нээгдсэнгүй" body={catalog.error} action="Дахин" onAction={catalog.refresh} />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={{ height: 500 }}>
        <RemoteImage uri={hero} width={1200} height={1600} alt="Elite Travel" style={{ width: "100%", height: "100%" }} />
        <View style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: "rgba(5,22,20,0.28)" }} />
        <View style={{ position: "absolute", left: 22, right: 22, top: insets.top + 12 }}>
          <Text style={{ color: "white", letterSpacing: 4, fontSize: 15, fontFamily: fontsReady ? fonts.sansBold : undefined }}>ELITE</Text>
          <Text style={{ color: "rgba(255,255,255,0.8)", letterSpacing: 3, fontSize: 10, marginTop: 2 }}>TRAVEL</Text>
        </View>
        <View style={{ position: "absolute", left: 22, right: 22, top: insets.top + 78 }}>
          <Text style={{ color: "#b7efe6", letterSpacing: 2, fontSize: 11, fontWeight: "700" }}>ELITE TRAVEL MONGOLIA</Text>
          <Display style={{ color: "white", fontSize: 52, lineHeight: 50, marginTop: 8 }}>Халуун орны</Display>
          <Display italic style={{ color: "#e8b86d", fontSize: 52, lineHeight: 52 }}>мөрөөдлөө</Display>
          <Display style={{ color: "white", fontSize: 52, lineHeight: 50 }}>бодит болго.</Display>
          <Txt style={{ color: "rgba(255,255,255,0.86)", marginTop: 12, maxWidth: 280 }}>Хайнань, Хонг Конг, Бали болон концерт аяллууд.</Txt>
        </View>
      </View>
      <View style={{ marginTop: -28, paddingHorizontal: 18 }}>
        <GlassBar style={{ height: 54, borderRadius: 27, flexDirection: "row", alignItems: "center", paddingLeft: 16, paddingRight: 6 }}>
          <Text style={{ flex: 1, color: colors.dark ? colors.text : "#12312d" }} onPress={() => router.push({ pathname: "/tours", params: { focus: "1" } })}>
            Аялал, чиглэл хайх
          </Text>
          <Press label="Хайх" onPress={() => router.push("/tours")} style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: colors.card, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: colors.text, fontSize: 18 }}>→</Text>
          </Press>
        </GlassBar>
      </View>
      {catalog.preview ? <Banner text="Урьдчилсан харагдац. Энэ жагсаалт серверийн шууд өгөгдөл биш." /> : null}
      {catalog.offline ? <Banner text="Интернэт алга. Сүүлд уншсан жагсаалтыг харуулж байна." /> : null}
      <View style={{ marginTop: 22, paddingHorizontal: 22, flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
        <Display style={{ fontSize: 30, color: colors.text }}>Эрэлттэй аяллууд</Display>
        <Press label="Бүх аялал" onPress={() => router.push("/tours")}>
          <Text style={{ color: colors.accent, fontWeight: "700" }}>Бүгд</Text>
        </Press>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 22, gap: 12, paddingTop: 12 }}>
        {open.map((tour) => (
          <Press key={tour.id} label={tour.title} onPress={() => router.push({ pathname: "/tour/[id]", params: { id: tour.id } })} style={{ width: 214, backgroundColor: colors.card, borderRadius: 26, overflow: "hidden" }}>
            <View>
              <RemoteImage uri={tour.image} width={800} height={640} alt={tour.title} style={{ width: 214, height: 132 }} />
              <Text style={{ position: "absolute", top: 10, left: 10, backgroundColor: "rgba(255,255,255,0.94)", color: "#0a2a26", borderRadius: 999, overflow: "hidden", paddingHorizontal: 8, paddingVertical: 4, fontSize: 11, fontWeight: "700" }}>{tour.destination}</Text>
              {tour.discount ? <Text style={{ position: "absolute", top: 10, right: 10, backgroundColor: colors.accent, color: "white", borderRadius: 999, overflow: "hidden", paddingHorizontal: 8, paddingVertical: 4, fontSize: 11, fontWeight: "700" }}>{tour.discount}</Text> : null}
            </View>
            <View style={{ padding: 12 }}>
              <Text style={{ color: colors.text, fontSize: 20, fontFamily: fontsReady ? fonts.display : undefined }} numberOfLines={2}>{tour.title}</Text>
              <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>{[tour.duration, tour.dates].filter(Boolean).join(" · ")}</Text>
              {tour.oldPrice ? <Text style={{ color: colors.muted, textDecorationLine: "line-through", marginTop: 8, fontSize: 12 }}>{formatPrice(tour.oldPrice)}</Text> : null}
              <Text style={{ color: colors.accent, fontWeight: "700", fontSize: 16, marginTop: 2 }}>{formatPrice(tour.price)}</Text>
            </View>
          </Press>
        ))}
      </ScrollView>
      {catalog.news[0] ? (
        <Press label={catalog.news[0].title} onPress={() => router.push({ pathname: "/news/[id]", params: { id: catalog.news[0].id } })} style={{ margin: 22, borderRadius: 24, overflow: "hidden", backgroundColor: colors.card }}>
          <RemoteImage uri={catalog.news[0].image} width={900} height={500} alt="" style={{ width: "100%", height: 140 }} />
          <View style={{ padding: 14 }}>
            <Text style={{ color: colors.accent, fontSize: 12, fontWeight: "700" }}>{catalog.news[0].category}</Text>
            <Text style={{ color: colors.text, fontSize: 20, marginTop: 4, fontFamily: fontsReady ? fonts.display : undefined }}>{catalog.news[0].title}</Text>
          </View>
        </Press>
      ) : null}
      <ScreenScrollSpacer />
    </ScrollView>
  );
}
