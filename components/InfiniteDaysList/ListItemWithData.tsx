import { Day } from "@/models/Day";
import { useObject } from "@realm/react";
import React from "react";
import ListItem from "../ListItem/ListItem";
import { useRouter } from "expo-router";
import {
  FOCUS_DESCRIPTION,
  SCROLL_TO_IMAGES,
  SCROLL_TO_RECORDING,
  SCROLL_TO_VIDEOS,
} from "@/constants/screens";

const ListItemWithData = ({ dateId }: { dateId: string }) => {
  const dayObject = useObject(Day, dateId);
  const router = useRouter();

  const { title = "", entryObjects = [] } = dayObject || {};

  const onPressHandler = () => {
    router.navigate({ pathname: "/day/[dateId]", params: { dateId } });
  };

  const addEntryHandlers = {
    onAddTextEntryPress: () =>
      router.navigate({
        pathname: "/day/[dateId]/entry/new",
        params: {
          dateId,
          ...FOCUS_DESCRIPTION,
        },
      }),
    onAddRecordingEntryPress: () =>
      router.navigate({
        pathname: "/day/[dateId]/entry/new",
        params: { dateId, ...SCROLL_TO_RECORDING },
      }),
    onAddImageEntryPress: () =>
      router.navigate({
        pathname: "/day/[dateId]/entry/new",
        params: { dateId, ...SCROLL_TO_IMAGES },
      }),
    onAddVideoEntryPress: () =>
      router.navigate({
        pathname: "/day/[dateId]/entry/new",
        params: { dateId, ...SCROLL_TO_VIDEOS },
      }),
  };

  const isEmpty = !title && (!dayObject || dayObject.entryObjects.length === 0);

  const feelings = entryObjects
    .map((entry) => entry?.feelings?.name)
    .filter((feeling) => !!feeling);

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
