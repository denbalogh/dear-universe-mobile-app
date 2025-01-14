import React, { useState } from "react";
import { LayoutChangeEvent, StyleSheet, View, ViewProps } from "react-native";
import ImageGridItem from "./ImageGridItem";

type Props = {
  imagesUri: string[];
  onImagePress: (index: number) => void;
  onImageLongPress?: (uri: string) => void;
  gridSize?: number;
  showPlayIcon?: boolean;
} & ViewProps;

const ImageGrid = ({
  imagesUri,
  onImagePress,
  onImageLongPress,
  gridSize = 3,
  showPlayIcon = false,
  style,
  ...props
}: Props) => {
  const [gridWidth, setGridWidth] = useState(0);

  const handleOnLayout = ({
    nativeEvent: {
      layout: { width },
    },
  }: LayoutChangeEvent) => {
    setGridWidth(width);
  };

  const imageSize = Math.floor((gridWidth / gridSize) * 1000) / 1000; // Floor to 3 decimal places, because it was wrapping incorrectly

  return (
    <View onLayout={handleOnLayout} style={[styles.wrapper, style]} {...props}>
      {imagesUri.map((uri, index) => {
        return (
          <ImageGridItem
            key={index}
            source={{ uri }}
            index={index}
            imagesCount={imagesUri.length}
            gridSize={gridSize}
            style={{ width: imageSize, height: imageSize }}
            touchableProps={{
              onPress: () => onImagePress(index),
              onLongPress: () => onImageLongPress?.(uri),
            }}
            showPlayIcon={showPlayIcon}
          />
        );
      })}
    </View>
  );
};

export default ImageGrid;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
