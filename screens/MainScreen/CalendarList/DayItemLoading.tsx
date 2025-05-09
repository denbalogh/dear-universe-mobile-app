import { useCustomTheme } from "@/common/hooks/useCustomTheme";
import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { ITEM_HEIGHT } from "../constants";
import { roundness, spacing } from "@/common/constants/theme";
import { getColorWithOpacity } from "@/common/utils/style";

const DayItemLoading = () => {
  const theme = useCustomTheme();
  const backgroundColor = getColorWithOpacity(theme.colors.onBackground, 0.1);

  return (
    <View style={styles.wrapper}>
      <View style={[styles.day, { backgroundColor }]} />
      <View style={[styles.content, { backgroundColor }]} />
    </View>
  );
};

export default memo(DayItemLoading);

const styles = StyleSheet.create({
  wrapper: {
    height: ITEM_HEIGHT,
    width: "100%",
    flexDirection: "row",
  },
  day: {
    width: 80,
    borderRadius: roundness,
  },
  content: {
    flex: 1,
    borderRadius: roundness,
    marginLeft: spacing.spaceSmall,
  },
});
