import React, { useCallback, useMemo } from "react";
import { formatFullDate, parseDateId } from "@/utils/date";
import { useLocalSearchParams, useRouter } from "expo-router";
import CreateEditEntry from "@/components/CreateEditEntry/CreateEditEntry";
import { useRealm } from "@realm/react";
import { EntryData } from "@/components/Entry/Entry";
import { EntrySearchParams } from "@/types/createEditEntryScreen";
import useInitiateDayObject from "@/hooks/useInitiateDayObject";
import { Entry, Media } from "@/models/Entry";

const NewEntryScreen = () => {
  const realm = useRealm();
  const router = useRouter();

  const { dateId, focus, scrollTo } = useLocalSearchParams<EntrySearchParams>();
  const dayObject = useInitiateDayObject(dateId);

  const formattedDate = useMemo(
    () => formatFullDate(parseDateId(dateId)),
    [dateId],
  );

  const handleOnEntrySave = useCallback(
    (entryData: EntryData) => {
      if (dayObject === null) {
        return;
      }

      const {
        title,
        description,
        recordingUri,
        media,
        feelingsActiveGroup,
        feelingsActiveEmotions,
      } = entryData;

      realm.write(() => {
        const entry = realm.create(Entry, {
          title,
          description,
          recordingUri,
          media: media as Media[],
          feelingsGroupName: feelingsActiveGroup,
          feelingsEmotions: feelingsActiveEmotions,
          day: dayObject,
        });

        dayObject.entryObjects.push(entry);
      });

      router.dismissTo({
        pathname: "/day/[dateId]",
        params: { dateId },
      });
    },
    [dayObject, realm, router, dateId],
  );

  return (
    <CreateEditEntry
      mode="create"
      formattedDate={formattedDate}
      title=""
      description=""
      recordingUri=""
      media={[]}
      feelingsActiveGroup=""
      feelingsActiveEmotions={[]}
      onSave={handleOnEntrySave}
      focusTitle={focus === "title"}
      focusDescription={focus === "description"}
      scrollToRecording={scrollTo === "recording"}
      scrollToMedia={scrollTo === "media"}
      scrollToFeelings={scrollTo === "feelings"}
    />
  );
};

export default NewEntryScreen;
