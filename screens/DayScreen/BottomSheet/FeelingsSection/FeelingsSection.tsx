import {
  emotionsGroups,
  FEELING_GROUP_NAMES,
} from "@/common/constants/feelings";
import { spacing } from "@/common/constants/theme";
import { useCustomTheme } from "@/common/hooks/useCustomTheme";
import React, { useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import EmotionChips from "./EmotionChips";
import { IconButton, Text } from "react-native-paper";
import { toLower } from "lodash";
import { useEntryDraft } from "@/contexts/EntryDraftContext";
import { LinearGradient } from "expo-linear-gradient";

const EmojiButton = ({
  feelingsGroup,
}: {
  feelingsGroup: FEELING_GROUP_NAMES;
}) => {
  const theme = useCustomTheme();

  const {
    feelingsGroup: activeFeelingsGroup,
    setFeelingsGroup,
    setFeelingsEmotions,
  } = useEntryDraft();

  const icon = useMemo(() => {
    switch (feelingsGroup) {
      case FEELING_GROUP_NAMES.VERY_UNPLEASANT:
        return "emoticon-dead-outline";
      case FEELING_GROUP_NAMES.UNPLEASANT:
        return "emoticon-sad-outline";
      case FEELING_GROUP_NAMES.NEUTRAL:
        return "emoticon-neutral-outline";
      case FEELING_GROUP_NAMES.PLEASANT:
        return "emoticon-happy-outline";
      case FEELING_GROUP_NAMES.VERY_PLEASANT:
        return "emoticon-excited-outline";
    }
  }, [feelingsGroup]);

  const handleOnPress = () => {
    setFeelingsGroup(feelingsGroup);
    setFeelingsEmotions([]);
  };

  const isActive = activeFeelingsGroup === feelingsGroup;

  return (
    <IconButton
      icon={icon}
      onPress={handleOnPress}
      iconColor={isActive ? "white" : theme.colors[`${feelingsGroup}base`]}
      style={{
        backgroundColor: isActive
          ? theme.colors[`${feelingsGroup}base`]
          : "transparent",
      }}
    />
  );
};

const FeelingsSection = () => {
  const theme = useCustomTheme();

  const { feelingsGroup, feelingsEmotions, setFeelingsEmotions } =
    useEntryDraft();

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
      <LinearGradient
        colors={[
          theme.colors[`${FEELING_GROUP_NAMES.VERY_UNPLEASANT}Container`],
          theme.colors[`${FEELING_GROUP_NAMES.UNPLEASANT}Container`],
          theme.colors[`${FEELING_GROUP_NAMES.NEUTRAL}Container`],
          theme.colors[`${FEELING_GROUP_NAMES.PLEASANT}Container`],
          theme.colors[`${FEELING_GROUP_NAMES.VERY_PLEASANT}Container`],
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.buttonsWrapper}>
          <EmojiButton feelingsGroup={FEELING_GROUP_NAMES.VERY_UNPLEASANT} />
          <EmojiButton feelingsGroup={FEELING_GROUP_NAMES.UNPLEASANT} />
          <EmojiButton feelingsGroup={FEELING_GROUP_NAMES.NEUTRAL} />
          <EmojiButton feelingsGroup={FEELING_GROUP_NAMES.PLEASANT} />
          <EmojiButton feelingsGroup={FEELING_GROUP_NAMES.VERY_PLEASANT} />
        </View>
      </LinearGradient>
      <Text style={styles.feelingsGroupTitle} variant="titleLarge">
        I felt{" "}
        <Text style={{ color: theme.colors[`${feelingsGroup}base`] }}>
          {toLower(feelingsGroup)}
        </Text>
      </Text>
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
  gradient: {
    borderRadius: 100,
  },
  buttonsWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  feelingsGroupTitle: {
    marginVertical: spacing.spaceMedium,
    textAlign: "center",
  },
});
