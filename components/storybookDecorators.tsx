import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { spacing } from "../constants/theme";

export const ScrollViewDecorator = (Story: any) => (
  <ScrollView contentContainerStyle={styles.scrollview}>
    <Story />
  </ScrollView>
);

export const ViewDecorator = (Story: any) => (
  <View style={styles.view}>
    <Story />
  </View>
);

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: spacing.spaceMedium,
  },
  scrollview: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: spacing.spaceMedium,
  },
});
