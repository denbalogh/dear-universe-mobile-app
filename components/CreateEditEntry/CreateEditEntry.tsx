import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import RecordingSection from "@/components/CreateEditEntry/RecordingSection";
import TextSection from "@/components/CreateEditEntry/TextSection";
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
import { EntryData } from "../Entry/Entry";
import useIsKeyboardOpen from "@/hooks/useIsKeyboardOpen";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { debounce, isEqual, sortBy } from "lodash";
import { useConfirmDialog } from "@/contexts/ConfirmDialogContext";
import {
  moveAndDeleteUpdatedMediaAndGetPaths,
  moveAndDeleteUpdatedRecordingAndGetPath,
  moveMediaToAppDirectoryAndGetPaths,
  moveRecordingToAppDirectoryAndGetPath,
} from "@/utils/files";
import MediaSection from "./MediaSection";
import FeelingsSection from "./FeelingsSection/FeelingsSection";

type LayoutParts =
  | "mainHeadline"
  | "textSection"
  | "recordingHeadline"
  | "recordingSection"
  | "mediaHeadline"
  | "mediaSection";

type Props = {
  mode: "create" | "edit";
  formattedDate: string;
  onSave: (entry: EntryData) => void;
  focusTitle?: boolean;
  focusDescription?: boolean;
  scrollToRecording?: boolean;
  scrollToMedia?: boolean;
  scrollToFeelings?: boolean;
  selectedMediaImageUri?: string;
} & EntryData;

const CreateEditEntry = ({
  mode,
  formattedDate,
  title: initialTitle,
  description: initialDescription,
  recordingUri: initialRecordingUri,
  media: initialMedia,
  feelingsActiveGroup: initialFeelingsActiveGroup,
  feelingsActiveEmotions: initialFeelingsActiveEmotions,
  focusTitle,
  focusDescription,
  scrollToFeelings,
  scrollToMedia,
  scrollToRecording,
  selectedMediaImageUri,
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
  const [media, setMedia] = useState(initialMedia);
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
    mediaHeadline: 0,
    mediaSection: 0,
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
          mediaHeadline,
          mediaSection,
        } = sectionsHeight;

        const recordingOffset = mainHeadline + textSection;
        const mediaOffset =
          recordingOffset + recordingHeadline + recordingSection;
        const feelingsOffset = mediaOffset + mediaHeadline + mediaSection;

        if (scrollToRecording) {
          handleScrollToOffset(recordingOffset);
        } else if (scrollToMedia) {
          handleScrollToOffset(mediaOffset);
        } else if (scrollToFeelings) {
          handleScrollToOffset(feelingsOffset);
        }

        hasScrolledInitially.current = true;
      }, 100),
    [handleScrollToOffset, scrollToFeelings, scrollToRecording, scrollToMedia],
  );

  useEffect(() => {
    if (!hasScrolledInitially.current) {
      debouncedInitialScrollToSection(sectionsHeight);
    }
  }, [debouncedInitialScrollToSection, sectionsHeight]);

  const handleSaveEntry = async () => {
    const newRecordingUri = isCreateMode
      ? await moveRecordingToAppDirectoryAndGetPath(recordingUri)
      : await moveAndDeleteUpdatedRecordingAndGetPath(
          recordingUri,
          initialRecordingUri,
        );

    const newMedia = isCreateMode
      ? await moveMediaToAppDirectoryAndGetPaths(media)
      : await moveAndDeleteUpdatedMediaAndGetPaths(media, initialMedia);

    onSave({
      title,
      description,
      recordingUri: newRecordingUri,
      media: newMedia,
      feelingsActiveGroup: activeGroup,
      feelingsActiveEmotions: [...activeEmotions], // Copy the array because it's a reference
    });
  };

  const isEdited = useMemo(
    () =>
      !isEqual(title, initialTitle) ||
      !isEqual(description, initialDescription) ||
      !isEqual(recordingUri, initialRecordingUri) ||
      !isEqual([...media], [...initialMedia]) ||
      !isEqual(activeGroup, initialFeelingsActiveGroup) ||
      !isEqual(sortBy(activeEmotions), sortBy(initialFeelingsActiveEmotions)),
    [
      title,
      description,
      recordingUri,
      media,
      activeGroup,
      activeEmotions,
      initialTitle,
      initialDescription,
      initialRecordingUri,
      initialMedia,
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
          animation: "fade_from_bottom",
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
          headline="Media"
          superHeadline={formattedDate}
          onLayout={handleSetSectionHeight("mediaHeadline")}
        />
        <MediaSection
          media={media}
          onMediaChange={setMedia}
          style={styles.sectionWrapper}
          onLayout={handleSetSectionHeight("mediaSection")}
          initialSelectedMediaImageUri={selectedMediaImageUri}
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
            onPress={handleSaveEntry}
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
