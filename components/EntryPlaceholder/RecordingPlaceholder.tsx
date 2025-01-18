import { sizing, spacing } from "@/constants/theme";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { Icon } from "react-native-paper";
import Animated, { AnimatedProps } from "react-native-reanimated";

type Props = {
  style: AnimatedProps<ViewProps>["style"];
};

const RecordingPlaceholder = ({ style }: Props) => {
  const theme = useCustomTheme();

  const timePlaceholder = (
    <View
      style={[
        styles.timePlaceholder,
        { backgroundColor: theme.colors.surface },
      ]}
    />
  );

  const controlButton = (icon: string) => (
    <View style={styles.controlButton}>
      <Icon
        source={icon}
        size={sizing.sizeMedium}
        color={theme.colors.surface}
      />
    </View>
  );

  return (
    <Animated.View style={[styles.wrapper, style]}>
      <View style={styles.sliderWrapper}>
        <View
          style={[styles.slider, { backgroundColor: theme.colors.surface }]}
        />
        <View
          style={[styles.sliderDot, { backgroundColor: theme.colors.surface }]}
        />
      </View>
      <View style={styles.bottomWrapper}>
        {timePlaceholder}
        <View style={styles.controlButtonWrapper}>
          {controlButton("rewind-5")}
          {controlButton("play")}
          {controlButton("fast-forward-5")}
        </View>
        {timePlaceholder}
      </View>
    </Animated.View>
  );
};

export default RecordingPlaceholder;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "column",
    marginTop: spacing.spaceMedium,
    marginBottom: spacing.spaceSmall,
  },
  sliderWrapper: {
    width: "100%",
    justifyContent: "center",
  },
  slider: {
    height: 2,
    width: "100%",
    borderRadius: 2,
  },
  sliderDot: {
    position: "absolute",
    left: 0,
    height: 12,
    width: 12,
    borderRadius: 12,
  },
  bottomWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.spaceMedium,
  },
  timePlaceholder: {
    height: 10,
    width: 35,
    borderRadius: 10,
  },
  controlButtonWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  controlButton: {
    marginHorizontal: spacing.spaceSmall,
  },
});
