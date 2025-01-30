import { spacing } from "@/constants/theme";
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
  metering = 1,
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

  return (
    <View style={styles.wrapper}>
      <View style={styles.buttonsWrapper}>
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
        <IconButton
          icon="delete"
          onPress={onDiscardPress}
          iconColor={theme.colors.error}
          disabled={!hasRecordingStarted || isRecording}
          accessibilityLabel="Discard recording"
        />
        {!hasRecordingStarted ? (
          <Button
            onPress={hasPermissions ? onRecordPress : onRequestPermissionsPress}
            icon="record"
            mode="elevated"
            style={styles.recordButton}
            accessibilityLabel="Start recording"
          >
            Record
          </Button>
        ) : isRecording ? (
          <Button
            onPress={onPausePress}
            icon="pause"
            mode="elevated"
            style={styles.recordButton}
            accessibilityLabel="Pause recording"
          >
            {`Pause | ${time}`}
          </Button>
        ) : (
          <Button
            onPress={onContinuePress}
            icon="record"
            mode="elevated"
            style={styles.recordButton}
            accessibilityLabel="Continue recording"
          >
            {`Continue | ${time}`}
          </Button>
        )}
        <IconButton
          icon="stop"
          mode="contained-tonal"
          onPress={onStopPress}
          disabled={!hasRecordingStarted || isRecording}
          accessibilityLabel="Stop recording"
        />
      </View>
    </View>
  );
};

export default Controls;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonsWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  recordButton: {
    flex: 1,
    marginHorizontal: spacing.spaceSmall,
  },
  meteringAnimated: {
    borderRadius: 100,
  },
});
