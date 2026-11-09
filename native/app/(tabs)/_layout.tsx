import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { haptic } from "../../src/components/ui";
import { DOCK_HEIGHT } from "../../src/motion/homeLayout";
import { brand, fonts, radii, shadows, useTheme } from "../../src/theme";

type DockProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigateToTab: (routeKey: string) => void;
};

const TABS = [
  { name: "index", label: "Аялал", icon: "compass" },
  { name: "map", label: "Газрын зураг", icon: "map" },
  { name: "trips", label: "Захиалга", icon: "calendar" },
  { name: "account", label: "Профайл", icon: "person" },
] as const;

const SPRING = { damping: 17, stiffness: 190, mass: 0.7 };

function Dock({ state, navigateToTab }: DockProps) {
  const insets = useSafeAreaInsets();
  const { colors, fontsReady, reduceMotion } = useTheme();
  const [width, setWidth] = useState(0);
  const visible = state.routes.filter((route) => TABS.some((tab) => tab.name === route.name));
  const count = Math.max(visible.length, 1);
  const tabW = width > 0 ? width / count : 0;
  const x = useSharedValue(0);
  useEffect(() => {
    const next = state.index * tabW;
    x.value = reduceMotion || tabW === 0 ? next : withSpring(next, SPRING);
  }, [reduceMotion, state.index, tabW, x]);
  const pillStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  const pill = colors.dark ? colors.accent : brand.emerald;
  const onPill = colors.dark ? colors.onAccent : "#ffffff";

  return (
    <View
      accessibilityRole="tablist"
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        bottom: Math.max(insets.bottom, 10),
        height: DOCK_HEIGHT,
        borderRadius: radii.dock,
        backgroundColor: colors.dark ? "rgba(12,28,26,0.94)" : "rgba(255,252,247,0.94)",
        overflow: "hidden",
        ...shadows.dock,
      }}
    >
      <BlurView intensity={48} tint={colors.dark ? "dark" : "light"} style={StyleSheet.absoluteFill} />
      <View onLayout={(event) => setWidth(event.nativeEvent.layout.width)} style={{ flex: 1, flexDirection: "row" }}>
        {tabW > 0 ? (
          <Animated.View
            pointerEvents="none"
            style={[
              {
                position: "absolute",
                top: 6,
                bottom: 6,
                left: 5,
                width: Math.max(tabW - 10, 0),
                borderRadius: 24,
                backgroundColor: pill,
              },
              pillStyle,
            ]}
          />
        ) : null}
        {state.routes.map((route, index) => {
          const meta = TABS.find((tab) => tab.name === route.name);
          if (!meta) return null;
          const focused = state.index === index;
          const icon = (focused ? meta.icon : `${meta.icon}-outline`) as keyof typeof Ionicons.glyphMap;
          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityLabel={meta.label}
              accessibilityState={{ selected: focused }}
              onPress={() => {
                if (focused) return;
                haptic();
                navigateToTab(route.key);
              }}
              style={{ flex: 1, minHeight: 52, alignItems: "center", justifyContent: "center" }}
            >
              <Ionicons name={icon} size={18} color={focused ? onPill : colors.muted} />
              <Text style={{ marginTop: 2, fontSize: 10, fontWeight: "700", color: focused ? onPill : colors.muted, fontFamily: fontsReady ? fonts.sansSemi : undefined }}>{meta.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <Dock state={props.state} navigateToTab={props.navigateToTab} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Аялал" }} />
      <Tabs.Screen name="map" options={{ title: "Газрын зураг" }} />
      <Tabs.Screen name="trips" options={{ title: "Захиалга" }} />
      <Tabs.Screen name="account" options={{ title: "Профайл" }} />
    </Tabs>
  );
}
