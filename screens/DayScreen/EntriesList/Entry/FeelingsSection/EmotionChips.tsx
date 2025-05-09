import { FEELING_GROUP_NAMES } from "@/common/constants/feelings";
import React from "react";
import { StyleSheet, View } from "react-native";
import EmotionChip from "./EmotionChip";
import { spacing } from "@/common/constants/theme";

type Props = {
  emotions: string[];
  activeEmotions: string[] | undefined;
  onEmotionPress: (emotion: string) => void;
  feelingsGroupName: FEELING_GROUP_NAMES;
};

const EmotionChips = ({
  emotions,
  activeEmotions,
  onEmotionPress,
  feelingsGroupName,
}: Props) => (
  <View style={styles.wrapper}>
    {emotions.map((emotion) => {
      const isActiveEmotion = activeEmotions?.includes(emotion);

      return (
        <EmotionChip
          key={emotion}
          feelingsGroupName={feelingsGroupName}
          emotion={emotion}
          onPress={() => onEmotionPress(emotion)}
          selected={isActiveEmotion}
        />
      );
    })}
  </View>
);

export default EmotionChips;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginRight: -spacing.spaceExtraSmall,
    marginVertical: spacing.spaceExtraSmall,
  },
});
