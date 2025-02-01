import React, { useCallback, useEffect, useState } from "react";
import { Media } from "../EditableMediaGallery";
import { Appbar, Modal, Portal } from "react-native-paper";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import PreviewItem from "./PreviewItem";
import { View } from "react-native";
import { lockAsync, OrientationLock } from "expo-screen-orientation";
import { spacing } from "@/constants/theme";
import useActiveColorScheme from "@/hooks/useActiveColorScheme";
import FlingGesture from "@/components/FlingGesture/FlingGesture";
import { FadeInViewAppearFrom } from "@/components/FadeInView/FadeInView";

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
  const [appearFrom, setAppearFrom] = useState<FadeInViewAppearFrom>("bottom");

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

  const onFlingLeft = useCallback(() => {
    if (activeIndex === media.length - 1) {
      setActiveIndex(0);
    } else {
      setActiveIndex(activeIndex + 1);
    }
    setAppearFrom("right");
  }, [activeIndex, media.length]);

  const onFlingRight = useCallback(() => {
    if (activeIndex === 0) {
      setActiveIndex(media.length - 1);
    } else {
      setActiveIndex(activeIndex - 1);
    }
    setAppearFrom("left");
  }, [activeIndex, media.length]);

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
          <FlingGesture
            onFlingDown={handleOnClose}
            onFlingLeft={onFlingLeft}
            onFlingRight={onFlingRight}
          >
            <View collapsable={false} style={styles.itemWrapper}>
              <PreviewItem
                item={media[activeIndex]}
                appearFrom={appearFrom}
                key={activeIndex}
              />
            </View>
          </FlingGesture>
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
