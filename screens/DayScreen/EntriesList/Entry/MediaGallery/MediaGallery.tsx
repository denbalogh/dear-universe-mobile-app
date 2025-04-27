import React, { useCallback, useMemo, useState } from "react";
import { LayoutChangeEvent, StyleSheet } from "react-native";
import MediaGalleryItem from "./MediaGalleryItem";
import { View } from "react-native";
import MediaGalleryPreview from "./MediaGalleryPreview/MediaGalleryPreview";
import { Media } from "@/common/types/Media";

type Props = {
  media: Media[];
  gridSize?: number;
};

const MediaGallery = ({ media, gridSize = 5 }: Props) => {
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

  const imageSize = gridWidth / gridSize;

  const handleOnPreviewClose = () => {
    setIsPreviewVisible(false);
  };

  const handleOnImagePress = useCallback((index: number) => {
    setInitialIndex(index);
    setIsPreviewVisible(true);
  }, []);

  const imageStyle = useMemo(
    () => ({ width: imageSize, height: imageSize, marginHorizontal: -0.001 }),
    [imageSize],
  );

  return (
    <View onLayout={handleOnLayout} style={styles.wrapper}>
      {media.map((item, index) => {
        return (
          <MediaGalleryItem
            key={item.uri}
            item={item}
            index={index}
            imagesCount={media.length}
            gridSize={gridSize}
            style={imageStyle}
            onPress={handleOnImagePress}
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
