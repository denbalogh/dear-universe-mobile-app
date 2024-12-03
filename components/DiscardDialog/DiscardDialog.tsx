import { spacing } from "@/constants/theme";
import React from "react";
import { StyleSheet } from "react-native";
import { Button, Dialog, Portal, Text, useTheme } from "react-native-paper";

type Props = {
  text: string;
  isVisible: boolean;
  hideDialog: () => void;
  onConfirm: () => void;
};

const DiscardDialog = ({ text, isVisible, hideDialog, onConfirm }: Props) => {
  const theme = useTheme();

  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={hideDialog}>
        <Dialog.Content>
          <Text variant="bodyLarge">{text}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>No</Button>
          <Button
            onPress={() => {
              onConfirm();
              hideDialog();
            }}
            textColor={theme.colors.error}
            style={styles.dialogConfirmButton}
          >
            Yes
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default DiscardDialog;

const styles = StyleSheet.create({
  dialogConfirmButton: {
    marginLeft: spacing.spaceSmall,
  },
});
