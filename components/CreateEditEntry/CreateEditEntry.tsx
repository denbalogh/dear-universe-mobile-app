import React, { useEffect, useRef, useState } from "react";
import ImagesSection from "@/components/CreateEditEntry/ImagesSection";
import RecordingSection from "@/components/CreateEditEntry/RecordingSection";
import TextSection from "@/components/CreateEditEntry/TextSection";
import VideosSection from "@/components/CreateEditEntry/VideosSection";
import SectionHeadline from "@/components/CreateEditEntry/SectionHeadline";
import { spacing } from "@/constants/theme";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import { LayoutChangeEvent, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, FAB } from "react-native-paper";
import FeelingsSection from "@/components/CreateEditEntry/FeelingsSection";
import { EntryData } from "../Entry/Entry";
import useIsKeyboardOpen from "@/hooks/useIsKeyboardOpen";
import { Stack } from "expo-router";
import { isEqual } from "lodash";

type LayoutParts =
  | "mainHeadline"
  | "textSection"
  | "recordingHeadline"
  | "recordingSection"
  | "imagesHeadline"
  | "imagesSection"
  | "videosHeadline"
  | "videosSection";

type Props = {
  mode: "create" | "edit";
  formattedDate: string;
  onSave: (entry: EntryData) => void;
  focusTitle?: boolean;
  focusDescription?: boolean;
  scrollToRecording?: boolean;
  scrollToImages?: boolean;
  scrollToVideos?: boolean;
  scrollToFeelings?: boolean;
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
  focusTitle,
  focusDescription,
  scrollToFeelings,
  scrollToImages,
  scrollToRecording,
  scrollToVideos,
  onSave,
}: Props) => {
  const theme = useCustomTheme();
  const isKeyboardOpen = useIsKeyboardOpen();

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

  const [sectionsHeight, setSectionsHeight] = useState<
    Record<LayoutParts, number>
  >({
    mainHeadline: 0,
    textSection: 0,
    recordingHeadline: 0,
    recordingSection: 0,
    imagesHeadline: 0,
    imagesSection: 0,
    videosHeadline: 0,
    videosSection: 0,
  });

  const handleSetSectionHeight =
    (part: LayoutParts) =>
    ({
      nativeEvent: {
        layout: { height },
      },
    }: LayoutChangeEvent) => {
      setSectionsHeight((prev) => ({
        ...prev,
        [part]: height,
      }));
    };

  const scrollViewRef = useRef<ScrollView>(null);

  const handleScrollToOffset = (offset: number) => {
    scrollViewRef.current?.scrollTo({ y: offset, animated: true });
  };

  useEffect(() => {
    // Continue only if all sections have been measured
    for (const value of Object.values(sectionsHeight)) {
      if (value === 0) {
        return;
      }
    }

    const {
      mainHeadline,
      textSection,
      recordingHeadline,
      recordingSection,
      imagesHeadline,
      imagesSection,
      videosHeadline,
      videosSection,
    } = sectionsHeight;

    if (scrollToRecording) {
      handleScrollToOffset(mainHeadline + textSection);
    } else if (scrollToImages) {
      handleScrollToOffset(
        mainHeadline + textSection + recordingHeadline + recordingSection,
      );
    } else if (scrollToVideos) {
      handleScrollToOffset(
        mainHeadline +
          textSection +
          recordingHeadline +
          recordingSection +
          imagesHeadline +
          imagesSection,
      );
    } else if (scrollToFeelings) {
      handleScrollToOffset(
        mainHeadline +
          textSection +
          recordingHeadline +
          recordingSection +
          imagesHeadline +
          imagesSection +
          videosHeadline +
          videosSection,
      );
    }
  }, [
    sectionsHeight,
    scrollToRecording,
    scrollToImages,
    scrollToVideos,
    scrollToFeelings,
  ]);

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

  const isEdited =
    !isEqual(title, initialTitle) ||
    !isEqual(description, initialDescription) ||
    !isEqual(recordingUri, initialRecordingUri) ||
    !isEqual(imagesUri, initialImagesUri) ||
    !isEqual(videosWithThumbnail, initialVideosWithThumbnail) ||
    !isEqual(activeGroup, initialFeelingsActiveGroup) ||
    !isEqual(activeEmotions, initialFeelingsActiveEmotions);

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.surface }]}>
      <Stack.Screen
        options={{
          header: () => (
            <Appbar.Header>
              <Appbar.BackAction onPress={() => {}} />
            </Appbar.Header>
          ),
          navigationBarColor: theme.colors.surface,
        }}
      />
      <ScrollView
        ref={scrollViewRef}
        stickyHeaderIndices={[0, 2, 4, 6, 8]}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollViewContentContainer}
      >
        <SectionHeadline
          headline={isCreateMode ? "Creating entry" : "Editing entry"}
          superHeadline={formattedDate}
          headlineVariant="displaySmall"
          onLayout={handleSetSectionHeight("mainHeadline")}
        />
        <TextSection
          titleInputProps={{
            value: title,
            onChangeText: setTitle,
            autoFocus: focusTitle,
          }}
          descriptionInputProps={{
            value: description,
            onChangeText: setDescription,
            autoFocus: focusDescription,
          }}
          style={styles.sectionWrapper}
          onLayout={handleSetSectionHeight("textSection")}
        />
        <SectionHeadline
          headline="Recording"
          superHeadline={formattedDate}
          onLayout={handleSetSectionHeight("recordingHeadline")}
        />
        <RecordingSection
          recordingUri={recordingUri}
          onRecordingDone={setRecordingUri}
          style={styles.sectionWrapper}
          onLayout={handleSetSectionHeight("recordingSection")}
        />
        <SectionHeadline
          headline="Images"
          superHeadline={formattedDate}
          onLayout={handleSetSectionHeight("imagesHeadline")}
        />
        <ImagesSection
          imagesUri={imagesUri}
          onImagesChange={setImagesUri}
          style={styles.sectionWrapper}
          onLayout={handleSetSectionHeight("imagesSection")}
        />
        <SectionHeadline
          headline="Videos"
          superHeadline={formattedDate}
          onLayout={handleSetSectionHeight("videosHeadline")}
        />
        <VideosSection
          videosWithThumbnail={videosWithThumbnail}
          onVideosChange={setVideosWithThumbnail}
          style={styles.sectionWrapper}
          onLayout={handleSetSectionHeight("videosSection")}
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
      {!isKeyboardOpen && (
        <View style={styles.saveButtonWrapper}>
          <FAB
            label="Save"
            variant="tertiary"
            onPress={handleOnSave}
            disabled={!isEdited}
          />
        </View>
      )}
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
