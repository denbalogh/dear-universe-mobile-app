import { CameraMode, CameraType, CameraView, FlashMode } from "expo-camera";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import Controls from "./Controls";
import { format } from "date-fns/format";
import { IconButton } from "react-native-paper";
import { spacing } from "@/constants/theme";
import useScreenOrientation from "@/hooks/useScreenOrientation";
import useCameraPermissions from "@/hooks/useCameraPermissions";
import useBackHandler from "@/hooks/useBackHandler";
import logCrashlytics from "@/utils/logCrashlytics";
import { lockAsync, OrientationLock } from "expo-screen-orientation";
import { getOrientationLock, isLandscape } from "@/utils/orientation";

type Props = {
  active: boolean;
  onCloseModal: () => void;
  onPictureSaved: (uri: string) => void;
  onVideoSaved: (uri: string) => void;
  initialMode: CameraMode;
};

const Camera = ({
  active,
  onCloseModal,
  onPictureSaved,
  onVideoSaved,
  initialMode,
}: Props) => {
  const orientation = useScreenOrientation();

  const cameraRef = useRef<CameraView>(null);

  const [facing, setFacing] = useState<CameraType>("back");
  const [cameraMode, setCameraMode] = useState<CameraMode>(initialMode);
  const [zoom, setZoom] = useState(0);
  const [flash, setFlash] = useState<FlashMode>("auto");
  const [torch, setTorch] = useState(false);

  const [isCameraReady, setIsCameraReady] = useState(false);

  const handleOnCameraReady = useCallback(() => {
    setIsCameraReady(true);
  }, []);

  const closeCameraOnAndroidBackPress = useCallback(() => {
    onCloseModal();
    return true;
  }, [onCloseModal]);

  useBackHandler(closeCameraOnAndroidBackPress);

  const handlePicturePress = async () => {
    if (cameraRef.current) {
      logCrashlytics("Taking picture");
      const picture = await cameraRef.current.takePictureAsync({
        quality: 1.0,
        skipProcessing: false,
        shutterSound: false,
      });

      if (picture) {
        onPictureSaved(picture.uri);
      }
    }
  };

  const { microphoneGranted, requestMicrophonePermission } =
    useCameraPermissions();

  const recordingTimerId = useRef<NodeJS.Timeout | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTimeInMs, setRecordingTimeInMs] = useState(0);

  useEffect(() => {
    if (isRecording) {
      // Lock orientation to current orientation
      logCrashlytics("Locking orientation on video recording start");
      lockAsync(getOrientationLock(orientation)).then();
    } else {
      // Unlock orientation
      logCrashlytics("Unlocking orientation on video recording stop");
      lockAsync(OrientationLock.ALL).then();
    }
  }, [isRecording, orientation]);

  const onStartRecording = useCallback(async () => {
    if (cameraRef.current) {
      setIsRecording(true);

      recordingTimerId.current = setInterval(() => {
        setRecordingTimeInMs((prev) => prev + 1000);
      }, 1000);

      logCrashlytics("Recording video");
      const video = await cameraRef.current.recordAsync();

      if (video) {
        onVideoSaved(video.uri);
      }
    }
  }, [onVideoSaved]);

  const handleStartRecording = useCallback(() => {
    if (microphoneGranted) {
      onStartRecording();
    } else {
      requestMicrophonePermission(onStartRecording);
    }
  }, [microphoneGranted, requestMicrophonePermission, onStartRecording]);

  const onStopRecording = async () => {
    if (cameraRef.current) {
      setIsRecording(false);
      clearInterval(recordingTimerId.current as NodeJS.Timeout);
      setRecordingTimeInMs(0);

      logCrashlytics("Stopping video recording");
      await cameraRef.current.stopRecording();
    }
  };

  const recordingTimeFormatted = format(new Date(recordingTimeInMs), "mm:ss");

  return (
    <CameraView
      ref={cameraRef}
      active={active}
      style={[
        styles.wrapper,
        { flexDirection: isLandscape(orientation) ? "row" : "column" },
      ]}
      facing={facing}
      mode={cameraMode}
      zoom={zoom / 100}
      flash={flash}
      enableTorch={torch}
      onCameraReady={handleOnCameraReady}
    >
      <Controls
        isCameraReady={isCameraReady}
        facing={facing}
        onFacingChange={setFacing}
        cameraMode={cameraMode}
        onCameraModeChange={setCameraMode}
        onPicturePress={handlePicturePress}
        onRecordPress={handleStartRecording}
        onStopRecordingPress={onStopRecording}
        isRecording={isRecording}
        recordingTime={recordingTimeFormatted}
        zoom={zoom}
        onZoomChange={setZoom}
        flash={flash}
        onFlashChange={setFlash}
        torch={torch}
        onTorchChange={setTorch}
        orientation={orientation}
      />
      <IconButton
        style={styles.closeButton}
        icon="arrow-left"
        onPress={onCloseModal}
      />
    </CameraView>
  );
};

export default Camera;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },
  closeButton: {
    position: "absolute",
    left: spacing.spaceExtraSmall,
    top: spacing.spaceExtraSmall,
  },
});
