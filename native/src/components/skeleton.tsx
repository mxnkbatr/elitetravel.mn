import { LinearGradient } from "expo-linear-gradient";
import { useEffect, type ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { radii, space, useTheme } from "../theme";

export function Shimmer({ style }: { style?: StyleProp<ViewStyle> }) {
  const { colors, reduceMotion } = useTheme();
  const travel = useSharedValue(0);
  useEffect(() => {
    if (reduceMotion) return;
    travel.value = withRepeat(withTiming(1, { duration: 1300, easing: Easing.inOut(Easing.quad) }), -1, false);
  }, [reduceMotion, travel]);
  const band = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(travel.value, [0, 1], [-420, 420]) }],
  }));
  return (
    <View style={[{ backgroundColor: colors.dark ? "#17332e" : "#e7dfd2", overflow: "hidden" }, style]}>
      {reduceMotion ? null : (
        <Animated.View style={[{ position: "absolute", top: 0, bottom: 0, width: 160 }, band]}>
          <LinearGradient
            colors={["rgba(255,255,255,0)", colors.dark ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.7)", "rgba(255,255,255,0)"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{ flex: 1 }}
          />
        </Animated.View>
      )}
    </View>
  );
}

function Bone({ children }: { children: ReactNode }) {
  const { colors } = useTheme();
  return (
    <View accessibilityLabel="Ачаалж байна" style={{ flex: 1, backgroundColor: colors.bg }}>
      {children}
    </View>
  );
}

export function HomeSkeleton() {
  return (
    <Bone>
      <Shimmer style={{ height: 500 }} />
      <Shimmer style={{ height: 58, borderRadius: radii.pill, marginHorizontal: space.lg, marginTop: -28 }} />
      <Shimmer style={{ height: 28, width: 190, borderRadius: radii.sm, marginHorizontal: space.xl, marginTop: space.xxl }} />
      <Shimmer style={{ height: 280, borderRadius: radii.xxl, marginHorizontal: space.xl, marginTop: space.lg }} />
      <Shimmer style={{ height: 280, borderRadius: radii.xxl, marginHorizontal: space.xl, marginTop: space.lg }} />
    </Bone>
  );
}

export function TourSkeleton() {
  return (
    <Bone>
      <Shimmer style={{ height: 460 }} />
      <View style={{ padding: space.xl, gap: space.md, marginTop: -48 }}>
        <Shimmer style={{ height: 14, width: 90, borderRadius: radii.sm }} />
        <Shimmer style={{ height: 36, width: "78%", borderRadius: radii.sm }} />
        <Shimmer style={{ height: 32, width: 140, borderRadius: radii.pill }} />
        <Shimmer style={{ height: 18, borderRadius: radii.sm }} />
        <Shimmer style={{ height: 18, width: "80%", borderRadius: radii.sm }} />
      </View>
    </Bone>
  );
}

export function TripsSkeleton() {
  return (
    <View accessibilityLabel="Ачаалж байна" style={{ marginTop: space.lg, gap: space.md }}>
      <Shimmer style={{ height: 44, borderRadius: radii.md }} />
      <Shimmer style={{ height: 220, borderRadius: radii.xxl }} />
      <Shimmer style={{ height: 120, borderRadius: radii.xl }} />
    </View>
  );
}
