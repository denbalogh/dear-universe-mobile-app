import { spacing } from "@/common/constants/theme";
import { useEntryDraft } from "@/contexts/EntryDraftContext";
import { useSnackbar } from "@/common/contexts/SnackbarContext";
import { formatFullDate, parseDateAt } from "@/common/utils/date";
import { useRealm } from "@realm/react";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { FAB } from "react-native-paper";
import { DaySearchTermParams } from "./types";

const ConfirmButton = () => {
  const realm = useRealm();
  const { showSnackbar } = useSnackbar();

  const { dateAt } = useLocalSearchParams<DaySearchTermParams>();

  const {
    isEmpty,
    text,
    recordingUri,
    media,
    feelingsEmotions,
    feelingsGroup,
    clear,
  } = useEntryDraft();

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

    showSnackbar(`Entry saved for ${formatFullDate(parseDateAt(dateAt))}`);
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
