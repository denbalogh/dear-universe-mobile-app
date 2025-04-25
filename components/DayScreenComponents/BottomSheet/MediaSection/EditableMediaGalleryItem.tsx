import React, { memo, useMemo } from "react";
import { Image, ImageProps } from "expo-image";
import { Checkbox, Icon, TouchableRipple } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { getBorderRadius } from "../../EntriesList/MediaGallery/utils";
import { roundness, sizing, spacing } from "@/constants/theme";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import { getColorWithOpacity } from "@/utils/style";
import { Draggable, Droppable } from "@mgcrea/react-native-dnd";
import { Media } from "@/types/Media";

export type EditableMediaGalleryItemProps = {
  item: Media;
  index: number;
  imagesCount: number;
  gridSize: number;
  style: ImageProps["style"];
  isSelected: boolean;
  onSelect: (uri: string) => void;
  onImagePress: (index: number) => void;
};

const EditableMediaGalleryItem = ({
  item: { uri, mediaType },
  index,
  imagesCount,
  gridSize,
  style,
  isSelected,
  onSelect,
  onImagePress,
}: EditableMediaGalleryItemProps) => {
  const theme = useCustomTheme();
  const borderRadii = useMemo(
    () => getBorderRadius(index, imagesCount, gridSize),
    [index, imagesCount, gridSize],
  );

  const isVideo = mediaType === "video";
  const backgroundColor = getColorWithOpacity(theme.colors.background, 0.6);

  return (
    <Draggable id={uri} activeOpacity={0.8}>
      <Droppable id={uri} activeOpacity={0.2}>
        <View>
          <TouchableRipple
            style={[styles.touchable, { ...borderRadii }]}
            background={{
              borderless: false,
              foreground: true,
            }}
            onPress={() => onImagePress(index)}
          >
            <View>
              <Image style={[style, { ...borderRadii }]} source={uri} />
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
            </View>
          </TouchableRipple>
          <View style={[styles.select, { backgroundColor }]}>
            <Checkbox
              status={isSelected ? "checked" : "unchecked"}
              onPress={() => onSelect(uri)}
              color={theme.colors.onBackground}
            />
          </View>
        </View>
      </Droppable>
    </Draggable>
  );
};

export default memo(EditableMediaGalleryItem);

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
