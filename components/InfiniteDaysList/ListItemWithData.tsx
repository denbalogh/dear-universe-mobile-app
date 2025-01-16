import { Day } from "@/models/Day";
import { useObject } from "@realm/react";
import React from "react";
import ListItem from "../ListItem/ListItem";
import { useRouter } from "expo-router";
import {
  FOCUS_DESCRIPTION,
  SCROLL_TO_RECORDING,
  SCROLL_TO_MEDIA,
} from "@/constants/screens";

const ListItemWithData = ({ dateId }: { dateId: string }) => {
  const dayObject = useObject(Day, dateId);
  const router = useRouter();

  const { title = "", entryObjects = [] } = dayObject || {};

  const onPressHandler = () => {
    router.navigate({ pathname: "/day/[dateId]", params: { dateId } });
  };

  const addEntryHandlers = {
    onAddTextPress: () =>
      router.navigate({
        pathname: "/day/[dateId]/entry/new",
        params: {
          dateId,
          ...FOCUS_DESCRIPTION,
        },
      }),
    onAddRecordingPress: () =>
      router.navigate({
        pathname: "/day/[dateId]/entry/new",
        params: { dateId, ...SCROLL_TO_RECORDING },
      }),
    onAddMediaPress: () =>
      router.navigate({
        pathname: "/day/[dateId]/entry/new",
        params: { dateId, ...SCROLL_TO_MEDIA },
      }),
  };

  const isEmpty = !title && (!dayObject || dayObject.entryObjects.length === 0);

  const feelings = entryObjects
    .map((entry) => entry?.feelingsGroupName)
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
