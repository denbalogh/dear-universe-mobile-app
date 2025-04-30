import { spacing } from "@/common/constants/theme";
import database from "@/common/models/db";
import { useDay } from "@/common/providers/DayProvider";
import { useSnackbar } from "@/common/providers/SnackbarProvider";
import { isEqual } from "lodash";
import React, { memo, useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";

const TitleInput = () => {
  const { showSnackbar } = useSnackbar();
  const day = useDay();
  const [value, setValue] = useState<string | undefined>(day.title);

  const handleOnSubmit = useCallback(async () => {
    if (isEqual(value, day.title)) return;

    await database.write(async () => {
      await day.update((d) => {
        d.title = value;
      });
    });

    showSnackbar("Title for the day was updated");
  }, [value, day, showSnackbar]);

  return (
    <TextInput
      label="Title for the day"
      value={value}
      onChangeText={setValue}
      multiline={true}
      enterKeyHint="done"
      submitBehavior="blurAndSubmit"
      onEndEditing={handleOnSubmit}
      style={styles.dayTitleInput}
      mode="outlined"
      autoFocus={!day.title}
      contentStyle={{ marginTop: 5 }}
    />
  );
};

export default memo(TitleInput);

const styles = StyleSheet.create({
  dayTitleInput: {
    margin: spacing.spaceSmall,
    zIndex: 0,
  },
});
