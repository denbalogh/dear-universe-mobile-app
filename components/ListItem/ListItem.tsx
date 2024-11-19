import React from "react";
import { StyleSheet, View } from "react-native";
import { Icon, Text, IconButton, Card } from "react-native-paper";
import MoodColorComposite from "../MoodColor/MoodColorComposite";
import { sizing, spacing } from "@/constants/theme";
import { Mood } from "../MoodColor/types";
import Day from "./Day";

type Props = {
  excerpt?: string;
  dateId: string;
  stats: {
    texts: number;
    recordings: number;
    images: number;
  };
  moods: Mood[];
  onPress: () => void;
  onAddTextEntryPress: () => void;
  onAddRecordingEntryPress: () => void;
  onAddImageEntryPress: () => void;
};

const ListItem = ({
  excerpt,
  dateId,
  stats,
  moods,
  onPress,
  onAddImageEntryPress,
  onAddRecordingEntryPress,
  onAddTextEntryPress,
}: Props) => {
  const hasStats = stats.texts || stats.recordings || stats.images;

  return (
    <Card onPress={onPress} style={styles.card} testID="ListItemPressable">
      <View style={[styles.wrapper]}>
        <Day dateId={dateId} />
        {hasStats ? (
          <>
            <View style={styles.middleWrapper}>
              <Text variant="bodySmall" numberOfLines={3}>
                {excerpt || "No description provided"}
              </Text>
              <View style={styles.statsWrapper}>
                {stats.texts > 0 && (
                  <View
                    style={styles.stat}
                    accessibilityLabel="Number of text entries"
                  >
                    <Text variant="bodySmall" style={styles.statText}>
                      {stats.texts}
                    </Text>
                    <Icon source="pen" size={sizing.sizeSmall} />
                  </View>
                )}
                {stats.recordings > 0 && (
                  <View
                    style={styles.stat}
                    accessibilityLabel="Number of recording entries"
                  >
                    <Text variant="bodySmall" style={styles.statText}>
                      {stats.recordings}
                    </Text>
                    <Icon source="microphone" size={sizing.sizeSmall} />
                  </View>
                )}
                {stats.images > 0 && (
                  <View
                    style={styles.stat}
                    accessibilityLabel="Number of image entries"
                  >
                    <Text variant="bodySmall" style={styles.statText}>
                      {stats.images}
                    </Text>
                    <Icon source="image" size={sizing.sizeSmall} />
                  </View>
                )}
              </View>
            </View>
            <MoodColorComposite
              moods={moods}
              style={styles.moodComposite}
              accessibilityLabel="Moods during the day"
              variant="vertical"
            />
          </>
        ) : (
          <View style={styles.addEntryButtonsWrapper}>
            <IconButton
              icon="pen-plus"
              onPress={onAddTextEntryPress}
              accessibilityLabel="Add text entry"
              size={sizing.sizeMedium}
            />
            <IconButton
              icon="microphone-plus"
              onPress={onAddRecordingEntryPress}
              accessibilityLabel="Add recording entry"
              size={sizing.sizeMedium}
            />
            <IconButton
              icon="image-plus"
              onPress={onAddImageEntryPress}
              accessibilityLabel="Add image entry"
              size={sizing.sizeMedium}
            />
          </View>
        )}
      </View>
    </Card>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.spaceSmall,
    marginTop: spacing.spaceSmall,
  },
  wrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: spacing.spaceSmall,
  },
  middleWrapper: {
    flexShrink: 1,
    padding: spacing.spaceMedium,
    flex: 1,
  },
  statsWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: spacing.spaceExtraSmall,
  },
  stat: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginStart: spacing.spaceSmall,
  },
  statText: {
    marginEnd: spacing.spaceExtraSmall,
  },
  moodComposite: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
  },
  addEntryButtonsWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
