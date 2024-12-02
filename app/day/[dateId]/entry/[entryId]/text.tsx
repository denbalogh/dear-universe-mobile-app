import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View, BackHandler } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import * as _ from "lodash";
import { spacing } from "@/constants/theme";
import { useObject, useRealm } from "@realm/react";
import { formatFullDate, parseDateId } from "@/utils/date";
import DiscardDialog from "@/components/DiscardDialog/DiscardDialog";
import TitleDescriptionEditor from "@/components/TitleDescriptionEditor/TitleDescriptionEditor";
import CloseSaveButtons from "@/components/CloseSaveButtons/CloseSaveButtons";
import { Entry } from "@/models/Entry";
import { BSON } from "realm";
import {
  FOCUS_DESCRIPTION,
  FOCUS_TITLE,
} from "@/components/TitleDescriptionEditor/constants";

const EditedEntryTextScreen = () => {
  const theme = useTheme();
  const realm = useRealm();
  const navigation = useNavigation();

  const { dateId, entryId, focus } = useLocalSearchParams();

  const focusTitleInput = focus === FOCUS_TITLE.focus;
  const focusDescription = focus === FOCUS_DESCRIPTION.focus;

  const entryObject = useObject(Entry, new BSON.ObjectId(entryId as string));

  const [isDiscardDialogVisible, setIsDiscardDialogVisible] = useState(false);

  const hideDiscardDialog = () => setIsDiscardDialogVisible(false);
  const showDiscardDialog = () => setIsDiscardDialogVisible(true);

  const { title: initialTitle = "", description: initialDescription = "" } =
    entryObject || {};

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  const isTitleEdited = title !== initialTitle;
  const isDescriptionEdited = description !== initialDescription;
  const isEdited = isTitleEdited || isDescriptionEdited;

  const handleBackPress = () => {
    if (isEdited) {
      showDiscardDialog();
    } else {
      navigation.goBack();
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isEdited) {
          showDiscardDialog();
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
    }, [isEdited]),
  );

  const handleUpdateEntry = () => {
    if (entryObject === null) {
      return;
    }

    realm.write(() => {
      entryObject.title = title;
      entryObject.description = description;
    });

    navigation.goBack();
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
        }}
      />
      <View style={styles.contentWrapper}>
        <TitleDescriptionEditor
          headline={`Editing entry for ${formatFullDate(parseDateId(dateId as string))}`}
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
          bottomButtons={
            <CloseSaveButtons
              closeButton={{ onPress: handleBackPress }}
              saveButton={{ disabled: !isEdited, onPress: handleUpdateEntry }}
            />
          }
        />
        <DiscardDialog
          text="Do you wish to discard the changes?"
          isVisible={isDiscardDialogVisible}
          hideDialog={hideDiscardDialog}
          onConfirm={navigation.goBack}
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
