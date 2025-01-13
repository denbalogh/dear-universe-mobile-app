import React, { useCallback, useMemo } from "react";
import { formatFullDate, parseDateId } from "@/utils/date";
import { useLocalSearchParams, useRouter } from "expo-router";
import CreateEditEntry from "@/components/CreateEditEntry/CreateEditEntry";
import { useObject, useRealm } from "@realm/react";
import { EntryData } from "@/components/Entry/Entry";
import { EntrySearchParams } from "@/types/createEditEntryScreen";
import useInitiateDayObject from "@/hooks/useInitiateDayObject";
import { Entry, VideoWithThumbnail } from "@/models/Entry";
import { BSON } from "realm";

const EditEntryScreen = () => {
  const realm = useRealm();
  const router = useRouter();

  const {
    dateId,
    entryId,
    focus,
    scrollTo,
    imagesSelectedIndex,
    videosSelectedIndex,
  } = useLocalSearchParams<EntrySearchParams>();
  const dayObject = useInitiateDayObject(dateId);

  const formattedDate = useMemo(
    () => formatFullDate(parseDateId(dateId)),
    [dateId],
  );

  const entryObject = useObject(Entry, new BSON.ObjectId(entryId));

  const {
    title = "",
    description = "",
    recordingUri = "",
    imagesUri = [],
    videosWithThumbnail = [],
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
        imagesUri,
        videosWithThumbnail,
        feelingsActiveGroup,
        feelingsActiveEmotions,
      } = entryData;

      realm.write(() => {
        entryObject.title = title;
        entryObject.description = description;
        entryObject.recordingUri = recordingUri;
        entryObject.imagesUri = imagesUri;
        entryObject.videosWithThumbnail =
          videosWithThumbnail as VideoWithThumbnail[];
        entryObject.feelingsGroupName = feelingsActiveGroup;
        entryObject.feelingsEmotions = feelingsActiveEmotions;
      });

      router.dismissTo({
        pathname: "/day/[dateId]",
        params: { dateId },
      });
    },
    [dayObject, entryObject, realm, router, dateId],
  );

  return (
    <CreateEditEntry
      mode="edit"
      formattedDate={formattedDate}
      title={title}
      description={description}
      recordingUri={recordingUri}
      imagesUri={imagesUri}
      videosWithThumbnail={videosWithThumbnail}
      feelingsActiveGroup={feelingsGroupName}
      feelingsActiveEmotions={feelingsEmotions}
      onSave={handleOnEntrySave}
      focusTitle={focus === "title"}
      focusDescription={focus === "description"}
      scrollToRecording={scrollTo === "recording"}
      scrollToImages={scrollTo === "images"}
      scrollToVideos={scrollTo === "videos"}
      scrollToFeelings={scrollTo === "feelings"}
      imagesSelectedIndex={imagesSelectedIndex}
      videosSelectedIndex={videosSelectedIndex}
    />
  );
};

export default EditEntryScreen;
