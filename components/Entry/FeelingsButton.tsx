import React from "react";
import { Button, Card, Text } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { roundness, spacing } from "@/constants/theme";
import { Feelings } from "@/constants/feelings";
import { useCustomTheme } from "@/hooks/useCustomTheme";

type Props = {
  feelings: Feelings | undefined;
  onPress: () => void;
};

const FeelingsButton = ({ feelings, onPress }: Props) => {
  const theme = useCustomTheme();
  const hasFeelings = feelings;

  if (hasFeelings) {
    const { name, emotions } = feelings;

    const hasEmotions = emotions.length > 0;

    return (
      <Card
        mode="elevated"
        style={[
          styles.card,
          { backgroundColor: theme.colors[`${name}Container`] },
        ]}
        onPress={onPress}
      >
        <Card.Content style={styles.cardContent}>
          {hasEmotions ? (
            <View style={styles.emotionsWrapper}>
              {emotions.map((emotion, index) => (
                <Text key={`${emotion}-${index}`} style={styles.emotion}>
                  {emotion}
                </Text>
              ))}
            </View>
          ) : (
            <Text style={styles.emotion}>{name}</Text>
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
