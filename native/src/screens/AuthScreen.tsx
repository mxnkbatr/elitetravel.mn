import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Field, Press, Txt } from "../components/ui";
import { useSession } from "../state/session";
import { fonts, useTheme } from "../theme";

export function AuthScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, fontsReady } = useTheme();
  const session = useSession();
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
      await session.requestCode(email.trim().toLowerCase());
      setSent(true);
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
      await session.verifyCode(email.trim().toLowerCase(), code, name);
      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Нэвтэрч чадсангүй.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 20, paddingTop: insets.top + 16, gap: 12 }}>
      <Press label="Хаах" onPress={() => router.back()}><Text style={{ color: colors.accent }}>Хаах</Text></Press>
      <Text style={{ color: colors.text, fontSize: 36, fontFamily: fontsReady ? fonts.display : undefined }}>Нэвтрэх</Text>
      <Txt muted>Имэйлээр ирсэн кодыг энд оруулна. Холбоос нь вэб хуудсан дээрх сессийг нээдэг бөгөөд энэ аппын сесс болохгүй.</Txt>
      <Field label="Имэйл" value={email} onChangeText={setEmail} keyboard="email-address" />
      {sent ? (
        <>
          <Field label="Код" value={code} onChangeText={setCode} keyboard="number-pad" />
          <Field label="Нэр, анх удаа бол" value={name} onChangeText={setName} />
        </>
      ) : null}
      {error ? <Text style={{ color: colors.danger }}>{error}</Text> : null}
      <Press label={sent ? "Баталгаажуулах" : "Код авах"} disabled={busy} onPress={() => void (sent ? verify() : send())} style={{ height: 52, borderRadius: 26, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: colors.onAccent, fontWeight: "700" }}>{busy ? "Түр хүлээнэ үү…" : sent ? "Баталгаажуулах" : "Код авах"}</Text>
      </Press>
    </View>
  );
}
