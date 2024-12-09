import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { roundness, spacing } from "@/constants/theme";
import { FEELING_GROUP_NAMES } from "@/constants/feelings";
import { useCustomTheme } from "@/hooks/useCustomTheme";

type Props = {
  feelings: FEELING_GROUP_NAMES[];
} & ViewProps;

const FeelingsIndicator = ({ feelings, style, ...props }: Props) => {
  const theme = useCustomTheme();

  if (feelings.length === 0) {
    return null;
  }

  const totalCount = feelings.length;
  const width = 100 / totalCount;

  return (
    <View style={[styles.wrapper, style]} {...props}>
      {feelings.map((feeling, index) => {
        const isLeftEnd = index === 0;
        const isRightEnd = index === totalCount - 1;

        return (
          <View
            key={`${feelings}-${index}`}
            style={[
              isLeftEnd && styles.leftEnd,
              isRightEnd && styles.rightEnd,
              {
                backgroundColor: theme.colors[`${feeling}base`],
                width: `${width}%`,
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
  wrapper: {
    height: spacing.spaceExtraSmall,
    flexDirection: "row",
  },
  leftEnd: {
    borderBottomStartRadius: roundness,
  },
  rightEnd: {
    borderBottomEndRadius: roundness,
  },
});
