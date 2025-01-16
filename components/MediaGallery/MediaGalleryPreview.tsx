import React, { useCallback, useMemo, useRef, useState } from "react";
import { Media } from "./EditableMediaGallery";
import { Modal, Portal } from "react-native-paper";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { View } from "react-native";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import {
  Directions,
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import { StatusBar } from "expo-status-bar";
import VideoPlayer from "./VideoPlayer";
import { runOnJS } from "react-native-reanimated";

type Props = {
  media: Media[];
  initialIndex: number;
  isVisible: boolean;
  onClose: () => void;
};

const MediaGalleryPreview = ({
  media,
  initialIndex,
  isVisible,
  onClose,
}: Props) => {
  const theme = useCustomTheme();
  const { width, height } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const flatListRef = useRef<FlatList<Media>>(null);

  const onScrollEnd = useCallback(
    ({
      nativeEvent: { contentOffset, layoutMeasurement },
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
      setActiveIndex(Math.floor(contentOffset.x / layoutMeasurement.width));
    },
    [],
  );

  const handleRenderItem = useCallback(
    ({
      item: { imageUri, videoUri },
      index,
    }: {
      item: Media;
      index: number;
    }) => {
      return (
        <View style={[styles.itemwrapper, { width, height }]}>
          {videoUri ? (
            <VideoPlayer
              sourceUri={videoUri}
              style={styles.video}
              shouldPlay={index === activeIndex}
            />
          ) : (
            <ImageZoom uri={imageUri} isDoubleTapEnabled={true} />
          )}
        </View>
      );
    },
    [height, width, activeIndex],
  );

  const handleGetItemLayout = useCallback(
    (_: any, index: number) => {
      return {
        length: width,
        offset: width * index,
        index,
      };
    },
    [width],
  );

  const flingDown = useMemo(() => {
    return Gesture.Fling()
      .direction(Directions.DOWN)
      .onEnd(() => runOnJS(onClose)());
  }, [onClose]);

  return (
    <Portal>
      <Modal visible={isVisible} onDismiss={onClose}>
        <StatusBar backgroundColor="black" style="light" />
        <GestureHandlerRootView style={[styles.wrapper, { width, height }]}>
          <GestureDetector gesture={flingDown}>
            <FlatList<Media>
              ref={flatListRef}
              horizontal={true}
              data={media}
              renderItem={handleRenderItem}
              getItemLayout={handleGetItemLayout}
              initialNumToRender={3}
              maxToRenderPerBatch={3}
              pagingEnabled={true}
              initialScrollIndex={initialIndex}
              windowSize={3}
              onMomentumScrollEnd={onScrollEnd}
            />
          </GestureDetector>
        </GestureHandlerRootView>
      </Modal>
    </Portal>
  );
};

export default MediaGalleryPreview;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "black",
  },
  itemwrapper: {
    backgroundColor: "black",
  },
  video: {
    flex: 1,
  },
});
