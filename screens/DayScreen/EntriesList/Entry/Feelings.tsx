import { FEELING_GROUP_NAMES } from "@/common/constants/feelings";
import { roundness, spacing } from "@/common/constants/theme";
import { useCustomTheme } from "@/common/hooks/useCustomTheme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Chip, Text, TouchableRipple } from "react-native-paper";
import EmotionChip from "../../BottomSheetProvider/FeelingsSection/EmotionChip";

type Props = {
  feelingsGroup: FEELING_GROUP_NAMES;
  feelingsEmotions: string[];
  disabled: boolean;
};

const Feelings = ({ feelingsGroup, feelingsEmotions, disabled }: Props) => {
  const hasFeelings = feelingsEmotions.length > 0;

  return (
    <TouchableRipple
      onPress={() => console.log("Pressed feelings")}
      style={styles.wrapper}
      disabled={disabled}
    >
      <View style={styles.emotionsWrapper}>
        {(hasFeelings ? feelingsEmotions : [feelingsGroup]).map(
          (emotion, index) => (
            <EmotionChip
              key={`${emotion}-${index}`}
              feelingsGroupName={feelingsGroup}
              emotion={emotion}
            />
          ),
        )}
      </View>
    </TouchableRipple>
  );
};

export default Feelings;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingBottom: spacing.spaceExtraSmall,
  },
  emotionsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    flexShrink: 1,
  },
  emotion: {
    marginRight: spacing.spaceExtraSmall,
    marginTop: spacing.spaceExtraSmall,
  },
});
