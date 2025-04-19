import React, { useMemo } from "react";
import { Image, ImageProps } from "expo-image";
import {
  Checkbox,
  Icon,
  TouchableRipple,
  TouchableRippleProps,
} from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { getBorderRadius } from "./utils";
import { roundness, sizing, spacing } from "@/constants/theme";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import { Media } from "./EditableMediaGallery";
import { getColorWithOpacity } from "@/utils/style";
import { Draggable, Droppable } from "@mgcrea/react-native-dnd";

export type EditableMediaGalleryItemProps = {
  item: Media;
  index: number;
  imagesCount: number;
  gridSize: number;
  touchableProps: Omit<TouchableRippleProps, "children">;
  style: ImageProps["style"];
  isSelected: boolean;
  onSelect: (imageUri: string) => void;
  dndEnabled?: boolean;
};

const EditableMediaGalleryItem = ({
  item: { imageUri, videoUri },
  index,
  imagesCount,
  gridSize,
  style,
  touchableProps,
  isSelected,
  onSelect,
  dndEnabled = true,
}: EditableMediaGalleryItemProps) => {
  const theme = useCustomTheme();
  const borderRadii = useMemo(
    () => getBorderRadius(index, imagesCount, gridSize),
    [index, imagesCount, gridSize],
  );

  const isVideo = !!videoUri;
  const backgroundColor = getColorWithOpacity(theme.colors.background, 0.6);

  const insides = (
    <View>
      <TouchableRipple
        {...touchableProps}
        style={[styles.touchable, { ...borderRadii }]}
        background={{
          borderless: false,
          foreground: true,
        }}
      >
        <View>
          <Image style={[style, { ...borderRadii }]} source={imageUri} />
          {isVideo && (
            <View style={[StyleSheet.absoluteFill, styles.playIconWrapper]}>
              <View style={[styles.playIcon, { backgroundColor }]}>
                <Icon
                  source="play"
                  size={sizing.sizeMedium}
                  color={theme.colors.onBackground}
                />
              </View>
            </View>
          )}
          {dndEnabled && (
            <View style={[StyleSheet.absoluteFill, styles.dragIconWrapper]}>
              <View style={[styles.dragIcon, { backgroundColor }]}>
                <Icon
                  source="drag"
                  size={sizing.sizeMedium}
                  color={theme.colors.onBackground}
                />
              </View>
            </View>
          )}
        </View>
      </TouchableRipple>
      <View style={[styles.select, { backgroundColor }]}>
        <Checkbox
          status={isSelected ? "checked" : "unchecked"}
          onPress={() => onSelect(imageUri)}
          color={theme.colors.onBackground}
        />
      </View>
    </View>
  );

  if (dndEnabled) {
    return (
      <Draggable id={imageUri} activeOpacity={0.8}>
        <Droppable id={imageUri} activeOpacity={0.2}>
          {insides}
        </Droppable>
      </Draggable>
    );
  }

  return insides;
};

export default EditableMediaGalleryItem;

const styles = StyleSheet.create({
  touchable: {
    overflow: "hidden",
  },
  playIconWrapper: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  playIcon: {
    borderRadius: roundness,
    margin: spacing.spaceSmall,
  },
  dragIconWrapper: {
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  dragIcon: {
    borderRadius: roundness,
    margin: spacing.spaceSmall,
  },
  select: {
    position: "absolute",
    top: spacing.spaceSmall,
    left: spacing.spaceSmall,
    borderRadius: roundness,
  },
});
