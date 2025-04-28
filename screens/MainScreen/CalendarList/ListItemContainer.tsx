import { useObject } from "@realm/react";
import React, { memo, useCallback, useMemo } from "react";
import { useRouter } from "expo-router";
import ListItem from "./ListItem/ListItem";
import { StyleSheet, View } from "react-native";
import { spacing } from "@/common/constants/theme";
import { isMonthYearFormat, parseDateAt } from "@/common/utils/date";
import MonthItem from "./MonthItem";

const ListItemContainer = memo(({ dateAt }: { dateAt: string }) => {
  const date = parseDateAt(dateAt);

  // const dayObject = useObject(Day, dateId);
  // const router = useRouter();

  // const { title = "", entryObjects = [] } = dayObject || {};

  // const onPressHandler = useCallback(() => {
  //   router.navigate({ pathname: "/day/[dateId]", params: { dateId } });
  // }, [dateId, router]);

  // const onAddTextHandler = useCallback(() => {
  //   router.navigate({
  //     pathname: "/day/[dateId]/entry/new",
  //     params: { dateId, ...ENTRY_SCREEN_FOCUS_DESCRIPTION },
  //   });
  // }, [dateId, router]);

  // const onAddRecordingHandler = useCallback(() => {
  //   router.navigate({
  //     pathname: "/day/[dateId]/entry/new",
  //     params: { dateId, ...ENTRY_SCREEN_SCROLL_TO_RECORDING },
  //   });
  // }, [dateId, router]);

  // const onAddMediaHandler = useCallback(() => {
  //   router.navigate({
  //     pathname: "/day/[dateId]/entry/new",
  //     params: { dateId, ...ENTRY_SCREEN_SCROLL_TO_MEDIA },
  //   });
  // }, [dateId, router]);

  // const isEmpty = useMemo(
  //   () => !title && (!dayObject || entryObjects.length === 0),
  //   [title, dayObject, entryObjects],
  // );

  // const feelings = useMemo(
  //   () =>
  //     entryObjects
  //       .map((entry) => entry?.feelingsGroup)
  //       .filter((feeling) => !!feeling),
  //   [entryObjects],
  // );

  if (isMonthYearFormat(dateAt)) {
    return (
      <View style={styles.listItemWrapper}>
        <MonthItem monthName={dateAt} />
      </View>
    );
  }

  return (
    <View style={styles.listItemWrapper}>
      <ListItem
        onPress={() => {}}
        date={date}
        title=""
        onTextPress={() => {}}
        onRecordingPress={() => {}}
        onMediaPress={() => {}}
        onFeelingsPress={() => {}}
        isEmpty={true}
        feelings={[]}
      />
    </View>
  );
});

ListItemContainer.displayName = "ListItemContainer";

export default ListItemContainer;

const styles = StyleSheet.create({
  listItemWrapper: {
    paddingHorizontal: spacing.spaceSmall,
    marginVertical: spacing.spaceExtraSmall,
  },
});
