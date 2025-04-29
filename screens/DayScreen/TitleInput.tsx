import { spacing } from "@/common/constants/theme";
import { isEqual } from "lodash";
import React, { memo, useState } from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";

type Props = {
  defaultValue: string;
  onSubmit: (value: string) => void;
};

const TitleInput = ({ defaultValue, onSubmit }: Props) => {
  const [value, setValue] = useState<string>(defaultValue);

  const handleOnSubmit = () => {
    if (!isEqual(value, defaultValue)) {
      onSubmit(value);
    }
  };

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
      autoFocus={!defaultValue}
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
