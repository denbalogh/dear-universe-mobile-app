import { roundness, spacing } from "@/constants/theme";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import {
  Card,
  IconButton,
  MenuItemProps,
  Text,
  TouchableRipple,
} from "react-native-paper";
import FeelingsButton from "./FeelingsButton";
import { FEELING_GROUP_NAMES } from "@/constants/feelings";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import IconButtonMenu from "../IconButtonMenu/IconButtonMenu";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import MediaGallery from "../MediaGallery/MediaGallery";
import { Media } from "../MediaGallery/EditableMediaGallery";

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
  style: ViewProps["style"];
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
  style,
}: Props) => {
  const theme = useCustomTheme();

  const hasMoveMenuItems = moveMenuItems.length > 0;
  const hasEditMenuItems = editMenuItems.length > 0;

  const hasMedia = media.length > 0;

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
        {hasMedia && (
          <MediaGallery
            media={media}
            style={styles.mediaGallery}
            onMediaLongPress={onMediaLongPress}
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
            {hasEditMenuItems && (
              <IconButtonMenu
                menuItems={editMenuItems}
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
