import { spacing } from "@/constants/theme";
import React from "react";
import { StyleSheet } from "react-native";
import { Text as PaperText, TouchableRipple } from "react-native-paper";

type Props = {
  text: string;
  onPress: () => void;
};

const Text = ({ text, onPress }: Props) => {
  return (
    <TouchableRipple
      onPress={onPress}
      style={styles.wrapper}
      accessibilityLabel="Edit text"
    >
      <PaperText variant="bodyMedium">{text}</PaperText>
    </TouchableRipple>
  );
};

export default Text;

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: spacing.spaceExtraSmall,
    marginVertical: spacing.spaceExtraSmall,
  },
});
