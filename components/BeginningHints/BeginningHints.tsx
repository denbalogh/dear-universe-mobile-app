import React from "react";
import { Text } from "react-native-paper";
import { StyleSheet, View, ViewProps } from "react-native";
import { spacing } from "@/constants/theme";
import FadeInOutTextChange from "../FadeInOutTextChange/FadeInOutTextChange";
import { phrases } from "./constants";

type Props = ViewProps;

const BeginningHints = ({ style, ...props }: Props) => (
  <View style={[styles.wrapper, style]} {...props}>
    <Text variant="labelMedium" style={styles.helperText}>
      How you might begin:
    </Text>
    <FadeInOutTextChange phrases={phrases}>
      {(phrase) => (
        <Text variant="bodyLarge" style={styles.phrase} numberOfLines={2}>
          {phrase}
        </Text>
      )}
    </FadeInOutTextChange>
  </View>
);

export default BeginningHints;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.spaceMedium,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  helperText: {
    marginBottom: spacing.spaceExtraSmall,
  },
  phrase: {
    textAlign: "center",
  },
});
