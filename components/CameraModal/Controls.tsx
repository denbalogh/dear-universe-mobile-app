import { spacing } from "@/constants/theme";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import { CameraMode, CameraType, FlashMode } from "expo-camera";
import React from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { FAB, IconButton } from "react-native-paper";
import Slider from "@react-native-community/slider";
import CustomMenu from "../CustomMenu/CustomMenu";
import { CustomOrientation } from "@/hooks/useScreenOrientation";

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
  mute: boolean;
  onMuteChange: (mute: boolean) => void;
  orientation: CustomOrientation;
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
  mute,
  onMuteChange,
  orientation,
}: Props) => {
  const theme = useCustomTheme();
  const { width, height } = useWindowDimensions();

  const sliderWidthPortrait = width - 250;
  const sliderWidthLandscape = height - 250;

  const onLowerZoom = () => {
    const newZoom = Math.max(0, zoom - 0.1);
    onZoomChange(newZoom);
  };

  const onHigherZoom = () => {
    const newZoom = Math.min(1, zoom + 0.1);
    onZoomChange(newZoom);
  };

  const toggleFacing = () => {
    onFacingChange(facing === "back" ? "front" : "back");
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

  const flashComponent = (
    <CustomMenu menuItems={flashMenuItems}>
      {({ openMenu }) => <IconButton icon={flashIcon} onPress={openMenu} />}
    </CustomMenu>
  );

  const toggleMute = () => {
    onMuteChange(!mute);
  };

  const toggleCameraMode = () => {
    onCameraModeChange(cameraMode === "picture" ? "video" : "picture");
  };

  const cameraModeIcon = {
    picture: "camera",
    video: "video",
  }[cameraMode];

  if (orientation === "portrait") {
    return (
      <View
        style={[
          styles.portraitWrapper,
          { backgroundColor: theme.colors.backdrop },
        ]}
      >
        <View style={styles.portraitTopButtonsWrapper}>
          {flashComponent}
          <View style={styles.portraitSliderWrapper}>
            <IconButton icon="magnify-minus" onPress={onLowerZoom} />
            <Slider
              style={{ width: sliderWidthPortrait }}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor={theme.colors.secondary}
              thumbTintColor={theme.colors.primary}
              value={zoom}
              onSlidingComplete={onZoomChange}
            />
            <IconButton icon="magnify-plus" onPress={onHigherZoom} />
          </View>
          <IconButton
            icon={mute ? "volume-off" : "volume-high"}
            onPress={toggleMute}
          />
        </View>
        <View style={styles.portraitBottomButtonsWrapper}>
          <IconButton
            onPress={toggleFacing}
            icon="camera-flip"
            disabled={isRecording}
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
          />
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.landscapeWrapper,
        { backgroundColor: theme.colors.backdrop },
      ]}
    >
      <View style={[styles.landscapeTopButtonsWrapper]}>
        <IconButton
          icon={mute ? "volume-off" : "volume-high"}
          onPress={toggleMute}
        />
        <View style={styles.landscapeSliderWrapper}>
          <IconButton icon="magnify-plus" onPress={onHigherZoom} />
          <Slider
            style={[styles.landscapeSlider, { width: sliderWidthLandscape }]}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.secondary}
            thumbTintColor={theme.colors.primary}
            value={zoom}
            onSlidingComplete={onZoomChange}
          />
          <IconButton icon="magnify-minus" onPress={onLowerZoom} />
        </View>
        {flashComponent}
      </View>
      <View style={styles.landscapeBottomButtonsWrapper}>
        <IconButton
          onPress={toggleCameraMode}
          icon={cameraModeIcon}
          disabled={isRecording}
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
          onPress={toggleFacing}
          icon="camera-flip"
          disabled={isRecording}
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
  portraitTopButtonsWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.spaceMedium,
  },
  portraitSliderWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  portraitBottomButtonsWrapper: {
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
  landscapeTopButtonsWrapper: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: spacing.spaceMedium,
  },
  landscapeSliderWrapper: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: 20,
    flex: 1,
  },
  landscapeSlider: {
    transform: [{ rotateZ: "-90deg" }],
    transformOrigin: "center",
    height: 20,
  },
  landscapeBottomButtonsWrapper: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
