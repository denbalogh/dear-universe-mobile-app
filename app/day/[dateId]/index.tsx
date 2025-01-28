import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { BackHandler, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import { formatDateId, formatFullDate, parseDateId } from "@/utils/date";
import { spacing } from "@/constants/theme";
import CTAButtons from "@/components/CTAButtons/CTAButtons";
import { DaySearchTermParams } from "@/types/dayScreen";
import {
  ENTRY_SCREEN_FOCUS_DESCRIPTION,
  ENTRY_SCREEN_SCROLL_TO_RECORDING,
  ENTRY_SCREEN_SCROLL_TO_MEDIA,
} from "@/constants/screens";
import AfterEntriesMessage from "@/components/AfterEntriesMessage/AfterEntriesMessage";
import EntryWithData from "@/components/EntryWithData/EntryWithData";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import {
  Directions,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import { addDays, isToday, subDays } from "date-fns";
import { runOnJS } from "react-native-reanimated";
import useDayObject from "@/hooks/useDayObject";
import EntryPlaceholder from "@/components/EntryPlaceholder/EntryPlaceholder";
import useIsKeyboardOpen from "@/hooks/useIsKeyboardOpen";
import DayTitle from "@/components/DayTitle/DayTitle";
import { isEqual } from "lodash";
import { useSnackbar } from "@/contexts/SnackbarContext";

const DayScreen = () => {
  const theme = useTheme();
  const router = useRouter();

  const isKeyboardOpen = useIsKeyboardOpen();
  const { showSnackbar } = useSnackbar();

  const { dateId } = useLocalSearchParams<DaySearchTermParams>();
  const { dayObject, updateDayObject } = useDayObject(dateId);

  const {
    entryObjects = [],
    title: initialTitle = "",
    locked = false,
  } = dayObject || {};
  const hasEntries = entryObjects.length > 0;

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

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isTitleEdited) {
          handleShowDiscardDialog();
          return true;
        } else {
          return false;
        }
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => subscription.remove();
    }, [isTitleEdited, handleShowDiscardDialog]),
  );

  const fullDate = useMemo(() => formatFullDate(parseDateId(dateId)), [dateId]);

  const flingLeft = useMemo(() => {
    const goToPreviousDay = () => {
      const currentDate = parseDateId(dateId);
      const previousDate = subDays(currentDate, 1);

      router.replace({
        pathname: "/day/[dateId]",
        params: { dateId: formatDateId(previousDate) },
      });
    };

    return Gesture.Fling()
      .direction(Directions.LEFT)
      .onEnd(() => runOnJS(goToPreviousDay)());
  }, [dateId, router]);

  const flingRight = useMemo(() => {
    const goToNextDay = () => {
      const currentDate = parseDateId(dateId);

      if (isToday(currentDate)) {
        return;
      }

      const nextDate = addDays(currentDate, 1);

      router.replace({
        pathname: "/day/[dateId]",
        params: { dateId: formatDateId(nextDate) },
      });
    };

    return Gesture.Fling()
      .direction(Directions.RIGHT)
      .onEnd(() => runOnJS(goToNextDay)());
  }, [dateId, router]);

  const toggleLocked = () => {
    if (dayObject === null) {
      return;
    }

    updateDayObject({ locked: !locked });
    showSnackbar(locked ? "Day was unlocked" : "Day was locked");
  };

  return (
    <GestureDetector gesture={Gesture.Race(flingLeft, flingRight)}>
      <View style={[styles.wrapper, { backgroundColor: theme.colors.surface }]}>
        <Stack.Screen
          options={{
            header: () => (
              <Appbar.Header>
                <Appbar.BackAction onPress={handleGoBack} />
                <Appbar.Content title={fullDate} />
                <Appbar.Action
                  icon={locked ? "lock" : "lock-open-variant"}
                  onPress={toggleLocked}
                  disabled={!hasEntries}
                />
              </Appbar.Header>
            ),
            navigationBarColor: theme.colors.surface,
            animation: "fade",
          }}
        />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContentWrapper,
            !locked && styles.bottomPadding,
          ]}
        >
          <DayTitle
            title={title}
            onTitleChange={setTitle}
            isTitleEdited={isTitleEdited}
            onSubmit={handleOnSubmit}
            locked={locked}
          />
          {hasEntries ? (
            <>
              {entryObjects.map(({ _id }, index) => {
                const entryId = _id.toString();

                return (
                  <EntryWithData
                    entryId={entryId}
                    dayObject={dayObject}
                    key={entryId}
                    index={index}
                    locked={locked}
                  />
                );
              })}
              {!locked && <AfterEntriesMessage />}
            </>
          ) : (
            <EntryPlaceholder />
          )}
        </ScrollView>
        {!isKeyboardOpen && !locked && (
          <CTAButtons
            style={styles.bottomButtons}
            showText={!hasEntries}
            addTextButton={{
              onPress: () =>
                router.navigate(
                  {
                    pathname: "./entry/new",
                    params: ENTRY_SCREEN_FOCUS_DESCRIPTION,
                  },
                  { relativeToDirectory: true },
                ),
            }}
            addRecordingButton={{
              onPress: () =>
                router.navigate(
                  {
                    pathname: "./entry/new",
                    params: ENTRY_SCREEN_SCROLL_TO_RECORDING,
                  },
                  { relativeToDirectory: true },
                ),
            }}
            addMediaButton={{
              onPress: () =>
                router.navigate(
                  {
                    pathname: "./entry/new",
                    params: ENTRY_SCREEN_SCROLL_TO_MEDIA,
                  },
                  { relativeToDirectory: true },
                ),
            }}
          />
        )}
      </View>
    </GestureDetector>
  );
};

export default DayScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentWrapper: {
    paddingHorizontal: spacing.spaceSmall,
    paddingTop: spacing.spaceSmall,
  },
  bottomButtons: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: spacing.spaceLarge,
  },
  bottomPadding: {
    paddingBottom: 130,
  },
});
