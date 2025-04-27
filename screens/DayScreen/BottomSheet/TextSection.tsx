import { roundness, spacing } from "@/common/constants/theme";
import { useEntryDraft } from "@/contexts/EntryDraftContext";
import { useCustomTheme } from "@/common/hooks/useCustomTheme";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React from "react";
import { StyleSheet } from "react-native";

const TextSection = () => {
  const theme = useCustomTheme();
  const { text, setText } = useEntryDraft();

  return (
    <BottomSheetTextInput
      placeholder="Type it out..."
      value={text}
      onChangeText={setText}
      scrollEnabled={false}
      style={styles.input}
      multiline={true}
      cursorColor={theme.colors.secondary}
      selectionColor={theme.colors.secondaryContainer}
      selectionHandleColor={theme.colors.secondary}
      submitBehavior="blurAndSubmit"
    />
  );
};

export default TextSection;

const styles = StyleSheet.create({
  input: {
    padding: spacing.spaceSmall,
    borderRadius: roundness,
    textAlignVertical: "top",
  },
});
