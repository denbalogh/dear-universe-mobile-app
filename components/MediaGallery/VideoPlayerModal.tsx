import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Appbar, Modal, Portal } from "react-native-paper";
import { StyleSheet } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import { lockAsync, OrientationLock } from "expo-screen-orientation";
import { roundness, spacing } from "@/constants/theme";
import {
  Directions,
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";

type Props = {
  videosUri: string[];
  initialIndex: number;
  isVisible: boolean;
  onClose: () => void;
};

const VideoPlayerModal = ({
  videosUri,
  initialIndex,
  isVisible,
  onClose,
}: Props) => {
  const theme = useCustomTheme();
  const player = useVideoPlayer(videosUri[initialIndex]);
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const onFullscreenEnter = async () => {
    await lockAsync(OrientationLock.ALL);
  };

  const onFullscreenExit = async () => {
    await lockAsync(OrientationLock.PORTRAIT);
  };

  useEffect(() => {
    player.replace(videosUri[initialIndex]);
    setActiveIndex(initialIndex);
  }, [videosUri, initialIndex, player]);

  useEffect(() => {
    if (isVisible) {
      player.play();
    } else {
      player.pause();
    }
  }, [isVisible, player]);

  const isFirstVideo = activeIndex === 0;
  const isLastVideo = activeIndex === videosUri.length - 1;

  const switchToPreviousVideo = useCallback(() => {
    if (!isFirstVideo) {
      player.replace(videosUri[activeIndex - 1]);
      setActiveIndex(activeIndex - 1);
    }
  }, [activeIndex, player, videosUri, isFirstVideo]);

  const flingRight = useMemo(() => {
    return Gesture.Fling()
      .direction(Directions.RIGHT)
      .onEnd(() => runOnJS(switchToPreviousVideo)());
  }, [switchToPreviousVideo]);

  const switchToNextVideo = useCallback(() => {
    if (!isLastVideo) {
      player.replace(videosUri[activeIndex + 1]);
      setActiveIndex(activeIndex + 1);
    }
  }, [activeIndex, player, videosUri, isLastVideo]);

  const flingLeft = useMemo(() => {
    return Gesture.Fling()
      .direction(Directions.LEFT)
      .onEnd(() => runOnJS(switchToNextVideo)());
  }, [switchToNextVideo]);

  return (
    <Portal>
      <Modal
        visible={isVisible}
        onDismiss={onClose}
        contentContainerStyle={styles.flex}
      >
        <StatusBar backgroundColor={theme.colors.surface} />
        <Appbar.Header
          style={{ backgroundColor: theme.colors.surface }}
          statusBarHeight={0}
          mode="center-aligned"
        >
          <Appbar.BackAction onPress={onClose} />
          <Appbar.Content title={`${activeIndex + 1} of ${videosUri.length}`} />
          <Appbar.Action
            icon="skip-previous"
            disabled={isFirstVideo}
            onPress={switchToPreviousVideo}
          />
          <Appbar.Action
            icon="skip-next"
            disabled={isLastVideo}
            onPress={switchToNextVideo}
          />
        </Appbar.Header>
        <GestureHandlerRootView>
          <GestureDetector gesture={Gesture.Race(flingLeft, flingRight)}>
            <VideoView
              style={[styles.flex, styles.video]}
              player={player}
              allowsFullscreen={true}
              allowsPictureInPicture={false}
              onFullscreenEnter={onFullscreenEnter}
              onFullscreenExit={onFullscreenExit}
            />
          </GestureDetector>
        </GestureHandlerRootView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  video: {
    backgroundColor: "black",
  },
  backButton: {
    position: "absolute",
    top: spacing.spaceSmall,
    left: spacing.spaceSmall,
  },
  positionWrapper: {
    position: "absolute",
    top: spacing.spaceMedium,
    right: spacing.spaceMedium,
    padding: spacing.spaceSmall,
    borderRadius: roundness,
  },
});

export default VideoPlayerModal;
