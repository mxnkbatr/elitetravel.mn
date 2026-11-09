import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Press, RemoteImage, StateBlock, Txt } from "../components/ui";
import { useCatalog } from "../state/catalog";
import { fonts, useTheme } from "../theme";

export function NewsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, fontsReady } = useTheme();
  const catalog = useCatalog();
  const item = catalog.news.find((news) => news.id === id);
  if (!item) return <StateBlock title="Мэдээ олдсонгүй" action="Буцах" onAction={() => router.back()} />;
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
      <RemoteImage uri={item.image} width={1200} height={800} alt="" style={{ width: "100%", height: 260 }} />
      <Press label="Буцах" onPress={() => router.back()} style={{ position: "absolute", top: insets.top + 8, left: 16 }}>
        <Text style={{ color: "white", fontWeight: "700" }}>←</Text>
      </Press>
      <Text style={{ color: colors.accent, margin: 18, fontWeight: "700" }}>{item.category}</Text>
      <Text style={{ color: colors.text, fontSize: 32, marginHorizontal: 18, fontFamily: fontsReady ? fonts.display : undefined }}>{item.title}</Text>
      {item.body.map((paragraph) => (
        <Txt key={paragraph} style={{ marginHorizontal: 18, marginTop: 12 }}>{paragraph}</Txt>
      ))}
      {item.tourId ? (
        <Press label="Аялал" onPress={() => router.push({ pathname: "/tour/[id]", params: { id: item.tourId! } })} style={{ margin: 18 }}>
          <Text style={{ color: colors.accent, fontWeight: "700" }}>Холбоотой аялал</Text>
        </Press>
      ) : null}
    </ScrollView>
  );
}
