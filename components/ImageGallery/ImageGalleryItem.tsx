import React, { useMemo } from "react";
import getBorderRadius from "./getBorderRadius";
import { Image, ImageProps } from "expo-image";
import { TouchableRipple, TouchableRippleProps } from "react-native-paper";
import { StyleSheet } from "react-native";

type Props = {
  index: number;
  imagesCount: number;
  cols: number;
  touchableProps: Omit<TouchableRippleProps, "children">;
} & ImageProps;

const ImageGalleryItem = ({
  index,
  imagesCount,
  cols,
  style,
  touchableProps,
  ...props
}: Props) => {
  const borderRadii = useMemo(
    () => getBorderRadius(index, imagesCount, cols),
    [index, imagesCount, cols],
  );

  return (
    <TouchableRipple
      {...touchableProps}
      style={[styles.touchable, { ...borderRadii }]}
      background={{
        borderless: false,
        foreground: true,
      }}
    >
      <Image style={[style, { ...borderRadii }]} {...props} />
    </TouchableRipple>
  );
};

export default ImageGalleryItem;

const styles = StyleSheet.create({
  touchable: {
    overflow: "hidden",
  },
});
