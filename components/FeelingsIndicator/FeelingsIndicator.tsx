import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { roundness, spacing } from "@/constants/theme";
import { FEELING_GROUP_NAMES } from "@/constants/feelings";
import { useCustomTheme } from "@/hooks/useCustomTheme";

type Props = {
  feelings: FEELING_GROUP_NAMES[];
  height?: number;
  borderRadius?: "bottomOnly" | "full";
} & ViewProps;

const FeelingsIndicator = ({
  feelings,
  style,
  height = spacing.spaceExtraSmall,
  borderRadius = "bottomOnly",
  ...props
}: Props) => {
  const theme = useCustomTheme();

  if (feelings.length === 0) {
    return null;
  }

  const totalCount = feelings.length;
  const width = 100 / totalCount;

  const isBorderRadiusFull = borderRadius === "full";

  return (
    <View style={[styles.wrapper, { height }, style]} {...props}>
      {feelings.map((feeling, index) => {
        const isLeftEnd = index === 0;
        const isRightEnd = index === totalCount - 1;

        return (
          <View
            key={`${feelings}-${index}`}
            style={[
              isLeftEnd &&
                (isBorderRadiusFull
                  ? styles.leftEndFull
                  : styles.leftEndBottomOnly),
              isRightEnd &&
                (isBorderRadiusFull
                  ? styles.rightEndFull
                  : styles.rightEndBottomOnly),
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
    flexDirection: "row",
  },
  leftEndFull: {
    borderBottomStartRadius: roundness,
    borderTopStartRadius: roundness,
  },
  leftEndBottomOnly: {
    borderBottomStartRadius: roundness,
  },
  rightEndFull: {
    borderBottomEndRadius: roundness,
    borderTopEndRadius: roundness,
  },
  rightEndBottomOnly: {
    borderBottomEndRadius: roundness,
  },
});
