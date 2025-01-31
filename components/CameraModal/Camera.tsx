import { CameraMode, CameraType, CameraView, FlashMode } from "expo-camera";
import React, { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import Controls from "./Controls";
import { format } from "date-fns";
import { IconButton } from "react-native-paper";
import { spacing } from "@/constants/theme";
import useScreenOrientation from "@/hooks/useScreenOrientation";

type Props = {
  active: boolean;
  onCloseModal: () => void;
};

const Camera = ({ active, onCloseModal }: Props) => {
  const orientation = useScreenOrientation();

  const [facing, setFacing] = useState<CameraType>("back");
  const [cameraMode, setCameraMode] = useState<CameraMode>("picture");
  const [zoom, setZoom] = useState(0);
  const [flash, setFlash] = useState<FlashMode>("auto");
  const [mute, setMute] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const handleOnCameraReady = useCallback(() => {
    setIsCameraReady(true);
  }, []);

  const [isRecording, setIsRecording] = useState(false);

  const onStartRecording = () => {
    setIsRecording(true);
  };

  const onStopRecording = () => {
    setIsRecording(false);
  };

  const recordingTime = format(new Date(1000), "mm:ss");

  return (
    <CameraView
      active={active}
      style={[
        styles.wrapper,
        { flexDirection: orientation === "landscape" ? "row" : "column" },
      ]}
      facing={facing}
      mode={cameraMode}
      zoom={zoom}
      onCameraReady={handleOnCameraReady}
    >
      <Controls
        isCameraReady={isCameraReady}
        facing={facing}
        onFacingChange={setFacing}
        cameraMode={cameraMode}
        onCameraModeChange={setCameraMode}
        onPicturePress={() => console.log("picture")}
        onRecordPress={onStartRecording}
        onStopRecordingPress={onStopRecording}
        isRecording={isRecording}
        recordingTime={recordingTime}
        zoom={zoom}
        onZoomChange={setZoom}
        flash={flash}
        onFlashChange={setFlash}
        mute={mute}
        onMuteChange={setMute}
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
