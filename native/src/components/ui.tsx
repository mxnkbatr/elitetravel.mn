import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { type ReactNode } from "react";
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, TextInput, View, type ImageStyle, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { imageUrl } from "../lib/money";
import { fonts, useTheme } from "../theme";

export function haptic() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

export function Display({ children, style, italic }: { children: string; style?: StyleProp<TextStyle>; italic?: boolean }) {
  const { fontsReady } = useTheme();
  return (
    <Text accessibilityRole="header" style={[styles.display, fontsReady && { fontFamily: italic ? fonts.displayItalic : fonts.display }, italic && { fontStyle: "italic" }, style]}>
      {children}
    </Text>
  );
}

export function Txt({ children, style, muted }: { children: ReactNode; style?: StyleProp<TextStyle>; muted?: boolean }) {
  const { colors, fontsReady } = useTheme();
  return <Text style={[{ color: muted ? colors.muted : colors.text, fontSize: 15, lineHeight: 22 }, fontsReady && { fontFamily: fonts.sans }, style]}>{children}</Text>;
}

export function Press({ children, onPress, style, disabled, label }: { children: ReactNode; onPress?: () => void; style?: StyleProp<ViewStyle>; disabled?: boolean; label: string }) {
  const { reduceMotion } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={() => {
        if (!reduceMotion) haptic();
        onPress?.();
      }}
      style={({ pressed }) => [style, pressed && !reduceMotion && { opacity: 0.86, transform: [{ scale: 0.985 }] }, disabled && { opacity: 0.45 }]}
    >
      {children}
    </Pressable>
  );
}

export function RemoteImage({ uri, width, height, style, alt }: { uri: string; width: number; height?: number; style?: StyleProp<ImageStyle>; alt: string }) {
  const { colors } = useTheme();
  return <Image source={{ uri: imageUrl(uri, width, height) }} accessibilityLabel={alt} style={[{ backgroundColor: colors.bgSoft }, style]} contentFit="cover" transition={180} />;
}

export function Banner({ text }: { text: string }) {
  const { colors, fontsReady } = useTheme();
  return (
    <View style={[styles.banner, { backgroundColor: colors.chip, borderColor: colors.line }]}>
      <Text style={{ color: colors.text, fontSize: 13, lineHeight: 18, fontFamily: fontsReady ? fonts.sansMedium : undefined }}>{text}</Text>
    </View>
  );
}

export function StateBlock({ title, body, action, onAction, busy }: { title: string; body?: string; action?: string; onAction?: () => void; busy?: boolean }) {
  const { colors, fontsReady } = useTheme();
  return (
    <View style={styles.state}>
      {busy ? <ActivityIndicator color={colors.accent} /> : null}
      <Text style={[styles.stateTitle, { color: colors.text, fontFamily: fontsReady ? fonts.display : undefined }]}>{title}</Text>
      {body ? <Txt muted style={{ textAlign: "center" }}>{body}</Txt> : null}
      {action && onAction ? (
        <Press label={action} onPress={onAction} style={[styles.button, { backgroundColor: colors.accent }]}>
          <Text style={{ color: colors.onAccent, fontFamily: fontsReady ? fonts.sansSemi : undefined, fontWeight: "700" }}>{action}</Text>
        </Press>
      ) : null}
    </View>
  );
}

export function Field({ label, value, onChangeText, placeholder, keyboard, multiline }: { label: string; value: string; onChangeText: (value: string) => void; placeholder?: string; keyboard?: "default" | "email-address" | "phone-pad" | "number-pad"; multiline?: boolean }) {
  const { colors, fontsReady } = useTheme();
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "700", fontFamily: fontsReady ? fonts.sansSemi : undefined }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        keyboardType={keyboard}
        autoCapitalize={keyboard === "email-address" ? "none" : "sentences"}
        multiline={multiline}
        accessibilityLabel={label}
        style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.line, fontFamily: fontsReady ? fonts.sans : undefined, minHeight: multiline ? 96 : 52 }]}
      />
    </View>
  );
}

export function Stepper({ label, hint, value, min = 0, max = 12, onChange }: { label: string; hint?: string; value: number; min?: number; max?: number; onChange: (value: number) => void }) {
  const { colors, fontsReady } = useTheme();
  const button = (name: "remove" | "add", next: number, disabled: boolean, a11y: string) => (
    <Pressable accessibilityRole="button" accessibilityLabel={a11y} disabled={disabled} onPress={() => onChange(next)} style={[styles.step, { borderColor: colors.line }, disabled && { opacity: 0.3 }]}>
      <Ionicons name={name} size={18} color={colors.text} />
    </Pressable>
  );
  return (
    <View style={styles.stepRow}>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontFamily: fontsReady ? fonts.sansSemi : undefined, fontWeight: "600" }}>{label}</Text>
        {hint ? <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>{hint}</Text> : null}
      </View>
      {button("remove", value - 1, value <= min, `${label} хасах`)}
      <Text style={{ width: 24, textAlign: "center", color: colors.text, fontFamily: fontsReady ? fonts.sansBold : undefined, fontSize: 16 }}>{value}</Text>
      {button("add", value + 1, value >= max, `${label} нэмэх`)}
    </View>
  );
}

export function GlassBar({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.glass, { borderColor: colors.glassBorder, backgroundColor: colors.glass }, style]}>
      <BlurView intensity={70} tint={colors.dark ? "dark" : "light"} experimentalBlurMethod={Platform.OS === "android" ? "dimezisBlurView" : undefined} style={StyleSheet.absoluteFill} />
      {children}
    </View>
  );
}

export function ScreenScrollSpacer() {
  const insets = useSafeAreaInsets();
  return <View style={{ height: 92 + insets.bottom }} />;
}

export function HeroShade() {
  return <LinearGradient colors={["rgba(5,22,20,0.45)", "rgba(5,22,20,0.05)", "rgba(5,22,20,0.2)", "rgba(6,24,22,0.82)"]} locations={[0, 0.28, 0.55, 1]} style={StyleSheet.absoluteFill} />;
}

const styles = StyleSheet.create({
  display: { fontSize: 40, lineHeight: 42, letterSpacing: -0.8 },
  banner: { marginHorizontal: 18, marginTop: 10, borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 14, paddingVertical: 10 },
  state: { flex: 1, alignItems: "center", justifyContent: "center", padding: 28, gap: 12 },
  stateTitle: { fontSize: 28, textAlign: "center" },
  button: { minHeight: 48, borderRadius: 24, paddingHorizontal: 20, alignItems: "center", justifyContent: "center" },
  input: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 },
  stepRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 8 },
  step: { width: 44, height: 44, borderRadius: 22, borderWidth: StyleSheet.hairlineWidth, alignItems: "center", justifyContent: "center" },
  glass: { overflow: "hidden", borderWidth: StyleSheet.hairlineWidth, borderRadius: 30 },
});
