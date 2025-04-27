import React, { ReactNode, useEffect } from "react";
import { ViewProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const OFFSET = 100;

export type FadeInViewAppearFrom =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "center";

type Props = {
  animateOpacity?: boolean;
  appearFrom?: FadeInViewAppearFrom;
  children: ReactNode;
} & ViewProps;

const FadeInView = ({
  animateOpacity = true,
  appearFrom = "center",
  style,
  children,
  ...viewProps
}: Props) => {
  const initialOpacity = animateOpacity ? 0 : 1;
  const initialTranslate = {
    left: -OFFSET,
    right: OFFSET,
    top: -OFFSET,
    bottom: OFFSET,
    center: 0,
  }[appearFrom];

  const opacity = useSharedValue(initialOpacity);
  const translate = useSharedValue(initialTranslate);

  const animatedStylesFromSides = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translate.value }],
  }));

  const animatedStylesFromTopBottom = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translate.value }],
  }));

  const isFadingFromSides = ["left", "right"].includes(appearFrom);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
    translate.value = withTiming(0, { duration: 300 });
  }, [opacity, translate]);

  return (
    <Animated.View
      style={[
        style,
        isFadingFromSides
          ? animatedStylesFromSides
          : animatedStylesFromTopBottom,
      ]}
      {...viewProps}
    >
      {children}
    </Animated.View>
  );
};

export default FadeInView;
