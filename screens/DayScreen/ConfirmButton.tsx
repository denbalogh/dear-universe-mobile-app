import { spacing } from "@/common/constants/theme";
import { useSnackbar } from "@/common/providers/SnackbarProvider";
import { formatFullDate, parseDayId } from "@/common/utils/date";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { FAB } from "react-native-paper";
import { DaySearchTermParams } from "./types";
import { useEntryEditor } from "@/common/providers/EntryEditorProvider";

const ConfirmButton = () => {
  const { showSnackbar } = useSnackbar();

  const { dayId } = useLocalSearchParams<DaySearchTermParams>();

  const {
    isEmpty,
    text,
    recordingUri,
    media,
    feelingsEmotions,
    feelingsGroup,
    clear,
  } = useEntryEditor();

  if (isEmpty) {
    return null;
  }

  const handleOnPress = () => {
    // if (!dayObject) {
    //   return;
    // }

    // realm.write(() => {
    //   const entry = realm.create(Entry, {
    //     text,
    //     recordingUri,
    //     media: media as Media[],
    //     feelingsGroup,
    //     feelingsEmotions,
    //     day: dayObject,
    //   });

    //   dayObject.entryObjects.push(entry);
    // });

    showSnackbar(`Entry saved for ${formatFullDate(parseDayId(dayId))}`);
    clear();
  };

  return <FAB icon="check" style={styles.fab} onPress={handleOnPress} />;
};

export default ConfirmButton;

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: spacing.spaceLarge,
    right: spacing.spaceMedium,
  },
});
