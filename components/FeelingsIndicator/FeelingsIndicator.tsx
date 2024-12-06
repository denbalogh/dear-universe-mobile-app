import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { roundness, spacing } from "@/constants/theme";
import { FEELING_GROUP_NAMES } from "@/constants/feelings";
import { useCustomTheme } from "@/hooks/useCustomTheme";

type Props = {
  feelings: FEELING_GROUP_NAMES[];
} & ViewProps;

const FeelingsIndicator = ({ feelings, ...props }: Props) => {
  const theme = useCustomTheme();

  if (feelings.length === 0) {
    return null;
  }

  const totalCount = feelings.length;
  const height = 100 / totalCount;

  return (
    <View style={styles.verticalWrapper} {...props}>
      {feelings.map((feeling, index) => {
        const isTop = index === 0;
        const isBottom = index === totalCount - 1;

        return (
          <View
            key={`${feelings}-${index}`}
            style={[
              isTop && styles.verticalTop,
              isBottom && styles.verticalBottom,
              {
                backgroundColor: theme.colors[`${feeling}base`],
                height: `${height}%`,
              },
            ]}
            accessibilityLabel={feeling}
            testID={`${feeling}-${index}`}
          />
        );
      })}
    </View>
  );
};

export default FeelingsIndicator;

const styles = StyleSheet.create({
  verticalWrapper: {
    width: spacing.spaceSmall,
    height: "100%",
  },
  verticalTop: {
    borderTopEndRadius: roundness,
  },
  verticalBottom: {
    borderBottomEndRadius: roundness,
  },
});
