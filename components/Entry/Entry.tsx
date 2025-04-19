import { roundness, spacing } from "@/constants/theme";
import React from "react";
import { StyleSheet } from "react-native";
import { Card, MenuItemProps } from "react-native-paper";
import { FEELING_GROUP_NAMES } from "@/constants/feelings";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import MediaGallery from "../MediaGallery/MediaGallery";
import { Media } from "../MediaGallery/EditableMediaGallery";
import BottomBar from "./BottomBar";
import Text from "./Text";

export type EntryData = {
  text: string;
  recordingUri: string;
  media: Media[];
  feelingsActiveGroup: FEELING_GROUP_NAMES | "";
  feelingsActiveEmotions: string[];
};

type Props = {
  onTextPress: () => void;
  onFeelingsPress: () => void;
  onDeleteEntryPress: () => void;
  onMediaLongPress?: (uri: string) => void;
  moveMenuItems: MenuItemProps[];
  editMenuItems: MenuItemProps[];
} & EntryData;

const Entry = ({
  text,
  recordingUri,
  media,
  feelingsActiveGroup,
  feelingsActiveEmotions,
  onTextPress,
  onFeelingsPress,
  onDeleteEntryPress,
  onMediaLongPress,
  moveMenuItems,
  editMenuItems,
}: Props) => {
  const hasMedia = media.length > 0;
  const hasRecording = !!recordingUri;
  const hasText = !!text;

  return (
    <Card style={styles.wrapper} mode="contained">
      <Card.Content style={styles.cardContent}>
        {hasMedia && (
          <MediaGallery
            media={media}
            style={styles.mediaGallery}
            onMediaLongPress={onMediaLongPress}
          />
        )}
        {hasRecording && (
          <AudioPlayer sourceUri={recordingUri} style={styles.recording} />
        )}
        {hasText && <Text text={text} onPress={onTextPress} />}
        {/* <BottomBar
          feelingsButtonProps={{
            feelingsGroupName: feelingsActiveGroup,
            feelingsEmotions: feelingsActiveEmotions,
            onPress: onFeelingsPress,
          }}
          onDeleteEntryPress={onDeleteEntryPress}
          editMenuItems={editMenuItems}
          moveMenuItems={moveMenuItems}
        /> */}
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
