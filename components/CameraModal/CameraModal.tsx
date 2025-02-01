import useActiveColorScheme from "@/hooks/useActiveColorScheme";
import { lockAsync, OrientationLock } from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo } from "react";
import { StyleSheet } from "react-native";
import { Modal, Portal } from "react-native-paper";
import Camera from "./Camera";
import {
  Directions,
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

type Props = {
  isVisible: boolean;
  onClose: () => void;
  onPictureSaved: (uri: string) => void;
  onVideoSaved: (uri: string) => void;
};

const CameraModal = ({
  isVisible,
  onClose,
  onPictureSaved,
  onVideoSaved,
}: Props) => {
  const { theme, statusBarStyle } = useActiveColorScheme();

  useEffect(() => {
    if (isVisible) {
      lockAsync(OrientationLock.ALL);
    } else {
      lockAsync(OrientationLock.PORTRAIT);
    }
  }, [isVisible]);

  const flingDown = useMemo(() => {
    return Gesture.Fling()
      .direction(Directions.DOWN)
      .onEnd(() => runOnJS(onClose)());
  }, [onClose]);

  return (
    <Portal>
      <Modal
        visible={isVisible}
        onDismiss={onClose}
        contentContainerStyle={[
          styles.wrapper,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <StatusBar
          backgroundColor={theme.colors.background}
          style={statusBarStyle}
        />
        <GestureHandlerRootView>
          <GestureDetector gesture={flingDown}>
            <Camera
              active={isVisible}
              onCloseModal={onClose}
              onPictureSaved={onPictureSaved}
              onVideoSaved={onVideoSaved}
            />
          </GestureDetector>
        </GestureHandlerRootView>
      </Modal>
    </Portal>
  );
};

export default CameraModal;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
