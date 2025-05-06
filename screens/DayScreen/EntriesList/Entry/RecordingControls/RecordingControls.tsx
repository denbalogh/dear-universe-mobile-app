import { roundness, spacing } from "@/common/constants/theme";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Button, IconButton, useTheme } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export const UPDATE_INTERVAL = 50;

type Props = {
  time: string;
  isRecording: boolean;
  hasRecordingStarted: boolean;
  hasPermissions: boolean;
  onRequestPermissionsPress: () => void;
  onRecordPress: () => void;
  onPausePress: () => void;
  onContinuePress: () => void;
  onStopPress: () => void;
  onDiscardPress: () => void;
  metering?: number;
};

const Controls = ({
  time,
  isRecording,
  hasRecordingStarted,
  hasPermissions,
  onContinuePress,
  onDiscardPress,
  onPausePress,
  onRecordPress,
  onStopPress,
  onRequestPermissionsPress,
  metering = 0,
}: Props) => {
  const theme = useTheme();

  const scale = useSharedValue(metering);

  useEffect(() => {
    if (isRecording) {
      scale.value = withTiming(metering, { duration: UPDATE_INTERVAL });
    } else {
      scale.value = withTiming(1, { duration: 300 });
    }
  }, [isRecording, metering, scale]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scaleY: scale.value }],
    };
  });

  const showSideButtons = hasRecordingStarted && !isRecording;

  return (
    <View style={styles.wrapper}>
      {hasRecordingStarted && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: theme.colors.primaryContainer },
            styles.meteringAnimated,
            animatedStyles,
          ]}
          testID="metering-animated"
        />
      )}
      {showSideButtons && (
        <IconButton
          icon="delete"
          onPress={onDiscardPress}
          iconColor={theme.colors.error}
          accessibilityLabel="Discard recording"
          style={styles.iconButton}
        />
      )}
      {!hasRecordingStarted ? (
        <Button
          onPress={hasPermissions ? onRecordPress : onRequestPermissionsPress}
          icon="microphone"
          mode="outlined"
          style={styles.button}
        >
          Recording
        </Button>
      ) : isRecording ? (
        <Button
          onPress={onPausePress}
          icon="pause"
          mode="text"
          style={[styles.button, styles.recordButton]}
          accessibilityLabel="Pause recording"
        >
          {`Pause recording | ${time}`}
        </Button>
      ) : (
        <Button
          onPress={onContinuePress}
          icon="record"
          mode="text"
          style={[styles.button, styles.recordButton]}
          accessibilityLabel="Continue recording"
        >
          {`Continue recording | ${time}`}
        </Button>
      )}
      {showSideButtons && (
        <IconButton
          icon="stop"
          mode="contained-tonal"
          onPress={onStopPress}
          accessibilityLabel="Stop recording"
          style={styles.iconButton}
        />
      )}
    </View>
  );
};

export default Controls;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: roundness,
  },
  button: {
    flex: 1,
  },
  recordButton: {
    marginVertical: spacing.spaceExtraSmall,
  },
  iconButton: {
    marginVertical: 0,
  },
  meteringAnimated: {
    borderRadius: roundness,
    transformOrigin: "bottom",
  },
});
