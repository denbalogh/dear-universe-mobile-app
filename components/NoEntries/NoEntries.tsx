import React from "react";
import { Text } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { spacing } from "@/constants/theme";
import FadeInOutTextChange from "../FadeInOutTextChange/FadeInOutTextChange";
import { phrases } from "./constants";

const NoEntries = () => (
  <View style={styles.wrapper}>
    <Text variant="titleLarge" style={styles.title}>
      Here's a place to describe your day.
    </Text>
    <Text variant="labelMedium" style={styles.helperText}>
      How you might begin:
    </Text>
    <FadeInOutTextChange phrases={phrases}>
      {(phrase) => (
        <Text variant="bodyLarge" style={styles.phrase}>
          {phrase}
        </Text>
      )}
    </FadeInOutTextChange>
  </View>
);

export default NoEntries;

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: spacing.spaceSmall,
    alignItems: "center",
  },
  title: {
    marginVertical: spacing.spaceLarge,
    textAlign: "center",
  },
  helperText: {
    marginBottom: spacing.spaceExtraSmall,
  },
  phrase: {
    textAlign: "center",
  },
});
