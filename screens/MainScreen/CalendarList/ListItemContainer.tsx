import { useObject } from "@realm/react";
import React, { useCallback, useMemo } from "react";
import { useRouter } from "expo-router";
import ListItem from "./ListItem/ListItem";

const ListItemContainer = ({ dateAt }: { dateAt: Date }) => {
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

  return (
    <ListItem
      onPress={() => {}}
      dateAt={dateAt}
      title=""
      onTextPress={() => {}}
      onRecordingPress={() => {}}
      onMediaPress={() => {}}
      onFeelingsPress={() => {}}
      isEmpty={true}
      feelings={[]}
    />
  );
};

export default ListItemContainer;
