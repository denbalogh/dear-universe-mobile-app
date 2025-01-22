import React from "react";
import { Button, Card, Text } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { roundness, spacing } from "@/constants/theme";
import { FEELING_GROUP_NAMES } from "@/constants/feelings";
import { useCustomTheme } from "@/hooks/useCustomTheme";

export type FeelingsButtonProps = {
  feelingsGroupName: FEELING_GROUP_NAMES | "";
  feelingsEmotions?: string[];
  onPress: () => void;
  locked?: boolean;
};

const FeelingsButton = ({
  feelingsGroupName,
  feelingsEmotions,
  onPress,
  locked = false,
}: FeelingsButtonProps) => {
  const theme = useCustomTheme();

  if (feelingsGroupName) {
    const hasEmotions = feelingsEmotions && feelingsEmotions.length > 0;

    return (
      <Card
        mode={locked ? "contained" : "elevated"}
        style={[
          styles.card,
          locked ? styles.lockedCard : styles.unlockedCard,
          { backgroundColor: theme.colors[`${feelingsGroupName}Container`] },
        ]}
        onPress={onPress}
      >
        <Card.Content style={styles.cardContent}>
          {hasEmotions ? (
            <View style={styles.emotionsWrapper}>
              {feelingsEmotions.map((emotion, index) => (
                <Text key={`${emotion}-${index}`} style={styles.emotion}>
                  {emotion}
                </Text>
              ))}
            </View>
          ) : (
            <Text style={styles.emotion}>{feelingsGroupName}</Text>
          )}
        </Card.Content>
      </Card>
    );
  }

  return (
    <Button onPress={onPress} mode="elevated">
      Feelings
    </Button>
  );
};

export default FeelingsButton;

const styles = StyleSheet.create({
  card: {
    borderRadius: roundness,
  },
  lockedCard: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: -spacing.spaceSmall,
    marginBottom: -spacing.spaceSmall,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  unlockedCard: {
    flexShrink: 1,
  },
  cardContent: {
    paddingVertical: spacing.spaceExtraSmall,
    paddingHorizontal: 0,
  },
  emotionsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  emotion: {
    marginHorizontal: spacing.spaceExtraSmall,
  },
});
