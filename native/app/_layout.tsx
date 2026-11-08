import "react-native-gesture-handler";
import { CormorantGaramond_600SemiBold, CormorantGaramond_600SemiBold_Italic } from "@expo-google-fonts/cormorant-garamond";
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from "@expo-google-fonts/manrope";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { CatalogProvider } from "../src/state/catalog";
import { DeviceBookingsProvider } from "../src/state/device-bookings";
import { SessionProvider } from "../src/state/session";
import { FontsProvider, useTheme } from "../src/theme";

SplashScreen.preventAutoHideAsync().catch(() => {});

function Root() {
  const { colors } = useTheme();
  return (
    <>
      <StatusBar style={colors.dark ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="tour/[id]" />
        <Stack.Screen name="book/[id]" />
        <Stack.Screen name="trip/[id]" />
        <Stack.Screen name="news/[id]" />
        <Stack.Screen name="auth" options={{ presentation: "modal" }} />
      </Stack>
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
  useEffect(() => {
    if (ready || error) SplashScreen.hideAsync().catch(() => {});
  }, [ready, error]);
  if (!ready && !error) return null;
  return (
    <FontsProvider ready={!!ready && !error}>
      <CatalogProvider>
        <SessionProvider>
          <DeviceBookingsProvider>
            <Root />
          </DeviceBookingsProvider>
        </SessionProvider>
      </CatalogProvider>
    </FontsProvider>
  );
}
