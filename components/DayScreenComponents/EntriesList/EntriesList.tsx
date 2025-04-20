import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { spacing } from "@/constants/theme";
import { useEntryDraft } from "@/contexts/EntryDraftContext";
import Entry from "../Entry/Entry";

const EntriesList = () => {
  const {
    isEmpty,
    text,
    recordingUri,
    media,
    feelingsEmotions,
    feelingsGroup,
  } = useEntryDraft();

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <Text style={styles.universeText}>
        The universe is listening patiently. Share your day.
      </Text>
      {!isEmpty && (
        <Entry
          text={text}
          recordingUri={recordingUri}
          media={media}
          feelingsEmotions={feelingsEmotions}
          feelingsGroup={feelingsGroup}
          isDraft={true}
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
