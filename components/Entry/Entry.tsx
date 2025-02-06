import { roundness, spacing } from "@/constants/theme";
import React from "react";
import { StyleSheet } from "react-native";
import { Card, MenuItemProps } from "react-native-paper";
import { FEELING_GROUP_NAMES } from "@/constants/feelings";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import MediaGallery from "../MediaGallery/MediaGallery";
import { Media } from "../MediaGallery/EditableMediaGallery";
import Title from "./Title";
import Description from "./Description";
import BottomBar from "./BottomBar";

export type EntryData = {
  title: string;
  description: string;
  recordingUri: string;
  media: Media[];
  feelingsActiveGroup: FEELING_GROUP_NAMES | "";
  feelingsActiveEmotions: string[];
};

type Props = {
  onTitlePress: () => void;
  onDescriptionPress: () => void;
  onFeelingsPress: () => void;
  onDeleteEntryPress: () => void;
  onMediaLongPress?: (uri: string) => void;
  moveMenuItems: MenuItemProps[];
  editMenuItems: MenuItemProps[];
  locked?: boolean;
} & EntryData;

const Entry = ({
  title,
  description,
  recordingUri,
  media,
  feelingsActiveGroup,
  feelingsActiveEmotions,
  onTitlePress,
  onDescriptionPress,
  onFeelingsPress,
  onDeleteEntryPress,
  onMediaLongPress,
  moveMenuItems,
  editMenuItems,
  locked = false,
}: Props) => {
  const hasTitle = !!title;
  const hasMedia = media.length > 0;
  const hasRecording = !!recordingUri;
  const hasDescription = !!description;

  return (
    <Card style={styles.wrapper} mode="contained">
      <Card.Content style={styles.cardContent}>
        {hasTitle && (
          <Title title={title} onPress={onTitlePress} locked={locked} />
        )}
        {hasMedia && (
          <MediaGallery
            media={media}
            style={styles.mediaGallery}
            onMediaLongPress={onMediaLongPress}
            locked={locked}
          />
        )}
        {hasRecording && (
          <AudioPlayer
            sourceUri={recordingUri}
            style={styles.recording}
            locked={locked}
          />
        )}
        {hasDescription && (
          <Description
            description={description}
            onPress={onDescriptionPress}
            locked={locked}
          />
        )}
        <BottomBar
          feelingsButtonProps={{
            feelingsGroupName: feelingsActiveGroup,
            feelingsEmotions: feelingsActiveEmotions,
            onPress: onFeelingsPress,
          }}
          onDeleteEntryPress={onDeleteEntryPress}
          editMenuItems={editMenuItems}
          moveMenuItems={moveMenuItems}
          locked={locked}
        />
      </Card.Content>
    </Card>
  );
};

export default Entry;

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: roundness,
    marginBottom: spacing.spaceSmall,
  },
  cardContent: {
    paddingHorizontal: spacing.spaceSmall,
    paddingVertical: spacing.spaceExtraSmall,
  },
  mediaGallery: {
    marginVertical: spacing.spaceExtraSmall,
  },
  recording: {
    marginTop: spacing.spaceSmall,
  },
  descriptionWrapper: {
    paddingVertical: spacing.spaceExtraSmall,
    marginVertical: spacing.spaceExtraSmall,
  },
});
