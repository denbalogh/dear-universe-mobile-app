import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import { formatDateId, formatFullDate, parseDateId } from "@/utils/date";
import { spacing } from "@/constants/theme";
import CTAButtons from "@/components/CTAButtons/CTAButtons";
import { DaySearchTermParams } from "@/types/dayScreen";
import {
  ENTRY_SCREEN_FOCUS_DESCRIPTION,
  ENTRY_SCREEN_SCROLL_TO_RECORDING,
  ENTRY_SCREEN_SCROLL_TO_MEDIA,
  DAY_SCREEN_APPEAR_FROM_LEFT,
  DAY_SCREEN_APPEAR_FROM_RIGHT,
} from "@/constants/screens";
import AfterEntriesMessage from "@/components/AfterEntriesMessage/AfterEntriesMessage";
import EntryWithData from "@/components/EntryWithData/EntryWithData";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import { addDays, isToday, subDays } from "date-fns";
import useDayObject from "@/hooks/useDayObject";
import EntryPlaceholder from "@/components/EntryPlaceholder/EntryPlaceholder";
import useIsKeyboardOpen from "@/hooks/useIsKeyboardOpen";
import DayTitle from "@/components/DayTitle/DayTitle";
import { isEqual } from "lodash";
import { useSnackbar } from "@/contexts/SnackbarContext";
import FlingGesture from "@/components/FlingGesture/FlingGesture";
import FadeInView from "@/components/FadeInView/FadeInView";
import useScrollViewOffset from "@/hooks/useScrollViewOffset";
import useBackHandler from "@/hooks/useBackHandler";

const DayScreen = () => {
  const theme = useTheme();
  const router = useRouter();

  const isKeyboardOpen = useIsKeyboardOpen();
  const { showSnackbar } = useSnackbar();

  const { dateId, appearFrom = "center" } =
    useLocalSearchParams<DaySearchTermParams>();
  const { dayObject, updateDayObject } = useDayObject(dateId);

  const { scrollOffset, handleOnScroll } = useScrollViewOffset();

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

  const onAndroidBackButtonPress = useCallback(() => {
    if (isTitleEdited) {
      handleShowDiscardDialog();
      return true;
    }
    return false;
  }, [handleShowDiscardDialog, isTitleEdited]);

  useBackHandler(onAndroidBackButtonPress);

  const fullDate = useMemo(() => formatFullDate(parseDateId(dateId)), [dateId]);

  const onFlingLeft = useCallback(() => {
    const currentDate = parseDateId(dateId);
    const previousDate = subDays(currentDate, 1);

    router.replace({
      pathname: "/day/[dateId]",
      params: {
        dateId: formatDateId(previousDate),
        ...DAY_SCREEN_APPEAR_FROM_RIGHT,
      },
    });
  }, [dateId, router]);

  const onFlingRight = useCallback(() => {
    const currentDate = parseDateId(dateId);

    if (isToday(currentDate)) {
      return;
    }

    const nextDate = addDays(currentDate, 1);

    router.replace({
      pathname: "/day/[dateId]",
      params: {
        dateId: formatDateId(nextDate),
        ...DAY_SCREEN_APPEAR_FROM_LEFT,
      },
    });
  }, [dateId, router]);

  const onFlingDown = useCallback(() => {
    if (scrollOffset <= 0) {
      router.back();
    }
  }, [router, scrollOffset]);

  const toggleLocked = () => {
    if (dayObject === null) {
      return;
    }

    updateDayObject({ locked: !locked });
    showSnackbar(locked ? "Day was unlocked" : "Day was locked");
  };

  return (
    <FlingGesture
      onFlingLeft={onFlingLeft}
      onFlingRight={onFlingRight}
      onFlingDown={onFlingDown}
    >
      <View style={[styles.flex, { backgroundColor: theme.colors.surface }]}>
        <FadeInView style={styles.flex} appearFrom={appearFrom}>
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
            onScroll={handleOnScroll}
            style={styles.flex}
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
        </FadeInView>
      </View>
    </FlingGesture>
  );
};

export default DayScreen;

const styles = StyleSheet.create({
  flex: {
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
