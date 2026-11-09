import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { countdownLabel, destinationAirport, ORIGIN, parseDeparture, statusLine, travellersLabel } from "../lib/ticket";
import type { TripStatus } from "../lib/types";
import { brand, fonts, radii, useTheme } from "../theme";
import { Press } from "./ui";

const INK = "#f4efe6";

export function BoardingPass({
  id,
  destinationKey,
  destination,
  title,
  date,
  travellers,
  totalLabel,
  status,
  stay,
  onOpen,
}: {
  id: string;
  destinationKey?: string;
  destination?: string;
  title: string;
  date?: string;
  travellers?: number | null;
  totalLabel: string;
  status?: TripStatus;
  stay?: string;
  onOpen?: () => void;
}) {
  const { fontsReady, reduceMotion, colors } = useTheme();
  const airport = destinationAirport(destinationKey);
  const city = airport.city || destination || "";
  const depart = parseDeparture(date);
  const [now, setNow] = useState(() => new Date());
  const [back, setBack] = useState(false);
  const spin = useSharedValue(0);

  useEffect(() => {
    if (!depart) return;
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, [depart]);

  function flip() {
    if (reduceMotion) {
      setBack((value) => !value);
      return;
    }
    spin.value = withTiming(88, { duration: 160 }, (finished) => {
      if (!finished) return;
      runOnJS(setBack)(!back);
      spin.value = withSpring(0, { damping: 14, stiffness: 170 });
    });
  }

  const face = useAnimatedStyle(() => ({
    transform: [{ perspective: 1100 }, { rotateY: `${spin.value}deg` }],
  }));
  const when = depart ? countdownLabel(depart, now) : null;

  return (
    <View style={{ marginBottom: 14 }}>
    <Press label={title} scaleTo={0.985} onPress={flip}>
      <Animated.View style={[{ borderRadius: radii.xl, backgroundColor: "#10241f", overflow: "hidden" }, face]}>
        <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ color: brand.mist, fontSize: 11, letterSpacing: 1.1, fontFamily: fontsReady ? fonts.sansSemi : undefined }}>ELITE TRAVEL</Text>
            <Text style={{ color: brand.gold, fontSize: 12, fontFamily: fontsReady ? fonts.sansSemi : undefined }}>{statusLine(status)}</Text>
          </View>
          {back ? (
            <View style={{ marginTop: 16, gap: 6, minHeight: 118 }}>
              <Text style={{ color: INK, fontSize: 22, lineHeight: 26, fontFamily: fontsReady ? fonts.display : undefined }}>{title}</Text>
              {stay ? <Text style={{ color: "rgba(244,239,230,0.72)", fontFamily: fontsReady ? fonts.sans : undefined }}>{stay}</Text> : null}
              <Text style={{ color: brand.gold, fontSize: 18, marginTop: 4, fontFamily: fontsReady ? fonts.sansBold : undefined }}>{totalLabel}</Text>
              <Text style={{ color: "rgba(244,239,230,0.6)", fontSize: 12 }}>Дугаар {id}</Text>
            </View>
          ) : (
            <>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 18 }}>
                <Code code={ORIGIN.code} city={ORIGIN.city} />
                <View style={{ flex: 1, alignItems: "center" }}>
                  <View style={{ position: "absolute", left: 8, right: 8, top: 10, borderTopWidth: 1, borderStyle: "dashed", borderColor: "rgba(244,239,230,0.35)" }} />
                  <Ionicons name="airplane" size={16} color={brand.gold} />
                </View>
                <Code code={airport.code} city={city} align="right" />
              </View>
              <View style={{ flexDirection: "row", marginTop: 16 }}>
                <Fact label="Огноо" value={date || "Тохиролцоно"} />
                <Fact label="Зорчигч" value={travellersLabel(travellers)} />
                <Fact label="Нисэх хүртэл" value={when ?? "—"} align="right" />
              </View>
            </>
          )}
        </View>
        <View style={{ height: 22, flexDirection: "row", alignItems: "center" }}>
          <View style={{ width: 14, height: 22, borderTopRightRadius: 11, borderBottomRightRadius: 11, backgroundColor: colors.bg, marginLeft: -7 }} />
          <View style={{ flex: 1, borderTopWidth: 1, borderStyle: "dashed", borderColor: "rgba(244,239,230,0.28)", marginHorizontal: 8 }} />
          <View style={{ width: 14, height: 22, borderTopLeftRadius: 11, borderBottomLeftRadius: 11, backgroundColor: colors.bg, marginRight: -7 }} />
        </View>
        <View style={{ paddingHorizontal: 16, paddingBottom: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
          <View>
            <Text style={{ color: "rgba(244,239,230,0.5)", fontSize: 10 }}>ХҮСЭЛТ</Text>
            <Text style={{ color: INK, letterSpacing: 1, marginTop: 2, fontFamily: fontsReady ? fonts.sansBold : undefined }}>{id}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "flex-end", height: 28, gap: 2 }} accessibilityElementsHidden>
            {id.replace(/\W/g, "").slice(0, 12).split("").map((char, index) => (
              <View key={`${char}-${index}`} style={{ width: (char.charCodeAt(0) % 3) + 1, height: 12 + (char.charCodeAt(0) % 16), backgroundColor: "rgba(244,239,230,0.8)" }} />
            ))}
          </View>
        </View>
      </Animated.View>
    </Press>
    {back && onOpen ? (
      <Press label="Захиалга нээх" onPress={onOpen} style={{ alignSelf: "flex-end", marginTop: 8, minHeight: 36, justifyContent: "center" }}>
        <Text style={{ color: colors.accent, fontFamily: fontsReady ? fonts.sansSemi : undefined }}>Захиалга нээх</Text>
      </Press>
    ) : null}
    </View>
  );
}

function Code({ code, city, align = "left" }: { code: string; city: string; align?: "left" | "right" }) {
  const { fontsReady } = useTheme();
  return (
    <View style={{ minWidth: 72, alignItems: align === "right" ? "flex-end" : "flex-start" }}>
      <Text style={{ color: INK, fontSize: 28, letterSpacing: 1, fontFamily: fontsReady ? fonts.sansBold : undefined }}>{code}</Text>
      <Text style={{ color: "rgba(244,239,230,0.62)", fontSize: 11, marginTop: 2 }} numberOfLines={1}>{city}</Text>
    </View>
  );
}

function Fact({ label, value, align = "left" }: { label: string; value: string; align?: "left" | "right" }) {
  const { fontsReady } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: align === "right" ? "flex-end" : "flex-start" }}>
      <Text style={{ color: "rgba(244,239,230,0.5)", fontSize: 10 }}>{label}</Text>
      <Text style={{ color: INK, marginTop: 3, fontSize: 13, fontFamily: fontsReady ? fonts.sansSemi : undefined }} numberOfLines={1}>{value}</Text>
    </View>
  );
}
