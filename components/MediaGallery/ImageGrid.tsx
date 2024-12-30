import React, { useState } from "react";
import { LayoutChangeEvent, StyleSheet, View, ViewProps } from "react-native";
import ImageGridItem from "./ImageGridItem";

type Props = {
  imagesUri: string[];
  onImagePress: (index: number) => void;
  gridSize?: number;
} & ViewProps;

const ImageGrid = ({
  imagesUri,
  gridSize = 3,
  style,
  onImagePress,
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

  const imageSize = gridWidth / gridSize;

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
            }}
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
