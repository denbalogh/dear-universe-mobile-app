import React from "react";
import { Mood } from "./types";
import { StyleSheet, View, ViewProps } from "react-native";
import { getMoodColor } from "./values";

type Props = {
  moods: Mood[];
} & ViewProps;

export const MOOD_COMPOSITE_WIDTH = 6;

const MoodColorComposite = ({ moods, ...props }: Props) => {
  if (moods.length === 0) {
    return null;
  }

  const totalCount = moods.length;
  const height = 100 / totalCount;

  return (
    <View style={styles.wrapper} {...props}>
      {moods.map((mood, index) => {
        const isTop = index === 0;
        const isBottom = index === totalCount - 1;

        return (
          <View
            key={`${mood}-${index}`}
            style={[
              styles.common,
              isTop && styles.top,
              isBottom && styles.bottom,
              {
                backgroundColor: getMoodColor(mood),
                height: `${height}%`,
              },
            ]}
            aria-label={mood}
            testID={`${mood}-${index}`}
          />
        );
      })}
    </View>
  );
};

export default MoodColorComposite;

const borderRadius = 5;

const styles = StyleSheet.create({
  wrapper: {
    width: MOOD_COMPOSITE_WIDTH,
    height: "100%",
    borderRadius: borderRadius,
  },
  common: {
    width: MOOD_COMPOSITE_WIDTH,
  },
  top: {
    borderTopStartRadius: borderRadius,
    borderTopEndRadius: borderRadius,
  },
  bottom: {
    borderBottomStartRadius: borderRadius,
    borderBottomEndRadius: borderRadius,
  },
});
