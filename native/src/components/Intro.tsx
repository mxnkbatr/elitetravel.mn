import { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COAST_PLATE } from "../lib/config";
import { INTRO_SKIP_MS, introPlan, markIntroPlayed, shouldShowIntro, type IntroPlan } from "../motion/intro";
import { fonts, useTheme } from "../theme";
import { RemoteImage } from "./ui";

/**
 * Runs after the static native splash has been hidden. Not a shared-element transition.
 * The travel photo scales with the native driver; reduced motion is opacity only.
 */
export function Intro() {
  const insets = useSafeAreaInsets();
  const { fontsReady } = useTheme();
  const [plan, setPlan] = useState<IntroPlan | null>(null);
  const [visible, setVisible] = useState(shouldShowIntro);
  const cover = useRef(new Animated.Value(1)).current;
  const logo = useRef(new Animated.Value(0)).current;
  const image = useRef(new Animated.Value(0)).current;
  const zoom = useRef(new Animated.Value(1.08)).current;
  const skipped = useRef(false);
  const running = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (!visible) return;
    let live = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((reduced) => {
        if (live) setPlan(introPlan(reduced));
      })
      .catch(() => {
        if (live) setPlan(introPlan(false));
      });
    return () => {
      live = false;
    };
  }, [visible]);

  useEffect(() => {
    if (!plan || !visible) return;
    skipped.current = false;
    const finish = () => {
      markIntroPlayed();
      setVisible(false);
    };
    if (!plan.zoom) {
      logo.setValue(1);
      image.setValue(0);
      const fade = Animated.timing(cover, { toValue: 0, duration: plan.duration, useNativeDriver: true });
      running.current = fade;
      fade.start(({ finished }) => {
        if (finished && !skipped.current) finish();
      });
      return () => fade.stop();
    }
    const sequence = Animated.sequence([
      Animated.timing(logo, { toValue: 1, duration: 520, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(image, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(zoom, { toValue: 1, duration: 1600, useNativeDriver: true }),
      ]),
      Animated.delay(280),
      Animated.timing(cover, { toValue: 0, duration: 480, useNativeDriver: true }),
    ]);
    running.current = sequence;
    sequence.start(({ finished }) => {
      if (finished && !skipped.current) finish();
    });
    return () => sequence.stop();
  }, [cover, image, logo, plan, visible, zoom]);

  function skip() {
    if (skipped.current) return;
    skipped.current = true;
    running.current?.stop();
    Animated.timing(cover, { toValue: 0, duration: INTRO_SKIP_MS, useNativeDriver: true }).start(({ finished }) => {
      if (finished) {
        markIntroPlayed();
        setVisible(false);
      }
    });
  }

  if (!visible) return null;

  return (
    <Animated.View accessibilityViewIsModal style={[styles.cover, { opacity: cover }]} pointerEvents="auto">
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: image, transform: [{ scale: plan?.zoom ? zoom : 1 }] }]}>
        <RemoteImage uri={COAST_PLATE} width={1400} height={1800} alt="" style={{ width: "100%", height: "100%" }} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(5,22,20,0.28)" }]} />
      </Animated.View>
      <View style={[styles.brand, { backgroundColor: plan?.zoom ? "transparent" : "#0b241d" }]}>
        <Animated.View style={{ opacity: logo, transform: [{ scale: logo.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }] }}>
          <Text style={[styles.elite, { fontFamily: fontsReady ? fonts.sansBold : undefined }]}>ELITE</Text>
          <Text style={[styles.travel, { fontFamily: fontsReady ? fonts.sansSemi : undefined }]}>TRAVEL</Text>
        </Animated.View>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="Танилцуулгыг алгасах" onPress={skip} style={[styles.skip, { top: insets.top + 12 }]}>
        <Text style={styles.skipText}>Алгасах</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cover: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#0b241d", zIndex: 50 },
  brand: { flex: 1, alignItems: "center", justifyContent: "center" },
  elite: { color: "white", letterSpacing: 8, fontSize: 28 },
  travel: { color: "rgba(255,255,255,0.78)", letterSpacing: 6, fontSize: 12, textAlign: "center", marginTop: 6 },
  skip: { position: "absolute", right: 16, minHeight: 36, paddingHorizontal: 14, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.16)", alignItems: "center", justifyContent: "center" },
  skipText: { color: "white", fontWeight: "700" },
});
