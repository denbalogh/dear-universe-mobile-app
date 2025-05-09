import { roundness, spacing } from "@/common/constants/theme";
import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";
import AudioPlayer from "@/common/components/AudioPlayer/AudioPlayer";
import { useCustomTheme } from "@/common/hooks/useCustomTheme";
import {
  NEW_ENTRY_ID,
  useEntryEditor,
} from "@/common/providers/EntryEditorProvider";
import MediaGallery from "./MediaGallery/MediaGallery";
import Feelings from "./Feelings";
import DiscardSaveButtons from "./DiscardSaveButtons";
import useAddMedia from "../../hooks/useAddMedia";
import Recording from "./Recording";
import { Media } from "@/common/types/Media";
import FeelingsSection from "./FeelingsSection/FeelingsSection";

const NewEntryEditor = () => {
  const theme = useCustomTheme();

  const {
    entryId,
    setText,
    text,
    recordingUri,
    media,
    setMedia,
    feelingsGroup,
    feelingsEmotions,
  } = useEntryEditor();

  const addMedia = useAddMedia();

  const hasMedia = media.length > 0;
  const hasRecording = !!recordingUri;

  const handleMediaOrderChange = useCallback(
    (newMedia: Media[]) => setMedia(newMedia),
    [setMedia],
  );

  if (entryId !== NEW_ENTRY_ID) {
    return null;
  }

  return (
    <Card style={styles.wrapper} mode="outlined">
      <Card.Content style={styles.cardContent}>
        <Text
          style={[styles.draftText, { backgroundColor: theme.colors.surface }]}
        >
          NEW ENTRY
        </Text>
        <View style={styles.section}>
          {hasMedia ? (
            <>
              <MediaGallery
                media={media}
                onOrderChange={handleMediaOrderChange}
                disabled={false}
              />
              <Button
                style={{ marginTop: spacing.spaceSmall }}
                icon="plus"
                onPress={addMedia}
              >
                More images & videos
              </Button>
            </>
          ) : (
            <Button icon="image-multiple" mode="outlined" onPress={addMedia}>
              Images & Videos
            </Button>
          )}
        </View>
        <View style={styles.section}>
          {hasRecording ? (
            <AudioPlayer sourceUri={recordingUri} />
          ) : (
            <Recording />
          )}
        </View>
        <View style={styles.section}>
          <TextInput
            value={text}
            onChangeText={setText}
            label="What happened?"
            mode="outlined"
            multiline={true}
            submitBehavior="blurAndSubmit"
            contentStyle={{ marginTop: 5 }}
            style={{ marginTop: -5 }}
          />
        </View>
        <View style={styles.section}>
          <FeelingsSection />
        </View>
        <View style={styles.bottomBarWrapper}>
          <DiscardSaveButtons />
        </View>
      </Card.Content>
    </Card>
  );
};

export default NewEntryEditor;

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: roundness,
    marginTop: spacing.spaceMedium,
    minWidth: "100%",
  },
  cardContent: {
    paddingHorizontal: spacing.spaceSmall,
    paddingTop: spacing.spaceSmall,
    paddingBottom: spacing.spaceExtraSmall,
  },
  draftText: {
    paddingHorizontal: spacing.spaceExtraSmall,
    position: "absolute",
    top: -12,
    left: spacing.spaceSmall,
    zIndex: 3,
  },
  section: {
    marginVertical: spacing.spaceExtraSmall,
  },
  bottomBarWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
