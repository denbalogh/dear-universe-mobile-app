import React, { useCallback, useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  StyleSheet,
  View,
  ViewToken,
} from "react-native";
import { appendDays, createInitDays } from "./utils";
import InfiniteDaysListItem from "./InfiniteDaysListItem";
import { useTheme } from "react-native-paper";
import { formatMonthYear, parseDateId } from "@/utils/date";
import { subDays } from "date-fns";

const EXTEND_LIST_OFFSET = 10;

type Props = {
  onMonthYearChange: (monthYear: string) => void;
};

const InfiniteDaysList = ({ onMonthYearChange }: Props) => {
  const theme = useTheme();
  const [days, setDays] = useState(createInitDays());
  const scrollDir = useRef<"up" | "down">("down");
  const currentOffset = useRef(0);

  const onScroll = useCallback(
    ({
      nativeEvent: { contentOffset },
    }: {
      nativeEvent: NativeScrollEvent;
    }) => {
      if (contentOffset.y <= 0) {
        return;
      }

      scrollDir.current =
        contentOffset.y > currentOffset.current ? "down" : "up";
      currentOffset.current = contentOffset.y;
    },
    [],
  );

  const lastDayIndex = days.length - 1;

  const onViewableItemsChanged = useCallback(
    ({ changed }: { changed: ViewToken[] }) => {
      for (const item of changed) {
        // Handle appending days
        if (item.index && item.index > lastDayIndex - EXTEND_LIST_OFFSET) {
          setDays(appendDays(days, 10));
        }

        // Handle setting current month year in the list
        if (parseDateId(item.item).getDate() === 1) {
          if (scrollDir.current === "down" && !item.isViewable) {
            const lastDayInPreviousMonth = subDays(parseDateId(item.item), 1);
            const newMonthYear = formatMonthYear(lastDayInPreviousMonth);
            onMonthYearChange(newMonthYear);
          }
          if (scrollDir.current === "up" && item.isViewable) {
            const newMonthYear = formatMonthYear(parseDateId(item.item));
            onMonthYearChange(newMonthYear);
          }
        }
      }
    },
    [days, lastDayIndex, onMonthYearChange],
  );

  const handleOnRefresh = () => {
    setDays(createInitDays());
  };

  return (
    <View
      style={[styles.wrapper, { backgroundColor: theme.colors.background }]}
    >
      <FlatList
        data={days}
        renderItem={(data) => <InfiniteDaysListItem {...data} />}
        onViewableItemsChanged={onViewableItemsChanged}
        keyExtractor={(item) => item}
        onScroll={onScroll}
        onRefresh={handleOnRefresh}
        refreshing={false}
      />
    </View>
  );
};

export default InfiniteDaysList;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
