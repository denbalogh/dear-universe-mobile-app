import { Day } from "@/models/Day";
import { useObject } from "@realm/react";
import React, { useCallback, useMemo } from "react";
import ListItem from "../ListItem/ListItem";
import { useRouter } from "expo-router";
import {
  ENTRY_SCREEN_FOCUS_DESCRIPTION,
  ENTRY_SCREEN_SCROLL_TO_RECORDING,
  ENTRY_SCREEN_SCROLL_TO_MEDIA,
} from "@/constants/screens";

const ListItemWithData = ({ dateId }: { dateId: string }) => {
  const dayObject = useObject(Day, dateId);
  const router = useRouter();

  const { title = "", entryObjects = [] } = dayObject || {};

  const onPressHandler = useCallback(() => {
    router.navigate({ pathname: "/day/[dateId]", params: { dateId } });
  }, [dateId, router]);

  const addEntryHandlers = useMemo(
    () => ({
      onAddTextPress: () =>
        router.navigate({
          pathname: "/day/[dateId]/entry/new",
          params: {
            dateId,
            ...ENTRY_SCREEN_FOCUS_DESCRIPTION,
          },
        }),
      onAddRecordingPress: () =>
        router.navigate({
          pathname: "/day/[dateId]/entry/new",
          params: { dateId, ...ENTRY_SCREEN_SCROLL_TO_RECORDING },
        }),
      onAddMediaPress: () =>
        router.navigate({
          pathname: "/day/[dateId]/entry/new",
          params: { dateId, ...ENTRY_SCREEN_SCROLL_TO_MEDIA },
        }),
    }),
    [dateId, router],
  );

  const isEmpty = useMemo(
    () => !title && (!dayObject || entryObjects.length === 0),
    [title, dayObject, entryObjects],
  );

  const feelings = useMemo(
    () =>
      entryObjects
        .map((entry) => entry?.feelingsGroupName)
        .filter((feeling) => !!feeling),
    [entryObjects],
  );

  return (
    <ListItem
      onPress={onPressHandler}
      dateId={dateId}
      title={title}
      addEntryHandlers={addEntryHandlers}
      isEmpty={isEmpty}
      feelings={feelings}
    />
  );
};

export default ListItemWithData;
