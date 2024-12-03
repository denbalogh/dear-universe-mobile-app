import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { spacing } from "../constants/theme";

export const ScrollViewDecorator = (Story: any) => (
  <ScrollView contentContainerStyle={styles.scrollview}>
    <Story />
  </ScrollView>
);

export const FlexViewDecorator = (Story: any) => (
  <View style={styles.viewFlex}>
    <Story />
  </View>
);

export const ViewDecorator = (Story: any) => (
  <View style={styles.view}>
    <Story />
  </View>
);

const styles = StyleSheet.create({
  viewFlex: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: spacing.spaceMedium,
  },
  view: {
    padding: spacing.spaceMedium,
  },
  scrollview: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: spacing.spaceMedium,
  },
});
