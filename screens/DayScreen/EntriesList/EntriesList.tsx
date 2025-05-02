import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { spacing } from "@/common/constants/theme";
import Entry from "./Entry/Entry";
import { useDay } from "@/common/providers/DayProvider";
import EntryDraft from "./Entry/EntryDraft";

const EntriesList = () => {
  const { entries } = useDay();

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <Text style={styles.universeText}>
        The universe is listening. Share your day.
      </Text>
      <EntryDraft />
      {entries.map((entry) => (
        <Entry key={entry.id} entry={entry} />
      ))}
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
