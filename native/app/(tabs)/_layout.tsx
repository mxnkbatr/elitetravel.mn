import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../src/theme";

function TabBackground() {
  const { colors } = useTheme();
  return (
    <View style={[StyleSheet.absoluteFill, { borderRadius: 30, overflow: "hidden", borderWidth: StyleSheet.hairlineWidth, borderColor: colors.glassBorder }]}>
      <BlurView intensity={70} tint={colors.dark ? "dark" : "light"} experimentalBlurMethod={Platform.OS === "android" ? "dimezisBlurView" : undefined} style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.glass }]} />
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { colors, fontsReady } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          position: "absolute",
          marginHorizontal: 14,
          bottom: Math.max(insets.bottom, 10),
          height: 66,
          borderRadius: 30,
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: () => <TabBackground />,
        tabBarLabelStyle: { fontSize: 10, fontWeight: "700", fontFamily: fontsReady ? "Manrope_600SemiBold" : undefined },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Нүүр", tabBarIcon: ({ color }) => <Ionicons name="home-outline" color={String(color)} size={22} /> }} />
      <Tabs.Screen name="tours" options={{ title: "Аялал", tabBarIcon: ({ color }) => <Ionicons name="compass-outline" color={String(color)} size={22} /> }} />
      <Tabs.Screen name="trips" options={{ title: "Захиалга", tabBarIcon: ({ color }) => <Ionicons name="calendar-outline" color={String(color)} size={22} /> }} />
      <Tabs.Screen name="account" options={{ title: "Бүртгэл", tabBarIcon: ({ color }) => <Ionicons name="person-outline" color={String(color)} size={22} /> }} />
    </Tabs>
  );
}
