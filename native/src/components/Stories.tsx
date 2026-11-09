import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useRef, useState } from "react";
import { Modal, ScrollView, Text, View, useWindowDimensions } from "react-native";
import Animated, { cancelAnimation, runOnJS, useAnimatedStyle, useSharedValue, withTiming, type SharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { StoryGroup } from "../lib/stories";
import { brand, fonts, useTheme } from "../theme";
import { Press, RemoteImage } from "./ui";

const BEAT = 4200;

export function StoriesRow({ groups, height, onOpen }: { groups: StoryGroup[]; height: number; onOpen: (index: number) => void }) {
  if (!groups.length) return <View style={{ height }} />;
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ height }} contentContainerStyle={{ paddingHorizontal: 20, alignItems: "center", gap: 14 }}>
      {groups.map((group, index) => (
        <Press key={group.key} label={group.name} scaleTo={0.96} onPress={() => onOpen(index)} style={{ alignItems: "center", width: 58 }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, borderWidth: 1.5, borderColor: brand.gold, padding: 2 }}>
            <RemoteImage uri={group.image} width={160} height={160} alt="" style={{ width: "100%", height: "100%", borderRadius: 20 }} />
          </View>
        </Press>
      ))}
    </ScrollView>
  );
}

export function StoryViewer({ groups, start, onClose }: { groups: StoryGroup[]; start: number; onClose: () => void }) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { reduceMotion, fontsReady } = useTheme();
  const [cursor, setCursor] = useState({ group: start, slide: 0 });
  const progress = useSharedValue(reduceMotion ? 1 : 0);
  const origin = useRef({ x: 0, at: 0 });
  const group = groups[cursor.group];
  const slide = group?.slides[cursor.slide];

  const go = useCallback((direction: 1 | -1) => {
    setCursor((current) => {
      const pack = groups[current.group];
      if (!pack) return current;
      const nextSlide = current.slide + direction;
      if (nextSlide >= 0 && nextSlide < pack.slides.length) return { group: current.group, slide: nextSlide };
      const nextGroup = current.group + direction;
      if (nextGroup < 0 || nextGroup >= groups.length) return current;
      const landed = groups[nextGroup];
      return { group: nextGroup, slide: direction > 0 ? 0 : Math.max(0, (landed?.slides.length ?? 1) - 1) };
    });
  }, [groups]);

  useEffect(() => {
    if (!slide || reduceMotion) {
      progress.value = 1;
      return;
    }
    progress.value = 0;
    progress.value = withTiming(1, { duration: BEAT }, (finished) => {
      if (finished) runOnJS(go)(1);
    });
    return () => cancelAnimation(progress);
  }, [cursor.group, cursor.slide, go, progress, reduceMotion, slide]);

  function begin(x: number) {
    origin.current = { x, at: Date.now() };
    if (!reduceMotion) cancelAnimation(progress);
  }

  function end(x: number) {
    const dx = x - origin.current.x;
    const held = Date.now() - origin.current.at > 220;
    if (Math.abs(dx) > 56) {
      const next = cursor.group + (dx < 0 ? 1 : -1);
      if (next < 0 || next >= groups.length) onClose();
      else setCursor({ group: next, slide: 0 });
      return;
    }
    if (!held) {
      go(x < width * 0.33 ? -1 : 1);
      return;
    }
    if (reduceMotion) return;
    const remain = Math.max(0.08, 1 - progress.value);
    progress.value = withTiming(1, { duration: remain * BEAT }, (finished) => {
      if (finished) runOnJS(go)(1);
    });
  }

  if (!group || !slide) return null;
  const barW = (width - 28 - Math.max(0, group.slides.length - 1) * 4) / group.slides.length;

  return (
    <Modal visible animationType={reduceMotion ? "none" : "fade"} transparent={false} onRequestClose={onClose} statusBarTranslucent>
      <View
        style={{ flex: 1, backgroundColor: "#071614" }}
        onTouchStart={(event) => begin(event.nativeEvent.pageX)}
        onTouchEnd={(event) => end(event.nativeEvent.pageX)}
      >
        <RemoteImage uri={slide.image} width={1400} height={1800} alt="" fade={false} style={{ width, height }} />
        <LinearGradient colors={["rgba(5,16,14,0.45)", "rgba(5,16,14,0)", "rgba(5,16,14,0.72)"]} locations={[0, 0.45, 1]} style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }} />
        <View style={{ position: "absolute", top: insets.top + 8, left: 14, right: 14, flexDirection: "row", gap: 4 }}>
          {group.slides.map((item, index) => (
            <View key={item.id} style={{ width: barW, height: 2, borderRadius: 2, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.35)" }}>
              <ProgressBar index={index} current={cursor.slide} progress={progress} width={barW} />
            </View>
          ))}
        </View>
        <Press label="Хаах" onPress={onClose} style={{ position: "absolute", top: insets.top + 22, right: 12, width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.28)" }}>
          <Ionicons name="close" size={18} color="white" />
        </Press>
        <View style={{ position: "absolute", left: 20, right: 20, bottom: Math.max(insets.bottom, 24) + 12 }}>
          <Text style={{ color: brand.mist, letterSpacing: 1.2, fontSize: 12, fontFamily: fontsReady ? fonts.sansSemi : undefined }}>{slide.kicker}</Text>
          <Text style={{ color: "white", fontSize: 32, lineHeight: 34, marginTop: 4, fontFamily: fontsReady ? fonts.display : undefined }}>{slide.title}</Text>
        </View>
      </View>
    </Modal>
  );
}

function ProgressBar({ index, current, progress, width }: { index: number; current: number; progress: SharedValue<number>; width: number }) {
  const style = useAnimatedStyle(() => {
    const value = index < current ? 1 : index > current ? 0 : progress.value;
    return { transform: [{ translateX: (value - 1) * width }] };
  });
  return <Animated.View style={[{ width, height: 2, backgroundColor: "white" }, style]} />;
}
