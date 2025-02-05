import React, { useCallback, useMemo } from "react";
import { formatFullDate, parseDateId } from "@/utils/date";
import { useLocalSearchParams, useRouter } from "expo-router";
import CreateEditEntry from "@/components/CreateEditEntry/CreateEditEntry";
import { useObject, useRealm } from "@realm/react";
import { EntryData } from "@/components/Entry/Entry";
import { EntrySearchParams } from "@/types/createEditEntryScreen";
import useDayObject from "@/hooks/useDayObject";
import { Entry, Media } from "@/models/Entry";
import { BSON } from "realm";
import { useSnackbar } from "@/contexts/SnackbarContext";

const EditEntryScreen = () => {
  const realm = useRealm();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const { dateId, entryId, focus, scrollTo, selectedMediaImageUri } =
    useLocalSearchParams<EntrySearchParams>();
  const { dayObject } = useDayObject(dateId);

  const formattedDate = useMemo(
    () => formatFullDate(parseDateId(dateId)),
    [dateId],
  );

  const entryObject = useObject(Entry, new BSON.ObjectId(entryId));

  const {
    title = "",
    description = "",
    recordingUri = "",
    media = [],
    feelingsGroupName = "",
    feelingsEmotions = [],
  } = entryObject || {};

  const handleOnEntrySave = useCallback(
    (entryData: EntryData) => {
      if (dayObject === null || entryObject === null) {
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
        entryObject.title = title;
        entryObject.description = description;
        entryObject.recordingUri = recordingUri;
        entryObject.media = media as Media[];
        entryObject.feelingsGroupName = feelingsActiveGroup;
        entryObject.feelingsEmotions = feelingsActiveEmotions;
      });

      showSnackbar(`Entry updated for ${formattedDate}`);

      router.back();
    },
    [dayObject, entryObject, realm, router, showSnackbar, formattedDate],
  );

  return (
    <CreateEditEntry
      mode="edit"
      formattedDate={formattedDate}
      title={title}
      description={description}
      recordingUri={recordingUri}
      media={media}
      feelingsActiveGroup={feelingsGroupName}
      feelingsActiveEmotions={feelingsEmotions}
      onSave={handleOnEntrySave}
      focusTitle={focus === "title"}
      focusDescription={focus === "description"}
      scrollToRecording={scrollTo === "recording"}
      scrollToMedia={scrollTo === "media"}
      scrollToFeelings={scrollTo === "feelings"}
      selectedMediaImageUri={selectedMediaImageUri}
    />
  );
};

export default EditEntryScreen;
