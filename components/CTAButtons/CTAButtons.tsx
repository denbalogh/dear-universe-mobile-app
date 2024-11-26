import { spacing } from "@/constants/theme";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { FAB, FABProps } from "react-native-paper";

type FABPropsWithoutIconAndLabel = Omit<FABProps, "icon" | "label">;

type Props = {
  addTextEntryButton: FABPropsWithoutIconAndLabel;
  addRecordingEntryButton: FABPropsWithoutIconAndLabel;
  addImageEntryButton: FABPropsWithoutIconAndLabel;
} & ViewProps;

const CTAButtons = ({
  addImageEntryButton,
  addRecordingEntryButton,
  addTextEntryButton,
  style,
  ...props
}: Props) => {
  return (
    <View style={[styles.wrapper, style]} {...props}>
      <FAB icon="pen-plus" variant="tertiary" {...addTextEntryButton} />
      <FAB
        icon="microphone-plus"
        style={styles.centerButton}
        variant="tertiary"
        {...addRecordingEntryButton}
      />
      <FAB icon="image-plus" variant="tertiary" {...addImageEntryButton} />
    </View>
  );
};

export default CTAButtons;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  centerButton: {
    marginHorizontal: spacing.spaceLarge,
  },
});
