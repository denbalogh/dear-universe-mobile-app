import React, { useEffect } from "react";
import { Media } from "../EditableMediaGallery";
import { StyleSheet } from "react-native";
import VideoPlayer from "./VideoPlayer";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { View } from "react-native";

export type AppearFrom = "left" | "right" | "bottom";

type Props = {
  item: Media;
  appearFrom: AppearFrom;
};

const PreviewItem = ({ item: { imageUri, videoUri }, appearFrom }: Props) => {
  const opacity = useSharedValue(0);
  const translate = useSharedValue(appearFrom === "left" ? -100 : 100);

  const animatedStylesFromSides = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translate.value }],
  }));

  const animatedStylesFromBottom = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translate.value }],
  }));

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
    translate.value = withTiming(0, { duration: 300 });
  }, [opacity, translate]);

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[
          styles.item,
          appearFrom === "bottom"
            ? animatedStylesFromBottom
            : animatedStylesFromSides,
        ]}
      >
        {videoUri ? (
          <VideoPlayer sourceUri={videoUri} style={styles.item} />
        ) : (
          <ImageZoom
            style={styles.item}
            uri={imageUri}
            isDoubleTapEnabled={true}
          />
        )}
      </Animated.View>
    </View>
  );
};

export default PreviewItem;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "black",
    flex: 1,
  },
  item: {
    flex: 1,
  },
});
