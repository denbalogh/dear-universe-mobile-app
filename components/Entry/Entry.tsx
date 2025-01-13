import { roundness, spacing } from "@/constants/theme";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import {
  Card,
  Divider,
  IconButton,
  MenuItemProps,
  Text,
  TouchableRipple,
} from "react-native-paper";
import FeelingsButton from "./FeelingsButton";
import { FEELING_GROUP_NAMES } from "@/constants/feelings";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import IconButtonMenu from "../IconButtonMenu/IconButtonMenu";
import ImageGallery from "../MediaGallery/ImageGallery";
import VideoGallery, { VideoWithThumbnail } from "../MediaGallery/VideoGallery";
import { useCustomTheme } from "@/hooks/useCustomTheme";

export type EntryData = {
  title: string;
  description: string;
  recordingUri: string;
  imagesUri: string[];
  videosWithThumbnail: VideoWithThumbnail[];
  feelingsActiveGroup: FEELING_GROUP_NAMES | "";
  feelingsActiveEmotions: string[];
};

type Props = {
  onTitlePress: () => void;
  onDescriptionPress: () => void;
  onFeelingsPress: () => void;
  onDeleteEntryPress: () => void;
  onRecordingLongPress: () => void;
  onImageLongPress?: (index: number) => void;
  onVideoLongPress?: (index: number) => void;
  moveMenuItems: MenuItemProps[];
  addMenuItems: MenuItemProps[];
  style: ViewProps["style"];
} & EntryData;

const Entry = ({
  title,
  description,
  recordingUri,
  imagesUri,
  videosWithThumbnail,
  feelingsActiveGroup,
  feelingsActiveEmotions,
  onTitlePress,
  onDescriptionPress,
  onFeelingsPress,
  onDeleteEntryPress,
  onRecordingLongPress,
  onImageLongPress,
  onVideoLongPress,
  moveMenuItems,
  addMenuItems,
  style,
}: Props) => {
  const theme = useCustomTheme();

  const hasMoveMenuItems = moveMenuItems.length > 0;
  const hasAddMenuItems = addMenuItems.length > 0;

  const hasImages = imagesUri.length > 0;
  const hasVideos = videosWithThumbnail.length > 0;

  return (
    <Card style={[styles.wrapper, style]} mode="contained">
      <Card.Content style={styles.cardContent}>
        {title && (
          <TouchableRipple
            onPress={onTitlePress}
            style={styles.titleWrapper}
            accessibilityLabel="Edit title"
          >
            <Text variant="titleLarge">{title}</Text>
          </TouchableRipple>
        )}
        {hasVideos && (
          <VideoGallery
            videosWithThumbnail={videosWithThumbnail}
            style={styles.mediaGallery}
            onVideoLongPress={onVideoLongPress}
          />
        )}
        {hasImages && (
          <ImageGallery
            imagesUri={imagesUri}
            style={styles.mediaGallery}
            onImageLongPress={onImageLongPress}
          />
        )}
        {recordingUri && (
          <AudioPlayer
            sourceUri={recordingUri}
            style={styles.recording}
            onLongPress={onRecordingLongPress}
          />
        )}
        {description && (
          <TouchableRipple
            onPress={onDescriptionPress}
            style={styles.textWrapper}
            accessibilityLabel="Edit text"
          >
            <Text variant="bodyMedium">{description}</Text>
          </TouchableRipple>
        )}
        <Divider style={styles.bottomDivider} />
        <View style={styles.actionBarWrapper}>
          <FeelingsButton
            feelingsGroupName={feelingsActiveGroup}
            feelingsEmotions={feelingsActiveEmotions}
            onPress={onFeelingsPress}
          />
          <View style={styles.actionBarMenusWrapper}>
            <IconButton
              icon="delete"
              onPress={onDeleteEntryPress}
              iconColor={theme.colors.error}
            />
            {hasMoveMenuItems && (
              <IconButtonMenu
                menuItems={moveMenuItems}
                iconButtonProps={{ icon: "arrow-up-down" }}
              />
            )}
            {hasAddMenuItems && (
              <IconButtonMenu
                menuItems={addMenuItems}
                iconButtonProps={{ icon: "plus" }}
              />
            )}
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

export default Entry;

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: roundness,
  },
  cardContent: {
    paddingHorizontal: spacing.spaceSmall,
    paddingBottom: spacing.spaceSmall,
    paddingTop: spacing.spaceExtraSmall,
  },
  titleWrapper: {
    paddingVertical: spacing.spaceExtraSmall,
    marginVertical: spacing.spaceExtraSmall,
  },
  mediaGallery: {
    marginVertical: spacing.spaceExtraSmall,
  },
  recording: {
    marginTop: spacing.spaceSmall,
  },
  textWrapper: {
    paddingVertical: spacing.spaceExtraSmall,
    marginVertical: spacing.spaceExtraSmall,
  },
  bottomDivider: {
    marginTop: spacing.spaceExtraSmall,
  },
  actionBarWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.spaceSmall,
  },
  actionBarMenusWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: spacing.spaceSmall,
  },
});
