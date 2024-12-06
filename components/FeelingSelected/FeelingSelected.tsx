import React from "react";
import { FEELING_GROUP_NAMES } from "@/constants/feelings";
import { roundness, spacing } from "@/constants/theme";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import { StyleSheet, View } from "react-native";
import { Card, Chip, Text } from "react-native-paper";

type Props = {
  feeling: FEELING_GROUP_NAMES;
  emotions: string[];
  onPress: () => void;
};

const FeelingSelected = ({ feeling, emotions, onPress }: Props) => {
  const theme = useCustomTheme();

  return (
    <Card
      mode="contained"
      style={[
        styles.card,
        { backgroundColor: theme.colors[`${feeling}Container`] },
      ]}
      onPress={onPress}
    >
      <Card.Content style={styles.cardContent}>
        <Text
          variant="titleMedium"
          style={{ color: theme.colors[`on${feeling}Container`] }}
        >
          {feeling}
        </Text>
        <View style={styles.emotionsWrapper}>
          {emotions.map((emotion, index) => (
            <Chip
              key={`${emotion}-${index}`}
              compact={true}
              style={[
                styles.emotion,
                { backgroundColor: theme.colors[feeling] },
              ]}
              textStyle={{ color: theme.colors[`on${feeling}`] }}
            >
              {emotion}
            </Chip>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
};

export default FeelingSelected;

const styles = StyleSheet.create({
  card: {
    borderRadius: roundness,
  },
  cardContent: {
    paddingVertical: spacing.spaceSmall,
    paddingHorizontal: spacing.spaceSmall,
  },
  emotionsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  emotion: {
    marginRight: spacing.spaceExtraSmall,
    marginTop: spacing.spaceExtraSmall,
  },
});
