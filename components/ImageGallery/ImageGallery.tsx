import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { ImageProps } from "expo-image";
import getBorderRadius from "./getBorderRadius";
import CustomImage, { CustomImageProps } from "./CustomImage";

type ImageGalleryItemProps = {
  index: number;
  imagesCount: number;
  imagesPerRow?: number;
} & CustomImageProps;

const ImageGalleryItem = ({
  index,
  imagesCount,
  imagesPerRow = 3,
  ...props
}: ImageGalleryItemProps) => {
  const borderRadii = useMemo(
    () => getBorderRadius(index, imagesCount, imagesPerRow),
    [index, imagesCount, imagesPerRow],
  );

  return (
    <CustomImage
      {...props}
      style={[styles.galleryImageItem, { width: `${100 / imagesPerRow}%` }]}
      imageProps={{ ...props.imageProps, style: { ...borderRadii } }}
      loadingStyle={{ ...borderRadii }}
    />
  );
};

type Props = {
  images: ImageProps[];
  imagesPerRow?: number;
};

const ImageGallery = ({ images, imagesPerRow = 3 }: Props) => {
  return (
    <View style={styles.wrapper}>
      {images.map((image, index) => (
        <ImageGalleryItem
          key={index}
          imageProps={image}
          index={index}
          imagesCount={images.length}
          imagesPerRow={imagesPerRow}
          touchableProps={{ onPress: () => console.warn("hello", index) }}
        />
      ))}
    </View>
  );
};

export default ImageGallery;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  galleryImageItem: {
    height: 100,
  },
});
