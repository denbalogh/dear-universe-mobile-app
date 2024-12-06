import { Day } from "@/models/Day";
import { useObject } from "@realm/react";
import React from "react";
import ListItem from "../ListItem/ListItem";
import { useRouter } from "expo-router";
import { COMING_FROM_INDEX, FOCUS_DESCRIPTION } from "@/constants/screens";

const ListItemWithData = ({ dateId }: { dateId: string }) => {
  const dayObject = useObject(Day, dateId);
  const router = useRouter();

  const { title = "" } = dayObject || {};

  const addEntryHandlers = {
    onAddImageEntryPress: () => {},
    onAddRecordingEntryPress: () => {},
    onAddTextEntryPress: () =>
      router.navigate({
        pathname: "/day/[dateId]/entry/new/text",
        params: { dateId, ...FOCUS_DESCRIPTION, ...COMING_FROM_INDEX },
      }),
  };

  const isEmpty = dayObject === null || dayObject.entryObjects.length === 0;

  return (
    <ListItem
      onPress={() =>
        router.navigate({ pathname: "/day/[dateId]", params: { dateId } })
      }
      dateId={dateId}
      title={title}
      moods={[]}
      empty={isEmpty ? addEntryHandlers : undefined}
    />
  );
};

export default ListItemWithData;
