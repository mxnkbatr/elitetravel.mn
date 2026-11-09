import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SaveHeart } from "../components/SaveHeart";
import { cardShadow, Press, RemoteImage, ScreenScrollSpacer, StateBlock, Txt } from "../components/ui";
import { formatPrice } from "../lib/money";
import { useCatalog } from "../state/catalog";
import { useSession } from "../state/session";
import { fonts, radii, space, typeScale, useTheme } from "../theme";

export function SavedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, fontsReady } = useTheme();
  const session = useSession();
  const catalog = useCatalog();
  const tours = session.saved.map((id) => catalog.tourById(id)).filter((tour) => tour != null);
  const missing = Math.max(0, session.saved.length - tours.length);

  if (catalog.status === "loading" && session.saved.length > 0 && tours.length === 0) {
    return <StateBlock busy title="Хадгалсан аяллыг ачаалж байна" />;
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: space.xl, paddingTop: insets.top + space.lg, gap: space.md }}>
      <Press label="Профайл руу буцах" onPress={() => router.back()}>
        <Text style={{ color: colors.accent, fontWeight: "700", fontFamily: fontsReady ? fonts.sansSemi : undefined }}>← Профайл</Text>
      </Press>
      <Text style={{ color: colors.text, fontSize: typeScale.display, lineHeight: 36, fontFamily: fontsReady ? fonts.display : undefined }}>Хадгалсан</Text>
      <Txt muted>{session.status === "user" ? "Энэ утсан дээр хадгалсан. Нэвтэрсэн үед бүртгэл рүү хуулагдана." : "Одоогоор зөвхөн энэ төхөөрөмж дээр. Нэвтэрвэл бүртгэл рүү хуулна."}</Txt>
      {missing > 0 ? <Txt muted>{missing} хадгалсан аялал энэ жагсаалтад алга.</Txt> : null}
      {tours.length === 0 ? (
        <View style={[{ backgroundColor: colors.card, borderRadius: radii.xxl, padding: space.lg, gap: space.sm }, cardShadow]}>
          <Text style={{ color: colors.text, fontSize: typeScale.section, fontFamily: fontsReady ? fonts.display : undefined }}>Хадгалсан аялал алга</Text>
          <Txt muted>Аяллын карт эсвэл дэлгэрэнгүй дээрх зүрх энд хадгална.</Txt>
        </View>
      ) : (
        tours.map((tour) => (
          <View key={tour.id} style={[{ backgroundColor: colors.card, borderRadius: radii.xxl, overflow: "hidden" }, cardShadow]}>
            <Press label={tour.title} onPress={() => router.push({ pathname: "/tour/[id]", params: { id: tour.id } })}>
              <RemoteImage uri={tour.image} width={1000} height={640} alt={tour.title} style={{ width: "100%", height: 160 }} />
              <View style={{ padding: space.lg, paddingRight: 64, gap: 4 }}>
                <Text style={{ color: colors.muted, fontSize: typeScale.caption, fontWeight: "700" }}>{tour.destination}</Text>
                <Text style={{ color: colors.text, fontSize: 22, fontFamily: fontsReady ? fonts.display : undefined }}>{tour.title}</Text>
                <Text style={{ color: colors.accent, fontWeight: "700", fontFamily: fontsReady ? fonts.sansBold : undefined }}>{formatPrice(tour.price)}</Text>
              </View>
            </Press>
            <SaveHeart saved onToggle={() => void session.toggleSaved(tour.id)} style={{ position: "absolute", top: 12, right: 12 }} />
          </View>
        ))
      )}
      <ScreenScrollSpacer />
    </ScrollView>
  );
}
