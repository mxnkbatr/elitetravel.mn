import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { formatPrice } from "../lib/money";
import { brand, fonts, radii, useTheme } from "../theme";
import { Press, Txt } from "./ui";

const BITS = [brand.gold, brand.mist, "#ffffff", "#1aa894", "#f3d199"];

export function BookingSuccess({
  preview,
  id,
  total,
  deposit,
  status,
  onDone,
  onOpen,
}: {
  preview?: boolean;
  id?: string;
  total?: number;
  deposit?: number;
  status?: string;
  onDone: () => void;
  onOpen?: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { colors, fontsReady, reduceMotion } = useTheme();
  const draw = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) return;
    draw.value = withDelay(180, withTiming(1, { duration: 560, easing: Easing.out(Easing.cubic) }));
  }, [draw, reduceMotion]);

  const ring = useAnimatedStyle(() => ({
    opacity: draw.value,
    transform: [{ scale: 0.7 + draw.value * 0.3 }],
  }));
  const tick = useAnimatedStyle(() => ({
    width: 8 + draw.value * 22,
    height: 4 + draw.value * 12,
    opacity: draw.value,
  }));

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingHorizontal: 22, paddingTop: insets.top + 28, paddingBottom: insets.bottom + 20 }}>
      {!reduceMotion ? <Confetti /> : null}
      <View style={{ alignItems: "center", marginTop: 28 }}>
        <Animated.View style={[{ width: 92, height: 92, borderRadius: 46, backgroundColor: brand.gold, alignItems: "center", justifyContent: "center" }, ring]}>
          <Animated.View style={[{ borderLeftWidth: 4, borderBottomWidth: 4, borderColor: brand.emerald, transform: [{ rotate: "-45deg" }, { translateY: -2 }] }, tick]} />
        </Animated.View>
        <Text style={{ color: colors.text, fontSize: 36, lineHeight: 40, textAlign: "center", marginTop: 22, fontFamily: fontsReady ? fonts.display : undefined }}>
          {preview ? "Ингэж харагдана" : "Хүсэлт бүртгэгдлээ"}
        </Text>
        <Txt muted style={{ textAlign: "center", marginTop: 8 }}>
          {preview ? "Урьдчилсан харагдац тул хүсэлт илгээгдээгүй." : "Энэ бол төлбөр биш. Серверийн бүртгэсэн дүн:"}
        </Txt>
      </View>
      {!preview && total != null ? (
        <View style={{ marginTop: 22, backgroundColor: colors.card, borderRadius: radii.xl, padding: 18, gap: 6 }}>
          <Text style={{ color: colors.accent, fontSize: 28, fontFamily: fontsReady ? fonts.sansBold : undefined }}>{formatPrice(total)}</Text>
          {id ? <Txt>Дугаар: {id}</Txt> : null}
          {deposit ? <Txt>Урьдчилгаа: {formatPrice(deposit)}</Txt> : null}
          <Txt>Төлөв: {status === "waitlist" ? "Хүлээлэг" : "Шинэ хүсэлт"}</Txt>
          {!onOpen && id ? <Txt muted>Сервер нээх түлхүүр буцаасангүй. {id} дугаараар утсаар холбогдоно уу.</Txt> : null}
        </View>
      ) : null}
      <View style={{ flex: 1 }} />
      {onOpen ? (
        <Press label="Захиалга нээх" onPress={onOpen} style={{ height: 52, borderRadius: 26, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: colors.onAccent, fontWeight: "700", fontFamily: fontsReady ? fonts.sansBold : undefined }}>Захиалга нээх</Text>
        </Press>
      ) : null}
      <Press label="Буцах" onPress={onDone} style={{ height: 48, marginTop: 10, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: colors.accent, fontFamily: fontsReady ? fonts.sansSemi : undefined }}>{preview ? "Буцах" : "Нүүр лүү"}</Text>
      </Press>
    </View>
  );
}

function Confetti() {
  return (
    <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, top: 0, height: 280 }}>
      {BITS.concat(BITS, BITS, BITS).map((color, index) => (
        <Bit key={`${color}-${index}`} index={index} color={color} />
      ))}
    </View>
  );
}

function Bit({ index, color }: { index: number; color: string }) {
  const y = useSharedValue(40);
  const x = useSharedValue(0);
  useEffect(() => {
    const angle = (index / 18) * Math.PI * 2;
    const dist = 70 + (index % 6) * 22;
    x.value = withTiming(Math.cos(angle) * dist, { duration: 900, easing: Easing.out(Easing.cubic) });
    y.value = withTiming(36 + Math.sin(angle) * 30 + (index % 5) * 28, { duration: 1100, easing: Easing.out(Easing.quad) });
  }, [index, x, y]);
  const style = useAnimatedStyle(() => ({
    opacity: y.value > 150 ? Math.max(0, 1 - (y.value - 150) / 80) : 1,
    transform: [{ translateX: x.value }, { translateY: y.value }, { rotate: `${index * 28}deg` }],
  }));
  return <Animated.View style={[{ position: "absolute", left: "48%", top: 70, width: index % 4 === 0 ? 8 : 5, height: 9, borderRadius: 2, backgroundColor: color }, style]} />;
}
