import { spacing } from "@/constants/theme";
import { useEntryDraft } from "@/contexts/EntryDraftContext";
import { useSnackbar } from "@/contexts/SnackbarContext";
import useDayObject from "@/hooks/useDayObject";
import { Entry, Media } from "@/models/Entry";
import { DaySearchTermParams } from "@/types/dayScreen";
import { formatFullDate, parseDateId } from "@/utils/date";
import logCrashlytics from "@/utils/logCrashlytics";
import { useRealm } from "@realm/react";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { FAB } from "react-native-paper";

const ConfirmButton = () => {
  const realm = useRealm();
  const { showSnackbar } = useSnackbar();

  const { dateId } = useLocalSearchParams<DaySearchTermParams>();

  const {
    isEmpty,
    text,
    recordingUri,
    media,
    feelingsEmotions,
    feelingsGroup,
    clear,
  } = useEntryDraft();

  const { dayObject } = useDayObject(dateId);

  if (isEmpty) {
    return null;
  }

  const handleOnPress = () => {
    if (!dayObject) {
      return;
    }

    logCrashlytics("Creating new entry");
    realm.write(() => {
      const entry = realm.create(Entry, {
        text,
        recordingUri,
        media: media as Media[],
        feelingsGroup,
        feelingsEmotions,
        day: dayObject,
      });

      dayObject.entryObjects.push(entry);
    });

    showSnackbar(`Entry saved for ${formatFullDate(parseDateId(dateId))}`);
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
