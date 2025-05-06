import {
  emotionsGroups,
  FEELING_GROUP_NAMES,
} from "@/common/constants/feelings";
import { roundness, spacing } from "@/common/constants/theme";
import { useCustomTheme } from "@/common/hooks/useCustomTheme";
import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import EmotionChips from "./EmotionChips";
import { TouchableRipple } from "react-native-paper";
import { useEntryEditor } from "@/common/providers/EntryEditorProvider";

const FeelingsGroupButton = ({
  feelingsGroup,
  isFirst = false,
  isLast = false,
}: {
  feelingsGroup: FEELING_GROUP_NAMES;
  isFirst?: boolean;
  isLast?: boolean;
}) => {
  const theme = useCustomTheme();

  const {
    feelingsGroup: activeFeelingsGroup,
    setFeelingsGroup,
    setFeelingsEmotions,
  } = useEntryEditor();

  const handleOnPress = () => {
    setFeelingsGroup(feelingsGroup);
    setFeelingsEmotions([]);
  };

  const isActive = activeFeelingsGroup === feelingsGroup;

  return (
    <TouchableRipple style={styles.buttonTouchable} onPress={handleOnPress}>
      <View
        style={[
          styles.buttonContent,
          isFirst && styles.buttonFirst,
          isLast && styles.buttonLast,
          {
            backgroundColor: isActive
              ? theme.colors[`${feelingsGroup}base`]
              : theme.colors[`${feelingsGroup}Container`],
          },
        ]}
      />
    </TouchableRipple>
  );
};

const FeelingsSection = () => {
  const { feelingsGroup, feelingsEmotions, setFeelingsEmotions } =
    useEntryEditor();

  const toggleFeelingsEmotion = useCallback(
    (emotion: string) => {
      if (feelingsEmotions.includes(emotion)) {
        setFeelingsEmotions(feelingsEmotions.filter((e) => e !== emotion));
      } else {
        setFeelingsEmotions([...feelingsEmotions, emotion]);
      }
    },
    [feelingsEmotions, setFeelingsEmotions],
  );

  return (
    <View>
      <View style={styles.buttonsWrapper}>
        <FeelingsGroupButton
          feelingsGroup={FEELING_GROUP_NAMES.VERY_UNPLEASANT}
          isFirst={true}
        />
        <FeelingsGroupButton feelingsGroup={FEELING_GROUP_NAMES.UNPLEASANT} />
        <FeelingsGroupButton feelingsGroup={FEELING_GROUP_NAMES.NEUTRAL} />
        <FeelingsGroupButton feelingsGroup={FEELING_GROUP_NAMES.PLEASANT} />
        <FeelingsGroupButton
          feelingsGroup={FEELING_GROUP_NAMES.VERY_PLEASANT}
          isLast={true}
        />
      </View>
      <EmotionChips
        emotions={emotionsGroups[feelingsGroup]}
        activeEmotions={feelingsEmotions}
        feelingsGroupName={feelingsGroup}
        onEmotionPress={toggleFeelingsEmotion}
      />
    </View>
  );
};

export default FeelingsSection;

const styles = StyleSheet.create({
  buttonsWrapper: {
    flexDirection: "row",
    marginBottom: spacing.spaceExtraSmall,
  },
  buttonTouchable: {
    width: "20%",
  },
  buttonContent: {
    height: 40,
    marginHorizontal: 2,
    borderRadius: roundness,
  },
  buttonFirst: {
    marginLeft: 0,
  },
  buttonLast: {
    marginRight: 0,
  },
});
