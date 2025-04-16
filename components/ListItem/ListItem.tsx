import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Text,
  IconButton,
  useTheme,
  TouchableRipple,
} from "react-native-paper";
import { roundness, sizing, spacing } from "@/constants/theme";
import { format } from "date-fns/format";
import { getDate } from "date-fns/getDate";
import { isToday as isTodayDateFns } from "date-fns/isToday";
import { parseDateId } from "@/utils/date";
import { ITEM_HEIGHT } from "../InfiniteDaysList/constants";
import { FEELING_GROUP_NAMES } from "@/constants/feelings";
import FeelingsIndicator from "../FeelingsIndicator/FeelingsIndicator";
import MediaPreview from "./MediaPreview";

type Props = {
  title: string;
  dateId: string;
  onPress: () => void;
  onAddTextPress: () => void;
  onAddRecordingPress: () => void;
  onAddMediaPress: () => void;
  isEmpty?: boolean;
  feelings: FEELING_GROUP_NAMES[];
};

const ListItem = ({
  title,
  dateId,
  onAddTextPress,
  onAddRecordingPress,
  onAddMediaPress,
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
    <TouchableRipple
      onPress={onPress}
      style={styles.itemWrapper}
      background={{
        foreground: true,
        borderless: false,
      }}
    >
      <View style={[styles.itemContentWrapper, { backgroundColor }]}>
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
              onPress={onAddTextPress}
              accessibilityLabel="Add text"
              size={sizing.sizeMedium}
            />
            <IconButton
              icon="microphone-plus"
              onPress={onAddRecordingPress}
              accessibilityLabel="Add recording"
              size={sizing.sizeMedium}
            />
            <IconButton
              icon="image-plus"
              onPress={onAddMediaPress}
              accessibilityLabel="Add media"
              size={sizing.sizeMedium}
            />
          </View>
        ) : (
          <View style={styles.contentWrapper}>
            <Text
              style={[styles.title, { color: textColor }]}
              variant="bodyMedium"
              numberOfLines={4}
            >
              {title || "No title for the day"}
            </Text>
            <MediaPreview dateId={dateId} />
          </View>
        )}
        <FeelingsIndicator
          style={styles.feelingsIndicator}
          feelings={feelings}
        />
      </View>
    </TouchableRipple>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  itemWrapper: {
    width: "100%",
    height: ITEM_HEIGHT,
    borderRadius: roundness,
    overflow: "hidden",
  },
  itemContentWrapper: {
    flexDirection: "row",
    alignItems: "stretch",
    borderRadius: roundness,
    height: "100%",
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  dayWrapper: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 50,
    padding: spacing.spaceSmall,
    paddingHorizontal: spacing.spaceMedium,
  },
  today: {
    fontWeight: "bold",
  },
  contentWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    flexShrink: 1,
    marginVertical: spacing.spaceSmall,
    marginRight: spacing.spaceMedium,
    width: "100%",
    lineHeight: 18,
  },
  feelingsIndicator: {
    position: "absolute",
    right: 0,
    left: 0,
    bottom: -1, // To hide overflow of media preview on android
  },
  addEntryButtonsWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    height: "100%",
    paddingRight: spacing.spaceSmall,
  },
});
