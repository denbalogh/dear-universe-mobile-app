import { spacing } from "@/constants/theme";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { FAB, FABProps, Text } from "react-native-paper";

type FABPropsWithoutIconAndLabel = Omit<FABProps, "icon" | "label">;

type Props = {
  addTextEntryButton: FABPropsWithoutIconAndLabel;
  addRecordingEntryButton: FABPropsWithoutIconAndLabel;
  addImageEntryButton: FABPropsWithoutIconAndLabel;
  showText?: boolean;
} & ViewProps;

const CTAButtons = ({
  addImageEntryButton,
  addRecordingEntryButton,
  addTextEntryButton,
  showText,
  style,
  ...props
}: Props) => {
  return (
    <View style={[styles.wrapper, style]} {...props}>
      {showText && (
        <Text style={styles.text} variant="titleMedium">
          You can add multiple entries with text, recording, images and videos.
        </Text>
      )}
      <View style={styles.buttonsWrapper}>
        <FAB icon="pen-plus" variant="tertiary" {...addTextEntryButton} />
        <FAB
          icon="microphone-plus"
          style={styles.centerButton}
          variant="tertiary"
          {...addRecordingEntryButton}
        />
        <FAB icon="image-plus" variant="tertiary" {...addImageEntryButton} />
      </View>
    </View>
  );
};

export default CTAButtons;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "column",
  },
  text: {
    textAlign: "center",
    marginBottom: spacing.spaceMedium,
    paddingHorizontal: spacing.spaceMedium,
  },
  buttonsWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  centerButton: {
    marginHorizontal: spacing.spaceLarge,
  },
});
