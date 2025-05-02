import { roundness, sizing, spacing } from "@/common/constants/theme";
import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";
import AudioPlayer from "@/common/components/AudioPlayer/AudioPlayer";
import { useCustomTheme } from "@/common/hooks/useCustomTheme";
import CustomMenu from "@/common/components/CustomMenu";
import { useEntryEditor } from "@/common/providers/EntryEditorProvider";
import MediaGallery from "./MediaGallery/MediaGallery";
import Feelings from "./Feelings";

const EntryDraft = () => {
  const theme = useCustomTheme();

  const {
    entryId,
    text,
    recordingUri,
    media,
    feelingsGroup,
    feelingsEmotions,
    clear,
    isEmpty,
  } = useEntryEditor();

  const hasMedia = media.length > 0;
  const hasRecording = !!recordingUri;
  const hasText = !!text;

  if (entryId || isEmpty) {
    return null;
  }

  return (
    <Card style={styles.wrapper} mode={"outlined"}>
      <Card.Content style={styles.cardContent}>
        <Text
          style={[styles.draftText, { backgroundColor: theme.colors.surface }]}
        >
          DRAFT
        </Text>
        {hasMedia && (
          <View style={styles.mediaGallery}>
            <MediaGallery media={media} />
          </View>
        )}
        {hasRecording && (
          <View style={styles.recording}>
            <AudioPlayer sourceUri={recordingUri} />
          </View>
        )}
        {hasText && (
          <Text variant="bodyMedium" style={styles.text}>
            {text}
          </Text>
        )}
        <View style={styles.bottomBarWrapper}>
          <Feelings
            feelingsGroup={feelingsGroup}
            feelingsEmotions={feelingsEmotions}
          />
        </View>
      </Card.Content>
    </Card>
  );
};

export default memo(EntryDraft);

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: roundness,
    marginVertical: spacing.spaceSmall,
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
  mediaGallery: {
    marginVertical: spacing.spaceExtraSmall,
  },
  recording: {
    marginVertical: spacing.spaceExtraSmall,
  },
  text: {
    marginVertical: spacing.spaceExtraSmall,
  },
  bottomBarWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bottomBarIconButton: {
    marginVertical: 0,
    marginRight: -spacing.spaceExtraSmall,
  },
});
