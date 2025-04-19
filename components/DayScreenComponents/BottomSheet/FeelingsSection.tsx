import { FEELING_GROUP_NAMES, feelings } from "@/constants/feelings";
import { roundness, spacing } from "@/constants/theme";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";
import EmotionChips from "../../CreateEditEntry/FeelingsSection/EmotionChips";

const FeelingsSection = () => {
  const theme = useCustomTheme();
  const activeGroup = FEELING_GROUP_NAMES.NEUTRAL; // This should be replaced with the actual active group state
  const activeEmotions = ["joy"]; // This should be replaced with the actual active emotions state
  const onActiveGroupChange = (name: string) => {
    // This should be replaced with the actual function to handle active group change
    console.log("Active group changed to:", name);
  };
  const onActiveEmotionsChange = (emotions: string[]) => {
    // This should be replaced with the actual function to handle active emotions change
    console.log("Active emotions changed to:", emotions);
  };

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
    <View>
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
