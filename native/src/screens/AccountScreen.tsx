import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Linking, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cardShadow, Field, Press, ScreenScrollSpacer, StateBlock, Txt } from "../components/ui";
import { INSTAGRAM, PHONE_ALT, PHONE_DISPLAY, PHONE_TEL } from "../lib/config";
import { usePush } from "../state/push";
import { useSession } from "../state/session";
import { fonts, radii, space, typeScale, useTheme } from "../theme";

export function AccountScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, fontsReady } = useTheme();
  const session = useSession();
  const push = usePush();
  const [name, setName] = useState(session.profile?.name ?? "");
  const [phone, setPhone] = useState(session.profile?.phone ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session.profile) return;
    setName(session.profile.name);
    setPhone(session.profile.phone);
  }, [session.profile]);

  if (session.status === "loading") return <StateBlock busy title="Бүртгэлийг шалгаж байна" />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: space.xl, paddingTop: insets.top + space.lg, gap: space.md }}>
      <Text style={{ color: colors.text, fontSize: typeScale.display, lineHeight: 36, fontFamily: fontsReady ? fonts.display : undefined }}>Профайл</Text>
      {session.error ? <Txt>{session.error}</Txt> : null}
      {session.status === "offline" && session.profile ? <Txt>Сүлжээгүй тул бүртгэл шинэчлэгдсэнгүй. Сүүлд хадгалсан нэрийг харуулж байна.</Txt> : null}
      {session.status === "guest" || (session.status === "offline" && !session.profile) ? (
        <View style={[{ gap: space.md, backgroundColor: colors.card, borderRadius: radii.xxl, padding: space.lg }, cardShadow]}>
          <Txt>Имэйлээр нэг удаагийн код авч нэвтэрнэ. Нууц үг байхгүй.</Txt>
          {session.status === "offline" ? <Press label="Дахин шалгах" onPress={session.refresh}><Text style={{ color: colors.accent, fontWeight: "700" }}>Дахин шалгах</Text></Press> : null}
          <Press label="Нэвтрэх" onPress={() => router.push("/auth")} style={{ height: 52, borderRadius: 26, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: colors.onAccent, fontWeight: "700" }}>Нэвтрэх</Text>
          </Press>
          {session.faceIdOn && session.biometry ? (
            <Press label={`${session.biometry}-аар нэвтрэх`} onPress={() => void session.faceIdSignIn().catch((e: unknown) => setError(e instanceof Error ? e.message : "Нэвтэрч чадсангүй."))}>
              <Text style={{ color: colors.accent, fontWeight: "700" }}>{session.biometry}-аар нэвтрэх</Text>
            </Press>
          ) : null}
        </View>
      ) : (
        <View style={[{ gap: space.md, backgroundColor: colors.card, borderRadius: radii.xxl, padding: space.lg }, cardShadow]}>
          <Txt>{session.profile?.email}</Txt>
          <Field label="Нэр" value={name} onChangeText={setName} />
          <Field label="Утас" value={phone} onChangeText={setPhone} keyboard="phone-pad" />
          <Press label="Хадгалах" onPress={() => void session.updateProfile({ name, phone }).catch((e: unknown) => setError(e instanceof Error ? e.message : "Хадгалж чадсангүй."))} style={{ height: 48, borderRadius: 18, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: colors.onAccent, fontWeight: "700" }}>Хадгалах</Text>
          </Press>
          {session.biometry ? (
            <Press label="Face ID" onPress={() => void (session.faceIdOn ? session.disableFaceId() : session.enableFaceId()).catch((e: unknown) => setError(e instanceof Error ? e.message : "Face ID болсонгүй."))}>
              <Text style={{ color: colors.text, fontWeight: "700" }}>{session.faceIdOn ? `${session.biometry} унтраах` : `${session.biometry} асаах`}</Text>
            </Press>
          ) : (
            <Txt muted>Энэ төхөөрөмж дээр биометр бүртгэлгүй, эсвэл апп вэбээр нээгдсэн тул Face ID асахгүй.</Txt>
          )}
          <Press label="Гарах" onPress={() => void session.logout()}>
            <Text style={{ color: colors.text }}>Энэ төхөөрөмжөөс гарах</Text>
          </Press>
          <Press label="Бүртгэл устгах" onPress={() => Alert.alert("Бүртгэл устгах уу?", "Нэвтрэлт болон профайл устана. Захиалга Elite Travel дээр үлдэнэ.", [{ text: "Болих", style: "cancel" }, { text: "Устгах", style: "destructive", onPress: () => void session.deleteAccount().catch((e: unknown) => setError(e instanceof Error ? e.message : "Устгаж чадсангүй.")) }])}>
            <Text style={{ color: colors.danger }}>Бүртгэл устгах</Text>
          </Press>
        </View>
      )}
      {error ? <Text style={{ color: colors.danger }}>{error}</Text> : null}
      <Press label="Хадгалсан" onPress={() => router.push("/saved")} style={[{ backgroundColor: colors.card, borderRadius: radii.xxl, padding: space.lg, flexDirection: "row", alignItems: "center", gap: space.md }, cardShadow]}>
        <Ionicons name="heart" size={20} color={colors.accent} />
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontSize: typeScale.section, fontFamily: fontsReady ? fonts.display : undefined }}>Хадгалсан</Text>
          <Txt muted>Энэ утсан дээр хадгалсан аялал</Txt>
        </View>
        <Text style={{ color: colors.accent, fontWeight: "700", fontFamily: fontsReady ? fonts.sansBold : undefined }}>{session.saved.length}</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.muted} />
      </Press>
      <View style={[{ gap: space.sm, backgroundColor: colors.card, borderRadius: radii.xxl, padding: space.lg }, cardShadow]}>
        <Text style={{ color: colors.text, fontSize: typeScale.section, fontFamily: fontsReady ? fonts.display : undefined }}>Мэдэгдэл</Text>
        <Txt muted>Захиалгын мэдээ энэ утсанд ирнэ. Апп нээгдэхэд зөвшөөрөл асуухгүй.</Txt>
        {push.permission === "unavailable" ? (
          <Txt muted>Firebase мэдэгдэл зөвхөн утасны апп дээр бүртгэгдэнэ.</Txt>
        ) : (
          <Press
            label={push.enabled ? "Мэдэгдэл унтраах" : "Мэдэгдэл асаах"}
            disabled={push.busy}
            onPress={() => void (push.enabled ? push.disable() : push.enable())}
            style={{ height: 48, borderRadius: 18, backgroundColor: push.enabled ? colors.bgSoft : colors.accent, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ color: push.enabled ? colors.text : colors.onAccent, fontWeight: "700" }}>{push.busy ? "Түр хүлээнэ үү" : push.enabled ? "Асаалттай · унтраах" : "Унтраалттай · асаах"}</Text>
          </Press>
        )}
        {push.permission === "denied" ? <Txt muted>Зөвшөөрөл хаалттай. Товч нь iOS тохиргоог нээнэ.</Txt> : null}
        {push.error ? <Text style={{ color: colors.danger }}>{push.error}</Text> : null}
      </View>
      <View style={[{ marginTop: space.xs, gap: space.xs, backgroundColor: colors.card, borderRadius: radii.xxl, padding: space.lg }, cardShadow]}>
        <Text style={{ color: colors.text, fontSize: typeScale.section, fontFamily: fontsReady ? fonts.display : undefined }}>Холбоо барих</Text>
        <Txt muted>Аялал, үнэ, огнооны талаар бидэнтэй холбогдоорой.</Txt>
        <Press label={`Утас ${PHONE_DISPLAY}`} onPress={() => void Linking.openURL(PHONE_TEL)} style={contactRow}>
          <View style={[contactIcon, { backgroundColor: colors.accent }]}>
            <Ionicons name="call" size={18} color={colors.onAccent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.muted, fontSize: 12, fontFamily: fontsReady ? fonts.sansSemi : undefined }}>Утас</Text>
            <Text style={{ color: colors.text, fontSize: 17, fontWeight: "700", marginTop: 1, fontFamily: fontsReady ? fonts.sansBold : undefined }}>{PHONE_DISPLAY}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.muted} />
        </Press>
        <Press label={`Эсвэл ${PHONE_ALT}`} onPress={() => void Linking.openURL(`tel:${PHONE_ALT.replace(/[^\d+]/g, "")}`)} style={contactRow}>
          <View style={[contactIcon, { backgroundColor: colors.bgSoft }]}>
            <Ionicons name="call-outline" size={18} color={colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.muted, fontSize: 12, fontFamily: fontsReady ? fonts.sansSemi : undefined }}>Эсвэл</Text>
            <Text style={{ color: colors.text, fontSize: 17, fontWeight: "700", marginTop: 1, fontFamily: fontsReady ? fonts.sansBold : undefined }}>{PHONE_ALT}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.muted} />
        </Press>
        <Press label="Instagram · @elitetravelmn" onPress={() => void Linking.openURL(INSTAGRAM)} style={contactRow}>
          <View style={[contactIcon, { backgroundColor: colors.bgSoft }]}>
            <Ionicons name="logo-instagram" size={18} color={colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.muted, fontSize: 12, fontFamily: fontsReady ? fonts.sansSemi : undefined }}>Instagram</Text>
            <Text style={{ color: colors.text, fontSize: 17, fontWeight: "700", marginTop: 1, fontFamily: fontsReady ? fonts.sansBold : undefined }}>@elitetravelmn</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.muted} />
        </Press>
      </View>
      <ScreenScrollSpacer />
    </ScrollView>
  );
}

const contactRow = { minHeight: 64, borderRadius: radii.lg, flexDirection: "row" as const, alignItems: "center" as const, gap: space.md };
const contactIcon = { width: 42, height: 42, borderRadius: radii.sm, alignItems: "center" as const, justifyContent: "center" as const };
