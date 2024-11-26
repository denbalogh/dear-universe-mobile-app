import { Day } from "@/models/Day";
import { useObject } from "@realm/react";
import React from "react";
import ListItem from "../ListItem/ListItem";

const ListItemWithData = ({ dateId }: { dateId: string }) => {
  const dayObject = useObject(Day, dateId);

  const { title = "" } = dayObject || {};

  const addEntryHandlers = {
    onAddImageEntryPress: () => {},
    onAddRecordingEntryPress: () => {},
    onAddTextEntryPress: () => {},
  };

  const isEmpty = dayObject === null;

  return (
    <ListItem
      dateId={dateId}
      title={title}
      moods={[]}
      onPress={() => {}}
      empty={isEmpty ? addEntryHandlers : undefined}
    />
  );
};

export default ListItemWithData;
