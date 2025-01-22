import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Media } from "../EditableMediaGallery";
import { Appbar, Modal, Portal } from "react-native-paper";
import { StyleSheet } from "react-native";
import {
  Directions,
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { runOnJS } from "react-native-reanimated";
import PreviewItem, { AppearFrom } from "./PreviewItem";
import { View } from "react-native";
import { lockAsync, OrientationLock } from "expo-screen-orientation";
import { spacing } from "@/constants/theme";
import useActiveColorScheme from "@/hooks/useActiveColorScheme";

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
  const { theme, statusBarStyle } = useActiveColorScheme();
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [appearFrom, setAppearFrom] = useState<AppearFrom>("bottom");

  useEffect(() => {
    if (isVisible) {
      setActiveIndex(initialIndex);
    }
  }, [initialIndex, isVisible]);

  useEffect(() => {
    if (isVisible) {
      lockAsync(OrientationLock.ALL);
    } else {
      lockAsync(OrientationLock.PORTRAIT);
    }
  }, [isVisible]);

  const handleOnClose = useCallback(() => {
    setAppearFrom("bottom");
    onClose();
  }, [onClose]);

  const flingDown = useMemo(() => {
    return Gesture.Fling()
      .direction(Directions.DOWN)
      .onEnd(() => runOnJS(handleOnClose)());
  }, [handleOnClose]);

  const flingLeft = useMemo(() => {
    const switchToNext = () => {
      if (activeIndex === media.length - 1) {
        setActiveIndex(0);
      } else {
        setActiveIndex(activeIndex + 1);
      }
      setAppearFrom("right");
    };

    return Gesture.Fling()
      .direction(Directions.LEFT)
      .onEnd(() => runOnJS(switchToNext)());
  }, [media, activeIndex]);

  const flingRight = useMemo(() => {
    const switchToPrevious = () => {
      if (activeIndex === 0) {
        setActiveIndex(media.length - 1);
      } else {
        setActiveIndex(activeIndex - 1);
      }
      setAppearFrom("left");
    };

    return Gesture.Fling()
      .direction(Directions.RIGHT)
      .onEnd(() => runOnJS(switchToPrevious)());
  }, [media, activeIndex]);

  return (
    <Portal>
      <Modal
        visible={isVisible}
        onDismiss={handleOnClose}
        contentContainerStyle={styles.modalContentContainer}
      >
        <StatusBar
          backgroundColor={theme.colors.surface}
          style={statusBarStyle}
        />
        <GestureHandlerRootView>
          <Appbar.Header statusBarHeight={0} mode="center-aligned">
            <Appbar.BackAction onPress={handleOnClose} />
            <Appbar.Content title={`${activeIndex + 1} of ${media.length}`} />
          </Appbar.Header>
          <GestureDetector
            gesture={Gesture.Race(flingDown, flingLeft, flingRight)}
          >
            <View collapsable={false} style={styles.itemWrapper}>
              <PreviewItem
                item={media[activeIndex]}
                appearFrom={appearFrom}
                key={activeIndex}
              />
            </View>
          </GestureDetector>
        </GestureHandlerRootView>
      </Modal>
    </Portal>
  );
};

export default MediaGalleryPreview;

const styles = StyleSheet.create({
  modalContentContainer: {
    flex: 1,
  },
  itemWrapper: {
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    top: spacing.spaceSmall,
    left: spacing.spaceSmall,
  },
  activeIndex: {
    position: "absolute",
    top: spacing.spaceMedium,
    right: spacing.spaceSmall,
  },
});
