import { spacing } from "@/constants/theme";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { FAB, FABProps, Text } from "react-native-paper";

type FABPropsWithoutIconAndLabel = Omit<FABProps, "icon" | "label">;

type Props = {
  addTextButton: FABPropsWithoutIconAndLabel;
  addRecordingButton: FABPropsWithoutIconAndLabel;
  addMediaButton: FABPropsWithoutIconAndLabel;
  showText?: boolean;
} & ViewProps;

const CTAButtons = ({
  addRecordingButton,
  addTextButton,
  addMediaButton,
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
        <FAB
          icon="pen-plus"
          variant="tertiary"
          style={styles.button}
          {...addTextButton}
        />
        <FAB
          icon="microphone-plus"
          variant="tertiary"
          style={styles.button}
          {...addRecordingButton}
        />
        <FAB
          icon="image-plus"
          variant="tertiary"
          style={styles.button}
          {...addMediaButton}
        />
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
  button: {
    marginHorizontal: spacing.spaceSmall,
  },
});
