import React from "react";
import { Text } from "react-native-paper";
import { StyleSheet } from "react-native";
import FadeInOutTextChange from "../FadeInOutTextChange/FadeInOutTextChange";
import { phrases } from "./constants";
import { spacing } from "@/constants/theme";

const AfterEntriesMessage = () => (
  <FadeInOutTextChange phrases={phrases}>
    {(phrase) => (
      <Text variant="bodyMedium" style={styles.phrase}>
        {phrase}
      </Text>
    )}
  </FadeInOutTextChange>
);

export default AfterEntriesMessage;

const styles = StyleSheet.create({
  phrase: {
    paddingHorizontal: spacing.spaceMedium,
    textAlign: "center",
  },
});
