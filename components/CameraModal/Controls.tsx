import { spacing } from "@/constants/theme";
import { useCustomTheme } from "@/hooks/useCustomTheme";
import { CameraMode, CameraType, FlashMode } from "expo-camera";
import React, { useMemo } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { FAB, IconButton } from "react-native-paper";
import Slider from "@react-native-community/slider";
import CustomMenu from "../CustomMenu/CustomMenu";
import { CustomOrientation } from "@/hooks/useScreenOrientation";

const SLIDER_SPACE_FROM_WALL = 240;

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

  const sliderWidthPortrait = width - SLIDER_SPACE_FROM_WALL;
  const sliderWidthLandscape = height - SLIDER_SPACE_FROM_WALL;

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

  const {
    wrapperStyle,
    topButtonsWrapperStyle,
    sliderWrapperStyle,
    sliderStyle,
    bottomButtonsWrapperStyle,
  } = useMemo(() => {
    return orientation === "portrait"
      ? {
          wrapperStyle: [
            styles.portraitWrapper,
            { backgroundColor: theme.colors.backdrop },
          ],
          topButtonsWrapperStyle: styles.portraitTopButtonsWrapper,
          sliderWrapperStyle: styles.portraitSliderWrapper,
          sliderStyle: [{ width: sliderWidthPortrait }],
          bottomButtonsWrapperStyle: styles.portraitBottomButtonsWrapper,
        }
      : {
          wrapperStyle: [
            styles.landscapeWrapper,
            { backgroundColor: theme.colors.backdrop },
          ],
          topButtonsWrapperStyle: styles.landscapeTopButtonsWrapper,
          sliderWrapperStyle: styles.landscapeSliderWrapper,
          sliderStyle: [
            styles.landscapeSlider,
            { width: sliderWidthLandscape },
          ],
          bottomButtonsWrapperStyle: styles.landscapeBottomButtonsWrapper,
        };
  }, [orientation, sliderWidthPortrait, sliderWidthLandscape, theme.colors]);

  return (
    <View style={wrapperStyle}>
      <View style={topButtonsWrapperStyle}>
        <CustomMenu menuItems={flashMenuItems}>
          {({ openMenu }) => <IconButton icon={flashIcon} onPress={openMenu} />}
        </CustomMenu>
        <View style={sliderWrapperStyle}>
          <IconButton icon="magnify-minus" onPress={onLowerZoom} />
          <Slider
            style={sliderStyle}
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
          disabled={cameraMode === "picture"}
        />
      </View>
      <View style={bottomButtonsWrapperStyle}>
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
};

export default Controls;

const LANDSCAPE_SLIDER_HEIGHT = 20;

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
    flexDirection: "column-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: spacing.spaceMedium,
  },
  landscapeSliderWrapper: {
    flexDirection: "column-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    width: LANDSCAPE_SLIDER_HEIGHT,
    flex: 1,
  },
  landscapeSlider: {
    transform: [{ rotateZ: "-90deg" }],
    transformOrigin: "center",
    height: LANDSCAPE_SLIDER_HEIGHT,
  },
  landscapeBottomButtonsWrapper: {
    flexDirection: "column-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
