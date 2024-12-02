import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, HelperText, TextInput, useTheme } from "react-native-paper";
import * as _ from "lodash";
import { formatFullDate, parseDateId } from "@/utils/date";
import { spacing } from "@/constants/theme";
import CTAButtons from "@/components/CTAButtons/CTAButtons";
import { useObject, useRealm } from "@realm/react";
import { Day } from "@/models/Day";
import EntriesList from "@/components/EntriesList/EntriesList";
import { useSnackbar } from "@/contexts/SnackbarContext/SnackbarContext";

const DayScreen = () => {
  const theme = useTheme();
  const realm = useRealm();
  const router = useRouter();

  const { showSnackbar } = useSnackbar();

  const { dateId } = useLocalSearchParams();
  const dayObject = useObject(Day, dateId as string);

  const [title, setTitle] = useState(dayObject?.title || "");

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

    showSnackbar("Title for the day was saved.");
  };

  const isTitleEdited = !_.isEqual(title, dayObject?.title);
  const editedUnderlineColor = isTitleEdited
    ? theme.colors.tertiary
    : undefined;

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.colors.surface }]}>
      <Stack.Screen
        options={{
          header: ({ navigation }) => (
            <Appbar.Header>
              <Appbar.BackAction onPress={navigation.goBack} />
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
          onPress: () => router.navigate("./entry/new/text"),
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
    padding: spacing.spaceSmall,
  },
  bottomButtons: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: spacing.spaceLarge,
  },
});
