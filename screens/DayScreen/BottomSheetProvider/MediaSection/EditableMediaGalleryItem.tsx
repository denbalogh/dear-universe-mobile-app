import React, { memo, useMemo } from "react";
import { Image, ImageProps } from "expo-image";
import { Checkbox, Icon } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { getBorderRadius } from "../../EntriesList/Entry/MediaGallery/utils";
import { roundness, sizing, spacing } from "@/common/constants/theme";
import { useCustomTheme } from "@/common/hooks/useCustomTheme";
import { getColorWithOpacity } from "@/common/utils/style";
import { Media } from "@/common/types/Media";
import Sortable from "react-native-sortables";

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
    <View>
      <Sortable.Pressable
        style={[styles.touchable, { ...borderRadii }]}
        onPress={() => onImagePress(index)}
        onLongPress={() => console.log("long pressed")}
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
      </Sortable.Pressable>
      <View style={[styles.select, { backgroundColor }]}>
        <Checkbox
          status={isSelected ? "checked" : "unchecked"}
          onPress={() => onSelect(uri)}
          color={theme.colors.onBackground}
        />
      </View>
    </View>
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
