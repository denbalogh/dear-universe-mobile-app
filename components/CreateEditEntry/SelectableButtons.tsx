import { spacing } from "@/constants/theme";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import React from "react";
import { StyleSheet } from "react-native";
import { View } from "react-native";
import {
  Button,
  ButtonProps,
  IconButton,
  IconButtonProps,
} from "react-native-paper";

type Props = {
  selectAllButtonProps: Omit<ButtonProps, "children">;
  deleteSelectedButtonProps: Omit<ButtonProps, "children">;
  cancelButtonProps: Omit<IconButtonProps, "icon">;
};

const SelectableButtons = ({
  selectAllButtonProps,
  deleteSelectedButtonProps,
  cancelButtonProps,
}: Props) => {
  const theme = useCustomTheme();

  return (
    <View style={styles.selectionButtonsWrapper}>
      <Button
        style={styles.selectionButton}
        mode="outlined"
        {...selectAllButtonProps}
      >
        Select all
      </Button>
      <Button
        style={styles.selectionButton}
        mode="outlined"
        textColor={theme.colors.error}
        {...deleteSelectedButtonProps}
      >
        Delete selected
      </Button>
      <IconButton {...cancelButtonProps} icon="cancel" />
    </View>
  );
};

export default SelectableButtons;

const styles = StyleSheet.create({
  selectionButtonsWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.spaceMedium,
  },
  selectionButton: {
    flex: 1,
    marginRight: spacing.spaceSmall,
  },
});
