import React, { useMemo } from "react";
import { Image, ImageProps } from "expo-image";
import { TouchableRipple, TouchableRippleProps } from "react-native-paper";
import { StyleSheet } from "react-native";
import { getBorderRadius } from "./utils";

type Props = {
  index: number;
  imagesCount: number;
  gridSize: number;
  touchableProps: Omit<TouchableRippleProps, "children">;
} & ImageProps;

const ImageGridItem = ({
  index,
  imagesCount,
  gridSize,
  style,
  touchableProps,
  ...props
}: Props) => {
  const borderRadii = useMemo(
    () => getBorderRadius(index, imagesCount, gridSize),
    [index, imagesCount, gridSize],
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

export default ImageGridItem;

const styles = StyleSheet.create({
  touchable: {
    overflow: "hidden",
  },
});
