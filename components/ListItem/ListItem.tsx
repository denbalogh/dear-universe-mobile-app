import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Icon,
  Text,
  useTheme,
  TouchableRipple,
  IconButton,
} from "react-native-paper";
import MoodColorComposite, {
  MOOD_COMPOSITE_WIDTH,
} from "../MoodColor/MoodColorComposite";
import { roundness, spacing } from "@/constants/theme";
import { Mood } from "../MoodColor/types";
import Day from "./Day";

type Props = {
  excerpt?: string;
  isLoading?: boolean;
  timestamp: number;
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
  isLoading = false,
  excerpt,
  timestamp,
  stats,
  moods,
  onPress,
  onAddImageEntryPress,
  onAddRecordingEntryPress,
  onAddTextEntryPress,
}: Props) => {
  const theme = useTheme();

  const hasStats = stats.texts || stats.recordings || stats.images;
  const loadingBackgroundColor = theme.colors.surfaceVariant;

  if (isLoading) {
    return (
      <View style={styles.wrapper}>
        <Day timestamp={timestamp} />
        <View style={styles.loadingMiddleWrapper}>
          <View
            style={[
              styles.loadingExcerpt,
              { backgroundColor: loadingBackgroundColor },
            ]}
          />
          <View
            style={[
              styles.loadingStats,
              { backgroundColor: loadingBackgroundColor },
            ]}
          />
        </View>
        <View
          style={[
            styles.loadingMoodComposite,
            { backgroundColor: loadingBackgroundColor },
          ]}
        />
      </View>
    );
  }

  return (
    <TouchableRipple style={styles.pressable} onPress={onPress}>
      <View style={styles.wrapper}>
        <Day timestamp={timestamp} />
        {hasStats ? (
          <>
            <View style={styles.middleWrapper}>
              <Text variant="bodySmall" numberOfLines={3}>
                {excerpt || "No description provided"}
              </Text>
              <View style={styles.statsWrapper}>
                {stats.texts > 0 && (
                  <View style={styles.stat}>
                    <Text variant="bodySmall" style={styles.statText}>
                      {stats.texts}
                    </Text>
                    <Icon source="pen" size={16} />
                  </View>
                )}
                {stats.recordings > 0 && (
                  <View style={styles.stat}>
                    <Text variant="bodySmall" style={styles.statText}>
                      {stats.recordings}
                    </Text>
                    <Icon source="microphone" size={16} />
                  </View>
                )}
                {stats.images > 0 && (
                  <View style={styles.stat}>
                    <Text variant="bodySmall" style={styles.statText}>
                      {stats.images}
                    </Text>
                    <Icon source="image" size={16} />
                  </View>
                )}
              </View>
            </View>
            <MoodColorComposite moods={moods} style={styles.moodComposite} />
          </>
        ) : (
          <View style={styles.addEntryButtonsWrapper}>
            <IconButton
              icon="pen-plus"
              mode="outlined"
              onPress={onAddTextEntryPress}
            />
            <IconButton
              icon="microphone-plus"
              mode="outlined"
              onPress={onAddRecordingEntryPress}
            />
            <IconButton
              icon="image-plus"
              mode="outlined"
              onPress={onAddImageEntryPress}
            />
          </View>
        )}
      </View>
    </TouchableRipple>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  pressable: {
    width: "100%",
  },
  wrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
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
    height: 9,
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
  loadingMiddleWrapper: {
    flex: 1,
    padding: spacing.spaceMedium,
    flexDirection: "column",
    alignItems: "flex-end",
  },
  loadingExcerpt: {
    width: "100%",
    height: 43,
    borderRadius: roundness,
  },
  loadingStats: {
    width: "35%",
    height: 16,
    marginTop: spacing.spaceSmall,
    borderRadius: roundness,
  },
  loadingMoodComposite: {
    width: MOOD_COMPOSITE_WIDTH,
    height: "100%",
    borderRadius: roundness,
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
  },
});
