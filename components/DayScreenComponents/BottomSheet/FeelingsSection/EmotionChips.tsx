import EmotionChip from "@/components/EmotionChip/EmotionChip";
import { FEELING_GROUP_NAMES } from "@/constants/feelings";
import { spacing } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

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
          style={styles.emotion}
          onPress={() => onEmotionPress(emotion)}
          selected={isActiveEmotion}
          elevated={true}
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
  },
  emotion: {
    marginRight: spacing.spaceSmall,
    marginBottom: spacing.spaceSmall,
  },
});
