import { FEELING_GROUP_NAMES, feelings } from "@/constants/feelings";
import { roundness, spacing } from "@/constants/theme";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import React, { ReactNode, useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";
import EmotionChips from "./EmotionChips";

type Props = {
  bottomComponent: ReactNode;
};

const FeelingSelector = ({ bottomComponent }: Props) => {
  const theme = useCustomTheme();

  const [activeGroup, setActiveGroup] = useState<FEELING_GROUP_NAMES | null>(
    null,
  );
  const [activeEmotions, setActiveEmotions] = useState<string[]>([]);

  const handleSetActiveGroup = (name: FEELING_GROUP_NAMES) => {
    if (activeGroup === name) {
      return;
    }

    setActiveGroup(name);
    setActiveEmotions([]);
  };

  const handleSetEmotion = useCallback(
    (emotion: string) => {
      if (activeEmotions.includes(emotion)) {
        setActiveEmotions(
          activeEmotions.filter((activeEmotion) => activeEmotion !== emotion),
        );
      } else {
        setActiveEmotions([...activeEmotions, emotion]);
      }
    },
    [activeEmotions],
  );

  return (
    <View style={styles.wrapper}>
      <Text variant="titleLarge" style={styles.headline}>
        How did you feel?
      </Text>
      <View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
        >
          {feelings.map(({ name, emotions }) => {
            const isActive = activeGroup === name;

            return (
              <Card
                key={name}
                style={[
                  styles.card,
                  isActive && {
                    backgroundColor: theme.colors[`${name}Container`],
                  },
                ]}
                onPress={() => handleSetActiveGroup(name)}
              >
                <Card.Content
                  style={{
                    paddingHorizontal: spacing.spaceMedium,
                    paddingVertical: spacing.spaceMedium,
                  }}
                >
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
                      onEmotionPress={handleSetEmotion}
                      feelingsGroupName={name}
                    />
                  )}
                </Card.Content>
              </Card>
            );
          })}
        </ScrollView>
      </View>
      <View style={styles.bottomComponentWrapper}>{bottomComponent}</View>
    </View>
  );
};

export default FeelingSelector;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "column",
    justifyContent: "space-between",
    flex: 1,
  },
  scrollView: {
    marginBottom: spacing.spaceMedium,
  },
  scrollViewContent: {
    paddingHorizontal: spacing.spaceSmall,
    paddingTop: spacing.spaceSmall,
  },
  headline: {
    marginBottom: spacing.spaceMedium,
    padding: spacing.spaceSmall,
  },
  card: {
    borderRadius: roundness,
    marginBottom: spacing.spaceSmall,
  },
  feelingsGroupName: {
    marginBottom: spacing.spaceSmall,
  },
  bottomComponentWrapper: {
    padding: spacing.spaceSmall,
  },
});
