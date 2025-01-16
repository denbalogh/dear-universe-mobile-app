import { FEELING_GROUP_NAMES } from "@/constants/feelings";
import { spacing } from "@/constants/theme";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Chip } from "react-native-paper";

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
}: Props) => {
  const theme = useCustomTheme();

  return (
    <View style={styles.wrapper}>
      {emotions.map((emotion) => {
        const isActiveEmotion = activeEmotions?.includes(emotion);

        return (
          <Chip
            key={emotion}
            style={[
              styles.emotion,
              isActiveEmotion
                ? // Active styles
                  {
                    backgroundColor: theme.colors[feelingsGroupName],
                  }
                : // Inactive styles
                  {
                    backgroundColor:
                      theme.colors[`${feelingsGroupName}Container`],
                  },
            ]}
            onPress={() => onEmotionPress(emotion)}
            selected={isActiveEmotion}
            elevated={true}
            textStyle={
              isActiveEmotion
                ? // Active styles
                  { color: theme.colors[`on${feelingsGroupName}`] }
                : // Inactive styles
                  { color: theme.colors[`on${feelingsGroupName}Container`] }
            }
            selectedColor={theme.colors[`on${feelingsGroupName}`]}
          >
            {emotion}
          </Chip>
        );
      })}
    </View>
  );
};

export default EmotionChips;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  emotion: {
    marginRight: spacing.spaceExtraSmall,
    marginTop: spacing.spaceExtraSmall,
  },
});
