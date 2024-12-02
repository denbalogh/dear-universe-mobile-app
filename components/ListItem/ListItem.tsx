import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, IconButton, Card, useTheme } from "react-native-paper";
import MoodColorComposite from "../MoodColor/MoodColorComposite";
import { roundness, sizing, spacing } from "@/constants/theme";
import { Mood } from "../MoodColor/types";
import { format, getDate, isToday as isTodayDateFns } from "date-fns";
import { parseDateId } from "@/utils/date";
import { ITEM_HEIGHT } from "../InfiniteDaysList/constants";

type Props = {
  title: string;
  dateId: string;
  moods: Mood[];
  onPress: () => void;
  empty?: {
    onAddTextEntryPress: () => void;
    onAddRecordingEntryPress: () => void;
    onAddImageEntryPress: () => void;
  };
};

const ListItem = ({ title, dateId, moods, empty, onPress }: Props) => {
  const theme = useTheme();

  const date = parseDateId(dateId);
  const isToday = isTodayDateFns(date);

  return (
    <Card testID="ListItemPressable" style={styles.card} onPress={onPress}>
      <Card.Content
        style={[
          styles.cardContent,
          {
            backgroundColor: empty
              ? theme.colors.background
              : theme.colors.surface,
          },
        ]}
      >
        <View style={styles.dayWrapper}>
          <Text
            variant="displaySmall"
            style={isToday && [styles.today, { color: theme.colors.tertiary }]}
            accessibilityLabel={
              isToday
                ? `Today ${format(date, "do LLLL yyyy")}`
                : format(date, "do LLLL yyyy")
            }
          >
            {getDate(date)}
          </Text>
          <Text variant="bodyLarge" accessibilityLabel={format(date, "EEEE")}>
            {format(date, "E")}
          </Text>
        </View>
        {empty ? (
          <View style={styles.addEntryButtonsWrapper}>
            <IconButton
              icon="pen-plus"
              onPress={empty.onAddTextEntryPress}
              accessibilityLabel="Add text entry"
              size={sizing.sizeMedium}
            />
            <IconButton
              icon="microphone-plus"
              onPress={empty.onAddRecordingEntryPress}
              accessibilityLabel="Add recording entry"
              size={sizing.sizeMedium}
            />
            <IconButton
              icon="image-plus"
              onPress={empty.onAddImageEntryPress}
              accessibilityLabel="Add image entry"
              size={sizing.sizeMedium}
            />
          </View>
        ) : (
          <Text style={styles.title} variant="bodyMedium" numberOfLines={4}>
            {title || "No title"}
          </Text>
        )}
        <MoodColorComposite
          moods={moods}
          style={styles.moodComposite}
          accessibilityLabel="Moods during the day"
          variant="vertical"
        />
      </Card.Content>
    </Card>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: ITEM_HEIGHT,
    borderRadius: roundness,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: roundness,
  },
  dayWrapper: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 50,
  },
  today: {
    fontWeight: "bold",
  },
  title: {
    paddingHorizontal: spacing.spaceSmall,
    flexShrink: 1,
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
    height: "100%",
  },
});
