import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { Pressable, View, type HostInstance, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  FadeIn,
  FadeInUp,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import { takeHeroFlight, type HeroRect } from "../motion/heroFlight";
import { fonts, radii, useTheme } from "../theme";
import { haptic, RemoteImage } from "./ui";

const FLIGHT = { damping: 22, stiffness: 170, mass: 0.82 };

export function useKenBurns(reduceMotion: boolean) {
  const scale = useSharedValue(1);
  useEffect(() => {
    if (reduceMotion) {
      cancelAnimation(scale);
      scale.value = 1;
      return;
    }
    scale.value = withRepeat(withTiming(1.08, { duration: 18000, easing: Easing.inOut(Easing.quad) }), -1, true);
    return () => cancelAnimation(scale);
  }, [reduceMotion, scale]);
  return scale;
}

export function useMotionFlag(reduceMotion: boolean) {
  const on = useSharedValue(reduceMotion ? 0 : 1);
  useEffect(() => {
    on.value = reduceMotion ? 0 : 1;
  }, [on, reduceMotion]);
  return on;
}

/** One display line, each word rising in. Reduced motion paints the line at once. */
export function CinematicLine({
  text,
  italic,
  color,
  delay,
  size,
}: {
  text: string;
  italic?: boolean;
  color: string;
  delay: number;
  size: number;
}) {
  const { reduceMotion, fontsReady } = useTheme();
  const words = text.split(" ");
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap" }} accessible={false}>
      {words.map((word, index) => (
        <Animated.Text
          key={`${word}-${index}`}
          entering={reduceMotion ? undefined : FadeInUp.delay(delay + index * 90).duration(640)}
          style={{
            color,
            fontSize: size,
            lineHeight: size + 2,
            marginRight: 10,
            fontFamily: fontsReady ? (italic ? fonts.displayItalic : fonts.display) : undefined,
            fontStyle: italic ? "italic" : "normal",
          }}
        >
          {word}
        </Animated.Text>
      ))}
    </View>
  );
}

export function Stagger({ index, children, style }: { index: number; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { reduceMotion } = useTheme();
  return (
    <Animated.View entering={reduceMotion ? undefined : FadeInUp.delay(Math.min(index, 7) * 75).duration(520)} style={style}>
      {children}
    </Animated.View>
  );
}

export function Rise({ delay = 0, children, style }: { delay?: number; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { reduceMotion } = useTheme();
  return (
    <Animated.View entering={reduceMotion ? undefined : FadeInUp.delay(delay).duration(560)} style={style}>
      {children}
    </Animated.View>
  );
}

export function Fade({ delay = 0, children, style }: { delay?: number; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { reduceMotion } = useTheme();
  return (
    <Animated.View entering={reduceMotion ? undefined : FadeIn.delay(delay).duration(480)} style={style}>
      {children}
    </Animated.View>
  );
}

export function SpringPress({
  children,
  onPress,
  style,
  disabled,
  label,
}: {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  label: string;
}) {
  const { reduceMotion } = useTheme();
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={anim}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        disabled={disabled}
        onPressIn={() => {
          if (!reduceMotion) scale.value = withSpring(0.96, { damping: 18, stiffness: 380 });
        }}
        onPressOut={() => {
          if (!reduceMotion) scale.value = withSpring(1, { damping: 16, stiffness: 260 });
        }}
        onPress={() => {
          haptic();
          onPress?.();
        }}
        style={[style, disabled && { opacity: 0.45 }]}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

function copyRect(rect: HeroRect, x: SharedValue<number>, y: SharedValue<number>, w: SharedValue<number>, h: SharedValue<number>) {
  x.value = rect.x;
  y.value = rect.y;
  w.value = rect.width;
  h.value = rect.height;
}

/**
 * Expands the tapped card image into the detail hero on the UI thread.
 * Reanimated 4.7 ships with shared-element transitions compiled off, so this
 * measured spring is the transition that runs on the current Expo SDK.
 */
export function FlyingHero({
  id,
  uri,
  from,
  destRef,
  onDone,
}: {
  id: string;
  uri: string;
  from: HeroRect | null;
  destRef: RefObject<HostInstance | null>;
  onDone: () => void;
}) {
  const progress = useSharedValue(0);
  const ready = useSharedValue(0);
  const fromX = useSharedValue(from?.x ?? 0);
  const fromY = useSharedValue(from?.y ?? 0);
  const fromW = useSharedValue(from?.width ?? 1);
  const fromH = useSharedValue(from?.height ?? 1);
  const toX = useSharedValue(from?.x ?? 0);
  const toY = useSharedValue(from?.y ?? 0);
  const toW = useSharedValue(from?.width ?? 1);
  const toH = useSharedValue(from?.height ?? 1);
  const [alive, setAlive] = useState(from != null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (!from) return;
    takeHeroFlight(id);
    copyRect(from, fromX, fromY, fromW, fromH);
    let cancelled = false;
    let tries = 0;
    const finish = () => {
      if (cancelled) return;
      cancelled = true;
      setAlive(false);
      doneRef.current();
    };
    const timer = setTimeout(finish, 1100);
    const measure = () => {
      if (cancelled) return;
      const node = destRef.current;
      if (!node || tries > 10) {
        if (!node && tries <= 10) {
          tries += 1;
          requestAnimationFrame(measure);
          return;
        }
        finish();
        return;
      }
      node.measureInWindow((x, y, width, height) => {
        if (cancelled) return;
        if (width < 2 || height < 2) {
          tries += 1;
          requestAnimationFrame(measure);
          return;
        }
        toX.value = x;
        toY.value = y;
        toW.value = width;
        toH.value = height;
        ready.value = 1;
        progress.value = withSpring(1, FLIGHT, (finished) => {
          if (finished) runOnJS(finish)();
        });
      });
    };
    requestAnimationFrame(measure);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      cancelAnimation(progress);
    };
  }, [destRef, from, fromH, fromW, fromX, fromY, id, progress, ready, toH, toW, toX, toY]);

  const style = useAnimatedStyle(() => {
    const p = ready.value ? progress.value : 0;
    return {
      position: "absolute",
      zIndex: 20,
      overflow: "hidden",
      left: interpolate(p, [0, 1], [fromX.value, toX.value]),
      top: interpolate(p, [0, 1], [fromY.value, toY.value]),
      width: interpolate(p, [0, 1], [fromW.value, toW.value]),
      height: interpolate(p, [0, 1], [fromH.value, toH.value]),
      borderRadius: interpolate(p, [0, 1], [radii.xxl, 0]),
    };
  });

  if (!from || !alive) return null;
  return (
    <Animated.View pointerEvents="none" style={style}>
      <RemoteImage uri={uri} width={1400} height={1600} alt="" fade={false} style={{ width: "100%", height: "100%", backgroundColor: "transparent" }} />
    </Animated.View>
  );
}
