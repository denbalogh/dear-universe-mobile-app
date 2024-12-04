import React, { useEffect, useState } from "react";
import Animated, {
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { getRandomPhrase } from "./utils";

type Props = {
  phrases: string[];
  children(phrase: string): React.ReactNode;
};

const FadeInOutTextChange = ({ phrases, children }: Props) => {
  const [phrase, setPhrase] = useState(getRandomPhrase(phrases));
  const opacity = useSharedValue(1);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeout(() => setPhrase(getRandomPhrase(phrases)), 500);
      opacity.value = withSequence(
        withTiming(0, { duration: 500 }),
        withTiming(1, { duration: 500 }),
      );
    }, 5000);
    return () => {
      clearInterval(intervalId);
    };
  }, [phrase, opacity, phrases]);

  return <Animated.View style={{ opacity }}>{children(phrase)}</Animated.View>;
};

export default FadeInOutTextChange;
