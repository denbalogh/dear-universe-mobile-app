import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BackHandler, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, HelperText, TextInput, useTheme } from "react-native-paper";
import { formatDateId, formatFullDate, parseDateId } from "@/utils/date";
import { spacing } from "@/constants/theme";
import CTAButtons from "@/components/CTAButtons/CTAButtons";
import { useObject, useRealm } from "@realm/react";
import { Day } from "@/models/Day";
import { DaySearchTermParams } from "@/types/dayScreen";
import { FOCUS_DESCRIPTION } from "@/constants/screens";
import AfterEntriesMessage from "@/components/AfterEntriesMessage/AfterEntriesMessage";
import BeginningHints from "@/components/BeginningHints/BeginningHints";
import EntryWithData from "@/components/EntryWithData/EntryWithData";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import {
  Directions,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import { addDays, isToday, subDays } from "date-fns";
import { runOnJS } from "react-native-reanimated";

const DayScreen = () => {
  const theme = useTheme();
  const realm = useRealm();
  const router = useRouter();

  const { dateId } = useLocalSearchParams<DaySearchTermParams>();
  const dayObject = useObject(Day, dateId);

  const { entryObjects = [], title: initialTitle = "" } = dayObject || {};
  const hasEntries = entryObjects.length > 0;

  const [title, setTitle] = useState(initialTitle);

  const isTitleEdited = title !== initialTitle;
  const editedUnderlineColor = isTitleEdited
    ? theme.colors.tertiary
    : undefined;

  useEffect(() => {
    if (dayObject === null) {
      realm.write(() => {
        realm.create(Day, {
          _id: dateId,
        });
      });
    }
  }, [dateId, dayObject, realm]);

  const handleOnSubmit = () => {
    if (!isTitleEdited) {
      return;
    }

    realm.write(() => {
      if (dayObject !== null) {
        dayObject.title = title;
      }
    });
  };

  const { showConfirmDialog } = useConfirmDialog();

  const handleShowDiscardDialog = useCallback(
    () =>
      showConfirmDialog(
        "Do you wish to discard changes to title?",
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

  return (
    <GestureDetector gesture={Gesture.Race(flingLeft, flingRight)}>
      <View style={[styles.wrapper, { backgroundColor: theme.colors.surface }]}>
        <Stack.Screen
          options={{
            header: () => (
              <Appbar.Header>
                <Appbar.BackAction onPress={handleGoBack} />
                <Appbar.Content title={fullDate} />
              </Appbar.Header>
            ),
            animation: "fade",
            navigationBarColor: theme.colors.surface,
          }}
        />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContentWrapper,
            styles.bottomPadding,
          ]}
        >
          <View style={styles.titleWrapper}>
            <TextInput
              label="Title for the day"
              value={title}
              onChangeText={setTitle}
              multiline={true}
              enterKeyHint="done"
              submitBehavior="blurAndSubmit"
              contentStyle={{ marginTop: 5 }}
              mode="outlined"
              onSubmitEditing={handleOnSubmit}
              outlineColor={editedUnderlineColor}
              activeOutlineColor={editedUnderlineColor}
              style={{ backgroundColor: theme.colors.surface }}
            />
            {isTitleEdited && (
              <HelperText type="info" visible={true}>
                To save the title, press done on the keyboard.
              </HelperText>
            )}
          </View>
          {!hasEntries && <BeginningHints />}
          {entryObjects.map((entryObject, index) => (
            <EntryWithData
              entryObject={entryObject}
              dayObject={dayObject}
              key={entryObject._id.toString()}
              index={index}
            />
          ))}
          {hasEntries && <AfterEntriesMessage />}
        </ScrollView>
        <CTAButtons
          style={styles.bottomButtons}
          showText={!hasEntries}
          addImageEntryButton={{
            onPress: () =>
              router.navigate(
                { pathname: "./entry/new/image" },
                { relativeToDirectory: true },
              ),
          }}
          addRecordingEntryButton={{
            onPress: () =>
              router.navigate(
                { pathname: "./entry/new/recording" },
                { relativeToDirectory: true },
              ),
          }}
          addTextEntryButton={{
            onPress: () =>
              router.navigate(
                {
                  pathname: "./entry/new/text",
                  params: FOCUS_DESCRIPTION,
                },
                { relativeToDirectory: true },
              ),
          }}
          addVideoEntryButton={{
            onPress: () =>
              router.navigate(
                { pathname: "./entry/new/video" },
                { relativeToDirectory: true },
              ),
          }}
        />
      </View>
    </GestureDetector>
  );
};

export default DayScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  titleWrapper: {
    marginBottom: spacing.spaceSmall,
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
