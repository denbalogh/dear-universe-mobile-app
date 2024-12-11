import { spacing } from "@/constants/theme";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { FAB, IconButton, Text, useTheme } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export const UPDATE_INTERVAL = 50;

type Props = {
  time: string;
  isLoading: boolean;
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
  isLoading,
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
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.timeWrapper}>
        {hasRecordingStarted && (
          <Text variant="displayLarge" style={styles.time}>
            {time}
          </Text>
        )}
      </View>
      <View style={styles.controlsWrapper}>
        <View style={styles.controls}>
          <IconButton
            icon="delete"
            iconColor={theme.colors.error}
            disabled={!hasRecordingStarted || isRecording}
            onPress={onDiscardPress}
            accessibilityLabel="Discard recording"
          />
          <View>
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
            {!hasPermissions ? (
              <FAB
                onPress={onRequestPermissionsPress}
                icon="microphone-question"
                variant="surface"
                size="large"
                loading={isLoading}
                disabled={isLoading}
                accessibilityLabel="Request recording permission"
              />
            ) : !hasRecordingStarted ? (
              <FAB
                onPress={onRecordPress}
                icon="record"
                variant="surface"
                size="large"
                loading={isLoading}
                disabled={isLoading}
                accessibilityLabel="Start recording"
              />
            ) : isRecording ? (
              <FAB
                onPress={onPausePress}
                icon="pause"
                variant="surface"
                size="large"
                accessibilityLabel="Pause recording"
                mode="flat"
              />
            ) : (
              <FAB
                onPress={onContinuePress}
                icon="record"
                variant="surface"
                size="large"
                accessibilityLabel="Continue recording"
                mode="flat"
              />
            )}
          </View>
          <IconButton
            icon="stop"
            disabled={!hasRecordingStarted || isRecording}
            onPress={onStopPress}
            mode="contained"
            accessibilityLabel="Stop recording"
          />
        </View>
        {!hasPermissions ? (
          <Text style={styles.helperText}>
            Press to request recording permissions
          </Text>
        ) : !hasRecordingStarted ? (
          <Text style={styles.helperText}>Press to start recording</Text>
        ) : isRecording ? (
          <Text style={styles.helperText}>Press to pause recording</Text>
        ) : (
          <Text style={styles.helperText}>Press to continue recording</Text>
        )}
      </View>
    </View>
  );
};

export default Controls;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "space-between",
    width: "100%",
  },
  timeWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  time: {
    textAlign: "center",
  },
  controlsWrapper: {
    width: "100%",
    alignItems: "center",
  },
  controls: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: spacing.spaceLarge,
  },
  helperText: {
    marginVertical: spacing.spaceSmall,
  },
  meteringAnimated: {
    borderRadius: 100,
  },
});
