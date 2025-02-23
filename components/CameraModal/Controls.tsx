import { spacing } from "@/constants/theme";
import { CameraMode, CameraType, FlashMode } from "expo-camera";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { FAB, IconButton, Text } from "react-native-paper";
import CustomMenu from "../CustomMenu/CustomMenu";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import { Orientation } from "expo-screen-orientation";
import { isPortrait } from "@/utils/orientation";

type Props = {
  isCameraReady: boolean;
  facing: CameraType;
  onFacingChange: (facing: CameraType) => void;
  cameraMode: CameraMode;
  onCameraModeChange: (mode: CameraMode) => void;
  onPicturePress: () => void;
  onRecordPress: () => void;
  onStopRecordingPress: () => void;
  isRecording: boolean;
  recordingTime: string;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  flash: FlashMode;
  onFlashChange: (flash: FlashMode) => void;
  torch: boolean;
  onTorchChange: (torch: boolean) => void;
  orientation: Orientation;
};

const Controls = ({
  isCameraReady,
  facing,
  onFacingChange,
  cameraMode,
  onCameraModeChange,
  onPicturePress,
  onRecordPress,
  onStopRecordingPress,
  isRecording,
  recordingTime,
  zoom,
  onZoomChange,
  flash,
  onFlashChange,
  torch,
  onTorchChange,
  orientation,
}: Props) => {
  const theme = useCustomTheme();

  const onLowerZoom = () => {
    const newZoom = Math.max(0, zoom - 20);
    onZoomChange(newZoom);
  };

  const onHigherZoom = () => {
    const newZoom = Math.min(100, zoom + 20);
    onZoomChange(newZoom);
  };

  const toggleFacing = () => {
    onFacingChange(facing === "back" ? "front" : "back");
  };

  const toggleTorch = () => {
    onTorchChange(!torch);
  };

  const flashMenuItems = [
    {
      title: "Auto",
      onPress: () => onFlashChange("auto"),
      leadingIcon: "flash-auto",
    },
    {
      title: "On",
      onPress: () => onFlashChange("on"),
      leadingIcon: "flash",
    },
    {
      title: "Off",
      onPress: () => onFlashChange("off"),
      leadingIcon: "flash-off",
    },
  ];

  const flashIcon = {
    auto: "flash-auto",
    on: "flash",
    off: "flash-off",
  }[flash];

  const toggleCameraMode = () => {
    onCameraModeChange(cameraMode === "picture" ? "video" : "picture");
  };

  const cameraModeIcon = {
    picture: "camera",
    video: "video",
  }[cameraMode];

  const {
    wrapperStyle,
    topWrapperStyle,
    topButtonsWrapperStyle,
    bottomWrapperStyle,
  } = useMemo(() => {
    return isPortrait(orientation)
      ? // Portrait styles
        {
          wrapperStyle: styles.portraitWrapper,
          topWrapperStyle: styles.portraitTopWrapper,
          topButtonsWrapperStyle: styles.portraitTopButtonsWrapper,
          bottomWrapperStyle: styles.portraitBottomWrapper,
        }
      : // Landscape styles
        {
          wrapperStyle: styles.landscapeWrapper,
          topWrapperStyle: styles.landscapeTopWrapper,
          topButtonsWrapperStyle: styles.landscapeTopButtonsWrapper,
          bottomWrapperStyle: styles.landscapeBottomButtonsWrapper,
        };
  }, [orientation]);

  return (
    <View style={[wrapperStyle, { backgroundColor: theme.colors.backdrop }]}>
      <View style={topWrapperStyle}>
        <View style={topButtonsWrapperStyle}>
          <IconButton
            icon={torch ? "flashlight" : "flashlight-off"}
            onPress={toggleTorch}
            disabled={isRecording}
            iconColor="white"
          />
          {cameraMode === "picture" && (
            <CustomMenu menuItems={flashMenuItems}>
              {({ openMenu }) => (
                <IconButton
                  icon={flashIcon}
                  onPress={openMenu}
                  iconColor="white"
                />
              )}
            </CustomMenu>
          )}
        </View>
        <View style={topButtonsWrapperStyle}>
          <IconButton
            icon="magnify-minus"
            onPress={onLowerZoom}
            disabled={zoom === 0 || isRecording}
            iconColor="white"
          />
          <Text variant="bodySmall" style={styles.zoomText}>
            {zoom}%
          </Text>
          <IconButton
            icon="magnify-plus"
            onPress={onHigherZoom}
            disabled={zoom === 100 || isRecording}
            iconColor="white"
          />
        </View>
      </View>
      <View style={bottomWrapperStyle}>
        <IconButton
          onPress={toggleFacing}
          icon="camera-flip"
          disabled={isRecording}
          iconColor="white"
        />
        {cameraMode === "picture" ? (
          <FAB
            icon="record"
            onPress={onPicturePress}
            color="transparent"
            disabled={!isCameraReady}
          />
        ) : isRecording ? (
          <FAB
            icon="stop"
            onPress={onStopRecordingPress}
            label={recordingTime}
          />
        ) : (
          <FAB
            icon="record"
            onPress={onRecordPress}
            disabled={!isCameraReady}
          />
        )}
        <IconButton
          onPress={toggleCameraMode}
          icon={cameraModeIcon}
          disabled={isRecording}
          iconColor="white"
        />
      </View>
    </View>
  );
};

export default Controls;

const styles = StyleSheet.create({
  portraitWrapper: {
    flexDirection: "column",
    paddingHorizontal: spacing.spaceSmall,
    paddingBottom: spacing.spaceLarge,
    paddingTop: spacing.spaceSmall,
  },
  portraitTopWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.spaceMedium,
  },
  portraitTopButtonsWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  portraitBottomWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  landscapeWrapper: {
    flexDirection: "row",
    paddingVertical: spacing.spaceSmall,
    paddingRight: spacing.spaceLarge,
    paddingLeft: spacing.spaceSmall,
  },
  landscapeTopWrapper: {
    flexDirection: "column-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: spacing.spaceMedium,
  },
  landscapeTopButtonsWrapper: {
    flexDirection: "column-reverse",
    alignItems: "center",
  },
  landscapeBottomButtonsWrapper: {
    flexDirection: "column-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  zoomText: {
    color: "white",
  },
});
