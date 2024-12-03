import React, { useEffect, useState } from "react";
import { Text } from "react-native-paper";
import { getRandomPhrase } from "./utils";
import Animated, {
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { StyleSheet, View } from "react-native";
import { spacing } from "@/constants/theme";

const NoEntries = () => {
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
    <View style={styles.wrapper}>
      <Text variant="titleLarge" style={styles.title}>
        Here's a place to describe your day.
      </Text>
      <Text variant="labelMedium" style={styles.helperText}>
        How you might begin:
      </Text>
      <Animated.View style={{ opacity }}>
        <Text variant="bodyLarge" style={styles.phrase}>
          {phrase}
        </Text>
      </Animated.View>
    </View>
  );
};

export default NoEntries;

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: spacing.spaceSmall,
    alignItems: "center",
  },
  title: {
    marginVertical: spacing.spaceLarge,
    textAlign: "center",
  },
  helperText: {
    marginBottom: spacing.spaceExtraSmall,
  },
  phrase: {
    textAlign: "center",
  },
});
