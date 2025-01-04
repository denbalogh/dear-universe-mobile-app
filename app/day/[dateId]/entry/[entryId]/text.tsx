import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import React, { useCallback, useState } from "react";
import { StyleSheet, View, BackHandler } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import { spacing } from "@/constants/theme";
import { useObject, useRealm } from "@realm/react";
import { formatFullDate, parseDateId } from "@/utils/date";
import TitleDescriptionEditor from "@/components/TitleDescriptionEditor/TitleDescriptionEditor";
import CloseSaveButtons from "@/components/CloseSaveButtons/CloseSaveButtons";
import { Entry } from "@/models/Entry";
import { BSON } from "realm";
import { EntrySearchTermParams } from "@/types/entryTextScreen";
import { FOCUS_DESCRIPTION, FOCUS_TITLE } from "@/constants/screens";
import { useDiscardDialog } from "@/contexts/DiscardDialogContext";

const EditedEntryTextScreen = () => {
  const theme = useTheme();
  const realm = useRealm();
  const router = useRouter();

  const { dateId, entryId, focus } =
    useLocalSearchParams<EntrySearchTermParams>();

  const focusTitleInput = focus === FOCUS_TITLE.focus;
  const focusDescription = focus === FOCUS_DESCRIPTION.focus;

  const entryObject = useObject(Entry, new BSON.ObjectId(entryId));

  const { title: initialTitle = "", description: initialDescription = "" } =
    entryObject || {};

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  const isTitleEdited = title !== initialTitle;
  const isDescriptionEdited = description !== initialDescription;
  const isEdited = isTitleEdited || isDescriptionEdited;

  const { showDiscardDialog } = useDiscardDialog();

  const handleShowDiscardDialog = useCallback(() => {
    showDiscardDialog({
      message: "Do you wish to discard the changes?",
      callback: router.back,
    });
  }, [showDiscardDialog, router.back]);

  const handleBackPress = () => {
    if (isEdited) {
      handleShowDiscardDialog();
    } else {
      router.back();
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isEdited) {
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
    }, [isEdited, handleShowDiscardDialog]),
  );

  const handleUpdateEntry = () => {
    if (entryObject === null) {
      return;
    }

    realm.write(() => {
      entryObject.title = title;
      entryObject.description = description;
    });

    router.back();
  };

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.surface }]}>
      <Stack.Screen
        options={{
          header: () => (
            <Appbar.Header>
              <Appbar.BackAction onPress={handleBackPress} />
            </Appbar.Header>
          ),
          navigationBarColor: theme.colors.surface,
        }}
      />
      <View style={styles.contentWrapper}>
        <TitleDescriptionEditor
          headline="Editing entry"
          date={formatFullDate(parseDateId(dateId))}
          titleTextInput={{
            value: title,
            onChangeText: setTitle,
            autoFocus: focusTitleInput,
          }}
          descriptionTextInput={{
            value: description,
            onChangeText: setDescription,
            autoFocus: focusDescription,
          }}
          bottomComponent={
            <CloseSaveButtons
              closeButton={{ onPress: handleBackPress }}
              saveButton={{ disabled: !isEdited, onPress: handleUpdateEntry }}
            />
          }
        />
      </View>
    </View>
  );
};

export default EditedEntryTextScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    padding: spacing.spaceMedium,
  },
});
