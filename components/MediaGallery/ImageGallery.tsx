import React, { useState } from "react";
import ImageGrid from "./ImageGrid";
import { ViewProps } from "react-native";
import { lockAsync, OrientationLock } from "expo-screen-orientation";
import GalleryPreview from "./GalleryPreview";

type Props = {
  imagesUri: string[];
  gridSize?: number;
  onImageLongPress?: (index: number) => void;
} & ViewProps;

const ImageGallery = ({
  imagesUri,
  gridSize = 4,
  onImageLongPress,
  ...props
}: Props) => {
  const [isGalleryVisible, setIsGalleryVisible] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  const onImagePress = async (index: number) => {
    await lockAsync(OrientationLock.ALL);
    setInitialIndex(index);
    setIsGalleryVisible(true);
  };

  const handleGalleryPreviewClose = async () => {
    await lockAsync(OrientationLock.PORTRAIT);
    setIsGalleryVisible(false);
  };

  return (
    <>
      <ImageGrid
        {...props}
        gridSize={gridSize}
        imagesUri={imagesUri}
        onImagePress={onImagePress}
        onImageLongPress={onImageLongPress}
      />
      <GalleryPreview
        imagesUri={imagesUri}
        initialIndex={initialIndex}
        isVisible={isGalleryVisible}
        onClose={handleGalleryPreviewClose}
      />
    </>
  );
};

export default ImageGallery;
