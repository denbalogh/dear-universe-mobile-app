import React, { useState } from "react";
import { LayoutChangeEvent, StyleSheet, ViewProps } from "react-native";
import MediaGalleryItem from "./MediaGalleryItem";
import { View } from "react-native";
import MediaGalleryPreview from "./MediaGalleryPreview/MediaGalleryPreview";
import { Media } from "./EditableMediaGallery";

type Props = {
  media: Media[];
  gridSize?: number;
  onMediaLongPress?: (uri: string) => void;
} & ViewProps;

const MediaGallery = ({
  media,
  gridSize = 4,
  onMediaLongPress,
  style,
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
    if (onMediaLongPress) {
      onMediaLongPress(imageUri);
    }
  };

  return (
    <View
      onLayout={handleOnLayout}
      style={[styles.wrapper, style]}
      {...viewProps}
    >
      {media.map(({ imageUri, videoUri }, index) => {
        return (
          <MediaGalleryItem
            key={imageUri}
            item={{ imageUri, videoUri }}
            index={index}
            imagesCount={media.length}
            gridSize={gridSize}
            style={{ width: imageSize, height: imageSize }}
            touchableProps={{
              onPress: () => handleOnImagePress(index),
              onLongPress: () => handleOnMediaLongPress(imageUri),
            }}
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
