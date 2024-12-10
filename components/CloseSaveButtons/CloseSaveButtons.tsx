import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { Button, ButtonProps, FAB, FABProps } from "react-native-paper";

type Props = {
  closeButton: Omit<ButtonProps, "children">;
  saveButton: Omit<FABProps, "label">;
} & ViewProps;

const CloseSaveButtons = ({
  closeButton,
  saveButton,
  style,
  ...props
}: Props) => (
  <View style={[styles.wrapper, style]} {...props}>
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
