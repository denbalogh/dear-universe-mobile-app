import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View, BackHandler } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import { spacing } from "@/constants/theme";
import { useObject, useRealm } from "@realm/react";
import { Day } from "@/models/Day";
import { formatFullDate, parseDateId } from "@/utils/date";
import DiscardDialog from "@/components/DiscardDialog/DiscardDialog";
import TitleDescriptionEditor from "@/components/TitleDescriptionEditor/TitleDescriptionEditor";
import CloseSaveButtons from "@/components/CloseSaveButtons/CloseSaveButtons";
import { Entry } from "@/models/Entry";
import { FOCUS_DESCRIPTION } from "@/components/TitleDescriptionEditor/constants";
import { NewEntrySearchTermParams } from "@/types/newEntryTextScreen";

const NewEntryTextScreen = () => {
  const theme = useTheme();
  const realm = useRealm();
  const router = useRouter();

  const { dateId, focus } = useLocalSearchParams<NewEntrySearchTermParams>();
  const dayObject = useObject(Day, dateId);

  const focusDescription = focus === FOCUS_DESCRIPTION.focus;

  const [isDiscardDialogVisible, setIsDiscardDialogVisible] = useState(false);

  const hideDiscardDialog = () => setIsDiscardDialogVisible(false);
  const showDiscardDialog = () => setIsDiscardDialogVisible(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const isTitleEdited = title !== "";
  const isDescriptionEdited = description !== "";
  const isEdited = isTitleEdited || isDescriptionEdited;

  const handleBackPress = () => {
    if (isEdited) {
      showDiscardDialog();
    } else {
      router.back();
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

  const handleCreateEntry = () => {
    if (dayObject === null) {
      return;
    }

    realm.write(() => {
      const entry = realm.create(Entry, {
        title,
        description,
        day: dayObject,
      });

      dayObject.entryObjects.push(entry);
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
        }}
      />
      <View style={styles.contentWrapper}>
        <TitleDescriptionEditor
          headline={`Creating entry for ${formatFullDate(parseDateId(dateId))}`}
          titleTextInput={{ value: title, onChangeText: setTitle }}
          descriptionTextInput={{
            value: description,
            onChangeText: setDescription,
            autoFocus: focusDescription,
          }}
          bottomComponent={
            <CloseSaveButtons
              closeButton={{ onPress: handleBackPress }}
              saveButton={{ disabled: !isEdited, onPress: handleCreateEntry }}
            />
          }
        />
        <DiscardDialog
          text="Do you wish to discard the entry?"
          isVisible={isDiscardDialogVisible}
          hideDialog={hideDiscardDialog}
          onConfirm={router.back}
        />
      </View>
    </View>
  );
};

export default NewEntryTextScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    padding: spacing.spaceMedium,
  },
});
