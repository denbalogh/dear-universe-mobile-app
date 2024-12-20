import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BackHandler, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, HelperText, TextInput, useTheme } from "react-native-paper";
import { formatFullDate, parseDateId } from "@/utils/date";
import { spacing } from "@/constants/theme";
import CTAButtons from "@/components/CTAButtons/CTAButtons";
import { useObject, useRealm } from "@realm/react";
import { Day } from "@/models/Day";
import { DaySearchTermParams } from "@/types/dayScreen";
import { COMING_FROM_DAY, FOCUS_DESCRIPTION } from "@/constants/screens";
import AfterEntriesMessage from "@/components/AfterEntriesMessage/AfterEntriesMessage";
import BeginningHints from "@/components/BeginningHints/BeginningHints";
import EntryWithData from "@/components/EntryWithData/EntryWithData";
import { useDiscardDialog } from "@/contexts/DiscardDialogContext";

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

  const { showDiscardDialog } = useDiscardDialog();

  const handleShowDiscardDialog = useCallback(() => {
    showDiscardDialog({
      message: "Do you wish to discard changes to title?",
      callback: router.back,
    });
  }, [showDiscardDialog, router.back]);

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

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.colors.surface }]}>
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
            blurOnSubmit={true}
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
            router.navigate({
              pathname: "./entry/new/image",
              params: COMING_FROM_DAY,
            }),
        }}
        addRecordingEntryButton={{
          onPress: () =>
            router.navigate({
              pathname: "./entry/new/recording",
              params: COMING_FROM_DAY,
            }),
        }}
        addTextEntryButton={{
          onPress: () =>
            router.navigate({
              pathname: "./entry/new/text",
              params: { ...FOCUS_DESCRIPTION, ...COMING_FROM_DAY },
            }),
        }}
      />
    </View>
  );
};

export default DayScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  titleWrapper: {
    marginBottom: spacing.spaceMedium,
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
