import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { TextInput } from "react-native-paper";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import { spacing } from "@/constants/theme";

type Props = {
  title: string;
  description: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
} & ViewProps;

const TextSection = ({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
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
        value={title}
        onChangeText={onTitleChange}
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
        value={description}
        onChangeText={onDescriptionChange}
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
