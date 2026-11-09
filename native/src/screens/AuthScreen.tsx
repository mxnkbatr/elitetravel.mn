import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cardShadow, Field, Press, RemoteImage, Txt } from "../components/ui";
import type { AuthMode } from "../lib/auth";
import { COAST_PLATE } from "../lib/config";
import { useSession } from "../state/session";
import { fonts, useTheme } from "../theme";

export function AuthScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, fontsReady } = useTheme();
  const session = useSession();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function send() {
    setBusy(true);
    setError(null);
    try {
      await session.requestCode(email);
      setSent(true);
      setCode("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Код илгээгдсэнгүй.");
    } finally {
      setBusy(false);
    }
  }

  async function verify() {
    setBusy(true);
    setError(null);
    try {
      await session.verifyCode(email, code, mode, name);
      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Нэвтэрч чадсангүй.");
      setCode("");
    } finally {
      setBusy(false);
    }
  }

  const title = sent ? "Кодоо оруулна уу" : mode === "signup" ? "Бүртгүүлэх" : "Тавтай морил";
  const help = sent
    ? "Имэйл рүү 6 оронтой код очно. Холбоос нь зөвхөн вэб дээрх сессийг нээдэг."
    : mode === "signup"
      ? "Шинэ бүртгэл тусдаа алхам биш. Код илгээхэд сервер бүртгэл үүсгэнэ. Нууц үг байхгүй."
      : "Имэйлээ оруулаад ирсэн кодоор нэвтэрнэ. Бүртгэлтэй хаяг мөн энэ кодоор орно.";

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ height: 210 }}>
        <RemoteImage uri={COAST_PLATE} width={1200} height={800} alt="" style={{ width: "100%", height: "100%" }} />
        <LinearGradient colors={["rgba(5,22,20,0.25)", colors.bg]} style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }} />
        <Press label="Хаах" onPress={() => router.back()} style={{ position: "absolute", top: insets.top + 8, left: 16, height: 36, paddingHorizontal: 12, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.85)", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: colors.accent, fontWeight: "700" }}>Хаах</Text>
        </Press>
      </View>
      <View style={{ paddingHorizontal: 20, marginTop: -28, gap: 12 }}>
      <Text style={{ color: colors.accent, letterSpacing: 2, fontSize: 11, fontWeight: "700" }}>ELITE TRAVEL</Text>
      <Text accessibilityRole="header" style={{ color: colors.text, fontSize: 40, lineHeight: 42, fontFamily: fontsReady ? fonts.display : undefined }}>{title}</Text>
      <Txt muted>{help}</Txt>
      {!sent && session.faceIdOn && session.biometry ? (
        <Press label={`${session.biometry}-аар нэвтрэх`} disabled={busy} onPress={() => void session.faceIdSignIn().then(() => router.back()).catch((e: unknown) => setError(e instanceof Error ? e.message : "Нэвтэрч чадсангүй."))} style={{ height: 52, borderRadius: 26, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: colors.onAccent, fontWeight: "700" }}>{session.biometry}-аар нэвтрэх</Text>
        </Press>
      ) : null}
      {!sent ? (
        <View style={{ flexDirection: "row", gap: 8 }}>
          {(["login", "signup"] as const).map((item) => (
            <Press key={item} label={item === "login" ? "Нэвтрэх" : "Бүртгүүлэх"} onPress={() => setMode(item)} style={{ flex: 1, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: mode === item ? colors.card : "transparent" }}>
              <Text style={{ color: mode === item ? colors.text : colors.muted, fontWeight: "700" }}>{item === "login" ? "Нэвтрэх" : "Бүртгүүлэх"}</Text>
            </Press>
          ))}
        </View>
      ) : null}
      {!sent ? <Field label="Имэйл" value={email} onChangeText={setEmail} keyboard="email-address" placeholder="name@example.com" /> : <Txt>{email.trim().toLowerCase()}</Txt>}
      {!sent && mode === "signup" ? <Field label="Таны нэр" value={name} onChangeText={setName} /> : null}
      {sent ? <Field label="6 оронтой код" value={code} onChangeText={setCode} keyboard="number-pad" placeholder="000000" /> : null}
      {error ? <Text style={{ color: colors.danger }} accessibilityRole="alert">{error}</Text> : null}
      <Press label={sent ? "Нэвтрэх" : "Код авах"} disabled={busy} onPress={() => void (sent ? verify() : send())} style={{ height: 52, borderRadius: 26, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: colors.onAccent, fontWeight: "700" }}>{busy ? "Түр хүлээнэ үү…" : sent ? "Нэвтрэх" : "Код авах"}</Text>
      </Press>
      {sent ? (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Press label="Имэйл солих" onPress={() => { setSent(false); setCode(""); setError(null); }}><Text style={{ color: colors.muted }}>Имэйл солих</Text></Press>
          <Press label="Дахин илгээх" disabled={busy} onPress={() => void send()}><Text style={{ color: colors.accent, fontWeight: "700" }}>Дахин илгээх</Text></Press>
        </View>
      ) : null}
      </View>
    </View>
  );
}
