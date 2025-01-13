import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { TextInput, TextInputProps } from "react-native-paper";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import { spacing } from "@/constants/theme";

type Props = {
  titleInputProps: TextInputProps;
  descriptionInputProps: TextInputProps;
} & ViewProps;

const TextSection = ({
  titleInputProps,
  descriptionInputProps,
  ...viewProps
}: Props) => {
  const theme = useCustomTheme();

  return (
    <View {...viewProps}>
      <TextInput
        label="Title"
        mode="outlined"
        multiline={true}
        style={{ backgroundColor: theme.colors.surface }}
        contentStyle={styles.inputContentStyle}
        placeholder="Enter title"
        submitBehavior="blurAndSubmit"
        enterKeyHint="done"
        {...titleInputProps}
      />
      <TextInput
        label="Description"
        mode="outlined"
        multiline={true}
        style={[styles.bottomInput, { backgroundColor: theme.colors.surface }]}
        contentStyle={styles.inputContentStyle}
        scrollEnabled={false}
        placeholder="Enter description"
        submitBehavior="blurAndSubmit"
        enterKeyHint="done"
        {...descriptionInputProps}
      />
    </View>
  );
};

export default TextSection;

const styles = StyleSheet.create({
  bottomInput: {
    marginTop: spacing.spaceMedium,
  },
  inputContentStyle: {
    marginTop: 5,
  },
});
