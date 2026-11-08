import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Banner, Press, RemoteImage, ScreenScrollSpacer, StateBlock } from "../components/ui";
import { formatPrice } from "../lib/money";
import { searchTours, seatHint } from "../lib/tours";
import { useCatalog } from "../state/catalog";
import { fonts, useTheme } from "../theme";

export function ToursScreen() {
  const params = useLocalSearchParams<{ q?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, fontsReady } = useTheme();
  const catalog = useCatalog();
  const [query, setQuery] = useState(typeof params.q === "string" ? params.q : "");
  const [filter, setFilter] = useState("all");
  const destinations = useMemo(() => {
    const keys = new Map<string, string>();
    for (const tour of catalog.tours) if (tour.destinationKey && tour.status !== "ended") keys.set(tour.destinationKey, tour.destination);
    return [...keys.entries()];
  }, [catalog.tours]);
  const results = useMemo(() => {
    const found = searchTours(catalog.tours, query);
    if (filter === "soon") return found.filter((tour) => tour.tag === "soon" || tour.price == null);
    if (filter === "all") return found;
    return found.filter((tour) => tour.destinationKey === filter);
  }, [catalog.tours, query, filter]);

  if (catalog.status === "loading") return <StateBlock busy title="Аяллыг ачаалж байна" />;
  if (catalog.status === "error") return <StateBlock title="Жагсаалт нээгдсэнгүй" body={catalog.error} action="Дахин" onAction={catalog.refresh} />;

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingHorizontal: 18 }}
      data={results}
      keyExtractor={(item) => item.id}
      refreshing={false}
      onRefresh={catalog.refresh}
      ListHeaderComponent={
        <View style={{ gap: 12, marginBottom: 14 }}>
          <Text style={{ color: colors.text, fontSize: 40, fontFamily: fontsReady ? fonts.display : undefined }}>Аяллууд</Text>
          {catalog.preview ? <Banner text="Урьдчилсан харагдац. Хайлт энэ жагсаалт дотор." /> : null}
          {catalog.offline ? <Banner text="Сүлжээгүй. Сүүлд хадгалсан жагсаалт." /> : null}
          <TextInput value={query} onChangeText={setQuery} placeholder="Аялал, чиглэл хайх" placeholderTextColor={colors.muted} accessibilityLabel="Хайлт" style={{ backgroundColor: colors.card, color: colors.text, borderRadius: 18, minHeight: 52, paddingHorizontal: 16, borderWidth: 1, borderColor: colors.line }} />
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {[["all", "Бүгд"], ...destinations, ["soon", "Удахгүй"]].map(([key, label]) => (
              <Press key={key} label={label} onPress={() => setFilter(key)} style={{ paddingHorizontal: 12, minHeight: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: filter === key ? colors.accent : colors.card }}>
                <Text style={{ color: filter === key ? colors.onAccent : colors.text, fontWeight: "700", fontSize: 13 }}>{label}</Text>
              </Press>
            ))}
          </View>
        </View>
      }
      ListEmptyComponent={<Text style={{ color: colors.muted, paddingVertical: 24 }}>Тохирох аялал алга.</Text>}
      renderItem={({ item }) => {
        const seats = seatHint(catalog.seats, item.id);
        return (
          <Press label={item.title} onPress={() => router.push({ pathname: "/tour/[id]", params: { id: item.id } })} style={{ marginBottom: 14, backgroundColor: colors.card, borderRadius: 28, overflow: "hidden" }}>
            <RemoteImage uri={item.image} width={1000} height={700} alt={item.title} style={{ width: "100%", height: 190 }} />
            <View style={{ padding: 16, gap: 4 }}>
              <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "700" }}>{item.destination}</Text>
              <Text style={{ color: colors.text, fontSize: 26, fontFamily: fontsReady ? fonts.display : undefined }}>{item.title}</Text>
              <Text style={{ color: colors.muted }}>{[item.duration, item.dates].filter(Boolean).join(" · ")}</Text>
              <Text style={{ color: colors.accent, fontSize: 18, fontWeight: "700", marginTop: 6 }}>{formatPrice(item.price)}</Text>
              {seats ? <Text style={{ color: colors.gold, fontWeight: "700" }}>{seats}</Text> : null}
            </View>
          </Press>
        );
      }}
      ListFooterComponent={<ScreenScrollSpacer />}
    />
  );
}
