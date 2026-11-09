import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Pressable, type StyleProp, type ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring } from "react-native-reanimated";
import { brand, useTheme } from "../theme";

const FACE = {
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: "rgba(16,36,31,0.28)",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.45)",
  alignItems: "center" as const,
  justifyContent: "center" as const,
};

/** Heart for a tour card or tour detail. The scale runs on the UI thread; the save itself stays on JS. */
export function SaveHeart({ saved, onToggle, style }: { saved: boolean; onToggle: () => void; style?: StyleProp<ViewStyle> }) {
  const { reduceMotion } = useTheme();
  const scale = useSharedValue(1);
  const motion = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  function press() {
    if (!reduceMotion) {
      scale.value = withSequence(withSpring(1.22, { damping: 8, stiffness: 420 }), withSpring(1, { damping: 11, stiffness: 240 }));
      void Haptics.impactAsync(saved ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }
    onToggle();
  }

  return (
    <Animated.View style={[FACE, motion, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={saved ? "Хадгалснаас хасах" : "Хадгалах"}
        accessibilityState={{ selected: saved }}
        hitSlop={8}
        onPress={press}
        style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}
      >
        <Ionicons name={saved ? "heart" : "heart-outline"} size={20} color={saved ? brand.gold : "white"} />
      </Pressable>
    </Animated.View>
  );
}
