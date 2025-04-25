import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { spacing } from "@/constants/theme";
import { isMonthYearFormat } from "@/utils/date";
import MonthItem from "./MonthItem";
import ListItemWithData from "./ListItemWithData";

const InfiniteDaysListItem = memo(({ item }: { item: string }) => {
  // MonthYear header item
  if (isMonthYearFormat(item)) {
    return (
      <View style={styles.itemWrapper}>
        <MonthItem monthName={item} />
      </View>
    );
  }

  return (
    <View style={styles.itemWrapper}>
      <ListItemWithData dateId={item} />
    </View>
  );
});

InfiniteDaysListItem.displayName = "InfiniteDaysListItem";

export default InfiniteDaysListItem;

const styles = StyleSheet.create({
  itemWrapper: {
    paddingHorizontal: spacing.spaceSmall,
    marginVertical: spacing.spaceExtraSmall,
  },
});
