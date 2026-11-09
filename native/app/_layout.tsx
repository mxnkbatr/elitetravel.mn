import "react-native-gesture-handler";
import "react-native-reanimated";
import { CormorantGaramond_600SemiBold, CormorantGaramond_600SemiBold_Italic } from "@expo-google-fonts/cormorant-garamond";
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from "@expo-google-fonts/manrope";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { Intro } from "../src/components/Intro";
import { INTRO_SEEN_KEY, introAlreadyPlayed, markIntroPlayed, resolveIntroGate } from "../src/motion/intro";
import { homeLayout } from "../src/motion/homeLayout";
import { SPLASH_BG } from "../src/motion/splash";
import { CatalogProvider } from "../src/state/catalog";
import { DeviceBookingsProvider } from "../src/state/device-bookings";
import { PushProvider } from "../src/state/push";
import { SessionProvider } from "../src/state/session";
import { FontsProvider, useTheme } from "../src/theme";

SplashScreen.preventAutoHideAsync().catch(() => {});

function hideSplash(fade: boolean) {
  SplashScreen.setOptions({ fade, duration: fade ? 320 : 0 });
  SplashScreen.hideAsync().catch(() => {});
}

function Root() {
  const { colors, reduceMotion } = useTheme();
  const { height } = useWindowDimensions();
  const [gate, setGate] = useState<"pending" | "play" | "skip">("pending");
  const [introDone, setIntroDone] = useState(introAlreadyPlayed());
  const hid = useRef(false);

  useEffect(() => {
    let live = true;
    AsyncStorage.getItem(INTRO_SEEN_KEY)
      .then((stored) => {
        if (!live) return;
        const next = resolveIntroGate(stored);
        if (next === "skip") {
          markIntroPlayed();
          setIntroDone(true);
        }
        setGate(next);
      })
      .catch(() => {
        if (live) setGate("play");
      });
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    if (gate !== "skip" || hid.current) return;
    hid.current = true;
    hideSplash(true);
  }, [gate]);

  return (
    <>
      <StatusBar style={colors.dark ? "light" : "dark"} />
      <View style={{ flex: 1, backgroundColor: SPLASH_BG }}>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
          <Stack.Screen name="(tabs)" />
          {/* The card image flies into the hero on its own spring. A stack fade would fade that image too. */}
          <Stack.Screen name="tour/[id]" options={{ animation: reduceMotion ? "fade" : "none", animationDuration: reduceMotion ? 280 : 0 }} />
          <Stack.Screen name="book/[id]" options={{ animation: "fade", animationDuration: 320 }} />
          <Stack.Screen name="trip/[id]" options={{ animation: "fade", animationDuration: 320 }} />
          <Stack.Screen name="news/[id]" options={{ animation: "fade", animationDuration: 320 }} />
          <Stack.Screen name="auth" options={{ presentation: "modal", animation: "fade_from_bottom" }} />
          <Stack.Screen name="saved" options={{ animation: "fade", animationDuration: 320 }} />
        </Stack>
        {gate === "play" && !introDone ? (
          <Intro
            heroHeight={homeLayout(height).hero}
            onFirstFrame={() => {
              if (hid.current) return;
              hid.current = true;
              hideSplash(false);
            }}
            onDone={() => setIntroDone(true)}
          />
        ) : null}
      </View>
    </>
  );
}

export default function Layout() {
  const [ready, error] = useFonts({
    CormorantGaramond_600SemiBold,
    CormorantGaramond_600SemiBold_Italic,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });
  if (!ready && !error) return null;
  return (
    <FontsProvider ready={!!ready && !error}>
      <CatalogProvider>
        <SessionProvider>
          <DeviceBookingsProvider>
            <PushProvider>
              <Root />
            </PushProvider>
          </DeviceBookingsProvider>
        </SessionProvider>
      </CatalogProvider>
    </FontsProvider>
  );
}
