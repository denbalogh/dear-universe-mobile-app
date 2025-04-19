import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, TextInput, useTheme } from "react-native-paper";
import { formatFullDate, parseDateId } from "@/utils/date";
import { DaySearchTermParams } from "@/types/dayScreen";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import useDayObject from "@/hooks/useDayObject";
import isEqual from "lodash/isEqual";
import { useSnackbar } from "@/contexts/SnackbarContext";
import FlingGesture from "@/components/FlingGesture/FlingGesture";
import useBackHandler from "@/hooks/useBackHandler";
import BottomSheet from "@/components/DayScreenComponents/BottomSheet/BottomSheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { spacing } from "@/constants/theme";
import { EntryCreationContextProvider } from "@/contexts/EntryCreationContext";
import EntriesList from "@/components/EntriesList/EntriesList";

const DayScreen = () => {
  const theme = useTheme();
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();

  const { showSnackbar } = useSnackbar();

  const { dateId } = useLocalSearchParams<DaySearchTermParams>();
  const { dayObject, updateDayObject } = useDayObject(dateId);

  const { title: initialTitle = "" } = dayObject || {};

  const [title, setTitle] = useState(initialTitle);

  const isTitleEdited = !isEqual(title, initialTitle);

  const handleOnSubmit = () => {
    if (!isTitleEdited || dayObject === null) {
      return;
    }

    updateDayObject({ title });
    showSnackbar("Title for the day was updated");
  };

  const { showConfirmDialog } = useConfirmDialog();

  const handleShowDiscardDialog = useCallback(
    () =>
      showConfirmDialog(
        "Do you wish to discard changes to the title?",
        router.back,
      ),
    [showConfirmDialog, router.back],
  );

  const handleGoBack = () => {
    if (isTitleEdited) {
      handleShowDiscardDialog();
    } else {
      router.back();
    }
  };

  const onAndroidBackButtonPress = useCallback(() => {
    if (isTitleEdited) {
      handleShowDiscardDialog();
      return true;
    }
    return false;
  }, [handleShowDiscardDialog, isTitleEdited]);

  useBackHandler(onAndroidBackButtonPress);

  const fullDate = useMemo(() => formatFullDate(parseDateId(dateId)), [dateId]);

  return (
    <FlingGesture onFlingRight={router.back}>
      <View
        style={[
          styles.flex,
          { backgroundColor: theme.colors.surface, paddingBottom: bottom },
        ]}
      >
        <Stack.Screen
          options={{
            header: () => (
              <Appbar.Header>
                <Appbar.BackAction onPress={handleGoBack} />
                <Appbar.Content title={fullDate} />
              </Appbar.Header>
            ),
          }}
        />
        <TextInput
          label="Title for the day"
          value={title}
          onChangeText={setTitle}
          multiline={true}
          enterKeyHint="done"
          submitBehavior="blurAndSubmit"
          onEndEditing={handleOnSubmit}
          autoFocus={!title}
          style={styles.dayTitleInput}
          mode="outlined"
          contentStyle={{ marginTop: 5 }}
        />
        <EntryCreationContextProvider>
          <EntriesList />
          <BottomSheet defaultSnapPoint={title ? 1 : 0} />
        </EntryCreationContextProvider>
      </View>
    </FlingGesture>
  );
};

export default DayScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  dayTitleInput: {
    margin: spacing.spaceSmall,
    zIndex: 0,
  },
});
