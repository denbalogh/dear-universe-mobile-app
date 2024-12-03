import React, { ReactNode } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet } from "react-native";
import { Text, TextInput, TextInputProps, useTheme } from "react-native-paper";
import { spacing } from "@/constants/theme";

export type TitleDescriptionEditorProps = {
  headline: string;
  titleTextInput: TextInputProps;
  descriptionTextInput: TextInputProps;
  bottomComponent: ReactNode;
};

const TitleDescriptionEditor = ({
  headline,
  titleTextInput,
  descriptionTextInput,
  bottomComponent,
}: TitleDescriptionEditorProps) => {
  const theme = useTheme();

  return (
    <KeyboardAvoidingView style={styles.wrapper} behavior="padding">
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.scrollView}>
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
      {bottomComponent}
    </KeyboardAvoidingView>
  );
};

export default TitleDescriptionEditor;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "column",
    flex: 1,
  },
  scrollView: {
    marginBottom: spacing.spaceMedium,
    flex: 1,
  },
  headline: {
    marginBottom: spacing.spaceMedium,
  },
  input: {
    marginTop: spacing.spaceMedium,
  },
});
