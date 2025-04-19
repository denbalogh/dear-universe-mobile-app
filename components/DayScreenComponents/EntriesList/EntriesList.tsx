import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { spacing } from "@/constants/theme";

const EntriesList = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <Text style={styles.universeText}>
        The universe is listening patiently. Share your day.
      </Text>
    </ScrollView>
  );
};

export default EntriesList;

const styles = StyleSheet.create({
  scrollViewContent: {
    padding: spacing.spaceSmall,
  },
  universeText: {
    textAlign: "center",
    marginBottom: spacing.spaceSmall,
  },
});
