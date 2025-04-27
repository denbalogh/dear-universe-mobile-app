import { FEELING_GROUP_NAMES } from "@/common/constants/feelings";
import { useCustomTheme } from "@/common/hooks/useCustomTheme";
import React, { useMemo } from "react";
import { Chip, ChipProps } from "react-native-paper";

type Props = {
  feelingsGroupName: FEELING_GROUP_NAMES;
  emotion: string;
} & Omit<ChipProps, "children">;

const EmotionChip = ({
  feelingsGroupName,
  emotion,
  selected,
  style,
  ...chipProps
}: Props) => {
  const theme = useCustomTheme();

  const backgroundColor = useMemo(() => {
    return selected
      ? theme.colors[feelingsGroupName]
      : theme.colors[`${feelingsGroupName}Container`];
  }, [selected, feelingsGroupName, theme.colors]);

  const color = useMemo(() => {
    return selected
      ? theme.colors[`on${feelingsGroupName}`]
      : theme.colors[`on${feelingsGroupName}Container`];
  }, [selected, feelingsGroupName, theme.colors]);

  return (
    <Chip
      selected={selected}
      selectedColor={theme.colors[`on${feelingsGroupName}`]}
      style={[style, { backgroundColor }]}
      textStyle={{ color }}
      {...chipProps}
    >
      {emotion}
    </Chip>
  );
};

export default EmotionChip;
