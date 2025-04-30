import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { spacing } from "@/common/constants/theme";
import Entry from "./Entry/Entry";
import { useEntryEditor } from "@/common/providers/EntryEditorProvider";

const EntriesList = () => {
  const {
    entryId,
    isEmpty,
    text,
    recordingUri,
    media,
    feelingsEmotions,
    feelingsGroup,
  } = useEntryEditor();

  const isDraft = entryId === null;

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <Text style={styles.universeText}>
        The universe is listening. Share your day.
      </Text>
      {isDraft && !isEmpty && (
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
