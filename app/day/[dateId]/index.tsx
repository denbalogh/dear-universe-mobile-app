import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import React, { useEffect, useState } from "react";
import { BackHandler, StyleSheet, View } from "react-native";
import { Appbar, HelperText, TextInput, useTheme } from "react-native-paper";
import { formatFullDate, parseDateId } from "@/utils/date";
import { spacing } from "@/constants/theme";
import CTAButtons from "@/components/CTAButtons/CTAButtons";
import { useObject, useRealm } from "@realm/react";
import { Day } from "@/models/Day";
import EntriesList from "@/components/EntriesList/EntriesList";
import { FOCUS_DESCRIPTION } from "@/components/TitleDescriptionEditor/constants";
import DiscardDialog from "@/components/DiscardDialog/DiscardDialog";

const DayScreen = () => {
  const theme = useTheme();
  const realm = useRealm();
  const router = useRouter();

  const { dateId } = useLocalSearchParams();
  const dayObject = useObject(Day, dateId as string);

  const [title, setTitle] = useState(dayObject?.title || "");
  const [isDiscardDialogVisible, setIsDiscardDialogVisible] = useState(false);

  const showDiscardDialog = () => setIsDiscardDialogVisible(true);
  const hideDiscardDialog = () => setIsDiscardDialogVisible(false);

  useEffect(() => {
    if (dayObject === null) {
      realm.write(() => {
        realm.create(Day, {
          _id: dateId as string,
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

  const isTitleEdited = title !== dayObject?.title;
  const editedUnderlineColor = isTitleEdited
    ? theme.colors.tertiary
    : undefined;

  const handleGoBack = () => {
    if (isTitleEdited) {
      showDiscardDialog();
    } else {
      router.back();
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isTitleEdited) {
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
    }, [isTitleEdited]),
  );

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.colors.surface }]}>
      <Stack.Screen
        options={{
          header: () => (
            <Appbar.Header>
              <Appbar.BackAction onPress={handleGoBack} />
              <Appbar.Content
                title={formatFullDate(parseDateId(dateId as string))}
              />
            </Appbar.Header>
          ),
        }}
      />
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
          <HelperText type="info" visible={isTitleEdited}>
            To save the title, press done on the keyboard.
          </HelperText>
        )}
      </View>
      <EntriesList entries={dayObject?.entryObjects} bottomPadding={true} />
      <CTAButtons
        style={styles.bottomButtons}
        addImageEntryButton={{ onPress: () => {} }}
        addRecordingEntryButton={{ onPress: () => {} }}
        addTextEntryButton={{
          onPress: () =>
            router.navigate({
              pathname: "./entry/new/text",
              params: FOCUS_DESCRIPTION,
            }),
        }}
      />
      <DiscardDialog
        text="Do you wish to discard changes to title?"
        isVisible={isDiscardDialogVisible}
        hideDialog={hideDiscardDialog}
        onConfirm={router.back}
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
    padding: spacing.spaceSmall,
  },
  bottomButtons: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: spacing.spaceLarge,
  },
});
