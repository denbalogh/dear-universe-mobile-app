import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import ListItem from "../ListItem/ListItem";
import { spacing } from "@/constants/theme";
import { formatMonthYear, parseDateId } from "@/utils/date";
import { Divider, Text } from "react-native-paper";
import { subDays } from "date-fns";
import { useObject } from "@realm/react";
import { Day } from "@/models/Day";

const InfiniteDaysListItem = memo(({ item: dateId }: { item: string }) => {
  const dayObject = useObject(Day, dateId);

  const {
    excerpt = "",
    statsImages = 0,
    statsRecordings = 0,
    statsTexts = 0,
  } = dayObject || {};

  const date = parseDateId(dateId);
  const isFirstDayOfMonth = date.getDate() === 1;

  return (
    <>
      <ListItem
        dateId={dateId}
        stats={{
          texts: statsTexts,
          recordings: statsRecordings,
          images: statsImages,
        }}
        excerpt={excerpt}
        moods={[]}
        onPress={() => {}}
        onAddImageEntryPress={() => {}}
        onAddRecordingEntryPress={() => {}}
        onAddTextEntryPress={() => {}}
      />
      {isFirstDayOfMonth && (
        <View style={styles.monthWrapper} testID="monthHeader">
          <Divider />
          <Text style={styles.monthName} variant="titleMedium">
            {formatMonthYear(subDays(date, 1))}
          </Text>
        </View>
      )}
    </>
  );
});

InfiniteDaysListItem.displayName = "InfiniteDaysListItem";

export default InfiniteDaysListItem;

const styles = StyleSheet.create({
  monthWrapper: {
    paddingVertical: spacing.spaceSmall,
    marginTop: spacing.spaceMedium,
  },
  monthName: {
    marginLeft: spacing.spaceMedium,
    marginTop: spacing.spaceExtraSmall,
  },
});
