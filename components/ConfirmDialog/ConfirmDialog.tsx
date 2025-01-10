import { spacing } from "@/constants/theme";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import React from "react";
import { StyleSheet } from "react-native";
import { Button, Dialog, Portal, Text } from "react-native-paper";

export type ConfirmDialogButtonType = "positive" | "negative";

type Props = {
  text: string;
  isVisible: boolean;
  hideDialog: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmType?: ConfirmDialogButtonType;
};

const ConfirmDialog = ({
  text,
  isVisible,
  hideDialog,
  onConfirm,
  confirmLabel = "Yes",
  cancelLabel = "No",
  confirmType = "negative",
}: Props) => {
  const theme = useCustomTheme();

  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={hideDialog}>
        <Dialog.Content>
          <Text variant="bodyLarge">{text}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog} textColor={theme.colors.secondary}>
            {cancelLabel}
          </Button>
          <Button
            onPress={() => {
              onConfirm();
              hideDialog();
            }}
            style={styles.dialogConfirmButton}
            textColor={
              confirmType === "positive"
                ? theme.colors.primary
                : theme.colors.error
            }
          >
            {confirmLabel}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default ConfirmDialog;

const styles = StyleSheet.create({
  dialogConfirmButton: {
    marginLeft: spacing.spaceSmall,
  },
});
