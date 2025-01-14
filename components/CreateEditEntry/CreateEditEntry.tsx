import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ImagesSection from "@/components/CreateEditEntry/ImagesSection";
import RecordingSection from "@/components/CreateEditEntry/RecordingSection";
import TextSection from "@/components/CreateEditEntry/TextSection";
import VideosSection from "@/components/CreateEditEntry/VideosSection";
import SectionHeadline from "@/components/CreateEditEntry/SectionHeadline";
import { spacing } from "@/constants/theme";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import {
  BackHandler,
  LayoutChangeEvent,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Appbar, FAB } from "react-native-paper";
import FeelingsSection from "@/components/CreateEditEntry/FeelingsSection";
import { EntryData } from "../Entry/Entry";
import useIsKeyboardOpen from "@/hooks/useIsKeyboardOpen";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { debounce, isEqual } from "lodash";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import {
  moveAndDeleteUpdatedImagesAndGetPaths,
  moveAndDeleteUpdatedRecordingAndGetPath,
  moveAndDeleteUpdatedVideosAndGetPaths,
  moveImagesToAppDirectoryAndGetPaths,
  moveRecordingToAppDirectoryAndGetPath,
  moveVideosToAppDirectoryAndGetPaths,
} from "@/utils/files";

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
  imagesSelectedUri?: string;
  videosSelectedThumbnailUri?: string;
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
  imagesSelectedUri,
  videosSelectedThumbnailUri,
  onSave,
}: Props) => {
  const theme = useCustomTheme();
  const router = useRouter();
  const isKeyboardOpen = useIsKeyboardOpen();
  const { showConfirmDialog } = useConfirmDialog();

  const isCreateMode = mode === "create";

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
  const hasScrolledInitially = useRef(false);

  const handleScrollToOffset = useCallback((offset: number) => {
    scrollViewRef.current?.scrollTo({ y: offset, animated: true });
  }, []);

  const debouncedInitialScrollToSection = useMemo(
    () =>
      debounce((sectionsHeight: Record<LayoutParts, number>) => {
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

        const recordingOffset = mainHeadline + textSection;
        const imagesOffset =
          recordingOffset + recordingHeadline + recordingSection;
        const videosOffset = imagesOffset + imagesHeadline + imagesSection;
        const feelingsOffset = videosOffset + videosHeadline + videosSection;

        if (scrollToRecording) {
          handleScrollToOffset(recordingOffset);
        } else if (scrollToImages) {
          handleScrollToOffset(imagesOffset);
        } else if (scrollToVideos) {
          handleScrollToOffset(videosOffset);
        } else if (scrollToFeelings) {
          handleScrollToOffset(feelingsOffset);
        }

        hasScrolledInitially.current = true;
      }, 100),
    [
      handleScrollToOffset,
      scrollToFeelings,
      scrollToImages,
      scrollToRecording,
      scrollToVideos,
    ],
  );

  useEffect(() => {
    if (!hasScrolledInitially.current) {
      debouncedInitialScrollToSection(sectionsHeight);
    }
  }, [debouncedInitialScrollToSection, sectionsHeight]);

  const handleSaveEntry = async () => {
    const newImagesUri = isCreateMode
      ? await moveImagesToAppDirectoryAndGetPaths(imagesUri)
      : await moveAndDeleteUpdatedImagesAndGetPaths(
          imagesUri,
          initialImagesUri,
        );

    const newVideosWithThumbnail = isCreateMode
      ? await moveVideosToAppDirectoryAndGetPaths(videosWithThumbnail)
      : await moveAndDeleteUpdatedVideosAndGetPaths(
          videosWithThumbnail,
          initialVideosWithThumbnail,
        );

    const newRecordingUri = isCreateMode
      ? await moveRecordingToAppDirectoryAndGetPath(recordingUri)
      : await moveAndDeleteUpdatedRecordingAndGetPath(
          recordingUri,
          initialRecordingUri,
        );

    onSave({
      title,
      description,
      recordingUri: newRecordingUri,
      imagesUri: newImagesUri,
      videosWithThumbnail: newVideosWithThumbnail,
      feelingsActiveGroup: activeGroup,
      feelingsActiveEmotions: activeEmotions,
    });
  };

  const handleShowSaveConfirmDialog = () => {
    showConfirmDialog(
      "Do you wish to save the entry?",
      handleSaveEntry,
      "positive",
    );
  };

  const isEdited = useMemo(
    () =>
      !isEqual(title, initialTitle) ||
      !isEqual(description, initialDescription) ||
      !isEqual(recordingUri, initialRecordingUri) ||
      !isEqual(imagesUri, initialImagesUri) ||
      !isEqual(videosWithThumbnail, initialVideosWithThumbnail) ||
      !isEqual(activeGroup, initialFeelingsActiveGroup) ||
      !isEqual(activeEmotions, initialFeelingsActiveEmotions),
    [
      title,
      description,
      recordingUri,
      imagesUri,
      videosWithThumbnail,
      activeGroup,
      activeEmotions,
      initialTitle,
      initialDescription,
      initialRecordingUri,
      initialImagesUri,
      initialVideosWithThumbnail,
      initialFeelingsActiveGroup,
      initialFeelingsActiveEmotions,
    ],
  );

  const handleShowDiscardDialog = useCallback(() => {
    showConfirmDialog(
      isCreateMode
        ? "Do you wish to discard the entry?"
        : "Do you wish to discard the changes?",
      router.back,
    );
  }, [showConfirmDialog, isCreateMode, router]);

  const handleBackPress = () => {
    if (isEdited) {
      handleShowDiscardDialog();
    } else {
      router.back();
    }
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (isEdited) {
          handleShowDiscardDialog();
          return true;
        } else {
          return false;
        }
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => subscription.remove();
    }, [isEdited, handleShowDiscardDialog]),
  );

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.surface }]}>
      <Stack.Screen
        options={{
          header: () => (
            <Appbar.Header>
              <Appbar.BackAction onPress={handleBackPress} />
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
          initialSelectedImageUri={imagesSelectedUri}
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
          initialSelectedThumbnailUri={videosSelectedThumbnailUri}
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
            onPress={handleShowSaveConfirmDialog}
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
