import { spacing } from "@/constants/theme";
import React from "react";
import { StyleSheet } from "react-native";
import { Button, Dialog, Portal, Text } from "react-native-paper";

type Props = {
  text: string;
  isVisible: boolean;
  hideDialog: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
};

const ConfirmDialog = ({
  text,
  isVisible,
  hideDialog,
  onConfirm,
  confirmLabel = "Yes",
  cancelLabel = "No",
}: Props) => {
  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={hideDialog}>
        <Dialog.Content>
          <Text variant="bodyLarge">{text}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>{cancelLabel}</Button>
          <Button
            onPress={() => {
              onConfirm();
              hideDialog();
            }}
            style={styles.dialogConfirmButton}
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
