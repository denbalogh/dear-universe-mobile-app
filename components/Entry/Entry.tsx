import { roundness, spacing } from "@/constants/theme";
import React from "react";
import { Platform, StyleSheet, View, ViewProps } from "react-native";
import { Card, IconButton, Text, TouchableRipple } from "react-native-paper";
import FeelingsButton from "./FeelingsButton";
import { Feelings } from "@/constants/feelings";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import ImageGallery from "../ImageGallery/ImageGallery";

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
  // moveMenuItems: MenuItemProps[];
  // optionsMenuItems: MenuItemProps[];
  style: ViewProps["style"];
};

const Entry = ({
  title,
  text,
  feelings,
  onFeelingsPress,
  recordingURI,
  imagesURI,
  // moveMenuItems,
  // optionsMenuItems,
  style,
}: Props) => {
  // const hasMoveMenuItems = moveMenuItems.length > 0;
  // const hasOptionsMenuItems = optionsMenuItems.length > 0;

  const hasImages = imagesURI.length > 0;

  return (
    <Card style={[styles.wrapper, style]} mode="contained">
      <Card.Content
        style={{
          paddingHorizontal: spacing.spaceSmall,
          paddingVertical: spacing.spaceSmall,
        }}
      >
        {title && (
          <TouchableRipple
            onPress={title.onPress}
            style={styles.titleWrapper}
            accessibilityLabel="Edit title"
          >
            <Text variant="titleLarge">{title.text}</Text>
          </TouchableRipple>
        )}
        {hasImages && <ImageGallery imagesURI={imagesURI} cols={4} />}
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
        <View style={styles.actionBarWrapper}>
          <FeelingsButton feelings={feelings} onPress={onFeelingsPress} />
          <View style={styles.actionBarMenusWrapper}>
            <IconButton icon="dots-vertical" onPress={() => {}} />
            <IconButton icon="arrow-up-down" />
            <IconButton icon="plus" />
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
  titleWrapper: {
    paddingVertical: spacing.spaceExtraSmall,
  },
  recording: {
    ...Platform.select({
      ios: {
        marginTop: spacing.spaceSmall,
      },
    }),
  },
  textWrapper: {
    paddingVertical: spacing.spaceExtraSmall,
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
