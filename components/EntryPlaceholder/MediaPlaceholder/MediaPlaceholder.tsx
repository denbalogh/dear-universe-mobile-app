import React, { useState } from "react";
import { LayoutChangeEvent, StyleSheet, ViewProps } from "react-native";
import MediaPlaceholderItem from "./MediaPlaceholderItem";
import { spacing } from "@/constants/theme";
import Animated, { AnimatedProps } from "react-native-reanimated";

const MediaPlaceholder = ({
  media,
  gridSize = 4,
  style,
}: {
  media: boolean[];
  gridSize?: number;
  style: AnimatedProps<ViewProps>["style"];
}) => {
  const [gridWidth, setGridWidth] = useState(0);

  if (media.length === 0) {
    return null;
  }

  const handleOnLayout = ({
    nativeEvent: {
      layout: { width },
    },
  }: LayoutChangeEvent) => {
    setGridWidth(width);
  };

  return (
    <Animated.View style={[styles.wrapper, style]} onLayout={handleOnLayout}>
      {media.map((isVideo, index) => {
        const itemSize = gridWidth / gridSize - 0.001; // to prevent incorrect wrapping

        const isLast = index === media.length - 1;
        const marginRight = isLast ? 0 : 1;

        return (
          <MediaPlaceholderItem
            key={index}
            index={index}
            imagesCount={media.length}
            gridSize={gridSize}
            style={{
              width: itemSize - marginRight,
              height: itemSize,
              marginRight,
            }}
            icon={isVideo ? "video" : "image"}
          />
        );
      })}
    </Animated.View>
  );
};

export default MediaPlaceholder;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: spacing.spaceExtraSmall,
  },
});
