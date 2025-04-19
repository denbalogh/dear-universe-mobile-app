import { emotionsGroups, FEELING_GROUP_NAMES } from "@/constants/feelings";
import { roundness, spacing } from "@/constants/theme";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import EmotionChips from "./EmotionChips";
import Slider, { MarkerProps } from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "react-native-paper";
import { toLower } from "lodash";

const StepMarker = ({ currentValue, index }: MarkerProps) => {
  const theme = useCustomTheme();

  const activeBackgroundColor = useMemo(() => {
    switch (index) {
      case 1:
        return theme.colors["Very unpleasantbase"];
      case 2:
        return theme.colors["Unpleasantbase"];
      case 3:
        return theme.colors["Neutralbase"];
      case 4:
        return theme.colors["Pleasantbase"];
      case 5:
        return theme.colors["Very pleasantbase"];
    }
  }, [index, theme]);

  const isActive = index === currentValue;

  return (
    <View
      style={[
        styles.stepMarker,
        {
          backgroundColor: isActive
            ? activeBackgroundColor
            : theme.colors.background,
          elevation: isActive ? 3 : 0,
        },
      ]}
    />
  );
};

const FeelingsSection = () => {
  const theme = useCustomTheme();
  const [currentValue, setCurrentValue] = useState(1);

  const feelingsGroup = useMemo(() => {
    switch (currentValue) {
      case 1:
        return FEELING_GROUP_NAMES.VERY_UNPLEASANT;
      case 2:
        return FEELING_GROUP_NAMES.UNPLEASANT;
      case 3:
      default:
        return FEELING_GROUP_NAMES.NEUTRAL;
      case 4:
        return FEELING_GROUP_NAMES.PLEASANT;
      case 5:
        return FEELING_GROUP_NAMES.VERY_PLEASANT;
    }
  }, [currentValue]);

  return (
    <View>
      <View style={styles.sliderWrapper}>
        <LinearGradient
          style={[StyleSheet.absoluteFill, styles.gradient]}
          colors={[
            theme.colors["Very unpleasantContainer"],
            theme.colors["UnpleasantContainer"],
            theme.colors["NeutralContainer"],
            theme.colors["PleasantContainer"],
            theme.colors["Very pleasantContainer"],
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          dither={false}
        />
        <Slider
          minimumValue={1}
          maximumValue={5}
          step={1}
          minimumTrackTintColor="transparent"
          maximumTrackTintColor="transparent"
          thumbTintColor="transparent"
          StepMarker={StepMarker}
          value={currentValue}
          onValueChange={setCurrentValue}
        />
      </View>
      <Text
        style={[
          styles.feelingsGroupTitle,
          { color: theme.colors[`${feelingsGroup}base`] },
        ]}
        variant="titleLarge"
      >
        I felt {toLower(feelingsGroup)}
      </Text>
      <EmotionChips
        emotions={emotionsGroups[feelingsGroup]}
        activeEmotions={[]}
        feelingsGroupName={feelingsGroup}
        onEmotionPress={() => {}}
      />
    </View>
  );
};

export default FeelingsSection;

const styles = StyleSheet.create({
  sliderWrapper: {
    padding: spacing.spaceSmall,
  },
  gradient: {
    borderRadius: roundness,
  },
  stepMarker: {
    width: 20,
    height: 20,
    borderRadius: 20,
  },
  feelingsGroupTitle: {
    marginVertical: spacing.spaceMedium,
    textAlign: "center",
  },
});
