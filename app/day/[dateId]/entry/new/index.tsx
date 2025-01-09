import React, { useCallback, useMemo } from "react";
import { formatFullDate, parseDateId } from "@/utils/date";
import { useLocalSearchParams, useRouter } from "expo-router";
import CreateEditEntry from "@/components/CreateEditEntry/CreateEditEntry";
import { useObject, useRealm } from "@realm/react";
import { EntryData } from "@/components/Entry/Entry";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import { EntrySearchParams } from "@/types/createEditEntryScreen";
import useInitiateDayObject from "@/hooks/useInitiateDayObject";

const NewEntryScreen = () => {
  const realm = useRealm();
  const router = useRouter();
  const { showConfirmDialog } = useConfirmDialog();

  const { dateId, focus, scrollTo } = useLocalSearchParams<EntrySearchParams>();
  const dayObject = useInitiateDayObject(dateId);

  const formattedDate = useMemo(
    () => formatFullDate(parseDateId(dateId)),
    [dateId],
  );

  const handleOnEntrySave = useCallback(
    (entryData: EntryData) => {
      showConfirmDialog("Do you wish to save this entry?", () => {
        console.log(entryData);
      });
    },
    [showConfirmDialog],
  );

  return (
    <CreateEditEntry
      mode="create"
      formattedDate={formattedDate}
      title=""
      description=""
      recordingUri=""
      imagesUri={[]}
      videosWithThumbnail={[]}
      feelingsActiveGroup=""
      feelingsActiveEmotions={[]}
      onSave={handleOnEntrySave}
      focusTitle={focus === "title"}
      focusDescription={focus === "description"}
      scrollToRecording={scrollTo === "recording"}
      scrollToImages={scrollTo === "images"}
      scrollToVideos={scrollTo === "videos"}
      scrollToFeelings={scrollTo === "feelings"}
    />
  );
};

export default NewEntryScreen;
