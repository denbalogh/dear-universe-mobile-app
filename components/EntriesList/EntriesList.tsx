import { useEntryCreation } from "@/contexts/EntryCreationContext";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import Entry from "../Entry/Entry";
import { spacing } from "@/constants/theme";

const EntriesList = () => {
  const { isEmpty, text } = useEntryCreation();

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <Text style={styles.universeText}>
        The universe is listening patiently. Share your day.
      </Text>
      {!isEmpty && (
        <Entry
          text={text}
          onTextPress={() => {}}
          onFeelingsPress={() => {}}
          onDeleteEntryPress={() => {}}
          feelingsActiveGroup=""
          feelingsActiveEmotions={[]}
          media={[]}
          recordingUri=""
          moveMenuItems={[]}
          editMenuItems={[]}
        />
      )}
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
