import React, { useCallback, useMemo } from "react";
import { formatFullDate, parseDateId } from "@/utils/date";
import { useLocalSearchParams, useRouter } from "expo-router";
import CreateEditEntry from "@/components/CreateEditEntry/CreateEditEntry";
import { useRealm } from "@realm/react";
import { EntryData } from "@/components/Entry/Entry";
import { EntrySearchParams } from "@/types/createEditEntryScreen";
import useDayObject from "@/hooks/useDayObject";
import { Entry, Media } from "@/models/Entry";
import { useSnackbar } from "@/contexts/SnackbarContext";

const NewEntryScreen = () => {
  const realm = useRealm();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const { dateId, focus, scrollTo } = useLocalSearchParams<EntrySearchParams>();
  const { dayObject } = useDayObject(dateId);

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

      showSnackbar(`Entry saved for ${formattedDate}`);

      router.back();
    },
    [dayObject, realm, router, showSnackbar, formattedDate],
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
