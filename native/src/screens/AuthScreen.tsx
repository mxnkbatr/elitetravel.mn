import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Field, Press, Txt } from "../components/ui";
import type { AuthMode } from "../lib/auth";
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
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 20, paddingTop: insets.top + 16, gap: 12 }}>
      <Press label="Хаах" onPress={() => router.back()}><Text style={{ color: colors.accent }}>Хаах</Text></Press>
      <Text accessibilityRole="header" style={{ color: colors.text, fontSize: 36, fontFamily: fontsReady ? fonts.display : undefined }}>{title}</Text>
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
  );
}
