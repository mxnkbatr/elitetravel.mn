import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Pressable, type StyleProp, type ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming, type SharedValue } from "react-native-reanimated";
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

const SPARKS = 6;

/** Heart for a tour card or tour detail. The scale runs on the UI thread; the save itself stays on JS. */
export function SaveHeart({ saved, onToggle, style }: { saved: boolean; onToggle: () => void; style?: StyleProp<ViewStyle> }) {
  const { reduceMotion } = useTheme();
  const scale = useSharedValue(1);
  const burst = useSharedValue(1);
  const motion = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  function press() {
    if (!reduceMotion) {
      if (saved) {
        scale.value = withSequence(withTiming(0.9, { duration: 120 }), withSpring(1, { damping: 16, stiffness: 210 }));
      } else {
        scale.value = withSequence(withSpring(1.16, { damping: 10, stiffness: 360 }), withSpring(1, { damping: 14, stiffness: 220 }));
        burst.value = 0;
        burst.value = withTiming(1, { duration: 460 });
      }
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    onToggle();
  }

  return (
    <Animated.View style={[FACE, motion, style]}>
      {reduceMotion ? null : <Sparkle progress={burst} />}
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

function Sparkle({ progress }: { progress: SharedValue<number> }) {
  return (
    <>
      {Array.from({ length: SPARKS }, (_, index) => (
        <Spark key={index} index={index} progress={progress} />
      ))}
    </>
  );
}

function Spark({ index, progress }: { index: number; progress: SharedValue<number> }) {
  const angle = (index / SPARKS) * Math.PI * 2 - Math.PI / 2;
  const dist = 14 + (index % 3) * 4;
  const style = useAnimatedStyle(() => ({
    opacity: (1 - progress.value) * 0.85,
    transform: [
      { translateX: Math.cos(angle) * dist * progress.value },
      { translateY: Math.sin(angle) * dist * progress.value },
      { scale: 0.7 + (1 - progress.value) * 0.5 },
    ],
  }));
    return <Animated.View pointerEvents="none" style={[{ position: "absolute", left: 19, top: 19, width: 5, height: 5, borderRadius: 3, backgroundColor: index % 2 === 0 ? brand.gold : "#fff4dc" }, style]} />;
}
