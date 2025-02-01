import useActiveColorScheme from "@/hooks/useActiveColorScheme";
import { lockAsync, OrientationLock } from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Modal, Portal } from "react-native-paper";
import Camera from "./Camera";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import FlingGesture from "../FlingGesture/FlingGesture";

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
          <FlingGesture onFlingDown={onClose}>
            <Camera
              active={isVisible}
              onCloseModal={onClose}
              onPictureSaved={onPictureSaved}
              onVideoSaved={onVideoSaved}
            />
          </FlingGesture>
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
