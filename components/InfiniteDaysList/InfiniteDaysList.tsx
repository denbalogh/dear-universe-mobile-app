import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  StyleSheet,
  View,
  ViewToken,
} from "react-native";
import { appendDays, createDaysUntilDate } from "./utils";
import InfiniteDaysListItem from "./InfiniteDaysListItem";
import { FAB, useTheme } from "react-native-paper";
import {
  formatDateId,
  formatMonthYear,
  isMonthYearFormat,
  parseDateId,
} from "@/utils/date";
import { ITEM_HEIGHT } from "./constants";
import { spacing } from "@/constants/theme";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import DatePickerModal from "../DatePickerModal/DatePickerModal";
import { useRealm } from "@realm/react";

const EXTEND_LIST_OFFSET = 10;
const BOTTOM_BUTTON_HEIGHT = 60;
const BOTTOM_BUTTON_HEIGHT_AND_OFFSET =
  BOTTOM_BUTTON_HEIGHT + spacing.spaceLarge;

type Props = {
  onMonthYearChange: (monthYear: string) => void;
};

const InfiniteDaysList = ({ onMonthYearChange }: Props) => {
  const theme = useTheme();
  const realm = useRealm();
  const [days, setDays] = useState(createDaysUntilDate());
  const scrollDir = useRef<"up" | "down">("down");
  const currentOffset = useRef(0);

  const flatListRef = useRef<FlatList<string> | null>(null);

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeDate, setActiveDate] = useState(new Date());

  const handleDismissDatePicker = () => {
    setIsDatePickerVisible(false);
  };

  const handleShowDatePicker = () => {
    setIsDatePickerVisible(true);
  };

  const translateSearchDate = useSharedValue(BOTTOM_BUTTON_HEIGHT_AND_OFFSET);
  const opacitySearchDate = useSharedValue(0);

  const animatedSearchDateStyles = useAnimatedStyle(() => ({
    opacity: opacitySearchDate.value,
    transform: [{ translateY: translateSearchDate.value }],
  }));

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

  const handleConfirmDate = (date: Date) => {
    if (date) {
      if (formatDateId(date) === formatDateId(activeDate)) {
        onMonthYearChange(formatMonthYear(activeDate));
        return handleScrollToIndex(activeIndex);
      }

      const newDays = createDaysUntilDate(date);
      const index = Math.max(newDays.indexOf(formatDateId(date)) - 1, 0); // -1 to show the selected date above bottom buttons (Search date / To today)

      setDays(newDays);
      setActiveIndex(index);
      setActiveDate(date);

      onMonthYearChange(formatMonthYear(date));
    }
  };

  useEffect(() => {
    handleScrollToIndex(activeIndex);
  }, [activeIndex]);

  const handleRenderItem = useCallback(
    ({ item }: { item: string }) => <InfiniteDaysListItem item={item} />,
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
        // Hide the search date button when scrolling up
        opacitySearchDate.value = withTiming(0);
        translateSearchDate.value = withTiming(BOTTOM_BUTTON_HEIGHT_AND_OFFSET);
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
        // Show the search date button when scrolling down
        opacitySearchDate.value = withTiming(1);
        translateSearchDate.value = withTiming(0);
        // Hide the scroll to top button when scrolling down
        opacityScrollToToday.value = withTiming(0);
        translateScrollToToday.value = withTiming(
          BOTTOM_BUTTON_HEIGHT_AND_OFFSET,
        );
      }
    },
    [
      opacityScrollToToday,
      translateScrollToToday,
      opacitySearchDate,
      translateSearchDate,
    ],
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
      key={activeIndex}
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
        initialScrollIndex={activeIndex}
        getItemLayout={handleGetItemLayout}
        showsVerticalScrollIndicator={false}
        inverted={true}
        contentContainerStyle={styles.flatListContentContainer}
      />
      <Animated.View
        style={[styles.bottomButtonWrapper, animatedSearchDateStyles]}
      >
        <FAB
          onPress={handleShowDatePicker}
          icon="calendar-search"
          variant="primary"
          label="Search date"
        />
      </Animated.View>
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
      <DatePickerModal
        isVisible={isDatePickerVisible}
        onDismiss={handleDismissDatePicker}
        onConfirm={handleConfirmDate}
        realm={realm}
      />
    </View>
  );
};

export default InfiniteDaysList;

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
