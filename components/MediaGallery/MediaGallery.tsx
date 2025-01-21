import React, { useState } from "react";
import { LayoutChangeEvent, StyleSheet, ViewProps } from "react-native";
import { Media } from "./EditableMediaGallery";
import ImageGridItem from "./ImageGridItem";
import { View } from "react-native";
import MediaGalleryPreview from "./MediaGalleryPreview/MediaGalleryPreview";

type Props = {
  media: Media[];
  gridSize?: number;
  onMediaLongPress?: (uri: string) => void;
  locked?: boolean;
} & ViewProps;

const MediaGallery = ({
  media,
  gridSize = 4,
  onMediaLongPress,
  style,
  locked = false,
  ...viewProps
}: Props) => {
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);
  const [gridWidth, setGridWidth] = useState(0);

  const handleOnLayout = ({
    nativeEvent: {
      layout: { width },
    },
  }: LayoutChangeEvent) => {
    setGridWidth(width);
  };

  const imageSize = gridWidth / gridSize - 0.001; // to prevent incorrent wrapping

  const handleOnImagePress = (index: number) => {
    setInitialIndex(index);
    setIsPreviewVisible(true);
  };

  const handleOnPreviewClose = () => {
    setIsPreviewVisible(false);
  };

  const handleOnMediaLongPress = (imageUri: string) => {
    if (!locked && onMediaLongPress) {
      onMediaLongPress(imageUri);
    }
  };

  if (!media.length) {
    return null;
  }

  return (
    <View
      onLayout={handleOnLayout}
      style={[styles.wrapper, style]}
      {...viewProps}
    >
      {media.map(({ imageUri, videoUri }, index) => {
        return (
          <ImageGridItem
            key={index}
            source={{ uri: imageUri }}
            index={index}
            imagesCount={media.length}
            gridSize={gridSize}
            style={{ width: imageSize, height: imageSize }}
            touchableProps={{
              onPress: () => handleOnImagePress(index),
              onLongPress: () => handleOnMediaLongPress(imageUri),
            }}
            showPlayIcon={!!videoUri}
          />
        );
      })}
      <MediaGalleryPreview
        media={media}
        onClose={handleOnPreviewClose}
        isVisible={isPreviewVisible}
        initialIndex={initialIndex}
      />
    </View>
  );
};

export default MediaGallery;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
