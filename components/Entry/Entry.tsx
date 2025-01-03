import { roundness, spacing } from "@/constants/theme";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import {
  Card,
  Divider,
  MenuItemProps,
  Text,
  TouchableRipple,
} from "react-native-paper";
import FeelingsButton from "./FeelingsButton";
import { Feelings } from "@/constants/feelings";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import IconButtonMenu from "../IconButtonMenu/IconButtonMenu";
import ImageGallery from "../MediaGallery/ImageGallery";
import VideoGallery, { VideoWithThumbnail } from "../MediaGallery/VideoGallery";

type Props = {
  title?: {
    onPress: () => void;
    text: string;
  };
  text?: {
    onPress: () => void;
    text: string;
  };
  feelings?: Feelings;
  onFeelingsPress: () => void;
  recordingURI?: string;
  imagesURI: string[];
  videosWithThumbnail: VideoWithThumbnail[];
  moveMenuItems: MenuItemProps[];
  optionsMenuItems: MenuItemProps[];
  addRemoveMenuItems: MenuItemProps[];
  style: ViewProps["style"];
};

const Entry = ({
  title,
  text,
  feelings,
  onFeelingsPress,
  recordingURI,
  imagesURI,
  videosWithThumbnail,
  moveMenuItems,
  optionsMenuItems,
  addRemoveMenuItems,
  style,
}: Props) => {
  const hasMoveMenuItems = moveMenuItems.length > 0;
  const hasOptionsMenuItems = optionsMenuItems.length > 0;
  const hasAddRemoveMenuItems = addRemoveMenuItems.length > 0;

  const hasImages = imagesURI.length > 0;
  const hasVideos = videosWithThumbnail.length > 0;

  return (
    <Card style={[styles.wrapper, style]} mode="contained">
      <Card.Content style={styles.cardContent}>
        {title && (
          <TouchableRipple
            onPress={title.onPress}
            style={styles.titleWrapper}
            accessibilityLabel="Edit title"
          >
            <Text variant="titleLarge">{title.text}</Text>
          </TouchableRipple>
        )}
        {hasVideos && (
          <VideoGallery
            videosWithThumbnail={videosWithThumbnail}
            style={styles.mediaGallery}
          />
        )}
        {hasImages && (
          <ImageGallery imagesUri={imagesURI} style={styles.mediaGallery} />
        )}
        {recordingURI && (
          <AudioPlayer sourceURI={recordingURI} style={styles.recording} />
        )}
        {text && (
          <TouchableRipple
            onPress={text.onPress}
            style={styles.textWrapper}
            accessibilityLabel="Edit text"
          >
            <Text variant="bodyMedium">{text.text}</Text>
          </TouchableRipple>
        )}
        <Divider style={styles.bottomDivider} />
        <View style={styles.actionBarWrapper}>
          <FeelingsButton feelings={feelings} onPress={onFeelingsPress} />
          <View style={styles.actionBarMenusWrapper}>
            {hasOptionsMenuItems && (
              <IconButtonMenu
                menuItems={optionsMenuItems}
                iconButtonProps={{ icon: "dots-vertical" }}
              />
            )}
            {hasMoveMenuItems && (
              <IconButtonMenu
                menuItems={moveMenuItems}
                iconButtonProps={{ icon: "arrow-up-down" }}
              />
            )}
            {hasAddRemoveMenuItems && (
              <IconButtonMenu
                menuItems={addRemoveMenuItems}
                iconButtonProps={{ icon: "plus-minus" }}
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
