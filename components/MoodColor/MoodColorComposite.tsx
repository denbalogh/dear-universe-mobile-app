import React from "react";
import { Mood } from "./types";
import { StyleSheet, View } from "react-native";
import { getMoodColor, getMoodOrder } from "./values";

type Props = {
  moods: { mood: Mood; count: number }[];
};

const MoodColorComposite = ({ moods }: Props) => {
  if (moods.length === 0) {
    return null;
  }

  const totalCount = moods.reduce((acc, { count }) => acc + count, 0);

  const moodsWithOrder = moods.map(({ mood, count }) => ({
    mood,
    count,
    order: getMoodOrder(mood),
  }));

  const moodsSorted = moodsWithOrder.sort((a, b) => a.order - b.order);

  return (
    <View style={styles.wrapper}>
      {moodsSorted.map(({ mood, count }, index) => {
        const isTop = index === 0;
        const isBottom = index === moodsSorted.length - 1;

        return (
          <View
            key={mood}
            style={[
              styles.common,
              isTop && styles.top,
              isBottom && styles.bottom,
              {
                backgroundColor: getMoodColor(mood),
                height: `${(count / totalCount) * 100}%`,
              },
            ]}
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
    width: 6,
    height: "100%",
    borderRadius: borderRadius,
  },
  common: {
    width: 6,
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
