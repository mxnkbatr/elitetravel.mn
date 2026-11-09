import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Animated, { cancelAnimation, Easing, Extrapolation, interpolate, runOnJS, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COAST_PLATE } from "../lib/config";
import { INTRO_CINEMATIC_MS, INTRO_REDUCED_MS, INTRO_SEEN_KEY, INTRO_SKIP_MS, introPlan, markIntroPlayed } from "../motion/intro";
import { SPLASH_BG, SPLASH_LOGO_WIDTH } from "../motion/splash";
import { fonts, useTheme } from "../theme";
import { RemoteImage } from "./ui";

const HOLD = 180;
const REVEAL = 780;
const PAUSE = 140;

/**
 * First frame matches the native splash: #0b241d with the 180pt logo centered.
 * Then the coast photo settles into the home hero. Later launches do not mount this.
 */
export function Intro({ heroHeight, onFirstFrame, onDone }: { heroHeight: number; onFirstFrame: () => void; onDone: () => void }) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { fontsReady, reduceMotion, colors } = useTheme();
  const frame = useSharedValue(0);
  const [visible, setVisible] = useState(true);
  const signaled = useRef(false);
  const done = useRef(onDone);
  done.current = onDone;

  function finish() {
    markIntroPlayed();
    AsyncStorage.setItem(INTRO_SEEN_KEY, "1").catch(() => {});
    setVisible(false);
    done.current();
  }

  useEffect(() => {
    const plan = introPlan(reduceMotion);
    if (!plan.zoom) {
      frame.value = withDelay(80, withTiming(2, { duration: INTRO_REDUCED_MS, easing: Easing.out(Easing.cubic) }, (finished) => {
        if (finished) runOnJS(finish)();
      }));
      return () => cancelAnimation(frame);
    }
    const settle = Math.max(0, INTRO_CINEMATIC_MS - HOLD - REVEAL - PAUSE);
    frame.value = withDelay(
      HOLD,
      withTiming(1, { duration: REVEAL, easing: Easing.out(Easing.cubic) }, (revealed) => {
        if (!revealed) return;
        frame.value = withDelay(PAUSE, withTiming(2, { duration: settle, easing: Easing.inOut(Easing.cubic) }, (finished) => {
          if (finished) runOnJS(finish)();
        }));
      }),
    );
    return () => cancelAnimation(frame);
  }, [frame, reduceMotion]);

  function signal() {
    if (signaled.current) return;
    signaled.current = true;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => onFirstFrame());
    });
  }

  function skip() {
    cancelAnimation(frame);
    frame.value = withTiming(2, { duration: INTRO_SKIP_MS, easing: Easing.out(Easing.cubic) }, (finished) => {
      if (finished) runOnJS(finish)();
    });
  }

  const windowStyle = useAnimatedStyle(() => {
    if (reduceMotion) return { height, opacity: interpolate(frame.value, [0, 2], [1, 0]) };
    return {
      height: interpolate(frame.value, [0, 1, 1.35, 2], [height, height, heroHeight, heroHeight]),
      opacity: interpolate(frame.value, [0, 1.55, 2], [1, 1, 0]),
    };
  });
  const photoStyle = useAnimatedStyle(() => ({
    opacity: reduceMotion ? 0 : interpolate(frame.value, [0, 1], [0, 1], Extrapolation.CLAMP),
    transform: [{ scale: reduceMotion ? 1 : interpolate(frame.value, [0, 1], [1.03, 1], Extrapolation.CLAMP) }],
  }));
  const logoStyle = useAnimatedStyle(() => ({
    opacity: reduceMotion
      ? interpolate(frame.value, [0, 2], [1, 0])
      : interpolate(frame.value, [0, 0.45, 1], [1, 1, 0], Extrapolation.CLAMP),
  }));

  if (!visible) return null;

  return (
    <View accessibilityViewIsModal style={styles.cover} pointerEvents="auto" onLayout={signal}>
      <Animated.View style={[styles.plate, windowStyle]}>
        <Animated.View style={[StyleSheet.absoluteFill, photoStyle]}>
          <RemoteImage uri={COAST_PLATE} width={1400} height={1800} alt="" fade={false} style={{ width: "100%", height: "100%" }} />
          <LinearGradient colors={["rgba(6,18,16,0.55)", "rgba(6,18,16,0.08)", "rgba(6,18,16,0.22)", "rgba(6,18,16,0.78)", colors.bg]} locations={[0, 0.28, 0.5, 0.84, 1]} style={StyleSheet.absoluteFill} />
        </Animated.View>
      </Animated.View>
      <Animated.View pointerEvents="none" style={[styles.logo, logoStyle]}>
        <Image accessibilityLabel="Elite Travel" source={require("../../assets/splash-logo.png")} resizeMode="contain" style={{ width: SPLASH_LOGO_WIDTH, height: SPLASH_LOGO_WIDTH }} />
      </Animated.View>
      <Pressable accessibilityRole="button" accessibilityLabel="Танилцуулгыг алгасах" onPress={skip} style={[styles.skip, { top: insets.top + 12 }]}>
        <Text style={[styles.skipText, { fontFamily: fontsReady ? fonts.sansSemi : undefined }]}>Алгасах</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 },
  plate: { position: "absolute", top: 0, left: 0, right: 0, overflow: "hidden", backgroundColor: SPLASH_BG },
  logo: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, alignItems: "center", justifyContent: "center" },
  skip: { position: "absolute", right: 16, minHeight: 36, paddingHorizontal: 14, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.16)", alignItems: "center", justifyContent: "center" },
  skipText: { color: "white", fontWeight: "700" },
});
