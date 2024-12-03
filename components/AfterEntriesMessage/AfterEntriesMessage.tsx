import React, { useEffect, useState } from "react";
import { Text } from "react-native-paper";
import { getRandomPhrase } from "./utils";
import Animated, {
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { StyleSheet } from "react-native";

const AfterEntriesMessage = () => {
  const [phrase, setPhrase] = useState(getRandomPhrase());
  const opacity = useSharedValue(1);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeout(() => setPhrase(getRandomPhrase()), 500);
      opacity.value = withSequence(
        withTiming(0, { duration: 500 }),
        withTiming(1, { duration: 500 }),
      );
    }, 5000);
    return () => {
      clearInterval(intervalId);
    };
  }, [phrase, opacity]);

  return (
    <Animated.View style={{ opacity }}>
      <Text variant="bodyMedium" style={styles.phrase}>
        {phrase}
      </Text>
    </Animated.View>
  );
};

export default AfterEntriesMessage;

const styles = StyleSheet.create({
  phrase: {
    textAlign: "center",
  },
});
