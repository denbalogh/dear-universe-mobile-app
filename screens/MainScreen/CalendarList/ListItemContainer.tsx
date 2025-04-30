import React, { memo } from "react";
import DayItem from "./DayItem/DayItem";
import { StyleSheet, View } from "react-native";
import { spacing } from "@/common/constants/theme";
import { isMonthYearFormat } from "@/common/utils/date";
import MonthItem from "./MonthItem";
import DayItemLoading from "./DayItemLoading";
import DayProvider from "@/common/providers/DayProvider";

type Props = {
  dateId: string;
};

const ListItemContainer = ({ dateId }: Props) => {
  if (isMonthYearFormat(dateId)) {
    return (
      <View style={styles.listItemWrapper}>
        <MonthItem monthName={dateId} />
      </View>
    );
  }

  return (
    <View style={styles.listItemWrapper}>
      <DayProvider dayId={dateId} loadingComponent={<DayItemLoading />}>
        <DayItem />
      </DayProvider>
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
