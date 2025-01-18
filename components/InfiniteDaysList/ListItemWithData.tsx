import { Day } from "@/models/Day";
import { useObject } from "@realm/react";
import React, { useCallback, useMemo } from "react";
import ListItem from "../ListItem/ListItem";
import { useRouter } from "expo-router";
import {
  FOCUS_DESCRIPTION,
  SCROLL_TO_RECORDING,
  SCROLL_TO_MEDIA,
} from "@/constants/screens";
import { Media } from "../MediaGallery/EditableMediaGallery";
import { EntryData } from "../Entry/Entry";

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
    }),
    [dateId, router],
  );

  const isEmpty = useMemo(
    () => !title && (!dayObject || dayObject.entryObjects.length === 0),
    [title, dayObject],
  );

  const feelings = useMemo(
    () =>
      entryObjects
        .map((entry) => entry?.feelingsGroupName)
        .filter((feeling) => !!feeling),
    [entryObjects],
  );

  const media = useMemo(
    () =>
      (entryObjects as EntryData[]).reduce((acc: Media[], entry: EntryData) => {
        if (entry?.media) {
          return [...acc, ...entry.media];
        }
        return acc;
      }, []),
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
      media={media}
    />
  );
};

export default ListItemWithData;
