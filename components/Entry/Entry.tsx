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
import { useCustomTheme } from "@/hooks/useCustomTheme";

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
  onRecordingLongPress: () => void;
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
  onRecordingLongPress,
  onMediaLongPress,
  moveMenuItems,
  editMenuItems,
  locked = false,
}: Props) => {
  const theme = useCustomTheme();

  return (
    <Card
      style={[styles.wrapper, { backgroundColor: theme.colors.surfaceVariant }]}
      mode={locked ? "outlined" : "contained"}
    >
      <Card.Content style={styles.cardContent}>
        <Title title={title} onPress={onTitlePress} locked={locked} />
        <MediaGallery
          media={media}
          style={styles.mediaGallery}
          onMediaLongPress={onMediaLongPress}
          locked={locked}
        />
        <AudioPlayer
          sourceUri={recordingUri}
          style={styles.recording}
          onLongPress={onRecordingLongPress}
          locked={locked}
        />
        <Description
          description={description}
          onPress={onDescriptionPress}
          locked={locked}
        />
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
