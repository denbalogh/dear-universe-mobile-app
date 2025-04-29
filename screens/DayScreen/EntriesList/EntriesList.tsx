import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { spacing } from "@/common/constants/theme";
import { useEntryDraft } from "@/contexts/EntryDraftContext";
import Entry from "./Entry/Entry";
import { Media } from "@/common/types/Media";
import { useLocalSearchParams } from "expo-router";
import { DaySearchTermParams } from "../types";

const EntriesList = () => {
  const {
    isEmpty,
    text,
    recordingUri,
    media,
    feelingsEmotions,
    feelingsGroup,
  } = useEntryDraft();

  const { dateId } = useLocalSearchParams<DaySearchTermParams>();

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
      {/* {dayObject?.entryObjects.map(
        ({
          _id,
          text,
          recordingUri,
          media,
          feelingsEmotions,
          feelingsGroup,
        }) => (
          <Entry
            key={_id.toString()}
            text={text}
            recordingUri={recordingUri}
            media={media as Media[]}
            feelingsEmotions={feelingsEmotions}
            feelingsGroup={feelingsGroup}
          />
        ),
      )} */}
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
