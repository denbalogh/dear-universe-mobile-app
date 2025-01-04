import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, BackHandler } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import { spacing } from "@/constants/theme";
import { useObject, useRealm } from "@realm/react";
import { Day } from "@/models/Day";
import { formatFullDate, parseDateId } from "@/utils/date";
import TitleDescriptionEditor from "@/components/TitleDescriptionEditor/TitleDescriptionEditor";
import CloseSaveButtons from "@/components/CloseSaveButtons/CloseSaveButtons";
import { Entry } from "@/models/Entry";
import { NewEntrySearchTermParams } from "@/types/newEntryTextScreen";
import { FOCUS_DESCRIPTION } from "@/constants/screens";
import { useDiscardDialog } from "@/contexts/DiscardDialogContext";

const NewEntryTextScreen = () => {
  const theme = useTheme();
  const realm = useRealm();
  const router = useRouter();

  const { dateId, focus } = useLocalSearchParams<NewEntrySearchTermParams>();
  const dayObject = useObject(Day, dateId);

  useEffect(() => {
    if (dayObject === null) {
      realm.write(() => {
        realm.create(Day, {
          _id: dateId,
        });
      });
    }
  }, [dateId, dayObject, realm]);

  const focusDescription = focus === FOCUS_DESCRIPTION.focus;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const isTitleEdited = title !== "";
  const isDescriptionEdited = description !== "";
  const isEdited = isTitleEdited || isDescriptionEdited;

  const { showDiscardDialog } = useDiscardDialog();

  const handleShowDiscardDialog = useCallback(() => {
    showDiscardDialog({
      message: "Do you wish to discard the entry?",
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

    router.dismissTo({
      pathname: "/day/[dateId]",
      params: { dateId },
    });
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
          headline="Creating new entry"
          date={formatFullDate(parseDateId(dateId))}
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
