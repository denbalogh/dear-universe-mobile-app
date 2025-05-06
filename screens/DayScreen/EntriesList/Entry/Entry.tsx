import { roundness, sizing, spacing } from "@/common/constants/theme";
import React, { memo, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Icon,
  IconButton,
  Text,
  TextInput,
} from "react-native-paper";
import AudioPlayer from "@/common/components/AudioPlayer/AudioPlayer";
import MediaGallery from "./MediaGallery/MediaGallery";
import { default as EntryModel } from "@/common/models/Entry";
import Feelings from "./Feelings";
import { deleteFilesInEntry } from "@/common/utils/files";
import database from "@/common/models/db";
import { useConfirmDialog } from "@/common/providers/ConfirmDialogProvider";
import { useSnackbar } from "@/common/providers/SnackbarProvider";
import { Media } from "@/common/types/Media";
import { useEntryEditor } from "@/common/providers/EntryEditorProvider";
import Sortable from "react-native-sortables";
import DiscardSaveButtons from "./DiscardSaveButtons";
import useAddMedia from "../../hooks/useAddMedia";
import Recording from "./Recording";
import FeelingsSection from "./FeelingsSection/FeelingsSection";
import CustomMenu from "@/common/components/CustomMenu";

type Props = {
  entry: EntryModel;
};

const Entry = ({ entry }: Props) => {
  const { showDialog } = useConfirmDialog();
  const { showSnackbar } = useSnackbar();

  const addMedia = useAddMedia();
  const entryEditor = useEntryEditor();

  const isEdited = entryEditor.entryId === entry.id;
  const entrySource = isEdited ? entryEditor : entry;

  const { text, recordingUri, media, feelingsGroup, feelingsEmotions } =
    entrySource;

  const hasText = !!text;
  const hasRecording = !!recordingUri;
  const hasMedia = media.length > 0;

  const handleDeleteEntry = async () => {
    await deleteFilesInEntry(media, recordingUri);
    await database.write(async () => {
      await entry.destroyPermanently();
    });
    showSnackbar("Entry was deleted");
  };

  const handleOnDeletePress = () => {
    showDialog("Do you want to delete this entry?", handleDeleteEntry);
  };

  const handleMediaOrderChange = useCallback(
    (newMedia: Media[]) => {
      entryEditor.setMedia(newMedia);
      entryEditor.setEntryId(entry.id);
    },
    [entryEditor, entry.id],
  );

  const setEntryEditor = () => {
    entryEditor.setEntryId(entry.id);
    entryEditor.setText(text);
    entryEditor.setRecordingUri(recordingUri);
    entryEditor.setMedia(media);
    entryEditor.setFeelingsGroup(feelingsGroup);
    entryEditor.setFeelingsEmotions(feelingsEmotions);
  };

  return (
    <Card style={styles.wrapper} mode={isEdited ? "outlined" : "contained"}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.section}>
          {hasMedia ? (
            <MediaGallery
              media={media}
              onOrderChange={handleMediaOrderChange}
              disabled={!isEdited}
            />
          ) : (
            isEdited && (
              <Button icon="image-multiple" mode="outlined" onPress={addMedia}>
                Images & Videos
              </Button>
            )
          )}
        </View>
        <View style={styles.section}>
          {hasRecording ? (
            <AudioPlayer sourceUri={recordingUri} />
          ) : (
            isEdited && <Recording />
          )}
        </View>
        {isEdited ? (
          <View style={styles.section}>
            <TextInput
              value={text}
              onChangeText={entryEditor.setText}
              label="What happened?"
              mode="outlined"
              multiline={true}
              submitBehavior="blurAndSubmit"
              contentStyle={{ marginTop: 5 }}
              style={{ marginTop: -5 }}
            />
          </View>
        ) : (
          hasText && (
            <Text variant="bodyMedium" style={styles.section}>
              {text}
            </Text>
          )
        )}
        {isEdited && (
          <View style={styles.section}>
            <FeelingsSection />
          </View>
        )}
        <View
          style={[
            styles.bottomBarWrapper,
            { justifyContent: !isEdited ? "space-between" : "flex-end" },
          ]}
        >
          <Sortable.Handle>
            <View style={{ padding: spacing.spaceSmall }}>
              <Icon source="drag" size={sizing.sizeMedium} />
            </View>
          </Sortable.Handle>
          {!isEdited && (
            <Feelings
              feelingsGroup={feelingsGroup}
              feelingsEmotions={feelingsEmotions}
              disabled={!isEdited}
            />
          )}
          {isEdited ? (
            <DiscardSaveButtons />
          ) : (
            <>
              {/* <IconButton
                size={sizing.sizeMedium}
                icon="trash-can"
                onPress={handleOnDeletePress}
              />
              <IconButton
                size={sizing.sizeMedium}
                icon="pencil"
                onPress={setEntryEditor}
              /> */}
              <CustomMenu
                menuItems={[
                  {
                    leadingIcon: "pencil",
                    title: "Edit",
                    onPress: setEntryEditor,
                  },
                  {
                    leadingIcon: "trash-can",
                    title: "Delete",
                    onPress: handleOnDeletePress,
                  },
                ]}
              >
                {({ openMenu }) => (
                  <IconButton onPress={openMenu} icon="dots-vertical" />
                )}
              </CustomMenu>
            </>
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
  },
  cardContent: {
    paddingHorizontal: spacing.spaceSmall,
    paddingTop: spacing.spaceSmall,
    paddingBottom: spacing.spaceExtraSmall,
  },
  section: {
    marginVertical: spacing.spaceExtraSmall,
  },
  bottomBarWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
