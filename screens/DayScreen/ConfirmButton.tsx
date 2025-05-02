import { sizing, spacing } from "@/common/constants/theme";
import { useSnackbar } from "@/common/providers/SnackbarProvider";
import React from "react";
import { StyleSheet, View } from "react-native";
import { FAB, IconButton } from "react-native-paper";
import { useEntryEditor } from "@/common/providers/EntryEditorProvider";
import { useDay } from "@/common/providers/DayProvider";
import database, { entriesCollection } from "@/common/models/db";
import {
  moveAndDeleteUpdatedMediaAndGetPaths,
  moveAndDeleteUpdatedRecordingAndGetPath,
  moveMediaToAppDirAndGetPaths,
  moveRecordingToAppDirAndGetPath,
} from "@/common/utils/files";
import { useCustomTheme } from "@/common/hooks/useCustomTheme";

const ConfirmButton = () => {
  const theme = useCustomTheme();
  const { showSnackbar } = useSnackbar();

  const { day, entries } = useDay();

  const {
    entryId,
    isEmpty,
    text,
    recordingUri,
    media,
    feelingsEmotions,
    feelingsGroup,
    clear,
  } = useEntryEditor();

  const isDraft = !entryId;

  if (isDraft && isEmpty) {
    return null;
  }

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

  const handleOnPress = async () => {
    if (isDraft) {
      await handleCreateNewEntry();
    } else {
      await handleUpdateEntry();
    }
    clear();
  };

  return (
    <View style={styles.wrapper}>
      <IconButton
        size={sizing.sizeMedium}
        icon="close"
        onPress={clear}
        iconColor={theme.colors.error}
        mode="contained-tonal"
      />
      <FAB icon="check" style={styles.check} onPress={handleOnPress} />
    </View>
  );
};

export default ConfirmButton;

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: spacing.spaceLarge,
    right: spacing.spaceMedium,
    alignItems: "center",
  },
  check: {
    marginTop: spacing.spaceMedium,
  },
});
