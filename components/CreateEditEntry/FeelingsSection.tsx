import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import { roundness, spacing } from "@/constants/theme";
import { FEELING_GROUP_NAMES, feelings } from "@/constants/feelings";
import { Card, Text } from "react-native-paper";
import EmotionChips from "../FeelingsScreen/EmotionChips";

type Props = {
  activeGroup: FEELING_GROUP_NAMES | "";
  activeEmotions: string[];
  onActiveGroupChange: (name: FEELING_GROUP_NAMES | "") => void;
  onActiveEmotionsChange: (emotions: string[]) => void;
} & ViewProps;

const FeelingsSection = ({
  activeGroup,
  activeEmotions,
  onActiveGroupChange,
  onActiveEmotionsChange,
  ...viewProps
}: Props) => {
  const theme = useCustomTheme();

  const handleActiveGroupChange = (name: FEELING_GROUP_NAMES) => {
    onActiveGroupChange(name === activeGroup ? "" : name);
    onActiveEmotionsChange([]);
  };

  const handleActiveEmotionsChange = (emotion: string) => {
    if (activeEmotions.includes(emotion)) {
      onActiveEmotionsChange(activeEmotions.filter((e) => e !== emotion));
    } else {
      onActiveEmotionsChange([...activeEmotions, emotion]);
    }
  };

  return (
    <View {...viewProps}>
      {feelings.map(({ name, emotions }) => {
        const isActive = name === activeGroup;

        return (
          <Card
            key={name}
            style={[
              styles.card,
              isActive && {
                backgroundColor: theme.colors[`${name}Container`],
              },
            ]}
            onPress={() => handleActiveGroupChange(name)}
          >
            <Card.Content style={styles.cardContent}>
              <Text
                variant="titleLarge"
                style={[
                  isActive && styles.feelingsGroupName,
                  {
                    color: isActive
                      ? // Active color
                        theme.colors[`on${name}Container`]
                      : // Inactive color
                        theme.colors[name],
                  },
                ]}
              >
                {name}
              </Text>
              {isActive && (
                <EmotionChips
                  emotions={emotions}
                  activeEmotions={activeEmotions}
                  onEmotionPress={handleActiveEmotionsChange}
                  feelingsGroupName={name}
                />
              )}
            </Card.Content>
          </Card>
        );
      })}
    </View>
  );
};

export default FeelingsSection;

const styles = StyleSheet.create({
  card: {
    borderRadius: roundness,
    marginBottom: spacing.spaceSmall,
  },
  cardContent: {
    paddingHorizontal: spacing.spaceSmall,
    paddingVertical: spacing.spaceSmall,
  },
  feelingsGroupName: {
    marginBottom: spacing.spaceSmall,
  },
});
