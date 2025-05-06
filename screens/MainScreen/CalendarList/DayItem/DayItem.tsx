import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme, TouchableRipple, Button } from "react-native-paper";
import { roundness, spacing } from "@/common/constants/theme";
import { format } from "date-fns/format";
import { getDate } from "date-fns/getDate";
import { isToday as isTodayDateFns } from "date-fns/isToday";
import { FEELING_GROUP_NAMES } from "@/common/constants/feelings";
import MediaPreview from "./MediaPreview";
import FeelingsIndicator from "@/screens/MainScreen/CalendarList/DayItem/FeelingsIndicator";
import { ITEM_HEIGHT } from "../../constants";
import { parseDayId } from "@/common/utils/date";
import { useFocusEffect, useRouter } from "expo-router";
import { useDay } from "@/common/providers/DayProvider";
import { Media } from "@/common/types/Media";

const ListItem = () => {
  const theme = useTheme();
  const router = useRouter();
  const { day } = useDay();
  const date = parseDayId(day.id);

  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const [feelings, setFeelings] = useState<FEELING_GROUP_NAMES[] | null>(null);
  const [media, setMedia] = useState<Media[]>([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        if (day) {
          const isEmpty = await day.isEmpty();
          const feelings = await day.feelings();
          const media = await day.media();

          setIsEmpty(isEmpty);
          setFeelings(feelings);
          setMedia(media);
        }
      })();
    }, [day]),
  );

  const isToday = isTodayDateFns(date);

  const backgroundColor = isEmpty
    ? theme.colors.background
    : theme.colors.surfaceVariant;

  const textColor = isEmpty
    ? theme.colors.onBackground
    : theme.colors.onSurfaceVariant;

  return (
    <TouchableRipple
      onPress={() => router.navigate(`/day/${day.id}`)}
      style={styles.itemWrapper}
      background={{
        foreground: true,
        borderless: false,
      }}
    >
      <View
        style={[
          styles.itemContentWrapper,
          { backgroundColor, borderColor: theme.colors.outline },
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
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              paddingHorizontal: spacing.spaceSmall,
            }}
          >
            <Text
              style={{ textAlign: "center", marginBottom: spacing.spaceSmall }}
            >
              This day is empty so far
            </Text>
            <Button icon="plus" mode="outlined" onPress={() => {}}>
              Add entry
            </Button>
          </View>
        ) : (
          <View style={styles.contentWrapper}>
            <Text
              style={[styles.title, { color: textColor }]}
              variant="bodyLarge"
              numberOfLines={3}
            >
              {day.title || "No title for the day"}
            </Text>
            <MediaPreview media={media} />
          </View>
        )}
        {feelings && (
          <FeelingsIndicator
            style={styles.feelingsIndicator}
            feelings={feelings}
          />
        )}
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
    marginVertical: spacing.spaceMedium,
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
