import { roundness, spacing } from "@/constants/theme";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import {
  MenuItemProps,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import PickMoodsButton from "./PickMoodsButton";
import { Mood } from "../MoodColor/types";
import IconButtonMenu from "../IconButtonMenu/IconButtonMenu";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import { ImageProps } from "expo-image";
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
  moods: Mood[];
  onMoodsPress: () => void;
  moveMenuItems: MenuItemProps[];
  optionsMenuItems: MenuItemProps[];
  recording?: boolean;
  images?: ImageProps[];
};

const Entry = ({
  title,
  text,
  moods,
  onMoodsPress,
  moveMenuItems,
  optionsMenuItems,
  recording,
  images,
}: Props) => {
  const theme = useTheme();

  const hasMoveMenuItems = moveMenuItems.length > 0;
  const hasOptionsMenuItems = optionsMenuItems.length > 0;

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.colors.surface }]}>
      {title && (
        <TouchableRipple
          onPress={title.onPress}
          style={styles.titleWrapper}
          accessibilityLabel="Edit title"
        >
          <Text variant="headlineSmall">{title.text}</Text>
        </TouchableRipple>
      )}
      {images && <ImageGallery images={images} style={styles.imageGallery} />}
      {recording && <AudioPlayer style={styles.recording} />}
      {text && (
        <TouchableRipple
          onPress={text.onPress}
          style={styles.textWrapper}
          accessibilityLabel="Edit text"
        >
          <Text variant="bodySmall">{text.text}</Text>
        </TouchableRipple>
      )}
      <View style={styles.actionBarWrapper}>
        <PickMoodsButton moods={moods} onPress={onMoodsPress} />
        <View style={styles.actionBarMenusWrapper}>
          {hasMoveMenuItems && (
            <IconButtonMenu
              iconButtonProps={{
                icon: "arrow-up-down",
                accessibilityLabel: "Move entry menu",
              }}
              menuItems={moveMenuItems}
            />
          )}
          {hasOptionsMenuItems && (
            <IconButtonMenu
              iconButtonProps={{
                icon: "dots-vertical",
                accessibilityLabel: "Options menu",
              }}
              menuItems={optionsMenuItems}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default Entry;

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: roundness,
    elevation: 2,
  },
  titleWrapper: {
    padding: spacing.spaceSmall,
  },
  imageGallery: {
    padding: spacing.spaceSmall,
  },
  recording: {
    paddingHorizontal: spacing.spaceSmall,
    ...Platform.select({
      ios: {
        marginTop: spacing.spaceSmall,
      },
    }),
  },
  textWrapper: {
    padding: spacing.spaceSmall,
  },
  actionBarWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    width: "100%",
  },
  actionBarMenusWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
});
