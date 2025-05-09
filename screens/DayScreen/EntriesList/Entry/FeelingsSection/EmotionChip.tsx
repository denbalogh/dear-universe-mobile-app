import { FEELING_GROUP_NAMES } from "@/common/constants/feelings";
import { spacing } from "@/common/constants/theme";
import { useCustomTheme } from "@/common/hooks/useCustomTheme";
import React from "react";
import { StyleSheet } from "react-native";
import { Chip } from "react-native-paper";

type Props = {
  feelingsGroupName: FEELING_GROUP_NAMES;
  emotion: string;
  selected?: boolean;
  onPress?: () => void;
};

const EmotionChip = ({
  feelingsGroupName,
  emotion,
  selected,
  onPress,
}: Props) => {
  const theme = useCustomTheme();

  const backgroundColor = selected
    ? theme.colors[feelingsGroupName]
    : theme.colors[`${feelingsGroupName}Container`];

  const color = selected
    ? theme.colors[`on${feelingsGroupName}`]
    : theme.colors[`on${feelingsGroupName}Container`];

  return (
    <Chip
      selected={selected}
      selectedColor={theme.colors[`on${feelingsGroupName}`]}
      style={[styles.chip, { backgroundColor }]}
      textStyle={{ color }}
      compact={true}
      onPress={onPress}
    >
      {emotion}
    </Chip>
  );
};

export default EmotionChip;

const styles = StyleSheet.create({
  chip: {
    marginTop: spacing.spaceExtraSmall,
    marginRight: spacing.spaceExtraSmall,
  },
});
