import useActiveColorScheme from "@/hooks/useActiveColorScheme";
import { lockAsync, OrientationLock } from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Portal } from "react-native-paper";
import Camera from "./Camera";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import FlingGesture from "../FlingGesture/FlingGesture";
import { CameraMode } from "expo-camera";
import NavigationAwareModal from "../NavigationAwareModal/NavigationAwareModal";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import { getCrashlytics, log } from "@react-native-firebase/crashlytics";

type Props = {
  isVisible: boolean;
  onClose: () => void;
  onPictureSaved: (uri: string) => void;
  onVideoSaved: (uri: string) => void;
  initialMode: CameraMode;
};

const CameraModal = ({
  isVisible,
  onClose,
  onPictureSaved,
  onVideoSaved,
  initialMode,
}: Props) => {
  const theme = useCustomTheme();
  const { statusBarStyle } = useActiveColorScheme();

  useEffect(() => {
    if (isVisible) {
      log(getCrashlytics(), "CameraModal - Locking orientation to all");
      lockAsync(OrientationLock.ALL);
    } else {
      log(getCrashlytics(), "CameraModal - Locking orientation to portrait");
      lockAsync(OrientationLock.PORTRAIT);
    }
  }, [isVisible]);

  return (
    <Portal>
      <NavigationAwareModal
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
              initialMode={initialMode}
            />
          </FlingGesture>
        </GestureHandlerRootView>
      </NavigationAwareModal>
    </Portal>
  );
};

export default CameraModal;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
