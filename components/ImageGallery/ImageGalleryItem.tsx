import React, { useMemo } from "react";
import { StyleSheet } from "react-native";
import getBorderRadius from "./getBorderRadius";
import CustomImage, { CustomImageProps } from "../CustomImage/CustomImage";

type Props = {
  index: number;
  imagesCount: number;
} & CustomImageProps;

const ImageGalleryItem = ({ index, imagesCount, ...props }: Props) => {
  const borderRadii = useMemo(
    () => getBorderRadius(index, imagesCount),
    [index, imagesCount],
  );

  return (
    <CustomImage
      {...props}
      style={styles.galleryImage}
      imageProps={{ ...props.imageProps, style: { ...borderRadii } }}
      loadingStyle={{ ...borderRadii }}
    />
  );
};

export default ImageGalleryItem;

const styles = StyleSheet.create({
  galleryImage: {
    width: "25%",
    height: 80,
  },
});
