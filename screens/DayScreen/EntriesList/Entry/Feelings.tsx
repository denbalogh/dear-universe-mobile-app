import { FEELING_GROUP_NAMES } from "@/common/constants/feelings";
import { roundness, spacing } from "@/common/constants/theme";
import { useCustomTheme } from "@/common/hooks/useCustomTheme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Chip, Text, TouchableRipple } from "react-native-paper";
import EmotionChip from "./FeelingsSection/EmotionChip";

type Props = {
  feelingsGroup: FEELING_GROUP_NAMES;
  feelingsEmotions: string[];
  disabled: boolean;
};

const Feelings = ({ feelingsGroup, feelingsEmotions, disabled }: Props) => {
  const theme = useCustomTheme();
  const hasFeelings = feelingsEmotions.length > 0;

  return (
    <View
      style={[
        styles.wrapper,
        { backgroundColor: theme.colors[`${feelingsGroup}Container`] },
      ]}
    >
      {(hasFeelings ? feelingsEmotions : [feelingsGroup]).map(
        (emotion, index) => (
          <Text key={index} style={styles.emotion}>
            {emotion}
          </Text>
        ),
      )}
    </View>
  );
};

export default Feelings;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    borderRadius: roundness,
    padding: spacing.spaceExtraSmall,
    marginHorizontal: spacing.spaceExtraSmall,
  },
  emotion: {
    margin: spacing.spaceExtraSmall,
  },
});
