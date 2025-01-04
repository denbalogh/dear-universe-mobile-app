import { Day } from "@/models/Day";
import { useObject } from "@realm/react";
import React from "react";
import ListItem from "../ListItem/ListItem";
import { useRouter } from "expo-router";
import { FOCUS_DESCRIPTION } from "@/constants/screens";

const ListItemWithData = ({ dateId }: { dateId: string }) => {
  const dayObject = useObject(Day, dateId);
  const router = useRouter();

  const { title = "", entryObjects = [] } = dayObject || {};

  const onPressHandler = () => {
    router.navigate({ pathname: "/day/[dateId]", params: { dateId } });
  };

  const addEntryHandlers = {
    onAddVideoEntryPress: () =>
      router.navigate({
        pathname: "/day/[dateId]/entry/new/video",
        params: { dateId },
      }),
    onAddImageEntryPress: () =>
      router.navigate({
        pathname: "/day/[dateId]/entry/new/image",
        params: { dateId },
      }),
    onAddRecordingEntryPress: () =>
      router.navigate({
        pathname: "/day/[dateId]/entry/new/recording",
        params: { dateId },
      }),
    onAddTextEntryPress: () =>
      router.navigate({
        pathname: "/day/[dateId]/entry/new/text",
        params: {
          dateId,
          ...FOCUS_DESCRIPTION,
        },
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
