import { roundness, sizing, spacing } from "@/common/constants/theme";
import React, { memo, useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";
import AudioPlayer from "@/common/components/AudioPlayer/AudioPlayer";
import { useCustomTheme } from "@/common/hooks/useCustomTheme";
import CustomMenu from "@/common/components/CustomMenu";
import { useEntryEditor } from "@/common/providers/EntryEditorProvider";
import MediaGallery from "./MediaGallery/MediaGallery";
import { default as EntryModel } from "@/common/models/Entry";
import Feelings from "./Feelings";
import { useBottomSheet } from "../../BottomSheetProvider/BottomSheetProvider";

type Props = {
  entry: EntryModel;
};

const Entry = ({ entry }: Props) => {
  const theme = useCustomTheme();
  const { snapToIndex } = useBottomSheet();
  const entryEditor = useEntryEditor();

  const isEdited = entryEditor.entryId === entry.id;
  const entrySource = isEdited ? entryEditor : entry;

  const { text, media, recordingUri, feelingsEmotions, feelingsGroup } =
    entrySource;

  const hasText = !!text;
  const hasRecording = !!recordingUri;
  const hasMedia = media.length > 0;

  const handleEdit = useCallback(() => {
    entryEditor.setEntryId(entry.id);
    entryEditor.setText(entry.text);
    entryEditor.setRecordingUri(entry.recordingUri);
    entryEditor.setMedia(entry.media);
    entryEditor.setFeelingsGroup(entry.feelingsGroup);
    entryEditor.setFeelingsEmotions(entry.feelingsEmotions);
    snapToIndex(0);
  }, [snapToIndex, entry, entryEditor]);

  return (
    <Card
      style={[styles.wrapper, { marginTop: isEdited ? spacing.spaceSmall : 0 }]}
      mode={isEdited ? "outlined" : "contained"}
    >
      <Card.Content style={styles.cardContent}>
        {isEdited && (
          <Text
            style={[
              styles.draftText,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            EDITING
          </Text>
        )}
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
          {isEdited ? null : (
            <CustomMenu
              menuItems={[
                {
                  title: "Edit",
                  onPress: handleEdit,
                  leadingIcon: "pencil",
                },
                {
                  title: "Delete",
                  onPress: () => console.log("Delete entry"),
                  leadingIcon: "trash-can",
                },
              ]}
            >
              {({ openMenu }) => (
                <IconButton
                  size={sizing.sizeMedium}
                  icon="dots-horizontal"
                  onPress={openMenu}
                  style={styles.bottomBarIconButton}
                />
              )}
            </CustomMenu>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

export default memo(Entry);

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: roundness,
    marginBottom: spacing.spaceSmall,
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
