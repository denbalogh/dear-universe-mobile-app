import { sizing } from "@/common/constants/theme";
import database, { entriesCollection } from "@/common/models/db";
import { useDay } from "@/common/providers/DayProvider";
import {
  NEW_ENTRY_ID,
  useEntryEditor,
} from "@/common/providers/EntryEditorProvider";
import { useSnackbar } from "@/common/providers/SnackbarProvider";
import {
  moveAndDeleteUpdatedMediaAndGetPaths,
  moveAndDeleteUpdatedRecordingAndGetPath,
  moveMediaToAppDirAndGetPaths,
  moveRecordingToAppDirAndGetPath,
} from "@/common/utils/files";
import React from "react";
import { IconButton } from "react-native-paper";

const DiscardSaveButtons = () => {
  const { showSnackbar } = useSnackbar();
  const { day, entries } = useDay();

  const {
    entryId,
    text,
    recordingUri,
    media,
    feelingsEmotions,
    feelingsGroup,
    clear,
    isEmpty,
  } = useEntryEditor();

  const isNewEntry = entryId === NEW_ENTRY_ID;

  const handleCreateNewEntry = async () => {
    const newMedia = await moveMediaToAppDirAndGetPaths(media);
    const newRecordingUri = await moveRecordingToAppDirAndGetPath(recordingUri);

    await database.write(async () => {
      await entriesCollection.create((entry) => {
        entry.day.set(day);
        entry.text = text;
        entry.language = "en";
        entry.orderIndex = entries.length;
        entry.recordingUri = newRecordingUri;
        entry.feelingsGroup = feelingsGroup;
        entry.feelingsEmotions = feelingsEmotions;
        entry.media = newMedia;
      });
    });
    showSnackbar("Entry created");
  };

  const handleUpdateEntry = async () => {
    const entry = await entriesCollection.find(entryId as string);
    const newMedia = await moveAndDeleteUpdatedMediaAndGetPaths(
      media,
      entry.media,
    );
    const newRecordingUri = await moveAndDeleteUpdatedRecordingAndGetPath(
      recordingUri,
      entry.recordingUri,
    );

    await database.write(async () => {
      await entry.update((entry) => {
        entry.text = text;
        entry.recordingUri = newRecordingUri;
        entry.feelingsGroup = feelingsGroup;
        entry.feelingsEmotions = feelingsEmotions;
        entry.media = newMedia;
      });
    });
    showSnackbar("Entry updated");
  };

  const handleOnSave = async () => {
    if (isNewEntry) {
      await handleCreateNewEntry();
    } else {
      await handleUpdateEntry();
    }
    clear();
  };

  return (
    <>
      <IconButton size={sizing.sizeMedium} icon="close" onPress={clear} />
      <IconButton
        size={sizing.sizeMedium}
        icon="check"
        onPress={handleOnSave}
        mode="contained"
        disabled={isEmpty}
      />
    </>
  );
};

export default DiscardSaveButtons;
