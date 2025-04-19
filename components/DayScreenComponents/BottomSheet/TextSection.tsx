import { roundness, spacing } from "@/constants/theme";
import { useEntryCreation } from "@/contexts/EntryCreationContext";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import { BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet";
import React from "react";
import { StyleSheet } from "react-native";

const TextSection = () => {
  const theme = useCustomTheme();
  const { text, setText } = useEntryCreation();

  return (
    <BottomSheetView>
      <BottomSheetTextInput
        placeholder="Type it out..."
        value={text}
        onChangeText={setText}
        scrollEnabled={false}
        style={styles.input}
        cursorColor={theme.colors.secondary}
        selectionColor={theme.colors.secondaryContainer}
        selectionHandleColor={theme.colors.secondary}
      />
    </BottomSheetView>
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
