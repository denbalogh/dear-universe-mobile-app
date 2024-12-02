import React, { ReactNode } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet } from "react-native";
import { Text, TextInput, TextInputProps, useTheme } from "react-native-paper";
import { spacing } from "@/constants/theme";

export type TitleDescriptionEditorProps = {
  headline: string;
  titleTextInput: TextInputProps;
  descriptionTextInput: TextInputProps;
  bottomButtons: ReactNode;
};

const TitleDescriptionEditor = ({
  headline,
  titleTextInput,
  descriptionTextInput,
  bottomButtons,
}: TitleDescriptionEditorProps) => {
  const theme = useTheme();

  return (
    <KeyboardAvoidingView style={styles.wrapper} behavior="padding">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContentContainer}
      >
        <Text variant="titleLarge" style={styles.headline}>
          {headline}
        </Text>
        <TextInput
          label="Title"
          mode="outlined"
          multiline={true}
          style={[styles.input, { backgroundColor: theme.colors.surface }]}
          placeholder="Enter title"
          blurOnSubmit={true}
          enterKeyHint="done"
          {...titleTextInput}
        />
        <TextInput
          label="Description"
          mode="outlined"
          multiline={true}
          style={[styles.input, { backgroundColor: theme.colors.surface }]}
          scrollEnabled={false}
          placeholder="Enter description"
          {...descriptionTextInput}
        />
      </ScrollView>
      {bottomButtons}
    </KeyboardAvoidingView>
  );
};

export default TitleDescriptionEditor;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "column",
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: spacing.spaceMedium,
  },
  headline: {
    marginBottom: spacing.spaceMedium,
  },
  input: {
    marginTop: spacing.spaceMedium,
  },
});
