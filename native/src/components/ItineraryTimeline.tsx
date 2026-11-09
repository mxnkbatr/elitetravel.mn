import { useEffect, useRef, useState } from "react";
import { Text, View, useWindowDimensions, type HostInstance } from "react-native";
import Animated, { runOnJS, useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming, type SharedValue } from "react-native-reanimated";
import { dayPhoto } from "../lib/day-photo";
import type { Tour } from "../lib/types";
import { fonts, radii, space, typeScale, useTheme } from "../theme";
import { useMotionFlag } from "./motion";
import { RemoteImage, Txt } from "./ui";

export function ItineraryTimeline({ tour, scrollY }: { tour: Tour; scrollY: SharedValue<number> }) {
  const days = tour.itinerary ?? [];
  const { height } = useWindowDimensions();
  const { colors, fontsReady, reduceMotion } = useTheme();
  const motionOn = useMotionFlag(reduceMotion);
  const columnRef = useRef<HostInstance>(null);
  const sectionY = useSharedValue(0);
  const offsets = useSharedValue<number[]>([]);
  const photos = days.map((day, index) => dayPhoto(tour, day, index));
  const [photoIndex, setPhotoIndex] = useState(0);

  useAnimatedReaction(
    () => {
      const marks = offsets.value;
      const view = scrollY.value + height * 0.58;
      let index = 0;
      for (let i = 0; i < marks.length; i++) {
        if (view >= sectionY.value + marks[i]) index = i;
      }
      return index;
    },
    (next, prev) => {
      if (next !== prev) runOnJS(setPhotoIndex)(next);
    },
  );

  if (!days.length) return null;

  function remember(index: number, y: number) {
    const next = offsets.value.slice();
    next[index] = y;
    offsets.value = next;
  }

  function measureColumn() {
    columnRef.current?.measureInWindow((_x, y) => {
      sectionY.value = y + scrollY.value;
    });
  }

  const lineStyle = useAnimatedStyle(() => {
    const marks = offsets.value;
    if (!marks.length) return { height: 0 };
    const span = Math.max(24, marks[marks.length - 1] - marks[0]);
    if (!motionOn.value) return { height: span };
    const seen = scrollY.value + height * 0.8 - (sectionY.value + marks[0]);
    return { height: Math.min(span, Math.max(0, seen)) };
  });

  return (
    <View style={{ marginTop: space.xxl }}>
      <Text style={{ color: colors.text, fontSize: typeScale.section, fontFamily: fontsReady ? fonts.display : undefined }}>Хөтөлбөр</Text>
      <PhotoStage photos={photos} index={photoIndex} reduceMotion={reduceMotion} />
      <View ref={columnRef} collapsable={false} onLayout={measureColumn} style={{ marginTop: space.lg, paddingLeft: 28 }}>
        <View style={{ position: "absolute", left: 7, top: 8, bottom: 8, width: 2, backgroundColor: colors.line }} />
        <Animated.View style={[{ position: "absolute", left: 7, top: 8, width: 2, backgroundColor: colors.accent, borderRadius: 1 }, lineStyle]} />
        {days.map((day, index) => (
          <DayNode
            key={`${day.day}-${day.title}`}
            index={index}
            label={day.day || `${index + 1}-р өдөр`}
            title={day.title}
            detail={day.detail}
            meta={[day.flight ? `Нислэг: ${day.flight}` : "", day.meals ? `Хоол: ${day.meals}` : "", day.hotel ? `Буудал: ${day.hotel}` : ""].filter(Boolean)}
            scrollY={scrollY}
            sectionY={sectionY}
            offsets={offsets}
            windowHeight={height}
            motion={motionOn}
            onY={(y) => remember(index, y)}
          />
        ))}
      </View>
    </View>
  );
}

function PhotoStage({ photos, index, reduceMotion }: { photos: (string | null)[]; index: number; reduceMotion: boolean }) {
  const { colors } = useTheme();
  const uri = photos[index] ?? photos.find((item) => item) ?? null;
  const [previous, setPrevious] = useState<string | null>(null);
  const [current, setCurrent] = useState<string | null>(uri);
  const fade = useSharedValue(1);

  useEffect(() => {
    if (!uri || uri === current) return;
    setPrevious(current);
    setCurrent(uri);
    if (reduceMotion) {
      fade.value = 1;
      return;
    }
    fade.value = 0;
    fade.value = withTiming(1, { duration: 420 });
  }, [current, fade, reduceMotion, uri]);

  if (!current) return null;
  const cover = useAnimatedStyle(() => ({ opacity: fade.value }));
  return (
    <View style={{ marginTop: space.md, height: 188, borderRadius: radii.xl, overflow: "hidden", backgroundColor: colors.bgSoft }}>
      {previous ? <RemoteImage uri={previous} width={1200} height={800} alt="" fade={false} style={{ position: "absolute", width: "100%", height: "100%" }} /> : null}
      <Animated.View style={[{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }, cover]}>
        <RemoteImage uri={current} width={1200} height={800} alt="" fade={false} style={{ width: "100%", height: "100%" }} />
      </Animated.View>
    </View>
  );
}

function DayNode({
  index,
  label,
  title,
  detail,
  meta,
  scrollY,
  sectionY,
  offsets,
  windowHeight,
  motion,
  onY,
}: {
  index: number;
  label: string;
  title: string;
  detail: string;
  meta: string[];
  scrollY: SharedValue<number>;
  sectionY: SharedValue<number>;
  offsets: SharedValue<number[]>;
  windowHeight: number;
  motion: SharedValue<number>;
  onY: (y: number) => void;
}) {
  const { colors, fontsReady } = useTheme();
  const style = useAnimatedStyle(() => {
    if (!motion.value) return { opacity: 1, transform: [{ translateY: 0 }] };
    const y = sectionY.value + (offsets.value[index] ?? 4000);
    const seen = scrollY.value + windowHeight * 0.86 - y;
    const p = Math.min(1, Math.max(0, seen / 90));
    return { opacity: 0.35 + 0.65 * p, transform: [{ translateY: (1 - p) * 14 }] };
  });
  return (
    <Animated.View onLayout={(event) => onY(event.nativeEvent.layout.y)} style={[{ marginBottom: space.lg }, style]}>
      <View style={{ position: "absolute", left: -28, top: 4, width: 16, height: 16, borderRadius: 8, backgroundColor: colors.bg, borderWidth: 2, borderColor: colors.accent, alignItems: "center", justifyContent: "center" }}>
        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent }} />
      </View>
      <Text style={{ color: colors.accent, fontSize: typeScale.caption, fontFamily: fontsReady ? fonts.sansBold : undefined }}>{label}</Text>
      <Text style={{ color: colors.text, fontSize: 20, lineHeight: 24, marginTop: 2, fontFamily: fontsReady ? fonts.display : undefined }}>{title}</Text>
      {detail ? <Txt muted style={{ marginTop: 4 }}>{detail}</Txt> : null}
      {meta.map((line) => (
        <Text key={line} style={{ color: colors.muted, fontSize: typeScale.caption, marginTop: 2, fontFamily: fontsReady ? fonts.sans : undefined }}>{line}</Text>
      ))}
    </Animated.View>
  );
}
