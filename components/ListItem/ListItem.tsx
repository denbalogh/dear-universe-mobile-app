import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, IconButton, Card, useTheme, Icon } from "react-native-paper";
import { roundness, sizing, spacing } from "@/constants/theme";
import { format, getDate, isToday as isTodayDateFns } from "date-fns";
import { parseDateId } from "@/utils/date";
import { ITEM_HEIGHT } from "../InfiniteDaysList/constants";
import { FEELING_GROUP_NAMES } from "@/constants/feelings";
import FeelingsIndicator from "../FeelingsIndicator/FeelingsIndicator";

type Props = {
  title: string;
  dateId: string;
  onPress: () => void;
  addEntryHandlers: {
    onAddTextEntryPress: () => void;
    onAddRecordingEntryPress: () => void;
    onAddImageEntryPress: () => void;
  };
  isEmpty?: boolean;
  feelings: FEELING_GROUP_NAMES[];
};

const ListItem = ({
  title,
  dateId,
  addEntryHandlers,
  isEmpty,
  onPress,
  feelings,
}: Props) => {
  const theme = useTheme();

  const date = parseDateId(dateId);
  const isToday = isTodayDateFns(date);

  const backgroundColor = isEmpty
    ? theme.colors.background
    : theme.colors.surfaceVariant;

  const textColor = isEmpty
    ? theme.colors.onBackground
    : theme.colors.onSurfaceVariant;

  return (
    <Card testID="ListItemPressable" style={styles.card} onPress={onPress}>
      <Card.Content
        style={[
          styles.cardContent,
          {
            backgroundColor,
          },
        ]}
      >
        <View style={styles.dayWrapper}>
          <Text
            variant="displaySmall"
            style={[
              { color: textColor },
              isToday && [styles.today, { color: theme.colors.tertiary }],
            ]}
            accessibilityLabel={
              isToday
                ? `Today ${format(date, "do LLLL yyyy")}`
                : format(date, "do LLLL yyyy")
            }
          >
            {getDate(date)}
          </Text>
          <Text
            variant="bodyLarge"
            accessibilityLabel={format(date, "EEEE")}
            style={{ color: textColor }}
          >
            {format(date, "E")}
          </Text>
        </View>
        {isEmpty ? (
          <View style={styles.addEntryButtonsWrapper}>
            <IconButton
              icon="pen-plus"
              onPress={addEntryHandlers.onAddTextEntryPress}
              accessibilityLabel="Add text entry"
              size={sizing.sizeMedium}
            />
            <IconButton
              icon="microphone-plus"
              onPress={addEntryHandlers.onAddRecordingEntryPress}
              accessibilityLabel="Add recording entry"
              size={sizing.sizeMedium}
            />
            <IconButton
              icon="image-plus"
              onPress={addEntryHandlers.onAddImageEntryPress}
              accessibilityLabel="Add image entry"
              size={sizing.sizeMedium}
            />
          </View>
        ) : (
          <Text
            style={[styles.title, { color: textColor }]}
            variant="bodyMedium"
            numberOfLines={3}
          >
            {title || "No title for the day"}
          </Text>
        )}
        <FeelingsIndicator
          style={styles.feelingsIndicator}
          feelings={feelings}
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
    alignItems: "stretch",
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
    flexShrink: 1,
    paddingHorizontal: spacing.spaceSmall,
  },
  feelingsIndicator: {
    position: "absolute",
    right: 0,
    left: 0,
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
