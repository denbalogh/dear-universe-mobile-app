import React, { useState } from "react";
import ImagesSection from "@/components/CreateEditEntry/ImagesSection";
import RecordingSection from "@/components/CreateEditEntry/RecordingSection";
import TextSection from "@/components/CreateEditEntry/TextSection";
import VideosSection from "@/components/CreateEditEntry/VideosSection";
import SectionHeadline from "@/components/CreateEditEntry/SectionHeadline";
import { spacing } from "@/constants/theme";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import { ScrollView, StyleSheet, View } from "react-native";
import { FAB } from "react-native-paper";
import FeelingsSection from "@/components/CreateEditEntry/FeelingsSection";
import { EntryData } from "../Entry/Entry";

type Props = {
  mode: "create" | "edit";
  formattedDate: string;
  onSave: (entry: EntryData) => void;
} & EntryData;

const CreateEditEntry = ({
  mode,
  formattedDate,
  title: initialTitle,
  description: initialDescription,
  recordingUri: initialRecordingUri,
  imagesUri: initialImagesUri,
  videosWithThumbnail: initialVideosWithThumbnail,
  feelingsActiveGroup: initialFeelingsActiveGroup,
  feelingsActiveEmotions: initialFeelingsActiveEmotions,
  onSave,
}: Props) => {
  const theme = useCustomTheme();

  const isCreateMode = mode === "create";
  const isEditMode = mode === "edit";

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [recordingUri, setRecordingUri] = useState(initialRecordingUri);
  const [imagesUri, setImagesUri] = useState(initialImagesUri);
  const [videosWithThumbnail, setVideosWithThumbnail] = useState(
    initialVideosWithThumbnail,
  );
  const [activeGroup, setActiveGroup] = useState(initialFeelingsActiveGroup);
  const [activeEmotions, setActiveEmotions] = useState(
    initialFeelingsActiveEmotions,
  );

  const handleOnSave = () => {
    onSave({
      title,
      description,
      recordingUri,
      imagesUri,
      videosWithThumbnail,
      feelingsActiveGroup: activeGroup,
      feelingsActiveEmotions: activeEmotions,
    });
  };

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.surface }]}>
      <ScrollView
        stickyHeaderIndices={[0, 2, 4, 6, 8]}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollViewContentContainer}
      >
        <SectionHeadline
          headline={isCreateMode ? "Creating entry" : "Editing entry"}
          superHeadline={formattedDate}
          headlineVariant="displaySmall"
        />
        <TextSection
          title={title}
          description={description}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          style={styles.sectionWrapper}
        />
        <SectionHeadline headline="Recording" superHeadline={formattedDate} />
        <RecordingSection
          recordingUri={recordingUri}
          onRecordingDone={setRecordingUri}
          style={styles.sectionWrapper}
        />
        <SectionHeadline headline="Images" superHeadline={formattedDate} />
        <ImagesSection
          imagesUri={imagesUri}
          onImagesChange={setImagesUri}
          style={styles.sectionWrapper}
        />
        <SectionHeadline headline="Videos" superHeadline={formattedDate} />
        <VideosSection
          videosWithThumbnail={videosWithThumbnail}
          onVideosChange={setVideosWithThumbnail}
          style={styles.sectionWrapper}
        />
        <SectionHeadline headline="Feelings" superHeadline={formattedDate} />
        <FeelingsSection
          activeGroup={activeGroup}
          activeEmotions={activeEmotions}
          onActiveGroupChange={setActiveGroup}
          onActiveEmotionsChange={setActiveEmotions}
          style={styles.sectionWrapper}
        />
      </ScrollView>
      <View style={styles.saveButtonWrapper}>
        <FAB label="Save" variant="tertiary" onPress={handleOnSave} />
      </View>
    </View>
  );
};

export default CreateEditEntry;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollViewContentContainer: {
    paddingBottom: 100,
  },
  sectionWrapper: {
    padding: spacing.spaceMedium,
    paddingVertical: spacing.spaceLarge,
  },
  saveButtonWrapper: {
    position: "absolute",
    margin: spacing.spaceMedium,
    bottom: spacing.spaceSmall,
    left: 0,
    right: 0,
  },
});
