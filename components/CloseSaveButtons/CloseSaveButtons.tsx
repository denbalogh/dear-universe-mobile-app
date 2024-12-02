import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, ButtonProps, FAB, FABProps } from "react-native-paper";

type Props = {
  closeButton: Omit<ButtonProps, "children">;
  saveButton: Omit<FABProps, "label">;
};

const CloseSaveButtons = ({ closeButton, saveButton }: Props) => (
  <View style={styles.wrapper}>
    <Button style={styles.button} {...closeButton}>
      Close
    </Button>
    <FAB
      label="Save"
      variant="tertiary"
      style={styles.button}
      {...saveButton}
    />
  </View>
);

export default CloseSaveButtons;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    width: "48%",
  },
});
