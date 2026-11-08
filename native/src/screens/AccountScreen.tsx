import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Linking, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Field, Press, ScreenScrollSpacer, StateBlock, Txt } from "../components/ui";
import { INSTAGRAM, PHONE_ALT, PHONE_DISPLAY, PHONE_TEL } from "../lib/config";
import { useSession } from "../state/session";
import { fonts, useTheme } from "../theme";

export function AccountScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, fontsReady } = useTheme();
  const session = useSession();
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
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 20, paddingTop: insets.top + 16, gap: 12 }}>
      <Text style={{ color: colors.text, fontSize: 40, fontFamily: fontsReady ? fonts.display : undefined }}>Бүртгэл</Text>
      {session.error ? <Txt>{session.error}</Txt> : null}
      {session.status === "offline" && session.profile ? <Txt>Сүлжээгүй тул бүртгэл шинэчлэгдсэнгүй. Сүүлд хадгалсан нэрийг харуулж байна.</Txt> : null}
      {session.status === "guest" || (session.status === "offline" && !session.profile) ? (
        <View style={{ gap: 10 }}>
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
        <View style={{ gap: 12 }}>
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
      <View style={{ marginTop: 8, gap: 6 }}>
        <Text style={{ color: colors.text, fontSize: 22, fontFamily: fontsReady ? fonts.display : undefined }}>Мэдэгдэл</Text>
        <Txt muted>Захиалгын мэдэгдлийг сервер Firebase Cloud Messaging-ээр илгээдэг. Энэ Expo хувилбарт FCM төхөөрөмжийн токен авахад хэрэгтэй Firebase тохиргоог оруулаагүй тул мэдэгдэл бүртгэхгүй. Capacitor аппын түлхүүрийг энд хуулаагүй.</Txt>
        <Press label="Утас" onPress={() => void Linking.openURL(PHONE_TEL)}><Text style={{ color: colors.accent, fontWeight: "700" }}>{PHONE_DISPLAY}</Text></Press>
        <Txt muted>Эсвэл {PHONE_ALT}</Txt>
        <Press label="Instagram" onPress={() => void Linking.openURL(INSTAGRAM)}><Text style={{ color: colors.accent, fontWeight: "700" }}>Instagram · @elitetravelmn</Text></Press>
        <Txt muted>Үнэ, огноо, зураг серверээс ирнэ. Аппын загвар шинэчлэгдэхийн тулд шинэ хувилбар хэрэгтэй.</Txt>
      </View>
      <ScreenScrollSpacer />
    </ScrollView>
  );
}
