import React from "react";
import { Mood } from "./types";
import { StyleSheet, View, ViewProps } from "react-native";
import { getMoodColor } from "./values";
import { roundness, sizing, spacing } from "@/constants/theme";

type Props = {
  moods: Mood[];
  variant: "vertical" | "horizontal";
} & ViewProps;

export const MOOD_COMPOSITE_VERTICAL_WIDTH = spacing.spaceSmall;

const MoodColorComposite = ({ moods, variant, ...props }: Props) => {
  if (moods.length === 0) {
    return null;
  }

  if (variant === "vertical") {
    const totalCount = moods.length;
    const height = 100 / totalCount;

    return (
      <View style={styles.verticalWrapper} {...props}>
        {moods.map((mood, index) => {
          const isTop = index === 0;
          const isBottom = index === totalCount - 1;

          return (
            <View
              key={`${mood}-${index}`}
              style={[
                styles.verticalCommon,
                isTop && styles.verticalTop,
                isBottom && styles.verticalBottom,
                {
                  backgroundColor: getMoodColor(mood),
                  height: `${height}%`,
                },
              ]}
              accessibilityLabel={mood}
              testID={`${mood}-${index}`}
            />
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.horizontalWrapper} {...props}>
      {moods.map((mood, index) => {
        const isStart = index === 0;
        const isEnd = index === moods.length - 1;
        const isSingle = moods.length === 1;

        return (
          <View
            key={`${mood}-${index}`}
            style={[
              styles.horizontalCommon,
              isStart && styles.horizontalStart,
              isEnd && styles.horizontalEnd,
              isSingle && styles.singleHorizontal,
              {
                backgroundColor: getMoodColor(mood),
              },
            ]}
            accessibilityLabel={mood}
            testID={`${mood}-${index}`}
          />
        );
      })}
    </View>
  );
};

export default MoodColorComposite;

const styles = StyleSheet.create({
  verticalWrapper: {
    width: MOOD_COMPOSITE_VERTICAL_WIDTH,
    height: "100%",
  },
  verticalCommon: {
    width: MOOD_COMPOSITE_VERTICAL_WIDTH,
  },
  verticalTop: {
    borderTopEndRadius: roundness,
  },
  verticalBottom: {
    borderBottomEndRadius: roundness,
  },
  horizontalWrapper: {
    flexDirection: "row",
  },
  horizontalCommon: {
    width: sizing.sizeMedium,
    height: sizing.sizeMedium,
  },
  singleHorizontal: {
    width: 2 * sizing.sizeMedium,
  },
  horizontalStart: {
    borderTopStartRadius: roundness,
    borderBottomStartRadius: roundness,
  },
  horizontalEnd: {
    borderTopEndRadius: roundness,
    borderBottomEndRadius: roundness,
  },
});
