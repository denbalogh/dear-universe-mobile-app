import React, { useCallback, useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  StyleSheet,
  View,
  ViewToken,
} from "react-native";
import { appendDays, createDaysUntilDate } from "../utils";
import { FAB, useTheme } from "react-native-paper";
import {
  formatMonthYear,
  isMonthYearFormat,
  parseDateId,
} from "@/common/utils/date";
import { ITEM_HEIGHT } from "../constants";
import { spacing } from "@/common/constants/theme";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import ListItemContainer from "./ListItemContainer";

const EXTEND_LIST_OFFSET = 10;
const BOTTOM_BUTTON_HEIGHT = 60;
const BOTTOM_BUTTON_HEIGHT_AND_OFFSET =
  BOTTOM_BUTTON_HEIGHT + spacing.spaceLarge;

type Props = {
  onMonthYearChange: (monthYear: string) => void;
};

const CalendarList = ({ onMonthYearChange }: Props) => {
  const theme = useTheme();
  const [days, setDays] = useState(createDaysUntilDate());
  const scrollDir = useRef<"up" | "down">("down");
  const currentOffset = useRef(0);

  const flatListRef = useRef<FlatList<string> | null>(null);

  const translateScrollToToday = useSharedValue(
    BOTTOM_BUTTON_HEIGHT_AND_OFFSET,
  );
  const opacityScrollToToday = useSharedValue(0);

  const animatedScrollToTodayStyles = useAnimatedStyle(() => ({
    opacity: opacityScrollToToday.value,
    transform: [{ translateY: translateScrollToToday.value }],
  }));

  const handleScrollToIndex = (index: number, animated = false) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated });
    }
  };

  const handleRenderItem = useCallback(
    ({ item }: { item: string }) => <ListItemContainer dateId={item} />,
    [],
  );

  const onScroll = useCallback(
    ({
      nativeEvent: { contentOffset },
    }: {
      nativeEvent: NativeScrollEvent;
    }) => {
      const isScrollingDown =
        contentOffset.y > 0 && contentOffset.y > currentOffset.current;

      scrollDir.current = isScrollingDown ? "down" : "up";
      currentOffset.current = contentOffset.y;

      if (scrollDir.current === "up") {
        // Show the scroll to top button when scrolling up
        if (contentOffset.y <= 0) {
          opacityScrollToToday.value = withTiming(0);
          translateScrollToToday.value = withTiming(
            BOTTOM_BUTTON_HEIGHT_AND_OFFSET,
          );
          // Hide the scroll to top button when scrolling up
        } else {
          opacityScrollToToday.value = withTiming(1);
          translateScrollToToday.value = withTiming(0);
        }
      } else {
        // Hide the scroll to top button when scrolling down
        opacityScrollToToday.value = withTiming(0);
        translateScrollToToday.value = withTiming(
          BOTTOM_BUTTON_HEIGHT_AND_OFFSET,
        );
      }
    },
    [opacityScrollToToday, translateScrollToToday],
  );

  const lastDayIndex = days.length - 1;

  const onViewableItemsChanged = useCallback(
    ({ changed }: { changed: ViewToken[] }) => {
      for (const item of changed) {
        // Handle appending days
        if (
          item.isViewable &&
          item.index &&
          item.index > lastDayIndex - EXTEND_LIST_OFFSET
        ) {
          setDays(appendDays(days));
        }

        // Handle setting current month year in the list
        if (
          isMonthYearFormat(item.item) &&
          scrollDir.current === "down" &&
          item.isViewable
        ) {
          onMonthYearChange(item.item);
        }

        if (parseDateId(item.item).getDate() === 1) {
          if (scrollDir.current === "up" && !item.isViewable) {
            onMonthYearChange(formatMonthYear(parseDateId(item.item)));
          }
        }
      }
    },
    [days, lastDayIndex, onMonthYearChange],
  );

  const handleOnRefresh = useCallback(() => {
    setDays(createDaysUntilDate());
  }, []);

  const handleGetItemLayout = useCallback((_: any, index: number) => {
    const TOTAL_ITEM_HEIGHT = ITEM_HEIGHT + 2 * spacing.spaceExtraSmall;
    return {
      length: TOTAL_ITEM_HEIGHT,
      offset: TOTAL_ITEM_HEIGHT * index,
      index,
    };
  }, []);

  const handleScrollToToday = () => {
    handleScrollToIndex(0);
    onMonthYearChange(formatMonthYear(new Date()));
  };

  const handleKeyExtractor = useCallback((item: string) => item, []);

  return (
    <View
      style={[styles.wrapper, { backgroundColor: theme.colors.background }]}
    >
      <FlatList
        ref={flatListRef}
        data={days}
        renderItem={handleRenderItem}
        onViewableItemsChanged={onViewableItemsChanged}
        keyExtractor={handleKeyExtractor}
        onScroll={onScroll}
        onRefresh={handleOnRefresh}
        refreshing={false}
        getItemLayout={handleGetItemLayout}
        showsVerticalScrollIndicator={false}
        inverted={true}
        contentContainerStyle={styles.flatListContentContainer}
      />
      <Animated.View
        style={[styles.bottomButtonWrapper, animatedScrollToTodayStyles]}
      >
        <FAB
          onPress={handleScrollToToday}
          icon="arrow-down"
          variant="surface"
          label="To today"
        />
      </Animated.View>
    </View>
  );
};

export default CalendarList;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  flatListContentContainer: {
    paddingTop: spacing.spaceSmall, // Flatlist is inverted so it's bottom padding
  },
  bottomButtonWrapper: {
    position: "absolute",
    bottom: spacing.spaceLarge,
    left: 0,
    right: 0,
    alignItems: "center",
    height: BOTTOM_BUTTON_HEIGHT,
    justifyContent: "center",
  },
});
