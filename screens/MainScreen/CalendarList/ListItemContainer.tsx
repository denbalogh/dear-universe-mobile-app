import React, { memo } from "react";
import DayItem from "./DayItem/DayItem";
import { StyleSheet, View } from "react-native";
import { spacing } from "@/common/constants/theme";
import { isMonthYearFormat } from "@/common/utils/date";
import MonthItem from "./MonthItem";
import useDay from "@/common/hooks/useDay";
import DayItemLoading from "./DayItemLoading";

type Props = {
  dateId: string;
};

const ListItemContainer = ({ dateId }: Props) => {
  const day = useDay(dateId);

  if (isMonthYearFormat(dateId)) {
    return (
      <View style={styles.listItemWrapper}>
        <MonthItem monthName={dateId} />
      </View>
    );
  }

  return (
    <View style={styles.listItemWrapper}>
      {day ? <DayItem day={day} /> : <DayItemLoading />}
    </View>
  );
};

export default memo(ListItemContainer);

const styles = StyleSheet.create({
  listItemWrapper: {
    paddingHorizontal: spacing.spaceSmall,
    marginVertical: spacing.spaceExtraSmall,
  },
});
