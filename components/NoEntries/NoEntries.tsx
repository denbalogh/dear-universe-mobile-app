import React from "react";
import { Text } from "react-native-paper";
import { StyleSheet, View, ViewProps } from "react-native";
import { spacing } from "@/constants/theme";
import FadeInOutTextChange from "../FadeInOutTextChange/FadeInOutTextChange";
import { phrases } from "./constants";

type Props = ViewProps;

const NoEntries = ({ style, ...props }: Props) => (
  <View style={[styles.wrapper, style]} {...props}>
    <View style={styles.titleWrapper}>
      <Text variant="titleLarge" style={styles.title}>
        Here's a place to describe your day.
      </Text>
    </View>
    <View style={styles.helperTextWrapper}>
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
  </View>
);

export default NoEntries;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginVertical: spacing.spaceSmall,
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    marginVertical: spacing.spaceLarge,
    textAlign: "center",
  },
  helperTextWrapper: {
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
