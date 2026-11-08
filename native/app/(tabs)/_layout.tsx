import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../src/theme";

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

function Dock({ state, navigateToTab }: DockProps) {
  const insets = useSafeAreaInsets();
  const { colors, fontsReady } = useTheme();
  return (
    <View
      accessibilityRole="tablist"
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        bottom: Math.max(insets.bottom, 10),
        height: 68,
        borderRadius: 34,
        backgroundColor: colors.dark ? "rgba(15,36,33,0.94)" : "rgba(255,252,247,0.96)",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        shadowColor: "#062a2a",
        shadowOpacity: 0.12,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
      }}
    >
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
              if (!focused) navigateToTab(route.key);
            }}
            style={{ minWidth: 68, minHeight: 52, alignItems: "center", justifyContent: "center" }}
          >
            <View style={{ width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", backgroundColor: focused ? "#0a2a26" : "transparent" }}>
              <Ionicons name={icon} size={18} color={focused ? "#ffffff" : colors.muted} />
            </View>
            <Text style={{ marginTop: 2, fontSize: 10, fontWeight: "700", color: focused ? colors.text : colors.muted, fontFamily: fontsReady ? "Manrope_600SemiBold" : undefined }}>{meta.label}</Text>
          </Pressable>
        );
      })}
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
